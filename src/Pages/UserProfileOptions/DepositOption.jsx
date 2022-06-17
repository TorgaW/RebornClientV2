import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MetaMaskStorage } from "../../Storages/MetaMaskStorage";
import { UIStorage } from "../../Storages/UIStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { UserBalanceStorage } from "../../Storages/UserBalanceStorage";
import axios from "axios";
import { addBalance_EP, getTokenExpiresTime_EP, safeAuthorize_header } from "../../Utils/EndpointsUtil";
import { catch401, logout } from "../../Utils/NetworkUtil";
import { BigNumber, ethers } from "ethers";
import { Decimals, ERC20Abi, GAMEAddress, HOTAddress } from "../../Utils/BlockchainUtils";
import { isTabletOrMobileBrowser } from "../../Utils/BrowserUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";
// import { deleteUserDataFromStorage } from "../../Utils/LocalStorageManager/LocalStorageManager";
// import { getUserDataFromStorage } from "../Utils/LocalStorageManager/LocalStorageManager";

export default function DepositOption() {
    let navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(isTabletOrMobileBrowser());

    const userData = useStoreState(UserDataStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const balance = useStoreState(UserBalanceStorage);
    const ui = useStoreState(UIStorage);

    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        if (!userData.getLocalUserData()) navigate("/restricted");
        else setShowProfile(true);
    }, []);

    async function deposit() {
        let depositAmount = document.getElementById("deposit").value;
        if (/^[0-9]+$/.test(depositAmount.toString())) {
            // console.log("valid");
            ui.showContentLoading();
            try {
                let req = await axios.post(getTokenExpiresTime_EP(), {}, safeAuthorize_header());
                if (new Date(req.data.data.answer) - Date.now() < 900000) {
                    ui.hideContentLoading();
                    ui.showError("Your session is too old. Please, sign in again.");
                    logout();
                    return;
                } else {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(GAMEAddress(), ERC20Abi(), signer);
                    let tx;
                    try {
                        tx = await contract.transfer(HOTAddress(), BigNumber.from(depositAmount + Decimals()));
                    } catch (error) {
                        ui.hideContentLoading();
                        ui.showError(error.message);
                        return;
                    }
                    ui.showNotification("Processing... Please, don't close your browser until this operation ends!");
                    await tx.wait();
                    console.log(tx.hash);
                    let address = await signer.getAddress();
                    try {
                        await axios.post(addBalance_EP(), { userAddress: address.toLowerCase(), hash: tx.hash }, safeAuthorize_header());
                        ui.hideContentLoading();
                        ui.showSuccess("Thank you for your deposit!");
                        balance.updateUserBalance();
                        document.getElementById("deposit").value = 0;
                        // console.log(userData);
                    } catch (error) {
                        if (catch401(error)) {
                            logout();
                            ui.showError("Your session is expired. Please, sign in again.");
                            ui.hideContentLoading();
                            return;
                        }
                        // ui.showError(error.message);
                        ui.showError(error.message);
                        if (error.response) ui.showError(error.response.message);
                        ui.hideContentLoading();
                    }
                    // ui.showNotification('Hello!');
                }
            } catch (error) {
                if (catch401(error)) {
                    logout();
                    ui.showError("Your session is expired. Please, sign in again.");
                }
            }
        } else {
            ui.showError("Please, enter valid amounts of tokens.");
        }
    }

    useEffect(() => {
        if (isMobile) navigate("/notfound");
    }, [isMobile]);

    return showProfile ? (
        <div className="w-full flex flex-col text-white gap-4">
            <div className="w-full flex justify-center p-4">
                <span className="text-4xl font-semibold text-center">{userData.getLocalUserData()?.username}'s Deposit</span>
            </div>
            <div className="w-full flex justify-center p-2 gap-4 text-xl">
                <Link to="/profile/deposit">
                    <button className="p-4 h-full bg-zinc-700 bg-opacity-70 rounded-md">Deposit</button>
                </Link>
                <Link to="/profile/uisettings">
                    <button className="p-4 h-full bg-zinc-600 bg-opacity-30 rounded-md hover:bg-opacity-80 animated-100">Interface settings</button>
                </Link>
                <Link to="/profile/accountsettings">
                    <button className="p-4 h-full bg-zinc-600 bg-opacity-30 rounded-md hover:bg-opacity-80 animated-100">Account settings</button>
                </Link>
            </div>
            <div className="w-full flex justify-center p-4">
                <div className="w-full max-w-[800px] flex flex-col gap-6 p-8 bg-dark-purple-300 rounded-lg">
                    <span className="text-xl font-semibold">
                        Connected wallet: <span className="p-2 bg-zinc-600 bg-opacity-40 rounded-md">{metamask.isConnected ? metamask.wallet : "No wallets connected"}</span>
                    </span>
                    <span className="text-xl font-semibold">
                        Your balance: <span className="p-2 bg-zinc-600 bg-opacity-40 rounded-md">{balance.userBalance}</span>
                    </span>
                    <div className="flex flex-col gap-8 w-full items-center">
                        <div className="group animated-100 border-2 border-dark-purple-200 border-opacity-90 bg-dark-purple-100 bg-opacity-90 p-4 rounded-lg flex flex-col gap-3 items-center max-w-[650px] w-full">
                            <span className="text-xl font-semibold">
                                Deposit <span className="text-purple-500">GAME</span> tokens:
                            </span>
                            <div className="flex flex-col gap-4 items-center">
                                <input
                                    onWheel={(e) => {
                                        e.target.blur();
                                    }}
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    id="deposit"
                                    className="w-full tracking-wider max-w-[300px] text-xl font-semibold p-2 bg-dark-purple-500 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                                />
                                <button
                                    onClick={() => {
                                        deposit();
                                    }}
                                    className="w-full p-4 text-xl font-semibold bg-purple-900 bg-opacity-50 rounded-md hover:bg-opacity-80 animated-100"
                                >
                                    Make a deposit!
                                </button>
                            </div>
                        </div>
                        <div className="group animated-100 border-2 border-dark-purple-200 border-opacity-90 bg-dark-purple-100 bg-opacity-90 rounded-lg p-4 flex flex-col gap-3 items-center max-w-[650px] w-full">
                            <span className="text-xl font-semibold">
                                Withdraw <span className="text-purple-500">GAME</span> tokens:
                            </span>
                            <div className="flex flex-col gap-4 items-center">
                                <input
                                    onWheel={(e) => {
                                        e.target.blur();
                                    }}
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    id="withdraw"
                                    className="w-full tracking-wider max-w-[300px] text-xl font-semibold p-2 bg-dark-purple-500 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                                />
                                <button
                                    onClick={() => {
                                        deposit();
                                    }}
                                    className="w-full p-4 text-xl font-semibold bg-purple-900 bg-opacity-50 rounded-md hover:bg-opacity-80 animated-100"
                                >
                                    Withdraw!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}