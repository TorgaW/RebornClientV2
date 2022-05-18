import { Store } from "pullstate";

export const CurrenciesStorage = new Store({
    BCHPrice: '0',
    GAMEPrice: '0',
    forceUpdatePrices: ()=>{},
});