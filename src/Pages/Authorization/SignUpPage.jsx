import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Link, useNavigate } from "react-router-dom";
import ButtonDefault from "../../Components/UI/StyledComponents/ButtonDefault";
import { UIStorage } from "../../Storages/UIStorage";
import { scrollToTop } from "../../Utils/BrowserUtil";
import { signUp_EP } from "../../Utils/EndpointsUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";

export default function SignUpPage() {
    const navigate = useNavigate();

    const ui = useStoreState(UIStorage);

    const { executeRecaptcha } = useGoogleReCaptcha();
    async function handleReCaptchaVerify() {
        if (!executeRecaptcha) {
            ui.showError("Execute recaptcha not yet available");
            return;
        }
        const token = await executeRecaptcha("yourAction");
        return token;
    }

    async function register() {
        let email = document.getElementById("signup-email").value;
        let username = document.getElementById("signup-username").value;
        let password = document.getElementById("signup-password").value;
        let confirmPassword = document.getElementById("confirm-signup-password").value;

        if (isStringEmptyOrSpaces([email, username, password, confirmPassword])) {
            ui.showError("Some fields are empty!");
            return;
        }

        if (password !== confirmPassword) {
            ui.showError("Passwords are not the same!");
            return;
        }

        if (password.length < 8) {
            ui.showError("Password is too weak!");
            return;
        }

        ui.showContentLoading();

        let captchaToken = await handleReCaptchaVerify();

        try {
            let response = await axios.post(signUp_EP(), {
                email,
                username,
                password,
                captchaToken,
            });
            if (response.data.message === "User registered successfully!") {
                ui.hideContentLoading();
                ui.showSuccess("You have successfully registered!");
                navigate("/signin");
            }
        } catch (error) {
            ui.hideContentLoading();
            ui.showError(error?.response?.data?.message ?? error.message);
        }
    }

    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <div className="w-full h-full flex justify-center px-2 py-10 min-h-[500px]">
            <div className="w-full md:w-[750px] h-[450px] bg-dark-purple-100 bg-opacity-10 shadow-lg mt-10 rounded-xl flex flex-col p-4 text-white items-center justify-center gap-2">
                <h3 className="text-2xl font-semibold">Create your new account</h3>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Email</span>
                    <input
                        id="signup-email"
                        type="text"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") register();
                        }}
                        className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2"
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Username</span>
                    <input
                        id="signup-username"
                        type="text"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") register();
                        }}
                        className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2"
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Password</span>
                    <input
                        id="signup-password"
                        type="password"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") register();
                        }}
                        className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2"
                    />
                    <div className="w-full flex justify-end">
                        {/* <span className='underline text-right text-gray-400 cursor-pointer hover:text-gray-300'>I forgot my password</span> */}
                    </div>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Confirm password</span>
                    <input
                        id="confirm-signup-password"
                        type="password"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") register();
                        }}
                        className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2"
                    />
                    <div className="w-full flex justify-end">
                        {/* <span className='underline text-right text-gray-400 cursor-pointer hover:text-gray-300'>I forgot my password</span> */}
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                    {/* <button onClick={()=>{register()}} className="h-12 bg-dark-purple-100 bg-opacity-70 hover:bg-opacity-100 animated-100 rounded-md font-semibold w-44">
                        Create account
                    </button> */}
                    <ButtonDefault
                        click={() => {
                            register();
                        }}
                        text="Create account"
                        additionalStyle={"p-4 w-44"}
                    />
                    <Link to="/signin">
                        <span className="underline text-teal-400 opacity-70 hover:opacity-100 cursor-pointer animated-100 px-2">I already have an account</span>
                    </Link>
                    {/* <button>Sign in</button> */}
                </div>
            </div>
        </div>
    );
}
