import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStoreState } from "pullstate";
import box from "../../Images/Boxes/luckyBox.png";
import { UIStorage } from "../../Storages/UIStorage";
import { marketplaceLoadLots_EP, safeAuthorize_header } from "../../Utils/EndpointsUtil";
import { getUserDataFromStorage } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { getDataFromResponse } from "../../Utils/NetworkUtil";
import { getRandomString } from "../../Utils/RandomUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";
import { Link } from "react-router-dom";
import SearchIcon from "../../Icons/Search";
import CrossIcon from "../../Icons/Cross";
import ArrowIcon from "../../Icons/FilterArrow";
import { getRandomInt } from "../../Utils/RandomUtil";
import ButtonGreen from "../../Components/UI/StyledComponents/ButtonGreen";
import ButtonRed from "../../Components/UI/StyledComponents/ButtonRed";

const rarityColor = {
    guarantee: "text-gray-400 border-gray-400 border-opacity-50",
    common: "text-blue-100 border-blue-100 border-opacity-50",
    rare: "text-green-300 border-green-300 border-opacity-50",
    epic: "text-blue-400 border-blue-400 border-opacity-50",
    mythical: "text-purple-400 border-purple-400 border-opacity-50",
    legendary: "text-yellow-300 border-yellow-300 border-opacity-50",
    heroic: "text-red-500 border-red-500 border-opacity-50",
};

async function start() {
    let response = await axios.post(marketplaceLoadLots_EP(), { amount: 1, type: 2, username: "FarHowl", tribe: "BCH Tribe" }, safeAuthorize_header());
    let data = getDataFromResponse(response);
    console.log(data);
}

