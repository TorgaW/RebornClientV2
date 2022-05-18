import { Store } from "pullstate";

export const UIStorage = new Store({
    UIOptions: {},
    uiMessages: [],
    showNotification: ()=>{},
    showError: ()=>{},
    showSuccess: ()=>{},
    showContentLoading: ()=>{},
    hideContentLoading: ()=>{},
    isMobile: false,
});