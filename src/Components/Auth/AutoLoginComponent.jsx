import React, { useEffect } from "react";
import { getUserAuthToken, getUserDataFromStorage } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { Buffer } from "buffer";
// import { useStoreState } from "pullstate";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import axios from "axios";
import { getTokenExpiresTime_EP, safeAuthorize_header } from "../../Utils/EndpointsUtil";
// import { UserBalanceStorage } from "../../Storages/UserBalanceStorage";

export default function AutoLoginComponent() {

    // const userData = useStoreState(UserDataStorage);
    // const balance = useStoreState(UserBalanceStorage);

    useEffect(()=>{

        // async function startup() {
        //     let tokenTime = await axios.post(getTokenExpiresTime_EP(), {}, safeAuthorize_header());
        //     console.log(tokenTime);
        // }

        let rawToken = getUserAuthToken();
        if(rawToken){
            try {
                let token = rawToken.split(".")[1];
                let stringToken = Buffer.from(token, "base64").toString("utf8");
                let a = JSON.parse(stringToken);
                if (a.exp < Date.now()) {
                    let userOldData = getUserDataFromStorage();
                    UserDataStorage.update((s) => {
                        s.isLoggedIn = true;
                        s.userData = JSON.parse(userOldData.data);
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }

        
        // startup();
    },[])

    return <></>;
}
