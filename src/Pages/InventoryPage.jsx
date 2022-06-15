import axios from "axios";
import { ethers } from "ethers";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { MetaMaskStorage } from "../Storages/MetaMaskStorage";
import { UIStorage } from "../Storages/UIStorage";
import { ERC721Abi, NFTAddress } from "../Utils/BlockchainUtils";
import { getBoxesByHeroId_EP, getHeroById_EP, getInventory_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { getAxiosError, getDataFromResponse, makePost } from "../Utils/NetworkUtil";
import luckyBoxImage from "../Images/Boxes/luckyBox.png";
import mysteryBoxImage from "../Images/Boxes/mysteryBox.png";
import { getRandomInt, getRandomString } from "../Utils/RandomUtil";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router-dom";
import { UserDataStorage } from "../Storages/UserDataStorage";
import { RARITY_PALETTE } from "../Utils/ColorPaletteUtils";
import { rarityToNumber } from "../Utils/ItemsUtil";
import { compactString } from "../Utils/StringUtil";

export default function InventoryPage() {
    const ui = useStoreState(UIStorage);

    const [selectedOption, setSelectedOption] = useState("boxes");

    return (
        <div className="w-full flex flex-col items-center px-2 gap-4 text-white">
            <div className="w-full flex justify-center text-xl gap-4 mt-8">
                <button
                    onClick={() => {
                        setSelectedOption("boxes");
                    }}
                    className={"w-32 h-10 border-b-[1px] animated-100 " + (selectedOption === "boxes" ? "text-teal-400 border-teal-400" : "")}
                >
                    Boxes
                </button>
                <button
                    onClick={() => {
                        setSelectedOption("items");
                    }}
                    className={"w-32 h-10 border-b-[1px] animated-100 " + (selectedOption === "items" ? "text-teal-400 border-teal-400" : "")}
                >
                    Items
                </button>
                {/* <button onClick={()=>{setSelectedOption('inventory')}} className={"w-32 h-10 border-b-[1px] animated-100 "+(selectedOption === 'inventory' ? 'text-teal-400 border-teal-400':'')}>Inventory</button> */}
            </div>
            {selectedOption === "boxes" ? <BoxTab /> : <InventoryTab />}
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
        console.log(copyBoxes, "fuck");
        copyBoxes.sort(function (a, b) {
            if (a.status === "Owned" && b.status !== "Owned") return -1;
            if (a.status === "Burned" && b.status !== "Burned") return -1;
            return 0;
        });
        for (const i of copyBoxes) {
            let safeType = i.type;
            if (i?.type !== "MYSTERY" && i?.type !== "LUCKY") safeType = i.type?.name?.slice(5) ?? "";
            i.type = safeType;
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
            console.log("hello");
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
                let [data, status, error] = await makePost(getBoxesByHeroId_EP(), { heroId: i }, true);
                if (!data) {
                    ui.showError(error);
                    return;
                }
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

    useEffect(() => {
        return () => {
            ui.hideContentLoading();
        };
    }, []);

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
            <div className="flex flex-wrap justify-center gap-6 p-4">{boxesComponents}</div>
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
            <div
                className={
                    "relative group w-[230px] h-[390px] p-4 flex flex-col flex-shrink-0 rounded-md bg-dark-purple-100 bg-opacity-10 hover:bg-opacity-50 animated-200 border-[2px] border-opacity-70 hover:border-opacity-100 " +
                    (type === "LUCKY" ? "border-yellow-500" : "border-teal-400")
                }
            >
                {/* <div className="absolute inset-0 flex opacity-70 group-hover:opacity-100 animated-100">
                    <img src={type === "LUCKY" ? luckyBoxImage : mysteryBoxImage} alt="lucky box" className={"w-full h-full object-contain animated-100 " + (getRandomInt(0,1) ? 'group-hover:rotate-6':'group-hover:-rotate-6')} />
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
                </div> */}
                <div className="w-full flex flex-col items-start gap-1 text-left">
                    <span className={"p-1 px-2 bg-dark-purple-100 bg-opacity-80 rounded-md no-flick " + statusPalette[status]}>
                        {status === "Owned" ? formatDistanceToNowStrict(new Date(eAt)) + " left" : status}
                    </span>
                    <span className="text-green-300 p-1 px-2 bg-dark-purple-100 bg-opacity-80 rounded-md">{owner}</span>
                </div>
                <div className="w-full flex opacity-70 group-hover:opacity-100 animated-100">
                    <img
                        src={type === "LUCKY" ? luckyBoxImage : mysteryBoxImage}
                        alt="lucky box"
                        className={
                            "w-full h-full object-contain animated-200 " +
                            (getRandomInt(0, 1) ? "group-hover:rotate-6 group-hover:scale-110" : "group-hover:-rotate-6 group-hover:scale-110")
                        }
                    />
                </div>
                <div className="w-full mt-auto flex flex-col items-center p-1 bg-dark-purple-100 rounded-md bg-opacity-80">
                    <span className={"no-flick font-semibold text-sm " + (type === "LUCKY" ? "text-yellow-500" : "text-teal-400")}>
                        {type.toUpperCase()} BOX
                    </span>
                    <span className="no-flick text-sm">
                        {serial}-{number}
                    </span>
                    <span className="no-flick font-semibold text-purple-300">{priceToOpen} G</span>
                </div>
            </div>
        </Link>
    );
}

function InventoryTab() {
    const ui = useStoreState(UIStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const userData = useStoreState(UserDataStorage);

    const [rawItems, setRawItems] = useState([]);
    const [itemsView, setItemsView] = useState([]);
    const [itemsFilter, setItemsFilter] = useState("heroic,legendary,mythical,epic,rare,common,guarantee");

    function addFilter(item) {
        let copy = itemsFilter;
        let splitted = copy.split(",");
        for (const i of splitted) if (i === item) return;
        if (splitted[0] === "") splitted = [];
        splitted.push(item);
        copy = splitted.join(",");
        setItemsFilter(copy);
        console.log(copy);
    }

    function removeFilter(item) {
        let copy = itemsFilter;
        let splitted = copy.split(",");
        for (const i of splitted) {
            if (i === item) {
                copy = splitted.filter((j) => j !== item).join(",");
                setItemsFilter(copy);
                console.log(copy);
                return;
            }
        }
    }

    function refillInventory() {
        let t = [];
        let filter = itemsFilter.split(',');
        if (filter[0]==='') filter = [];
        let rawCopy = Array.from(rawItems);
        rawCopy.sort((a,b)=>{return rarityToNumber(b.rarity)-rarityToNumber(a.rarity)});
        for (const i of rawCopy) {
            if(filter.includes(i?.rarity?.toLowerCase()))
                t.push(<ItemTile {...i} key={getRandomString(32)} />);
        }
        setItemsView(t);
    }

    async function getUserInventory() {
        try {
            let r = await axios.get(getInventory_EP(), safeAuthorize_header());
            let data = getDataFromResponse(r);
            setRawItems(data);
            console.log(data);
        } catch (error) {
            ui.showError(getAxiosError(error));
            console.log(error.message);
        }
    }

    useEffect(() => {
        getUserInventory();
    }, []);

    useEffect(() => {
        refillInventory();
    }, [rawItems, itemsFilter]);

    return userData.isLoggedIn ? (
        <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
            <div className="w-full p-8 border-[1px] border-teal-400 rounded-md flex justify-center flex-wrap gap-6">
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.guarantee}>Guarantee</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("guarantee");
                            else removeFilter("guarantee");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.common}>Common</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("common");
                            else removeFilter("common");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.rare}>Rare</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("rare");
                            else removeFilter("rare");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.epic}>Epic</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("epic");
                            else removeFilter("epic");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.mythical}>Mythical</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("mythical");
                            else removeFilter("mythical");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.legendary}>Legendary</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("legendary");
                            else removeFilter("legendary");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.heroic}>Heroic</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("heroic");
                            else removeFilter("heroic");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-6 mt-4">{itemsView}</div>
        </div>
    ) : (
        <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative"></div>
    );
}