export default function MarketplaceSellPage() {
    const ui = useStoreState(UIStorage);

    const [popUpData, setPopUpData] = useState({});

    const [lotsView, setLotsView] = useState([]);

    const [lotsData, setLotsData] = useState([
        { name: "Rabbit", price: 300, rarity: "Heroic", describtion: "Mother and Father. I am sure learning foreign languages is very important nowadays. People want to have a possibility to get a higher education abroad or even start their career there." },
        { name: "Poop Rabbit", price: 200, rarity: "Common", describtion: "Mother and Father" },
        { name: "Mommy Rabbit", price: 500, rarity: "Legendary", describtion: "Mother and Father" },
        { name: "Rabbit`s Carrot", price: 600, rarity: "Epic", describtion: "Mother and Father" },
        { name: "Big Black Rabbit", price: 250, rarity: "Mythical", describtion: "Mother and Father" },
        { name: "Poor Rabbit", price: 10, rarity: "Guarantee", describtion: "Mother and Father" },
        { name: "Ultra Rabbit", price: 900, rarity: "Rare", describtion: "Mother and Father" },
    ]);

    const [filter, setFilter] = useState({ rarity: null, price: null, rarityColor: "" });

    useEffect(() => {
        if (lotsData.length > 0) {
            let t = Array.from(lotsData);
            if (filter.rarity) {
                t = t.filter((a) => {
                    return a.rarity.toLowerCase() === filter.rarity.toLowerCase();
                });
            }
            let a = [];
            for (const i of t) {
                a.push(<ItemTile key={getRandomString(12)} {...i} setData={setPopUpData} />);
            }
            setLotsView(a);
        }
    }, [lotsData, filter]);

    useEffect(() => {
        ui.showContentLoading();
        setTimeout(() => {
            ui.hideContentLoading();
        }, 500);
        start();
    }, []);

    return (
        <div className="w-full text-white flex flex-col relative justify-center items-center px-2">
            <div className="w-full flex justify-center items-center gap-4 text-xl my-6">
                <Link to={"/marketplace"}>
                    <button className="w-[100px] h-10 border-b-[1px] animated-100">Buy</button>
                </Link>
                <Link to={"/marketplace/sell"}>
                    <button className="w-[100px] h-10 border-b-[1px] animated-100 text-teal-400 border-teal-400">Sell</button>
                </Link>
                <button className="w-[100px] h-10 border-b-[1px] animated-100">My lots</button>
            </div>
            <div className="shadow-lg bg-opacity-10 bg-dark-purple-100 rounded-xl pb-4">
                <div className="w-full lg:w-[1000px] flex md:flex-row flex-col items-center flex-wrap md:gap-0 gap-4 justify-center md:justify-between p-4 px-8 pb-2">
                    <div className="flex justify-start items-center relative">
                        <div className="absolute left-1">
                            <SearchIcon />
                        </div>
                        <SearchBar />
                    </div>
                    <div className="flex justify-center flex-wrap items-center gap-2">
                        <div className="flex justify-center items-center gap-2">
                            {filter.rarity ? (
                                <div className="relative h-[42px] md:text-base text-sm px-7 border-2 border-gray-800 rounded-md text-center flex items-center justify-center">
                                    <div className={"w-[15px] h-[15px] rounded-xl " + filter.rarityColor}></div>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: null });
                                        }}
                                        className="absolute p-[2px] top-0 right-0"
                                    >
                                        <CrossIcon size="16" />
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <div className="relative group">
                                <button className="hover:bg-zinc-800 px-4 animated-100 rounded-md flex flex-shrink-0 items-center gap-2 justify-center w-[100px] h-[42px]">
                                    <span>Rarity</span>
                                    <ArrowIcon />
                                </button>
                                <div className="absolute flex flex-col shadow-lg top-10 animated-200 bg-gray-900 w-[140px] h-[200px] overflow-auto rounded-b-md pointer-events-none hover:pointer-events-auto z-10 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Guarantee", rarityColor: "bg-gray-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["guarantee"]}
                                    >
                                        Guarantee
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Common", rarityColor: "bg-blue-100" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["common"]}
                                    >
                                        Common
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Rare", rarityColor: "bg-green-300" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["rare"]}
                                    >
                                        Rare
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Epic", rarityColor: "bg-blue-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["epic"]}
                                    >
                                        Epic
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Mythical", rarityColor: "bg-purple-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["mythical"]}
                                    >
                                        Mythical
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Legendary", rarityColor: "bg-yellow-300" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["legendary"]}
                                    >
                                        Legendary
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Heroic", rarityColor: "bg-red-500" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["heroic"]}
                                    >
                                        Heroic
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[1000px] flex justify-center p-4 flex-wrap gap-6">{lotsView}</div>
            </div>
            <PopUpTile {...popUpData} />
        </div>
    );
}

function SearchBar() {
    function checkText() {
        let t = document.getElementById("input");
        let val = t.value;
        if (isStringEmptyOrSpaces(val)) t.classList.remove("min-w-[270px]");
        else t.classList.add("min-w-[270px]");
    }
    function filterText() {
        let input = document.getElementById("input").value.toLowerCase();
    }

    return (
        <input
            onKeyUp={() => {
                filterText();
            }}
            onChange={() => {
                checkText();
            }}
            className="animated-300 pl-10 placeholder:italic placeholder:text-slate-500 text-white rounded-md shadow-none bg-black bg-opacity-70 ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none w-[141px] focus:w-[270px]"
            placeholder="Search for rabbits..."
            type="text"
            name="search"
            id="input"
        />
    );
}

