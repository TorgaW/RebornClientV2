import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { UIStorage } from "../Storages/UIStorage";
import { useNavigate, useParams } from "react-router-dom";
import { getNFTsByIndexes_EP, getHeroById_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { getDataFromResponse } from "../Utils/NetworkUtil";
import { getRandomString } from "../Utils/RandomUtil";

export default function HeroView() {
    const params = useParams();
    const navigate = useNavigate();

    const ui = useStoreState(UIStorage);

    const [heroData, setHeroData] = useState({});

    useEffect(() => {
        async function h() {
            if (params && params.heroIndex) {
                let idx = Number(params.heroIndex);
                if (!isNaN(idx)) {
                    try {
                        let realIndex = (idx - 163 * 172) / 727 - 1;
                        let response = await axios.post(getHeroById_EP, { index: realIndex });
                        let data = getDataFromResponse(response);
                        setHeroData(data);
                        setTimeout(() => {
                            ui.hideContentLoading();
                        }, 250);
                    } catch (error) {
                        navigate("/pagenotfound");
                    }
                }
            }
        }
        ui.showContentLoading();
        h();
        return () => {
            ui.hideContentLoading();
        };
    }, []);
    useEffect(()=>{
        fillHero();
    },[heroData])

    function fillHero() {
        <HeroTile key={getRandomString(32)} 
        index={heroData.index}
        name={heroData.name}
        tribe={heroData.tribe}
        status={heroData.status}
        imageLink={heroData.imageLink}
        age={heroData.age}
        breed={heroData.breed}
        skills={heroData.skills}
        origin={heroData.origin}
        />
    }

    return (
        <div className="shadow-lg bg-opacity-10 bg-dark-purple-100 rounded-xl pb-4">
            <div className="w-full lg:w-[1000px] flex items-center justify-center p-4">
                <HeroTile />
            </div>
        </div>
    );
}

function HeroTile({ index, name, tribe, status, imageLink, age, breed, skills, origin }) {
    const tribePalette = {
        text: {
            "Law Tribe": "text-orange-500",
            "CashCats Tribe": "text-teal-500",
            "White Crystal Tribe": "text-cyan-200",
            "Northern Light Tribe": "text-yellow-700",
            "AxieBCH Tribe": "text-indigo-500",
            "BCH Tribe": "text-lime-500",
            "Mist Tribe": "text-emerald-300",
            "Red Point": "text-red-500",
            "Ocean Tribe": "text-sky-500",
            "Invisible Boys": "text-fuchsia-300",
            "Invisible Girls": "text-fuchsia-300",
        },
        border: {
            "Law Tribe": "border-orange-500",
            "CashCats Tribe": "border-teal-500",
            "White Crystal Tribe": "border-cyan-200",
            "Northern Light Tribe": "border-yellow-700",
            "AxieBCH Tribe": "border-indigo-500",
            "BCH Tribe": "border-lime-500",
            "Mist Tribe": "border-emerald-300",
            "Red Point": "border-red-500",
            "Ocean Tribe": "border-sky-500",
            "Invisible Boys": "border-fuchsia-300",
            "Invisible Girls": "border-fuchsia-300",
        },
    };

    const skillsPalette = {
        sexy: "bg-pink-500",
        lucky: "bg-pink-500",
        brave: "bg-pink-500",
        healthy: "bg-pink-500",
        smart: "bg-pink-500",
        skilled: "bg-pink-500",
    };

    const originPalette = {
        border: { Founding: "border-amber-400" },
        text: { Founding: "text-amber-400" },
    };

    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="h-[200px] w-[200px]">
            
        </div>      
    );
}
