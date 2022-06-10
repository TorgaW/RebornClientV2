import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UIStorage } from "../Storages/UIStorage";
import { getDataFromResponse } from "../Utils/NetworkUtil";

export default function HeroView() {

    const params = useParams();

    const ui = useStoreState(UIStorage);

    useEffect(()=>{
        async function h() {
            if(params && params.heroIndex) {
                
            }
        };
    },[]);

    return (
        <div></div>
    );
}