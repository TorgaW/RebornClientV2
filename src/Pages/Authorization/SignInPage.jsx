import { useStoreState } from "pullstate";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHashStorage } from "../../Storages/Stuff/AuthHashStorage";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { saveAuthorizeToken, signIn_EP } from "../../Utils/EndpointsUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";
import { UIStorage } from "../../Storages/UIStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { saveUserDataToStorage, saveUserNonce } from "../../Utils/LocalStorageManager/LocalStorageManager";
import ButtonDefault from "../../Components/UI/StyledComponents/ButtonDefault";
import InputDefault from "../../Components/UI/StyledComponents/InputDefault";
import { scrollToTop } from "../../Utils/BrowserUtil";

export default function SignInPage() {
    let navigate = useNavigate();

    const authHash = useStoreState(AuthHashStorage);
    const ui = useStoreState(UIStorage);

    // v3 captcha
    const { executeRecaptcha } = useGoogleReCaptcha();
    async function handleReCaptchaVerify() {
        if (!executeRecaptcha) {
            return;
        }
        const token = await executeRecaptcha("login");
        return token;
    }
    // captcha end

    async function login() {
        ui.showContentLoading();
        let captchaToken = await handleReCaptchaVerify();

        let username = document.getElementById("login-username").value;
        let password = document.getElementById("login-password").value;

        if (isStringEmptyOrSpaces(username) || isStringEmptyOrSpaces(password)) {
            ui.showError("Please, enter your username and password.");
            ui.hideContentLoading();
            return;
        }

        try {
            let response = await axios.post(signIn_EP(), {
                username,
                password,
                captchaToken,
            });
            UserDataStorage.update((s) => {
                s.userData = response.data;
            });
            if (response.data.twoFA) {
                ui.hideContentLoading();
                let h = authHash.generateHash();
                navigate("/auth/" + username + "/" + h);
            } else {
                ui.hideContentLoading();
                saveUserDataToStorage(response.data, response.data.accessToken);
                console.log(response.data);
                UserDataStorage.update((s)=>{
                    s.isLoggedIn = true;
                })
                saveUserNonce(response.data.nonce);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            ui.showError("Error login! Please, ensure your data is correct.");
            ui.hideContentLoading();
        }
    }

    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <div className="w-full h-full flex justify-center px-2 py-10 min-h-[500px]">
            <div className="w-full md:w-[750px] h-[400px] bg-dark-purple-100 bg-opacity-10 shadow-lg mt-10 rounded-xl flex flex-col p-4 text-white items-center justify-center gap-5">
                <h3 className="text-2xl font-semibold">Sign in to your account</h3>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Username</span>
                    <InputDefault
                        id="login-username"
                        type="text"
                        keyDown={(e) => {
                            if (e.key === "Enter") login();
                        }}
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Password</span>
                    <InputDefault
                        id="login-password"
                        type="password"
                        keyDown={(e) => {
                            if (e.key === "Enter") login();
                        }}
                    />
                    <div className="w-full flex justify-end">
                        <Link to="/forgotpass">
                            <span className="underline text-right text-gray-400 cursor-pointer hover:text-gray-300">I forgot my password</span>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                    <ButtonDefault
                        text={"Sign in"}
                        click={() => {
                            login();
                        }}
                        additionalStyle={"p-4 w-44"}
                    />
                    <Link to="/signup">
                        <span className="underline text-teal-400 opacity-70 hover:opacity-100 cursor-pointer animated-100 px-2">Or create a new account</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
