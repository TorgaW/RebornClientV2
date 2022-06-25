import { useStoreState } from "pullstate";
import React, { useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Link, useNavigate } from "react-router-dom";
import ButtonDefault from "../../Components/UI/StyledComponents/ButtonDefault";
import { UIStorage } from "../../Storages/UIStorage";
import { scrollToTop } from "../../Utils/BrowserUtil";
import { getElementById } from "../../Utils/CodeUtils";
import { changePassword_EP } from "../../Utils/EndpointsUtil";
import { makePost } from "../../Utils/NetworkUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";

export default function ForgotPasswordPage() {

    const navigate = useNavigate();

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



    async function resetPass() {

        let username = getElementById('username')?.value;
        let password = getElementById('pass')?.value;
        let code = getElementById('code')?.value;

        if(isStringEmptyOrSpaces([username, password, code])) {
            ui.showError("Please, fill all fields.");
            return;
        }

        if(!(/^\d+$/.test(code))){
            ui.showError("Please, enter valid code from your authenticator.");
            return;
        }

        ui.showContentLoading();

        let captcha = await handleReCaptchaVerify();
        let [d,s,e] = await makePost(changePassword_EP(), {
            username,
            password,
            code,
            captchaToken: captcha,
        });
        ui.hideContentLoading();
        if(d) {
            ui.showSuccess('Your password was successfully changed!');
            navigate('/signin');
        }
        else {
            ui.showError(e);
        }
    }

    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <div className="w-full h-full flex justify-center px-2 py-10 mih-h-[550px]">
            <div className="w-full md:w-[750px] h-[500px] bg-dark-purple-100 bg-opacity-10 shadow-lg mt-10 rounded-xl flex flex-col p-4 text-white items-center justify-center gap-5">
                <h3 className="text-2xl font-semibold">Restore your password</h3>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Username</span>
                    <input id="username" type="text" className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2" />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">New password</span>
                    <input
                        type="password"
                        id="pass"
                        className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2"
                    />
                </div>
                <div className="w-full flex flex-col gap-1">
                    <span className="text-gray-300 font-semibold opacity-70 text-sm">Authentication code</span>
                    <input id="code" type="text" className="w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2" />
                </div>
                <div className="flex flex-col gap-4 items-center mt-7">
                    {/* <button className="h-12 bg-dark-purple-100 bg-opacity-70 hover:bg-opacity-100 animated-100 rounded-md font-semibold w-44">Change password</button> */}
                    <ButtonDefault additionalStyle={'p-4'} text={"Change password"} click={()=>{resetPass()}} />
                    <Link to="/signin">
                        <span className="underline text-teal-400 opacity-70 hover:opacity-100 cursor-pointer animated-100 px-2">Back to sign in</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
