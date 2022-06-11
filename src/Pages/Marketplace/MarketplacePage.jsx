import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import CrossIcon from "../../Icons/Cross";
import ArrowIcon from "../../Icons/FilterArrow";
import SearchIcon from "../../Icons/Search";
import box from "../../Images/Boxes/luckyBox.png";
import { UIStorage } from "../../Storages/UIStorage";
import { marketplace_Load, safeAuthorize_header } from "../../Utils/EndpointsUtil";
import { getUserDataFromStorage } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { getDataFromResponse } from "../../Utils/NetworkUtil";
import { getRandomString } from "../../Utils/RandomUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";

const rarityColor = {
    guarantee: "text-gray-400 border-gray-400 border-opacity-50",
    common: "text-blue-100 border-blue-100 border-opacity-50",
    rare: "text-green-300 border-green-300 border-opacity-50",
    epic: "text-blue-400 border-blue-400 border-opacity-50",
    mythical: "text-purple-400 border-purple-400 border-opacity-50",
    legendary: "text-yellow-300 border-yellow-300 border-opacity-50",
    heroic: "text-red-500 border-red-500 border-opacity-50",
};

export default function MarketplacePage() {
    const ui = useStoreState(UIStorage);

    const [lotsView, setLotsView] = useState([]);

    const [lotsData, setLotsData] = useState([
        { name: "Rabbit", price: 300, owner: "TorgaW", rarity: "Heroic" },
        { name: "Poop Rabbit", price: 200, owner: "TorgaW", rarity: "Common" },
        { name: "Mommy Rabbit", price: 500, owner: "FarHowl", rarity: "Legendary" },
        { name: "Rabbit`s Carrot", price: 600, owner: "FarHowl", rarity: "Epic" },
        { name: "Big Black Rabbit", price: 250, owner: "Nat", rarity: "Mythical" },
        { name: "Poor Rabbit", price: 10, owner: "Kirusha", rarity: "Guarantee" },
        { name: "Ultra Rabbit", price: 900, owner: "Mom", rarity: "Rare" },
    ]);

    const [filter, setFilter] = useState({ rarity: null, price: null, rarityColor: "" });

    useEffect(() => {
        if (lotsData.length > 0) {
            let t = Array.from(lotsData);
            if (filter.price === "To lowest") {
                t.sort((prev, next) => {
                    return next.price - prev.price;
                });
            } else {
                t.sort((prev, next) => {
                    return prev.price - next.price;
                });
            }
            if (filter.rarity) {
                t = t.filter((a) => {
                    return a.rarity.toLowerCase() === filter.rarity.toLowerCase();
                });
            }
            let a = [];
            for (const i of t) {
                a.push(<ItemTile key={getRandomString(12)} {...i} />);
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

    async function start() {
        let response = await axios.post(marketplace_Load(), { amount: 1, type: 2, username: "FarHowl", tribe: "BCH Tribe" }, safeAuthorize_header());
        let data = getDataFromResponse(response);
        console.log(data);
    }

    return (
        <div className="w-full flex items-center flex-col relative text-white px-2">
            <div className="w-full flex justify-center items-center gap-4 text-xl my-6">
                <button className="w-[100px] h-10 border-b-[1px] animated-100 hover:text-teal-400 hover:border-teal-400">Buy</button>
                <button className="w-[100px] h-10 border-b-[1px] animated-100 hover:text-teal-400 hover:border-teal-400">Sell</button>
                <button className="w-[100px] h-10 border-b-[1px] animated-100 hover:text-teal-400 hover:border-teal-400">My lots</button>
            </div>
            <div className="shadow-lg bg-opacity-10 bg-dark-purple-100 rounded-xl pb-4">
                <div className="w-full lg:w-[1000px] flex items-center flex-wrap md:gap-0 gap-4 justify-center md:justify-between p-4 px-8 pb-2">
                    <div className="flex justify-start items-center relative">
                        <div className="absolute left-1">
                            <SearchIcon />
                        </div>
                        <SearchBar />
                    </div>
                    <div className="flex justify-center flex-wrap items-center gap-2">
                        <div className="flex justify-center items-center gap-2">
                            {filter.rarity ? (
                                <div className="relative h-[42px] px-7 border-2 border-gray-800 rounded-md text-center flex items-center justify-center">
                                    <span className={filter.rarityColor}>{filter.rarity}</span>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: null });
                                        }}
                                        className="absolute p-[2px] top-0 right-0"
                                    >
                                        <CrossIcon />
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                            {filter.price ? (
                                <div className="relative h-[42px] px-7 border-2 border-gray-800 rounded-md text-center flex items-center justify-center">
                                    <span>{filter.price}</span>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, price: null });
                                        }}
                                        className="absolute p-[2px] top-0 right-0"
                                    >
                                        <CrossIcon />
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
                                            setFilter({ ...filter, rarity: "Guarantee", rarityColor: "text-gray-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["guarantee"]}
                                    >
                                        Guarantee
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Common", rarityColor: "text-blue-100" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["common"]}
                                    >
                                        Common
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Rare", rarityColor: "text-green-300" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["rare"]}
                                    >
                                        Rare
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Epic", rarityColor: "text-blue-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["epic"]}
                                    >
                                        Epic
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Mythical", rarityColor: "text-purple-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["mythical"]}
                                    >
                                        Mythical
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Legendary", rarityColor: "text-yellow-300" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["legendary"]}
                                    >
                                        Legendary
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Heroic", rarityColor: "text-red-500" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["heroic"]}
                                    >
                                        Heroic
                                    </button>
                                </div>
                            </div>
                            <div className="relative group">
                                <button className="hover:bg-zinc-800 px-4 animated-100 rounded-md flex flex-shrink-0 items-center gap-2 justify-center w-[100px] h-[42px]">
                                    <span>Price</span>
                                    <ArrowIcon />
                                </button>
                                <div className="absolute rounded-r-md flex flex-col shadow-lg animated-200 bg-gray-900 w-[140px] rounded-b-md top-10 pointer-events-none hover:pointer-events-auto z-10 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, price: "To highest" });
                                        }}
                                        className="p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100"
                                    >
                                        To highest
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, price: "To lowest" });
                                        }}
                                        className="p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100"
                                    >
                                        To lowest
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[1000px] flex justify-center p-4 flex-wrap gap-6">{lotsView}</div>
                <div className="w-full flex justify-center gap-4">
                    <button className={"w-12 p-4 rounded-lg bg-dark-purple-100 bg-opacity-30 hover:bg-dark-purple-100 hover:bg-opacity-50 "}>1</button>
                </div>
            </div>
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

