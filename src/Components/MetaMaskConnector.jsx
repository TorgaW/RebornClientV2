import React, { useEffect } from "react";
import { MetaMaskStorage } from "../Storages/MetaMaskStorage";
import { UserDataStorage } from "../Storages/UserDataStorage";
import { isTabletOrMobileBrowser } from "../Utils/BrowserUtil";
import { useStoreState } from "pullstate";
import { createLocalOptionsIfNotExist, getLocalOptions } from "../Utils/LocalStorageManager/LocalStorageManager";
import { ethers } from "ethers";
import { getUserNonce } from "../Utils/LocalStorageManager/LocalStorageManager";
import axios from "axios";
import { safeAuthorize_header, signedMessageMetaMask_EP } from "../Utils/EndpointsUtil";
import { catch401, logout } from "../Utils/NetworkUtil";
import { UIStorage } from "../Storages/UIStorage";
// import { MetaMaskStorage } from "../Storages/MetaMaskStorage";

export default function MetaMaskConnector() {

    const userData = useStoreState(UserDataStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const ui = useStoreState(UIStorage);

    async function connectToMetamask() {
        if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
            console.log("MetaMask is installed!");
            const ethereum = window.ethereum;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const network = await provider.getNetwork();
            if(network.chainId !== 10000){
                ui.showError('Please, switch Metamask to SmartBCH network.');
                return;
            }
            // console.log(network);
            try {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                MetaMaskStorage.update((s) => {
                    s.isConnected = true;
                    s.wallet = accounts[0];
                });
                // console.log(accounts[0]);
            } catch (error) {
                MetaMaskStorage.update((s) => {
                    s.isConnected = false;
                    s.wallet = '';
                });
                console.log(error.message);
            }
        } else {
            //no metamask
            ui.showError('Web3 Network error! Please, install Metamask.');
            console.log("MetaMask is not connected!");
        }
    }

    async function signUserNonce() {
        if(userData.isLoggedIn && metamask.wallet){
            let userNonce = getUserNonce();
            // console.log(userNonce);
            if(!userNonce || userNonce === 'undefined') return;
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let signer = provider.getSigner();
            // logout();
            try {
                let message = await signer.signMessage(userNonce);
                await axios.post(signedMessageMetaMask_EP(),{
                    message,
                    address: metamask.wallet,
                }, safeAuthorize_header())
            } catch (error) {
                if(catch401(error))
                {
                    logout();
                    ui.showError('Your session is expired. Please, sign in again.');
                }
                ui.showError('Your nonce is old! Please, sign in again.');
                console.log(error.message);
            }
        }
    }

    useEffect(() => {

        // disable metamask on mobile devices
        if(isTabletOrMobileBrowser())
            return;

        //otherwise
        MetaMaskStorage.update((s) => {
            s.connectToMetaMask = connectToMetamask;
            s.signNonce = signUserNonce;
        });

        // createLocalOptionsIfNotExist();
        let localOptions = getLocalOptions();
        if (localOptions?.autoConnectToMetaMask) connectToMetamask();

        if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
            window.ethereum.on("accountsChanged", ()=>{
                console.log('MetaMask is disconnected');
                MetaMaskStorage.update((s) => {
                    s.isConnected = false;
                    s.wallet = '';
                });
            });
        }

        // console.log('1');
    }, []);

    useEffect(()=>{
        if(userData.isLoggedIn && metamask.wallet){
            signUserNonce();
        }
    },[userData, metamask])

    return <></>;
}
