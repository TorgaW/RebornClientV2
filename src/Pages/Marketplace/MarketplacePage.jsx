import React from "react";
import box from "../../Images/Boxes/luckyBox.png";

const rarityColor = {
    guarantee: "border-gray-400 border-opacity-50",
    common: "border-blue-100 border-opacity-50",
    rare: "text-orangeborder-green-300 border-opacity-50",
    epic: "border-blue-400 border-opacity-50",
    mythical: "border-purple-400 border-opacity-50",
    legendary: "text-yellow-300 border-yellow-300 border-opacity-50",
    heroic: "border-red-500 border-opacity-50",
};

export default function MarketplacePage() {
    return (
        <div className="w-full flex justify-center items-center flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative h-full">
            <div className="w-full lg:w-[1000px] flex justify-center p-4 flex-wrap gap-4">
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
        <div className={"w-[250px] h-[290px] px-4 items-center flex flex-col rounded-md bg-dark-purple-300 border-2 justify-center " + rarityColor["legendary"]}>
            <div className="text-white w-full text-center py-2 font-bold text-2xl">
                <span>Rabbit</span>
            </div>
            <div className="flex w-[150px] h-[150px]">
                <img className="h-full w-full object-cover" src={box} alt="" />
            </div>
            <div className="w-full justify-between flex py-3 border-t-2 border-gray-600 items-center">
                <div className="">
                    <span>Legendary</span>
                </div>
                <div className="text-purple-500">
                    <span>300$</span>
                </div>
            </div>
        </div>
    );
}

// Название, картинка, цена, рарность