function ItemTile({ price, name, rarity, owner }) {
    // let rarityUpperCase = String(rarity).charAt(0).toUpperCase() + rarity.slice(1);
    return (
        <div className={"w-[250px] h-[290px] px-4 py-2 items-center flex flex-col rounded-md group hover:bg-dark-purple-300 hover:border-opacity-100 animated-200 cursor-pointer border-2 justify-center " + rarityColor[rarity.toLowerCase()]}>
            <div className="text-white w-full text-center font-bold text-2xl">
                <span>{name}</span>
            </div>
            <div className="flex w-[150px] h-[150px]">
                <img className="h-full w-full object-cover animated-200 group-hover:rotate-[5deg] group-hover:scale-[1.2]" src={box} alt="" />
            </div>
            <div className="w-full justify-between flex py-2 border-t-2 border-b-2 border-gray-800 items-center">
                <div className="">
                    <span>{rarity}</span>
                </div>
                <div className="text-white text-xl">
                    <span>{price}$</span>
                </div>
            </div>
            <div className="w-full flex justify-center mt-2 gap-1 text-sm">
                <div className="text-gray-500">
                    <span>Owner:</span>
                </div>
                <div className="text-white italic font-light">
                    <span>{owner}</span>
                </div>
            </div>
        </div>
    );
}
