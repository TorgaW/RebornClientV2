import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdaptiveLoadingComponent from "../../Components/UI/AdaptiveLoadingComponent";
import ButtonDefault from "../../Components/UI/StyledComponents/ButtonDefault";
import ButtonRed from "../../Components/UI/StyledComponents/ButtonRed";
import InputDefault from "../../Components/UI/StyledComponents/InputDefault";
import { MetaMaskStorage } from "../../Storages/MetaMaskStorage";
import { UIStorage } from "../../Storages/UIStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { deleteUserDataFromStorage, getLocalOptions, saveLocalOptions } from "../../Utils/LocalStorageManager/LocalStorageManager";

export default function AccountOption() {
    let navigate = useNavigate();

    const userData = useStoreState(UserDataStorage);
    // const metamask = useStoreState(MetaMaskStorage);
    const ui = useStoreState(UIStorage);

    const [showProfile, setShowProfile] = useState(false);
    const [userSettings, setUserSettings] = useState(getLocalOptions());
    const [safeUserData, setSafeUserData] = useState({});

    useEffect(() => {
        if (!userData.getLocalUserData()) navigate("/restricted");
        else setShowProfile(true);

        setSafeUserData(userData.getLocalUserData());
    }, []);

    function signOut() {
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
                <div className="w-full max-w-[800px] flex flex-col gap-4 p-8 bg-dark-purple-300 rounded-lg">
                    <div className="w-full flex justify-center">
                        <span className="text-2xl font-semibold">Account information</span>
                    </div>
                    <div className="w-full flex items-center gap-2 text-xl">
                        <span className="font-semibold">Username:</span>
                        <span className="text-pink-100">{safeUserData.username}</span>
                    </div>
                    <div className="w-full flex items-center gap-2 text-xl">
                        <span className="font-semibold">Email:</span>
                        <span className="text-pink-100">{safeUserData.email}</span>
                    </div>
                    <div className="w-full h-[1px] bg-white"></div>
                    <div className="w-full flex justify-center">
                        <span className="text-2xl font-semibold">Two-factor authentication</span>
                    </div>
                    {safeUserData.twoFA ? (
                        <div className="w-full flex flex-col gap-2">
                            <span className="text-green-300">You have already connected two-factor authentication!</span>
                            <ButtonDefault text="Show my QR-code" />
                        </div>
                    ) : (
                        <div className="w-full flex flex-col gap-2">
                            <span className="text-red-300">Two-factor authentication is disabled!</span>
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
