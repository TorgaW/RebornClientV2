import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useStoreState } from "pullstate";
import { UIStorage } from "../Storages/UIStorage";
import { ERC721Abi, NFTAddress, SBCHProvider } from "../Utils/BlockchainUtils";
import axios from "axios";
import { getAllNFTs_EP, getNFTsByIndexes_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { catch401, getDataFromResponse } from "../Utils/NetworkUtil";
import { getRandomString } from "../Utils/RandomUtil";
import AdaptiveLoadingComponent from "../Components/UI/AdaptiveLoadingComponent";
import { MetaMaskStorage } from "../Storages/MetaMaskStorage";

export default function HeroesPage() {
    const ui = useStoreState(UIStorage);
    const metamask = useStoreState(MetaMaskStorage);

    const [selectedOption, setSelectedOption] = useState("all");

    const [heroes, setHeroes] = useState([]);
    const [heroesTiles, setHeroesTiles] = useState([]);

    const [selectedPage, setSelectedPage] = useState(1);

    useEffect(() => {
        async function startup() {
            ui.showContentLoading();
            await fetchHeroes(0);
            // setNumberToShow(9);
        }
        startup();
        return () => {
            ui.hideContentLoading();
        };
    }, []);

    useEffect(() => {
        fillHeroes();
    }, [heroes]);
    useEffect(() => {
        fetchHeroes(20 * (selectedPage - 1));
    }, [selectedPage]);

    async function fetchHeroes(from) {
        if (heroes.length === 99) return;
        try {
            ui.showContentLoading();
            let response = await axios.post(getNFTsByIndexes_EP(), {
                index: from,
            });
            let respHeroes = getDataFromResponse(response);
            setHeroes(respHeroes);
            setTimeout(()=>{ui.hideContentLoading()},100)
        } catch (error) {
            console.log(error);
            ui.showError(error.message);
        }
    }

    function fillHeroes() {
        let arr = [];
        for (const i of heroes) {
            arr.push(<HeroTile key={getRandomString(64)} {...i} />);
        }
        setHeroesTiles(arr);
        document.getElementById("content-wrapper").scrollTop = 0;
    }

    const [allHeroes, setAllHeroes] = useState([]);
    const [userHeroes, setUserHeroes] = useState([]);
    const [fetchedAll, setFetchedAll] = useState(false);

    async function fetchAndFindUserHeroes() {
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
            let response;
            if(!fetchedAll) {
                response = await axios.post(getAllNFTs_EP(), {}, safeAuthorize_header());
                setFetchedAll(true);
                setAllHeroes(getDataFromResponse(response));
            }
            const tAllHeroes = fetchedAll ? Array.from(allHeroes):getDataFromResponse(response);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(NFTAddress(), ERC721Abi(), signer);
            const address = await signer.getAddress();
            let userIndexes = await contract.getUsersTokens(address);
            // console.log('idx',userIndexes);
            let counter = userIndexes.length;
            let uHeroes = [];
            for (const i of tAllHeroes) {
                if (counter === 0) break;
                for (const j of userIndexes) {
                    if (i.index === j.toNumber()) uHeroes.push(<HeroTile key={getRandomString(64)} {...i} />);
                }
            }
            // console.log(uHeroes);
            setUserHeroes(uHeroes);
            setTimeout(()=>{ui.hideContentLoading()},200);
        } catch (error) {
            console.log(error);
            ui.showError(error.message);
        }
    }

    useEffect(() => {
        if (selectedOption === "user") fetchAndFindUserHeroes();
        else setUserHeroes([]);
    }, [selectedOption]);

    return (
        <div id="heroes-page" className="w-full flex flex-col items-center px-2 text-white">
            <div className="w-full flex justify-center items-center gap-4 text-xl my-6">
                <button
                    onClick={() => {
                        setSelectedOption("all");
                    }}
                    className={"w-32 h-10 border-b-[1px] animated-100 " + (selectedOption === "all" ? "text-teal-400 border-teal-400" : "")}
                >
                    All heroes
                </button>
                {!ui.isMobile ? <button
                    onClick={() => {
                        setSelectedOption("user");
                    }}
                    className={"w-32 h-10 border-b-[1px] animated-100 " + (selectedOption === "user" ? "text-teal-400 border-teal-400" : "")}
                >
                    My heroes
                </button>:<></>}
            </div>
            {selectedOption === "all" ? (
                <div className="w-full lg:w-[1000px] bg-dark-purple-100 bg-opacity-10 rounded-xl flex flex-col justify-center p-4 gap-5">
                    <div className="w-full flex flex-wrap justify-center gap-4">
                        {heroesTiles}
                    </div>
                    {/* <button onClick={()=>{fetchHeroes()}} className="w-full mt-4 p-4 text-teal-400 rounded-lg hover:bg-dark-purple-100 hover:bg-opacity-30">More heroes</button> */}
                    <div className="w-full flex justify-center gap-4">
                        <button
                            onClick={() => {
                                setSelectedPage(1);
                            }}
                            className={
                                "w-12 p-4 rounded-lg bg-dark-purple-100 bg-opacity-30 hover:bg-dark-purple-100 hover:bg-opacity-50 " +
                                (selectedPage === 1 ? "text-teal-400" : "")
                            }
                        >
                            1
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPage(2);
                            }}
                            className={
                                "w-12 p-4 rounded-lg bg-dark-purple-100 bg-opacity-30 hover:bg-dark-purple-100 hover:bg-opacity-50 " +
                                (selectedPage === 2 ? "text-teal-400" : "")
                            }
                        >
                            2
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPage(3);
                            }}
                            className={
                                "w-12 p-4 rounded-lg bg-dark-purple-100 bg-opacity-30 hover:bg-dark-purple-100 hover:bg-opacity-50 " +
                                (selectedPage === 3 ? "text-teal-400" : "")
                            }
                        >
                            3
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPage(4);
                            }}
                            className={
                                "w-12 p-4 rounded-lg bg-dark-purple-100 bg-opacity-30 hover:bg-dark-purple-100 hover:bg-opacity-50 " +
                                (selectedPage === 4 ? "text-teal-400" : "")
                            }
                        >
                            4
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPage(5);
                            }}
                            className={
                                "w-12 p-4 rounded-lg bg-dark-purple-100 bg-opacity-30 hover:bg-dark-purple-100 hover:bg-opacity-50 " +
                                (selectedPage === 5 ? "text-teal-400" : "")
                            }
                        >
                            5
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full lg:w-[1000px] bg-dark-purple-100 bg-opacity-10 mt-10 rounded-xl flex justify-center flex-wrap p-4 gap-5">
                    {userHeroes.length === 0 ? <span>We can't find your heroes :(</span>:userHeroes}
                </div>
            )}
        </div>
    );
}

