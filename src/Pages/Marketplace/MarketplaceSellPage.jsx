import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStoreState } from "pullstate";
import box from "../../Images/Boxes/luckyBox.png";
import { UIStorage } from "../../Storages/UIStorage";
import { marketplace_Load, safeAuthorize_header } from "../../Utils/EndpointsUtil";
import { getUserDataFromStorage } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { getDataFromResponse } from "../../Utils/NetworkUtil";
import { getRandomString } from "../../Utils/RandomUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";
import { Link } from "react-router-dom";
import SearchIcon from "../../Icons/Search";
import { getRandomInt } from "../../Utils/RandomUtil";

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
    let response = await axios.post(marketplace_Load(), { amount: 1, type: 2, username: "FarHowl", tribe: "BCH Tribe" }, safeAuthorize_header());
    let data = getDataFromResponse(response);
    console.log(data);
}

export default function MarketplaceSellPage() {
    const ui = useStoreState(UIStorage);

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
                <div className="w-full lg:w-[1000px] flex flex-col items-center flex-wrap gap-6 justify-center p-4 px-8 pb-2">
                    <div className="flex w-full justify-start items-center relative">
                        <div className="absolute left-1">
                            <SearchIcon />
                        </div>
                        <SearchBar />
                    </div>
                    <div className="flex items-center justify-center p-4 flex-wrap gap-6">
                        <ItemTile />
                        <ItemTile />
                    </div>
                </div>
            </div>
            <SellWindow />
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

function SellWindow() {
    return (
        <div id="sellWindow" className="absolute justify-center items-center w-full h-full hidden">
            <span>Hi</span>
        </div>
    );
}

function ItemTile({ price, name, rarity, owner }) {
    // let rarityUpperCase = String(rarity).charAt(0).toUpperCase() + rarity.slice(1);
    return (
        <div
            onClick={() => {
                document.getElementById("sellWindow").classList.remove("hidden");
                document.getElementById("sellWindow").classList.add("flex");
            }}
            className={"w-[250px] h-[290px] px-4 py-2 items-center flex flex-col rounded-md group hover:bg-dark-purple-300 hover:border-opacity-100 animated-200 cursor-pointer border-2 justify-center "}
        >
            <div className="text-white w-full text-center font-bold text-2xl">
                <span>Name</span>
            </div>
            <div className="flex w-[150px] h-[150px]">
                <img className={"h-full w-full object-cover animated-200 group-hover:scale-[1.2]  " + (getRandomInt(0, 1) ? "group-hover:rotate-[-5deg]" : "group-hover:rotate-[5deg]")} src={box} alt="" />
            </div>
            <div className="w-full justify-between flex py-2 border-t-2 border-b-2 border-gray-800 items-center">
                <div className="">
                    <span>Rarity</span>
                </div>
                <div className="text-white text-xl">
                    <span>Price</span>
                </div>
            </div>
        </div>
    );
}
