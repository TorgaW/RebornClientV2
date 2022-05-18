import { Store } from "pullstate";

export const MetaMaskStorage = new Store({
    isConnected: false,
    wallet: '',
    connectToMetaMask: ()=>{},
    signNonce: ()=>{},
    userNonce: -10,
});