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

export default function MarketplaceSellPage() {
    const ui = useStoreState(UIStorage);

    useEffect(() => {
        ui.showContentLoading();
        setTimeout(() => {
            ui.hideContentLoading();
        }, 500);
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
                <div className="w-full lg:w-[1000px] flex items-center flex-wrap md:gap-0 gap-4 justify-center md:justify-between p-4 px-8 pb-2">
                    <span className="">Привет</span>
                </div>
            </div>
        </div>
    );
}