function ItemTile({ price, name, rarity, setData, describtion }) {
    // let rarityUpperCase = String(rarity).charAt(0).toUpperCase() + rarity.slice(1);
    return (
        <div
            onClick={() => {
                document.getElementById("popUpVision").classList.remove("pointer-events-none");
                document.getElementById("popUpVision").classList.remove("opacity-0");
                document.getElementById("popUpVision").classList.add("opacity-100");
                setData({ price, name, rarity, setData, describtion });
            }}
            className={"w-full md:h-[130px] h-[100px] px-4 md:px-8 py-2 gap-3 md:gap-5 items-center flex rounded-md group hover:bg-dark-purple-300 hover:border-opacity-100 animated-200 cursor-pointer border-2 justify-center " + rarityColor[rarity.toLowerCase()]}
        >
            <div className="flex items-center justify-between w-[150px] md:w-[250px]">
                <div className="flex md:w-[100px] md:h-[100px] w-[80px] h-[80px]">
                    <img className={"h-full w-full object-cover animated-200 group-hover:scale-[1.2]  " + (getRandomInt(0, 1) ? "group-hover:rotate-[-5deg]" : "group-hover:rotate-[5deg]")} src={box} alt="" />
                </div>
                <div className="w-[100px] px-2 md:w-[150px] text-white text-center md:font-bold font-semibold md:text-xl text-sm">
                    <span>{name}</span>
                </div>
            </div>
            <div className="max-w-[800px] md:gap-0 gap-4 w-full justify-between flex py-2 border-b-2 border-gray-800 items-center">
                <div className="md:text-sm text-xs">
                    <span>{rarity}</span>
                </div>
                <div className="text-white text-large md:text-xl">
                    <span>{price}$</span>
                </div>
            </div>
        </div>
    );
}

function PopUpTile({ price, name, rarity, describtion }) {
    return (
        <div id="popUpVision" className="flex z-10 pointer-events-none animated-100 opacity-0 w-full h-full justify-center items-center bg-black fixed top-0 bg-opacity-70">
            <div className={"relative md:w-[500px] w-[430px] md:h-[600px] h-[470px] flex flex-col gap-4 items-center bg-dark-purple-400 border-2 md:mt-0 mt-[48px] rounded-xl shadow-lg mx-6 " + rarityColor[rarity?.toLowerCase()]}>
                <div className="absolute w-full flex justify-end pt-2 pr-2">
                    <button
                        onClick={() => {
                            document.getElementById("popUpVision").classList.add("pointer-events-none");
                            document.getElementById("popUpVision").classList.remove("opacity-100");
                            document.getElementById("popUpVision").classList.add("opacity-0");
                        }}
                    >
                        <CrossIcon size="32" />
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center h-full w-full gap-4 px-4">
                    <div className="w-full flex justify-center">
                        <span className="md:text-3xl text-2xl font-bold text-white">{name}</span>
                    </div>
                    <div className="md:w-[200px] md:h-[200px] w-[130px] h-[130px]">
                        <img className="w-full h-full object-cover" src={box} alt="" />
                    </div>
                    <div className="border-t-2 border-b-2 border-gray-800 w-full flex flex-col items-center gap-3 py-4">
                        <div className={rarityColor[rarity?.toLowerCase()]}>
                            <span className="md:text-xl text-large">{rarity}</span>
                        </div>
                    </div>
                    <div className="max-h-[100px] text-center flex justify-center items-center py-4">
                        <span className="text-white md:text-base text-sm">{describtion}</span>
                    </div>
                    <ButtonGreen
                        click={() => {
                            document.getElementById("orderConfirmation").classList.remove("pointer-events-none");
                            document.getElementById("orderConfirmation").classList.remove("opacity-0");
                            document.getElementById("orderConfirmation").classList.add("opacity-100");
                        }}
                        additionalStyle="w-[300px] text-white"
                        text={"Buy for " + price + "$"}
                    />
                </div>
                <div id="orderConfirmation" className="animated-100 absolute w-full h-full flex pointer-events-none opacity-0 justify-center items-center rounded-xl bg-opacity-80 bg-black">
                    <div className="text-white flex flex-col gap-6 justify-center items-center rounded-xl bg-dark-purple-400 w-[250px] h-[150px]">
                        <div className="">
                            <span className="text-xl font-semibold">Are you sure?</span>
                        </div>
                        <div className="flex gap-5">
                            <ButtonGreen additionalStyle="w-[70px]" text="Yes" />
                            <ButtonRed
                                click={() => {
                                    document.getElementById("orderConfirmation").classList.add("pointer-events-none");
                                    document.getElementById("orderConfirmation").classList.add("opacity-0");
                                    document.getElementById("orderConfirmation").classList.remove("opacity-100");
                                }}
                                additionalStyle="w-[70px]"
                                text="No"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