function ItemTile({ comment, features, imgLink, name, rarity }) {
    return (
        <div
            className={
                "w-[250px] h-[440px] cursor-pointer p-2 group flex flex-col text-center items-center relative border-2 rounded-md border-opacity-70 hover:border-opacity-100 bg-dark-purple-100 bg-opacity-0 hover:bg-opacity-50 animated-200 " +
                RARITY_PALETTE.border[rarity?.toLowerCase()]
            }
        >
            <span className="font-semibold text-lg h-[100px] no-flick flex-shrink-0">{name}</span>
            <div className="w-[150px] h-[150px] flex flex-shrink-0">
                <img
                    src={imgLink}
                    alt="item"
                    className={
                        "w-full h-full object-fill rounded-md animated-200 " +
                        (getRandomInt(0, 1) ? "group-hover:rotate-6 group-hover:scale-110" : "group-hover:-rotate-6 group-hover:scale-110")
                    }
                />
            </div>
            <span className={"mt-4 no-flick flex-shrink-0 font-bold " + RARITY_PALETTE.text[rarity?.toLowerCase()]}>{rarity?.toUpperCase()}</span>
            <div className="w-full h-full flex items-center justify-center text-center overflow-y-hidden overflow-x-hidden">
                <span className="text-gray-300 text-sm">{compactString(comment, 150)}</span>
            </div>
        </div>
    );
}
