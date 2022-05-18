import React, { useEffect, useState } from "react";
import { AuthHashStorage } from "../../Storages/Stuff/AuthHashStorage";
import { getRandomString } from "../../Utils/RandomUtil";

export default function AuthHasherComponent() {

    function generateAuthHash() {

        // // encode as UTF-8
        // baseString += getRandomString(128);
        // const msgBuffer = new TextEncoder().encode(baseString);

        // // hash the message
        // const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

        // // convert ArrayBuffer to Array
        // const hashArray = Array.from(new Uint8Array(hashBuffer));

        // // convert bytes to hex string
        // const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        let pseudo = getRandomString(128); // better then real hash

        AuthHashStorage.update((s)=>{
            s.hash = pseudo;
            s.expiresTime = Date.now() + 30000;
        });

        return pseudo;
    }

    useEffect(() => {
        AuthHashStorage.update((s) => {
            s.generateHash = generateAuthHash;
        });
    }, []);

    return <></>;
}
