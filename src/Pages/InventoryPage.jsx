import axios from "axios";
import { ethers } from "ethers";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { MetaMaskStorage } from "../Storages/MetaMaskStorage";
import { UIStorage } from "../Storages/UIStorage";
import { ERC721Abi, NFTAddress } from "../Utils/BlockchainUtils";
import { getBoxesByHeroId_EP, getHeroById_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { getDataFromResponse } from "../Utils/NetworkUtil";
import luckyBoxImage from "../Images/Boxes/luckyBox.png";
import mysteryBoxImage from "../Images/Boxes/mysteryBox.png";
import { getRandomString } from "../Utils/RandomUtil";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router-dom";
import { UserDataStorage } from "../Storages/UserDataStorage";

export default function InventoryPage() {
    const ui = useStoreState(UIStorage);

    const [selectedOption, setSelectedOption] = useState("boxes");

    return (
        <div className="w-full flex flex-col items-center px-2 gap-4 text-white">
            <div className="w-full flex justify-center text-xl gap-4">
                <button
                    onClick={() => {
                        setSelectedOption("boxes");
                    }}
                    className={"w-32 h-10 border-b-[1px] animated-100 " + (selectedOption === "boxes" ? "text-teal-400 border-teal-400" : "")}
                >
                    Boxes
                </button>
                {/* <button onClick={()=>{setSelectedOption('inventory')}} className={"w-32 h-10 border-b-[1px] animated-100 "+(selectedOption === 'inventory' ? 'text-teal-400 border-teal-400':'')}>Inventory</button> */}
            </div>
            <BoxTab></BoxTab>
        </div>
    );
}

function BoxTab() {
    const ui = useStoreState(UIStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const userData = useStoreState(UserDataStorage);
    const [filter, setFilter] = useState({ unopened: true, burned: true, opened: true });
    const [rawBoxes, setRawBoxes] = useState([]);
    const [boxesComponents, setBoxesComponents] = useState([]);

    function changeFilter(newValue) {
        setFilter({ ...filter, ...newValue });
    }

    function fillBoxes() {
        let t = [];
        let copyBoxes = Array.from(rawBoxes);
        copyBoxes.sort(function (a, b) {
            if (a.status === "Owned" && b.status !== "Owned") return -1;
            if (a.status === "Burned" && b.status !== "Burned") return -1;
            return 0;
        });
        for (const i of copyBoxes) {
            let safeType = i.type?.name?.slice(5) ?? "";
            i.type = safeType;
            console.log(i.status);
            if (i.status === "Opened" && !filter.opened) continue;
            if (i.status === "Burned" && !filter.burned) continue;
            if (i.status === "Owned" && !filter.unopened) continue;
            // console.log(i.status);
            t.push(<BoxTile key={getRandomString(12)} {...i} />);
        }
        setBoxesComponents(t);
    }

    async function getHeroesIDs() {
        if (typeof window.ethereum === "undefined" || !window.ethereum.isMetaMask) {
            ui.showError("Web3 Network error! Please, install Metamask.");
            return;
        }
        if (!metamask.isConnected) {
            ui.showError("Please, connect Metamask.");
            return;
        }
        try {
            ui.showContentLoading();
            console.log('hello');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(NFTAddress(), ERC721Abi(), signer);
            const address = await signer.getAddress();
            console.log(provider, signer, contract, address);
            let bigNumberHeroes = await contract.getUsersTokens(address);
            if (bigNumberHeroes.length === 0) {
                setTimeout(() => {
                    ui.hideContentLoading();
                }, 250);
                return;
            }
            let normalIndexes = [];
            let normalHeroes = [];
            for await (const i of bigNumberHeroes) {
                normalIndexes.push(i.toNumber());
                try {
                    let response = await axios.post(getHeroById_EP(), { index: i.toNumber() }, safeAuthorize_header());
                    let dat = getDataFromResponse(response);
                    normalHeroes.push(dat.name);
                } catch (error2) {
                    ui.showError(error2.message);
                    console.log(error2);
                }
            }

            let finalBoxes = [];
            let c = 0;
            for await (const i of normalIndexes) {
                let response = await axios.post(getBoxesByHeroId_EP(), { heroId: i }, safeAuthorize_header());
                let data = getDataFromResponse(response);
                for (const j of data) {
                    finalBoxes.push({ ...j, owner: normalHeroes[c] });
                }
                c++;
            }
            // console.log(finalBoxes);
            setRawBoxes(finalBoxes);
            setTimeout(() => {
                ui.hideContentLoading();
            }, 250);
        } catch (error) {
            console.log(error);
            ui.showError(error.message);
        }
    }

    useEffect(() => {
        if (userData.isLoggedIn) getHeroesIDs();
        // console.log('hi');
    }, [metamask, userData]);

    useEffect(() => {
        // console.log(filter);
        if (rawBoxes.length === 0) return;
        fillBoxes();
    }, [rawBoxes, filter]);

    return userData.isLoggedIn ? (
        <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
            <div className="w-full flex flex-wrap items-center justify-center gap-2 p-4">
                <div className="w-[230px] flex items-center justify-between gap-2 p-2 border-[1px] border-teal-400 rounded-md">
                    <span>Show unopened boxes</span>
                    <input
                        type="checkbox"
                        onChange={() => {
                            changeFilter({ unopened: document.getElementById("show-unopened").checked });
                        }}
                        name=""
                        id="show-unopened"
                        defaultChecked={filter.unopened}
                        className="h-5 w-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="w-[230px] flex items-center justify-between gap-2 p-2 border-[1px] border-teal-400 rounded-md">
                    <span>Show burned boxes</span>
                    <input
                        type="checkbox"
                        onChange={() => {
                            changeFilter({ burned: document.getElementById("show-burned").checked });
                        }}
                        name=""
                        id="show-burned"
                        defaultChecked={filter.burned}
                        className="h-5 w-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="w-[230px] flex items-center justify-between gap-2 p-2 border-[1px] border-teal-400 rounded-md">
                    <span>Show opened boxes</span>
                    <input
                        type="checkbox"
                        onChange={() => {
                            changeFilter({ opened: document.getElementById("show-opened").checked });
                        }}
                        name=""
                        id="show-opened"
                        defaultChecked={filter.opened}
                        className="h-5 w-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 p-4">{boxesComponents}</div>
        </div>
    ) : (
        <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
            <div className="w-full flex flex-wrap items-center justify-center gap-2 p-4">
                <span>Please, sign in to see your inventory.</span>
            </div>
        </div>
    );
}

function BoxTile({ serial, number, owner, type, priceToOpen, status, eAt, boxId }) {
    const statusPalette = {
        Opened: "text-red-500",
        Burned: "text-amber-500",
        Owned: "text-green-300",
    };
    return (
        <Link to={"/box/" + (boxId * 71 + 41)}>
            <div className="relative group w-[200px] h-[250px] flex flex-shrink-0 rounded-md bg-dark-purple-100 bg-opacity-10 animated-100 hover:bg-opacity-50">
                <div className="absolute inset-0 flex opacity-70 group-hover:opacity-100 animated-100">
                    <img src={type === "LUCKY" ? luckyBoxImage : mysteryBoxImage} alt="lucky box" className="w-full h-full object-contain" />
                </div>
                <div className="w-full h-full flex flex-col p-2 z-10 pointer-events-none">
                    <div className="w-full flex flex-col items-start justify-between gap-1">
                        <span className={"text-sm p-1 px-2 bg-dark-purple-100 bg-opacity-80 rounded-md " + statusPalette[status]}>
                            {status === "Owned" ? formatDistanceToNowStrict(new Date(eAt)) + " left" : status}
                        </span>
                        <span className="text-green-300 text-sm p-1 px-2 bg-dark-purple-100 bg-opacity-80 rounded-md">{owner}</span>
                    </div>
                    <div className="w-full mt-auto flex flex-col items-center p-1 bg-dark-purple-100 rounded-md bg-opacity-80">
                        <span className={"font-semibold text-sm " + (type === "LUCKY" ? "text-yellow-500":"text-teal-400")}>{type.toUpperCase()} BOX</span>
                        <span className="text-sm">
                            {serial}-{number}
                        </span>
                        <span className="font-semibold text-purple-300">{priceToOpen} G</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
