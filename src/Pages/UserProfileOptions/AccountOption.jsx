import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import AdaptiveLoadingComponent from "../../Components/UI/AdaptiveLoadingComponent";
import ButtonDefault from "../../Components/UI/StyledComponents/ButtonDefault";
import ButtonGreen from "../../Components/UI/StyledComponents/ButtonGreen";
import ButtonRed from "../../Components/UI/StyledComponents/ButtonRed";
import InputDefault from "../../Components/UI/StyledComponents/InputDefault";
import { MetaMaskStorage } from "../../Storages/MetaMaskStorage";
import { UIStorage } from "../../Storages/UIStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { changePassword_EP, getQr_EP, safeAuthorize_header, set2FA_EP } from "../../Utils/EndpointsUtil";
import { deleteUserDataFromStorage, getLocalOptions, saveLocalOptions, saveUserDataToStorage } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { getDataFromResponse, logout, makePost } from "../../Utils/NetworkUtil";
import { isStringEmptyOrSpaces, strToBase } from "../../Utils/StringUtil";
import { isTabletOrMobileBrowser } from "../../Utils/BrowserUtil";
import { TempLinkStorage } from "../../Storages/Stuff/TempLinkStorage";
import { getRandomString } from "../../Utils/RandomUtil";

export default function AccountOption() {
    let navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(isTabletOrMobileBrowser());

    const userData = useStoreState(UserDataStorage);
    // const metamask = useStoreState(MetaMaskStorage);
    const ui = useStoreState(UIStorage);
    const tempLink = useStoreState(TempLinkStorage);

    const [showProfile, setShowProfile] = useState(false);
    const [userSettings, setUserSettings] = useState(getLocalOptions());
    const [safeUserData, setSafeUserData] = useState({});

    const [showQR, setShowQR] = useState(false);
    const [QRCode, setQRCode] = useState("");
    const [QRCodeLoaded, setQRCodeLoaded] = useState(false);

    const [new2FAData, setNew2FAData] = useState({ qr: null, privateKey: null });

    const { executeRecaptcha } = useGoogleReCaptcha();
    async function handleReCaptchaVerify() {
        if (!executeRecaptcha) {
            ui.showError("Execute recaptcha not yet available");
            return;
        }
        const token = await executeRecaptcha("yourAction");
        return token;
    }

    useEffect(() => {
        if (!userData.getLocalUserData()) navigate("/restricted");
        else setShowProfile(true);

        setSafeUserData(userData.getLocalUserData());

        return ()=>{
            ui.hideContentLoading();
        }
    }, []);

    async function getQR() {
        if (showQR) {
            setShowQR(false);
            return;
        }
        if (QRCode) {
            setShowQR(true);
            return;
        }
        let data = getDataFromResponse(await axios.get(getQr_EP(), safeAuthorize_header()));
        setQRCode(data.qrLink);
        setShowQR(true);
    }

    async function changePassword() {
        // username: cStorage.logData.sub,
        // password: newP,
        // code: cod,
        // captchaToken: captcha,
        let firstPass = document.getElementById("change-pass-first").value;
        let secondPass = document.getElementById("change-pass-second").value;
        let code = document.getElementById("change-pass-code").value;

        if (firstPass !== secondPass) {
            ui.showError("Passwords are not the same");
            return;
        }

        if (isStringEmptyOrSpaces(firstPass)) {
            ui.showError("Please, enter new password");
            return;
        }

        ui.showContentLoading();
        let captcha = await handleReCaptchaVerify();

        let [d, s, e] = await makePost(changePassword_EP(), {
            username: userData.userData.username,
            password: firstPass,
            code,
            captchaToken: captcha,
        });
        ui.hideContentLoading();
        console.log(d);
    }

    async function enable2FA() {
        ui.showContentLoading();
        let [d, s, e] = await makePost(set2FA_EP(), {}, true);
        if (d) {
            saveUserDataToStorage({ ...userData.getLocalUserData(), twoFA: true });
            UserDataStorage.update((s) => {
                s.userData = { ...s.userData, twoFA: true };
            });
            let link = getRandomString(32);
            tempLink.setLinkFor(link, 600);
            let base64QR = strToBase(d.qrLink);
            let base64Private = strToBase(d.secretKey);
            navigate('/qr/'+base64QR+'/'+base64Private+'/'+link);
        } else {
            ui.showError(e);
            console.log(e);
            ui.hideContentLoading();
        }
    }

    return showProfile ? (
        <div className="w-full flex flex-col text-white gap-4">
            <div className="w-full flex justify-center p-4 text-center">
                <span className="text-4xl font-semibold">{userData.getLocalUserData()?.username}'s Account settings</span>
            </div>
            <div className="w-full flex justify-center p-2 gap-4 text-xl">
                {!isMobile ? (
                    <Link to="/profile/deposit">
                        <button className="p-4 h-full bg-zinc-600 bg-opacity-30 rounded-md hover:bg-opacity-80 animated-100">Deposit</button>
                    </Link>
                ) : (
                    <></>
                )}
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
                    <div className="w-full flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xl">
                        <span className="font-semibold">Username:</span>
                        <span className="text-teal-100 text-xl md:text-2xl font-bold">{safeUserData.username}</span>
                    </div>
                    <div className="w-full flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xl">
                        <span className="font-semibold">Email:</span>
                        <span className="text-teal-100 text-xl md:text-2xl font-bold">{safeUserData.email}</span>
                    </div>
                    <div className="w-full h-[1px] bg-white"></div>
                    <div className="w-full flex justify-center text-center">
                        <span className="text-2xl font-semibold">Two-factor authentication</span>
                    </div>
                    {safeUserData.twoFA ? (
                        <div className="w-full flex flex-col gap-2 text-center">
                            <span className="text-green-300">You have already connected two-factor authentication!</span>
                            <ButtonDefault
                                text={"Show my QR-code"}
                                click={() => {
                                    getQR();
                                }}
                            />
                            {showQR ? (
                                <div className="flex w-full h-48 justify-center items-center p-2 relative">
                                    <img
                                        onLoad={() => {
                                            setQRCodeLoaded(true);
                                        }}
                                        src={QRCode}
                                        alt="qr-code"
                                        className="h-full object-contain border-2 border-purple-900 p-1"
                                    />
                                    {!QRCodeLoaded ? (
                                        <div className="absolute inset-0 w-full h-full flex">
                                            <AdaptiveLoadingComponent />
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col gap-2 text-center">
                            <span className="text-red-300">Two-factor authentication is disabled!</span>
                            <ButtonGreen
                                click={() => {
                                    enable2FA();
                                }}
                                text={"Enable Two-factor Authentication"}
                            />
                        </div>
                    )}
                    <div className="w-full h-[1px] bg-white"></div>
                    <div className="w-full flex justify-center">
                        <span className="text-2xl font-semibold">Change password</span>
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <span className="font-semibold">New password:</span>
                        <InputDefault type="password" id={"change-pass-first"} />
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <span className="font-semibold">Confirm new password:</span>
                        <InputDefault type="password" id={"change-pass-second"} />
                    </div>
                    <div className="w-full flex flex-col">
                        <span className="font-semibold">Authenticator code:</span>
                        <InputDefault type="text" id={"change-pass-code"} additionalStyle={"font-bold tracking-wider"} />
                    </div>
                    {/* <button className="p-2 w-48 bg-purple-800 bg-opacity-50 rounded-lg hover:bg-opacity-90 animated-100">Change password</button> */}
                    <ButtonDefault
                        text={"Change password"}
                        click={() => {
                            changePassword();
                        }}
                    />
                    <div className="w-full h-[1px] bg-white"></div>
                    {/* <button onClick={()=>{signOut(); navigate('/');}} className="p-2 w-48 bg-red-900 bg-opacity-70 rounded-lg hover:bg-opacity-100 self-end animated-100">Sign out</button> */}
                    <ButtonRed
                        text={"Sign out"}
                        click={() => {
                            logout();
                            navigate("/");
                        }}
                    />
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}
