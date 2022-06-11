import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthHashStorage } from "../../Storages/Stuff/AuthHashStorage";
import { UIStorage } from "../../Storages/UIStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { createAuthorizeHeader, saveAuthorizeToken, verify2FA_EP } from "../../Utils/EndpointsUtil";
import { saveUserDataToStorage, saveUserNonce } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { getDataFromResponse } from "../../Utils/NetworkUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";

export default function ProofAuthWithCodePage() {
    let params = useParams();
    let navigate = useNavigate();

    const authHash = useStoreState(AuthHashStorage);
    const ui = useStoreState(UIStorage);
    const userData = useStoreState(UserDataStorage);
    const [validUser, setValidUser] = useState(false);

    useEffect(() => {
        if (authHash.hash === params.authHash && authHash.expiresTime > Date.now()) {
            setValidUser(true);
            return;
        }
        navigate("/whoops");
    }, []);

    async function submitCode() {
        let code = document.getElementById("2fa-code").value;
        if (isStringEmptyOrSpaces(code)) {
            ui.showError("Please, enter verification code from your authenticator.");
            return;
        }

        if(!(/^\d+$/.test(code))){
            ui.showError("Please, enter valid code from your authenticator.");
            return;
        }

        try {
            let response = await axios.post(verify2FA_EP(), { code }, createAuthorizeHeader(userData.userData.accessToken));
            saveUserNonce(response.data.data.nonce);
            saveUserDataToStorage(userData.userData, userData.userData.accessToken);
            UserDataStorage.update((s)=>{
                s.isLoggedIn = true;
            })
            navigate('/');

        } catch (error) {
            ui.showError("Invalid code!");
            console.log(error?.response?.data?.message);
        }
    }

    return validUser ? (
        <div className="w-full h-full flex justify-center px-2 py-10">
            <div className="w-full md:w-[750px] h-[400px] bg-dark-purple-100 bg-opacity-10 shadow-lg mt-10 rounded-xl flex flex-col p-4 text-white items-center justify-center gap-5">
                <h3 className="text-2xl font-semibold">Enter code from authenticator</h3>
                <div className="w-full flex flex-col gap-1">
                    {/* <span className="text-gray-300 font-semibold opacity-70 text-sm">Username</span> */}
                    <input
                        id="2fa-code"
                        maxLength={6}
                        type="text"
                        autoFocus
                        onChange={(e)=>{
                            if(e?.target?.value?.length === 6) submitCode();
                        }}
                        className="w-full h-16 text-4xl tracking-[0.3em] font-bold rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2 text-center"
                    />
                </div>
                <div className="flex flex-col gap-4 items-center">
                    <button
                        onClick={() => {
                            submitCode();
                        }}
                        className="h-12 bg-dark-purple-100 bg-opacity-70 hover:bg-opacity-100 animated-100 rounded-md font-semibold w-44"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}
