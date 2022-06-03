import React from "react";
import box from "../../Images/Boxes/luckyBox.png";

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
        <div className="w-full flex items-center flex-col relative h-full">
            <div className="w-full lg:w-[1000px] shadow-lg rounded-xl bg-opacity-10 bg-dark-purple-100 flex justify-between p-4 pb-2">
                <div className="w-[300px] flex justify-start">
                    <img src="" alt="" />
                    <input className="placeholder:italic placeholder:text-slate-500 rounded-md bg-black focus:border-green-500 focus:ring-blue-400 focus:ring-2" placeholder="Search for rabbits..." type="text" name="search"/>
                </div>
                <div>

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

function ItemTile() {
    return (
        <div className={"w-[250px] h-[290px] px-4 items-center flex flex-col rounded-md hover:bg-dark-purple-300 hover:mt-[-10px] animated-200 cursor-pointer border-2 justify-center " + rarityColor["legendary"]}>
            <div className="text-white w-full text-center py-2 font-bold text-2xl">
                <span>Rabbit</span>
            </div>
            <div className="flex w-[150px] h-[150px]">
                <img className="h-full w-full object-cover" src={box} alt="" />
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
