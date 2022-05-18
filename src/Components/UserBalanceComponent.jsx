import axios from "axios";
import React, { useEffect } from "react";
import { UserBalanceStorage } from "../Storages/UserBalanceStorage";
import { getBalance_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { UserDataStorage } from "../Storages/UserDataStorage";
// import { MetaMaskStorage } from "../Storages/MetaMaskStorage";
// import { isTabletOrMobileBrowser } from "../Utils/BrowserUtil";
import { UIStorage } from "../Storages/UIStorage";
import { useStoreState } from "pullstate";
// import { createLocalOptionsIfNotExist, getLocalOptions } from "../Utils/LocalStorageManager/LocalStorageManager";

export default function UserBalanceComponent() {
    const userData = useStoreState(UserDataStorage);
    const ui = useStoreState(UIStorage);

    async function updateUserBalance(loud) {
        try {
            let res = await axios.post(getBalance_EP(), {}, safeAuthorize_header());
            // console.log(res.data.data);
            UserBalanceStorage.update((s) => {
                s.userBalance = res.data.data;
            });
            console.log('user balance has been updated');
        } catch (error) {
            if(loud){
                ui.showError(error.message);
                ui.showError('Failed to update user deposit!');
            }
            console.log(error);
        }
    }

    useEffect(() => {
        UserBalanceStorage.update((s) => {
            s.updateUserBalance = updateUserBalance;
        });
    }, []);

    useEffect(() => {
        if (userData.isLoggedIn) {
            // console.log('updating balance');
            updateUserBalance();
        }
    }, [userData]);

    return <></>;
}
