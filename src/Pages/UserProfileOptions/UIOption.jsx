import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MetaMaskStorage } from "../../Storages/MetaMaskStorage";
import { UIStorage } from "../../Storages/UIStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { isTabletOrMobileBrowser } from "../../Utils/BrowserUtil";
import { getLocalOptions, saveLocalOptions } from "../../Utils/LocalStorageManager/LocalStorageManager";

export default function UIOption() {
    let navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(isTabletOrMobileBrowser());

    const userData = useStoreState(UserDataStorage);
    // const metamask = useStoreState(MetaMaskStorage);
    const ui = useStoreState(UIStorage);

    const [showProfile, setShowProfile] = useState(false);
    const [userSettings, setUserSettings] = useState(getLocalOptions());

    useEffect(() => {
        if (!userData.getLocalUserData()) navigate("/restricted");
        else setShowProfile(true);

        // console.log(userSettings);
    }, []);

    function updateSettings() {
        let showBCH = document.getElementById('show-bch-price').checked;
        let showGame = document.getElementById('show-game-price').checked;
        let autoConnectToMetaMask = document.getElementById('auto-connect-to-metamask').checked;
        let messagesPlace = document.getElementById('messages-place').value;
        let soundVolume = document.getElementById('sound-volume').value;

        saveLocalOptions({
            ...userSettings,
            showBCHPrice: showBCH,
            showGamePrice: showGame,
            systemMessagesPlace: messagesPlace,
            autoConnectToMetaMask,
            soundVolume: soundVolume,
        });

        setUserSettings({
            ...userSettings,
            showBCHPrice: showBCH,
            showGamePrice: showGame,
            systemMessagesPlace: messagesPlace,
            autoConnectToMetaMask,
            soundVolume: soundVolume,
        });

        // console.log({
        //     ...userSettings,
        //     showBCHPrice: showBCH,
        //     showGamePrice: showGame,
        //     systemMessagesPlace: messagesPlace,
        //     autoConnectToMetaMask,
        //     soundVolume: soundVolume,
        // });

        UIStorage.update((s)=>{
            s.UIOptions = {
                ...userSettings,
                showBCHPrice: showBCH,
                showGamePrice: showGame,
                systemMessagesPlace: messagesPlace,
                autoConnectToMetaMask,
                soundVolume: soundVolume,
            };
        })
    }

    return showProfile ? (
        <div className="w-full flex flex-col text-white gap-4">
            <div className="w-full flex justify-center p-4">
                <span className="text-4xl font-semibold text-center">{userData.getLocalUserData()?.username}'s Interface settings</span>
            </div>
            <div className="w-full flex justify-center p-2 gap-4 text-xl">
                {!isMobile ? <Link to="/profile/deposit">
                    <button className="p-4 h-full bg-zinc-600 bg-opacity-30 rounded-md hover:bg-opacity-80 animated-100">Deposit</button>
                </Link>:<></>}
                <Link to="/profile/uisettings">
                    <button className="p-4 h-full bg-zinc-700 bg-opacity-70 rounded-md">Interface settings</button>
                </Link>
                <Link to="/profile/accountsettings">
                    <button className="p-4 h-full bg-zinc-600 bg-opacity-30 rounded-md hover:bg-opacity-80 animated-100">Account settings</button>
                </Link>
            </div>
            <div className="w-full flex justify-center p-4">
                <div className="w-full max-w-[800px] flex flex-col gap-6 p-8 bg-dark-purple-400 rounded-lg">
                    {/* <span className="text-xl font-semibold">
                        Connected wallet:{" "}
                        <span className="p-2 bg-zinc-600 bg-opacity-40 rounded-md">{metamask.isConnected ? metamask.wallet : "No wallets connected"}</span>
                    </span>
                    <span className="text-xl font-semibold">
                        Your deposit: <span className="p-2 bg-zinc-600 bg-opacity-40 rounded-md">{10000}</span>
                    </span>
                    <span className="text-xl font-semibold">
                        You can deposit more <span className="text-purple-500">GAME</span> tokens here:
                    </span>
                    <button className="w-full max-w-[200px] p-4 text-xl font-semibold bg-purple-900 bg-opacity-50 rounded-md hover:bg-opacity-80 animated-100">Make a deposit!</button> */}
                    <div className="w-full flex items-center gap-2">
                        <span className="text-xl font-semibold">Show BCH price:</span>
                        <input
                            type="checkbox"
                            id="show-bch-price"
                            onChange={()=>{updateSettings()}}
                            defaultChecked={userSettings?.showBCHPrice}
                            className="w-5 h-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                        />
                    </div>
                    <div className="w-full flex items-center gap-2">
                        <span className="text-xl font-semibold">Show GAME price:</span>
                        <input
                            type="checkbox"
                            id="show-game-price"
                            onChange={()=>{updateSettings()}}
                            defaultChecked={userSettings?.showGamePrice}
                            className="w-5 h-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <div className="w-full flex items-center gap-2">
                            <span className="text-xl font-semibold">Show system messages at:</span>
                            <select
                                id="messages-place"
                                onChange={()=>{updateSettings()}}
                                defaultValue={userSettings?.systemMessagesPlace}
                                className="w-full tracking-wider max-w-[150px] text-lg font-semibold p-2 bg-dark-purple-500 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                            >
                                <option value="up-right">Up-right</option>
                                <option value="up-left">Up-left</option>
                                <option value="down-left">Down-left</option>
                            </select>
                        </div>
                        <span
                            onClick={() => {
                                let rnd = Math.random()*100;
                                if(rnd > 66)
                                    ui.showNotification("Hello! I'm here!");
                                else if(rnd > 33)
                                    ui.showSuccess("Hello! I'm here!");
                                else 
                                    ui.showError("Hello! I'm here!");
                            }}
                            className="underline cursor-pointer w-44 select-none"
                        >
                            Click to test message
                        </span>
                    </div>
                    <div className="w-full flex items-center gap-2">
                        <span className="text-xl font-semibold">Sound volume:</span>
                        <span className="w-10 text-center font-bold text-xl">{parseFloat((userSettings.soundVolume ?? 0.5)).toFixed(1)}</span>
                        <input
                            type="range"
                            id="sound-volume"
                            onChange={()=>{updateSettings()}}
                            defaultValue={userSettings.soundVolume ?? 0.5}
                            min={0}
                            max={1}
                            step={0.1}
                            className="w-36 h-8 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                        />
                    </div>
                    <div className="w-full flex items-center gap-2">
                        <span className="text-xl font-semibold">Auto-connect to MetaMask:</span>
                        <input
                            type="checkbox"
                            id="auto-connect-to-metamask"
                            onChange={()=>{updateSettings()}}
                            defaultChecked={userSettings?.autoConnectToMetaMask}
                            className="w-5 h-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}
