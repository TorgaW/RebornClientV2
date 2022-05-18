import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OpenBoxCarousel from "../Components/OpenBoxCarousel/OpenBoxCarousel";
import { MetaMaskStorage } from "../Storages/MetaMaskStorage";
import { TempLinkStorage } from "../Storages/Stuff/TempLinkStorage";
import { UIStorage } from "../Storages/UIStorage";
import { UserBalanceStorage } from "../Storages/UserBalanceStorage";
import { UserDataStorage } from "../Storages/UserDataStorage";
import { openBox_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { getDataFromResponse } from "../Utils/NetworkUtil";

import party from "party-js";

export default function OpenBoxPage() {
    const params = useParams();
    const navigate = useNavigate();

    const userData = useStoreState(UserDataStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const ui = useStoreState(UIStorage);
    const userBalance = useStoreState(UserBalanceStorage);
    const tempLink = useStoreState(TempLinkStorage);

    const [activate, setActivate] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [itemData, setItemData] = useState({});

    const tempItem = {
        comment: "Nazko wears this backpack every day to travel to his job & home.",
        features: {},
        imgLink: "https://axiebch.com/wp-content/uploads/2022/04/reborn_box_serial_001.png",
        name: "Original Xiaomi Mi Backpack",
        rarity: "Guarantee",
    };

    async function startup() {
        if (params && params.boxIndex && params.hash && params.heroIndex && userData.isLoggedIn) {
            if (!metamask.isConnected) {
                ui.showError("Please, connect metamask and try again!");
                tempLink.removeLink();
                navigate("/notfound");
            } else {
                if (params.hash === tempLink.link && tempLink.eAt >= new Date()) {
                    tempLink.removeLink();
                    let realBoxIndex = params.boxIndex / 77 - 12;
                    let realHeroIndex = params.heroIndex / 77 - 12;
                    try {
                        // let response = await axios.post(
                        //     openBox_EP(),
                        //     {
                        //         userAddress: metamask.wallet,
                        //         heroId: realHeroIndex,
                        //         boxId: realBoxIndex,
                        //     },
                        //     safeAuthorize_header()
                        // );
                        // let data = getDataFromResponse(response);
                        setItemData(tempItem);
                        setIsWinner(true);
                        setActivate(true);
                        ui.hideContentLoading();
                        userBalance.updateUserBalance();
                        // console.log("you win: ", JSON.stringify(tempItem));
                    } catch (error) {
                        console.log(error);
                        ui.showError(error.message);
                    }
                    // console.log(realBoxIndex, realHeroIndex);
                } else {
                    // console.log(params.hash, tempLink.link, tempLink.eAt, (new Date()).getTime());
                    tempLink.removeLink();
                    navigate("/notfound");
                }
            }
        } else {
            tempLink.removeLink();
            navigate("/notfound");
        }
    }

    useEffect(() => {
        // startup();
        setActivate(true)
    }, []);

    return activate ? (<div className="w-full h-full p-4 flex justify-center items-center text-white">
      <div className="w-[70vw] h-[70vw] md:w-[600px] md:h-[600px] flex relative bg-white overflow-x-hidden overflow-y-hidden">
        <OpenBoxCarousel />
      </div>
    </div>):<></>;
}
