import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdaptiveLoadingComponent from "../../Components/UI/AdaptiveLoadingComponent";
import ButtonDefault from "../../Components/UI/StyledComponents/ButtonDefault";
import ButtonGreen from "../../Components/UI/StyledComponents/ButtonGreen";
import ButtonRed from "../../Components/UI/StyledComponents/ButtonRed";
import InputDefault from "../../Components/UI/StyledComponents/InputDefault";
import { MetaMaskStorage } from "../../Storages/MetaMaskStorage";
import { UIStorage } from "../../Storages/UIStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { deleteUserDataFromStorage, getLocalOptions, saveLocalOptions } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { logout } from "../../Utils/NetworkUtil";

export default function AccountOption() {
    let navigate = useNavigate();

    const userData = useStoreState(UserDataStorage);
    // const metamask = useStoreState(MetaMaskStorage);
    const ui = useStoreState(UIStorage);

    const [showProfile, setShowProfile] = useState(false);
    const [userSettings, setUserSettings] = useState(getLocalOptions());
    const [safeUserData, setSafeUserData] = useState({});
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        if (!userData.getLocalUserData()) navigate("/restricted");
        else setShowProfile(true);

        setSafeUserData(userData.getLocalUserData());
    }, []);

    function signOut() {
        logout();
        deleteUserDataFromStorage();
        UserDataStorage.update((s) => {
            s.isLoggedIn = false;
            s.userData = {};
        });
    }

    return showProfile ? (
        <div className="w-full flex flex-col text-white gap-4">
            <div className="w-full flex justify-center p-4">
                <span className="text-4xl font-semibold">{userData.getLocalUserData()?.username}'s Account settings</span>
            </div>
            <div className="w-full flex justify-center p-2 gap-4 text-xl">
                <Link to="/profile/deposit">
                    <button className="p-4 h-full bg-zinc-600 bg-opacity-30 rounded-md hover:bg-opacity-80 animated-100">Deposit</button>
                </Link>
                <Link to="/profile/uisettings">
                    <button className="p-4 h-full bg-zinc-600 bg-opacity-30 rounded-md hover:bg-opacity-80 animated-100">Interface settings</button>
                </Link>
                <Link to="/profile/accountsettings">
                    <button className="p-4 h-full bg-zinc-700 bg-opacity-70 rounded-md">Account settings</button>
                </Link>
            </div>
            <div className="w-full flex justify-center p-4">
                <div className="w-full max-w-[800px] flex flex-col gap-4 p-8 bg-dark-purple-400 rounded-lg">
                    <div className="w-full flex justify-center text-center">
                        <span className="text-2xl font-semibold">Account information</span>
                    </div>
                    <div className="w-full flex items-center gap-2 text-xl">
                        <span className="font-semibold">Username:</span>
                        <span className="text-teal-100 text-2xl font-bold">{safeUserData.username}</span>
                    </div>
                    <div className="w-full flex items-center gap-2 text-xl">
                        <span className="font-semibold">Email:</span>
                        <span className="text-teal-100 text-2xl font-bold">{safeUserData.email}</span>
                    </div>
                    <div className="w-full h-[1px] bg-white"></div>
                    <div className="w-full flex justify-center text-center">
                        <span className="text-2xl font-semibold">Two-factor authentication</span>
                    </div>
                    {safeUserData.twoFA ? (
                        <div className="w-full flex flex-col gap-2 text-center">
                            <span className="text-green-300">You have already connected two-factor authentication!</span>
                            <ButtonDefault text={"Show my QR-code"} click={()=>{setShowQR(!showQR)}} />
                            {showQR ? <div className="flex w-full h-48 justify-center items-center p-2">
                                <img
                                    src={
                                        "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M|0&cht=qr&chl=otpauth://totp/Reborn.Cash(username:%20teo)%3Fsecret%3DZZTU6SFLIL5AMXIK%26digits%3D6"
                                    }
                                    alt="qr-code"
                                    className="h-full object-contain border-2 border-purple-900 p-1"
                                />
                            </div>:<></>}
                            <ButtonDefault text="Show my QR-code" />
                        </div>
                    ) : (
                        <div className="w-full flex flex-col gap-2 text-center">
                            <span className="text-red-300">Two-factor authentication is disabled!</span>
                            <ButtonGreen text={"Enable Two-factor Authentication"} />
                            <ButtonDefault text="Enable 2FA" />
                        </div>
                    )}
                    <div className="w-full h-[1px] bg-white"></div>
                    <div className="w-full flex justify-center">
                        <span className="text-2xl font-semibold">Change password</span>
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <span className="font-semibold">New password:</span>
                        <InputDefault type="password" />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <span className="font-semibold">Confirm new password:</span>
                        <InputDefault type="password" />
                    </div>
                    <div className="w-full flex flex-col">
                        <span className="font-semibold">Authenticator code:</span>
                        <InputDefault type="text" additionalStyle={'font-bold tracking-wider'} />
                    </div>
                    {/* <button className="p-2 w-48 bg-purple-800 bg-opacity-50 rounded-lg hover:bg-opacity-90 animated-100">Change password</button> */}
                    <ButtonDefault text={'Change password'} />
                    <div className="w-full h-[1px] bg-white"></div>
                    {/* <button onClick={()=>{signOut(); navigate('/');}} className="p-2 w-48 bg-red-900 bg-opacity-70 rounded-lg hover:bg-opacity-100 self-end animated-100">Sign out</button> */}
                    <ButtonRed
                        text={"Sign out"}
                    />
                    <div className="w-full flex flex-col">
                        <span className="font-semibold">Authenticator code:</span>
                        <InputDefault type="text" />
                    </div>
                    <ButtonDefault text="Change password" />
                    <div className="w-full h-[1px] bg-white"></div>
                    <ButtonRed
                        click={() => {
                            signOut();
                            navigate("/");
                        }}
                        text="Sign out"
                    />
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}
