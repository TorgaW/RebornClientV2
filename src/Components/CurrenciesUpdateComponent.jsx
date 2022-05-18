import React, { useEffect } from "react";
import { request, gql } from "graphql-request";
import { CurrenciesStorage } from "../Storages/CurrenciesStorage";

export default function CurrenciesUpdateComponent() {
    async function updatePrices() {
        //BCH Price
        let BCHResponse = await (await fetch("https://api.binance.com/api/v3/avgPrice?symbol=BCHUSDT"))?.json();
        let BCHPrice = parseFloat(BCHResponse.price);

        //GAME Price
        const gameQuery = gql`
            {
                pair(id: "0x2ea9369daee963cebc0266ae8b98c3e015c59046") {
                    token1Price
                }
            }
        `;

        let gameResponse = await request("https://thegraph.mistswap.fi/subgraphs/name/mistswap/exchange", gameQuery);
        let gamePrice = BCHPrice / parseFloat(gameResponse.pair.token1Price);

        //update storage info
        CurrenciesStorage.update((s) => {
            s.BCHPrice = BCHPrice.toFixed(2);
            s.GAMEPrice = gamePrice.toFixed(5);
        });

        // console.log({GAME: gamePrice, BCH: BCHPrice});

        return { GAME: gamePrice, BCH: BCHPrice };
    }

    useEffect(() => {
        updatePrices();

        CurrenciesStorage.update((s) => {
            s.forceUpdatePrices = updatePrices;
        });

        const interval = setInterval(() => {
            updatePrices();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return <></>;
}
