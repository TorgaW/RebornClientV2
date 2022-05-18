import { useStoreState } from "pullstate";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHashStorage } from "../../Storages/Stuff/AuthHashStorage";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { saveAuthorizeToken, signIn_EP } from "../../Utils/EndpointsUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";
import { UIStorage } from "../../Storages/UIStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { saveUserNonce } from "../../Utils/LocalStorageManager/LocalStorageManager";

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
        let captchaToken = await handleReCaptchaVerify();

        let username = document.getElementById("login-username").value;
        let password = document.getElementById("login-password").value;

        if (isStringEmptyOrSpaces(username) || isStringEmptyOrSpaces(password)) {
            ui.showError("Please, enter your username and password.");
            return;
        }

        try {
            let response = await axios.post(signIn_EP(), {
                username,
                password,
                captchaToken,
            });
            UserDataStorage.update((s)=>{
                s.userData = response.data;
            })
            if(response.data.twoFA){
                let h = authHash.generateHash();
                navigate("/auth/"+username+"/" + h);
            }
            else{
                saveUserNonce(response.data.nonce);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            ui.showError('Error login! Please, ensure your data is correct.');
        }
    }

    return (
        <div className="w-full h-full flex justify-center px-2 py-10">
            <div className="w-full md:w-[750px] h-[400px] bg-dark-purple-100 bg-opacity-10 shadow-lg mt-10 rounded-xl flex flex-col p-4 text-white items-center justify-center gap-5">
                <h3 className="text-2xl font-semibold">Sign in to your account</h3>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Username</span>
                    <input
                        id="login-username"
                        type="text"
                        className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2"
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Password</span>
                    <input
                        id="login-password"
                        type="password"
                        className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2"
                    />
                    <div className="w-full flex justify-end">
                        <Link to="/forgotpass">
                            <span className="underline text-right text-gray-400 cursor-pointer hover:text-gray-300">I forgot my password</span>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                    <button
                        onClick={() => {
                            login();
                        }}
                        className="h-12 bg-dark-purple-100 bg-opacity-70 hover:bg-opacity-100 animated-100 rounded-md font-semibold w-44"
                    >
                        Sign in
                    </button>
                    <Link to="/signup">
                        <span className="underline text-teal-400 opacity-70 hover:opacity-100 cursor-pointer animated-100 px-2">Or create a new account</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
