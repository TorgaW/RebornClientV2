import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { UIStorage } from "../Storages/UIStorage";
import { useNavigate, useParams } from "react-router-dom";
import { getNFTsByIndexes_EP, getHeroById_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { getDataFromResponse } from "../Utils/NetworkUtil";
import { getRandomString } from "../Utils/RandomUtil";
import AdaptiveLoadingComponent from "../Components/UI/AdaptiveLoadingComponent";
import ButtonGreen from "../Components/UI/StyledComponents/ButtonGreen";
import { scrollToTop } from "../Utils/BrowserUtil";
import NavigationArrow from "../Icons/NavigationArrow";
import IconComponent from "../Icons/IconComponent";

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
        scrollToTop();
        return () => {
            ui.hideContentLoading();
        };
    }, []);

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-full lg:w-[1000px] bg-dark-purple-100 bg-opacity-10 flex items-center justify-center p-4">
                <HeroTile {...heroData} />
                <button
                    onClick={() => {
                        navigate(-1);
                    }}
                    className="fixed mt-4 ml-4 left-0 top-[120px]"
                >
                    <IconComponent
                        Icon={NavigationArrow}
                        size={40}
                        color={"#dcf5ed"}
                        hoveredColor={"#31cc9b"}
                        animation={"animated-100"}
                        buttonStyle={"w-14 h-14 mt-3 ml-3 hover:bg-slate-700 bg-slate-800 shadow-lg animated-100 p-2 rounded-full"}
                    />
                </button>
            </div>
        </div>
    );
}

function SkillTile({ skillVal, skillTitle }) {
    const skillsPalette = {
        sexy: "bg-pink-400",
        lucky: "bg-yellow-300",
        brave: "bg-slate-200",
        healthy: "bg-red-500",
        smart: "bg-blue-500",
        skilled: "bg-green-500",
    };

    return (
        <div className={"group relative w-full mt-4 py-1 px-2 rounded-md bg-opacity-20 " + skillsPalette[skillTitle.toLowerCase()]}>
            <div className="relative z-10 flex justify-between">
                <span className="font-semibold">{skillTitle}</span>
                <span className="font-semibold">{skillVal}</span>
            </div>
            <div
                className={
                    "absolute inset-0 h-full rounded-md bg-opacity-30 font-semibold group-hover:bg-opacity-60 animated-100 " +
                    skillsPalette[skillTitle.toLowerCase()]
                }
                style={{ width: skillVal + "%" }}
            ></div>
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

    const originPalette = {
        border: { Founding: "border-amber-400" },
        text: { Founding: "text-amber-400" },
    };

    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="w-full mt-6 flex flex-col justify-center items-center gap-6 text-white px-4">
            <div
                className={
                    "w-full flex flex-col justify-center items-center gap-6 px-6 py-6 border-t-2 border-b-2 border-opacity-80 " + tribePalette["border"][tribe]
                }
            >
                <div className="w-full flex px-4 flex-col justify-center items-center gap-3">
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
                    <div className="bg-gray-800 bg-opacity-50 w-full max-w-[350px] text-center p-1 rounded-lg">
                        <span className={"text-3xl font-bold text-opacity-70 " + tribePalette["text"][tribe]}>{tribe}</span>
                    </div>
                    <div className="flex flex-col w-full max-w-[350px] justify-center bg-gray-800 rounded-xl px-4 py-4 bg-opacity-80">
                        <span className="text-2xl font-semibold">Skills</span>
                        <SkillTile skillVal={skills?.sexy} skillTitle={"Sexy"} />
                        <SkillTile skillVal={skills?.lucky} skillTitle={"Lucky"} />
                        <SkillTile skillVal={skills?.brave} skillTitle={"Brave"} />
                        <SkillTile skillVal={skills?.healthy} skillTitle={"Healthy"} />
                        <SkillTile skillVal={skills?.smart} skillTitle={"Smart"} />
                        <SkillTile skillVal={skills?.skilled} skillTitle={"Skilled"} />
                    </div>
                </div>
            </div>
            {/* <ButtonGreen additionalStyle={"md:w-[350px] w-full"} text={"View on Marketplace"} /> */}
        </div>
    );
}
