import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { UIStorage } from "../Storages/UIStorage";
import { useNavigate, useParams } from "react-router-dom";
import { getNFTsByIndexes_EP, getHeroById_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { getDataFromResponse } from "../Utils/NetworkUtil";
import { getRandomString } from "../Utils/RandomUtil";
import AdaptiveLoadingComponent from "../Components/UI/AdaptiveLoadingComponent";

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
                        let response = await axios.post(getHeroById_EP(), { index: realIndex });
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

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-full lg:w-[1000px] bg-dark-purple-100 bg-opacity-10 flex items-center justify-center p-4">
                <HeroTile {...heroData} />
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
        sexy: "bg-pink-400",
        lucky: "bg-yellow-300",
        brave: "bg-slate-200",
        healthy: "bg-red-500",
        smart: "bg-blue-500",
        skilled: "bg-green-500",
    };

    const originPalette = {
        border: { Founding: "border-amber-400" },
        text: { Founding: "text-amber-400" },
    };

    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="w-full mt-4 flex text-white px-4">
            <div className={"w-full flex justify-center items-start gap-20 px-6 py-5 border-t-2 border-b-2 border-opacity-80 " + tribePalette["border"][tribe]}>
                <div className="flex flex-col gap-2 justify-center items-center">
                    <div className={"h-[300px] w-[300px] border-[6px] border-opacity-50 rounded-lg relative " + tribePalette["border"][tribe]}>
                        <img
                            onLoad={() => {
                                setImgLoaded(true);
                            }}
                            className="w-full h-full"
                            src={imageLink}
                            alt="hero"
                        />
                        <div className="absolute inset-0 flex">{imgLoaded ? <></> : <AdaptiveLoadingComponent />}</div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center p-2">
                        <span className={"text-3xl font-semibold " + (tribePalette["text"][tribe] ?? "text-white")}>
                            {name} #{index}
                        </span>
                        <div className="w-full flex justify-center items-center gap-2 text-center">
                            <span className={" font-semibold " + (tribePalette["text"][tribe] ?? "text-white")}>
                                Age: {age} Breed: {breed}
                            </span>
                            <span className={" font-semibold " + (originPalette["text"][origin] ?? "text-white")}>Origin: {origin}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center bg-gray-800 rounded-xl p-4 py-4 bg-opacity-80">
                    <span className="text-2xl font-semibold">Skills</span>
                    <div className={"relative w-[200px] mt-4 py-1 px-2 rounded-md bg-opacity-20 " + skillsPalette["sexy"]}>
                        <div className="relative z-10 flex justify-between">
                            <span>Sexy</span>
                            <span>{skills?.sexy}</span>
                        </div>
                        <div className={"absolute inset-0 h-full rounded-md bg-opacity-40 " + skillsPalette["sexy"]} style={{ width: skills?.sexy + "%" }}></div>
                    </div>
                    <div className={"relative w-[200px] mt-4 py-1 px-2 rounded-md bg-opacity-20 " + skillsPalette["lucky"]}>
                        <div className="relative z-10 flex justify-between">
                            <span>Lucky</span>
                            <span>{skills?.lucky}</span>
                        </div>
                        <div className={"absolute inset-0 h-full rounded-md bg-opacity-40 " + skillsPalette["lucky"]} style={{ width: skills?.lucky + "%" }}></div>
                    </div>
                    <div className={"relative w-[200px] mt-4 py-1 px-2 rounded-md bg-opacity-20 " + skillsPalette["brave"]}>
                        <div className="relative z-10 flex justify-between">
                            <span>Brave</span>
                            <span>{skills?.brave}</span>
                        </div>
                        <div className={"absolute inset-0 h-full rounded-md bg-opacity-40 " + skillsPalette["brave"]} style={{ width: skills?.brave + "%" }}></div>
                    </div>
                    <div className={"relative w-[200px] mt-4 py-1 px-2 rounded-md bg-opacity-20 " + skillsPalette["healthy"]}>
                        <div className="relative z-10 flex justify-between">
                            <span>Healthy</span>
                            <span>{skills?.healthy}</span>
                        </div>
                        <div className={"absolute inset-0 h-full rounded-md bg-opacity-40 " + skillsPalette["healthy"]} style={{ width: skills?.healthy + "%" }}></div>
                    </div>
                    <div className={"relative w-[200px] mt-4 py-1 px-2 rounded-md bg-opacity-20 " + skillsPalette["smart"]}>
                        <div className="relative z-10 flex justify-between">
                            <span>Smart</span>
                            <span>{skills?.smart}</span>
                        </div>
                        <div className={"absolute inset-0 h-full rounded-md bg-opacity-40 " + skillsPalette["smart"]} style={{ width: skills?.smart + "%" }}></div>
                    </div>
                    <div className={"relative w-[200px] mt-4 py-1 px-2 rounded-md bg-opacity-20 " + skillsPalette["skilled"]}>
                        <div className="relative z-10 flex justify-between">
                            <span>Skilled</span>
                            <span>{skills?.skilled}</span>
                        </div>
                        <div className={"absolute inset-0 h-full rounded-md bg-opacity-40 " + skillsPalette["skilled"]} style={{ width: skills?.skilled + "%" }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
