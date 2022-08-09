import React, { useEffect } from "react";
import { request, gql } from "graphql-request";
import { CurrenciesStorage } from "../Storages/CurrenciesStorage";

export default function CurrenciesUpdateComponent() {

    async function updateBCHPrice() {
        let BCHPrice = 0;
        try {
            //BCH Price
            let BCHResponse = await (await fetch("https://api.binance.com/api/v3/avgPrice?symbol=BCHUSDT"))?.json();
            BCHPrice = parseFloat(BCHResponse.price);
        } catch (error) {}

        CurrenciesStorage.update((s) => {
            s.BCHPrice = BCHPrice.toFixed(2);
            // s.GAMEPrice = gamePrice.toFixed(5);
        });

        return BCHPrice;
    }

    async function updateGAMEPrice(BCH) {
        let gamePrice = 0;
        try {
            //GAME Price
            const gameQuery = gql`
                {
                    pair(id: "0x2ea9369daee963cebc0266ae8b98c3e015c59046") {
                        token1Price
                    }
                }
            `;

            let gameResponse = await request("https://thegraph.mistswap.fi/subgraphs/name/mistswap/exchange", gameQuery);
            let BCHPrice = BCH ?? (await updateBCHPrice());
            gamePrice = BCHPrice / parseFloat(gameResponse.pair.token1Price);
        } catch (error) {}

        CurrenciesStorage.update((s) => {
            // s.BCHPrice = BCHPrice.toFixed(2);
            s.GAMEPrice = "-";
        });

        return "-";
    }

    async function updatePrices() {

        let BCHPrice = updateBCHPrice();
        let gamePrice = updateGAMEPrice(BCHPrice);

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
