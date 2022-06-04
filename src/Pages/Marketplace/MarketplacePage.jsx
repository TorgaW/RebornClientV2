import React from "react";
import ArrowIcon from "../../Icons/FilterArrow";
import SearchIcon from "../../Icons/Search";
import box from "../../Images/Boxes/luckyBox.png";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";

const rarityColor = {
    guarantee: "border-gray-400 border-opacity-50",
    common: "border-blue-100 border-opacity-50",
    rare: "text-green-300 border-green-300 border-opacity-50",
    epic: "border-blue-400 border-opacity-50",
    mythical: "border-purple-400 border-opacity-50",
    legendary: "text-yellow-300 border-yellow-300 border-opacity-50",
    heroic: "border-red-500 border-opacity-50",
};

export default function MarketplacePage() {
    return (
        <div className="w-full flex items-center flex-col relative">
            <div className="w-full lg:w-[1000px] shadow-lg rounded-xl bg-opacity-10 bg-dark-purple-100 flex items-center justify-between p-4 pb-2">
                <div className="flex justify-start items-center relative">
                    <div className="absolute left-1">
                        <SearchIcon />
                    </div>
                    <SearchBar />
                </div>
                <div className="flex justify-center items-center gap-2">
                    <div className="group flex flex-col justify-center">
                        <button className="relative hover:bg-zinc-800 px-4 animated-200 rounded-md text-white flex flex-shrink-0 items-center gap-2 justify-center w-[100px] h-[42px]">
                            <span>Rarity</span>
                            <ArrowIcon />
                        </button>
                        <div className="flex-col justify-center absolute hidden animated-200 group-hover:opacity-100 group-hover:flex">
                            <button className="text-white p-3 bg-white"></button>
                            <button className="text-white p-3 bg-white"></button>
                            <button className="text-white p-3 bg-white"></button>
                            <button className="text-white p-3 bg-white"></button>
                            <button className="text-white p-3 bg-white"></button>
                            <button className="text-white p-3 bg-white"></button>
                            <button className="text-white p-3 bg-white"></button>
                        </div>
                    </div>
                    <button className="hover:bg-zinc-800 px-4 animated-200 rounded-md text-white flex flex-shrink-0 items-center gap-2 justify-center w-[100px] h-[42px]">
                        <span>Price</span>
                        <ArrowIcon />
                    </button>
                </div>
            </div>
            <div className="w-full lg:w-[1000px] shadow-lg rounded-xl bg-opacity-10 bg-dark-purple-100 flex justify-center p-4 flex-wrap gap-6">
                <ItemTile />
                <ItemTile />
                <ItemTile />
                <ItemTile />
                <ItemTile />
                <ItemTile />
                <ItemTile />
                <ItemTile />
                <ItemTile />
            </div>
        </div>
    );
}

function SearchBar() {
    function checkText() {
        let t = document.getElementsByTagName("input")[0];
        let val = t.value;
        isStringEmptyOrSpaces(val) ? t.classList.remove("w-[270px]") : t.classList.add("w-[270px]");
    }

    return (
        <input
            onChange={() => {
                checkText();
            }}
            className="search-border animated-300 pl-10 placeholder:italic placeholder:text-slate-500 text-white rounded-md shadow-none bg-black bg-opacity-70 border-teal-600 focus:ring-teal-500 focus:border-teal-400 w-[141px] focus:w-[270px]"
            placeholder="Search for rabbits..."
            type="text"
            name="search"
        />
    );
}

function ItemTile() {
    return (
        <div className={"w-[250px] h-[290px] px-4 items-center flex flex-col rounded-md group hover:bg-dark-purple-300 animated-200 cursor-pointer border-2 justify-center " + rarityColor["legendary"]}>
            <div className="text-white w-full text-center py-2 font-bold text-2xl">
                <span>Rabbit</span>
            </div>
            <div className="flex w-[150px] h-[150px]">
                <img className="h-full w-full object-cover animated-200 group-hover:rotate-[5deg] group-hover:scale-[1.2]" src={box} alt="" />
            </div>
            <div className="w-full justify-between flex py-2 border-t-2 border-b-2 border-gray-800 items-center">
                <div className="">
                    <span>Legendary</span>
                </div>
                <div className="text-white text-xl">
                    <span>300$</span>
                </div>
            </div>
        </div>
    );
}

// Название, картинка, цена, рарность