function HeroSelector() {

    const [heroView, setHeroView] = useState([]);

    return (
        <div></div>
    );
}

function HeroTile({ index, name, tribe, status, imageLink, age, breed, skills, origin }) {
    const tribePalette = {
        text: {
            "Law Tribe": "text-orange-500",
            "CashCats Tribe": "text-teal-500",
            "White Crystal Tribe": "text-cyan-200",
            "Northern Light Tribe": "text-yellow-700",
            "AxieBCH Tribe": "text-indigo-500",
            "BCH Tribe": "text-lime-500",
            "Mist Tribe": "text-emerald-300",
            "Red Point": "text-red-500",
            "Ocean Tribe": "text-sky-500",
            "Invisible Boys": "text-fuchsia-300",
            "Invisible Girls": "text-fuchsia-300",
        },
        border: {
            "Law Tribe": "border-orange-500",
            "CashCats Tribe": "border-teal-500",
            "White Crystal Tribe": "border-cyan-200",
            "Northern Light Tribe": "border-yellow-700",
            "AxieBCH Tribe": "border-indigo-500",
            "BCH Tribe": "border-lime-500",
            "Mist Tribe": "border-emerald-300",
            "Red Point": "border-red-500",
            "Ocean Tribe": "border-sky-500",
            "Invisible Boys": "border-fuchsia-300",
            "Invisible Girls": "border-fuchsia-300",
        },
    };

    const skillsPalette = {
        sexy: "bg-pink-500",
        lucky: "bg-pink-500",
        brave: "bg-pink-500",
        healthy: "bg-pink-500",
        smart: "bg-pink-500",
        skilled: "bg-pink-500",
    };

    const originPalette = {
        border: { Founding: "border-amber-400" },
        text: { Founding: "text-amber-400" },
    };

    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div
            className={
                "w-[400px] flex-wrap group flex justify-center p-2 border-y-[1px] border-opacity-50 cursor-pointer animated-200 hover:bg-dark-purple-100 hover:bg-opacity-30 hover:border-opacity-100 " +
                (tribePalette["border"][tribe] ?? "border-white")
            }
        >
            <div
                className={
                    "w-[200px] h-[200px] relative flex flex-shrink-0 rounded-lg border-[6px] border-opacity-50 animated-200 group-hover:border-opacity-100 overflow-x-hidden overflow-y-hidden " +
                    (tribePalette["border"][tribe] ?? "border-white")
                }
            >
                <img
                    onLoad={() => {
                        setImgLoaded(true);
                    }}
                    src={imageLink}
                    alt="hero"
                    className="w-full h-full animated-200 group-hover:scale-110"
                />
                {imgLoaded ? (
                    <></>
                ) : (
                    <div className="absolute inset-0 flex">
                        <AdaptiveLoadingComponent />
                    </div>
                )}
            </div>
            <div className="w-full flex flex-col justify-center items-center p-2">
                <span className={"text-3xl font-semibold " + (tribePalette["text"][tribe] ?? "text-white")}>
                    {name} #{index}
                </span>
                <div className="w-full flex justify-center items-center gap-2 text-center">
                    <span className={" font-semibold " + (tribePalette["text"][tribe] ?? "text-white")}>
                        Age: {age} Breed: {breed}
                    </span>
                    <span className={" font-semibold " + (originPalette["text"][origin] ?? "text-white")}>Origin: {origin}</span>
                </div>
            </div>
        </div>
    );
}
