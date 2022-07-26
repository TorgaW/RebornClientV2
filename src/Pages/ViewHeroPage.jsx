import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { UIStorage } from "../Storages/UIStorage";
import { useNavigate, useParams } from "react-router-dom";
import { getNFTsByIndexes_EP, getHeroById_EP, safeAuthorize_header, marketplaceSellItem_EP } from "../Utils/EndpointsUtil";
import { getDataFromResponse, makePost, catch401 } from "../Utils/NetworkUtil";
import { ERC721Abi, NFTAddress, SBCHProvider } from "../Utils/BlockchainUtils";
import { ethers } from "ethers";
import { MetaMaskStorage } from "../Storages/MetaMaskStorage";
import { getRandomString } from "../Utils/RandomUtil";
import AdaptiveLoadingComponent from "../Components/UI/AdaptiveLoadingComponent";
import ButtonGreen from "../Components/UI/StyledComponents/ButtonGreen";
import { scrollToTop } from "../Utils/BrowserUtil";
import NavigationArrow from "../Icons/NavigationArrow";
import IconComponent from "../Icons/IconComponent";
import InputDefault from "../Components/UI/StyledComponents/InputDefault";
import CrossIcon from "../Icons/Cross";

export default function HeroView() {
    const params = useParams();
    const navigate = useNavigate();

    const ui = useStoreState(UIStorage);
    const metamask = useStoreState(MetaMaskStorage);

    const [heroData, setHeroData] = useState({});
    const [userHeroes, setUserHeroes] = useState([]);

    async function sellHero() {
        let code = (document.getElementById("hero-sell-code").value = "");
        let price = (document.getElementById("hero-sell-price").value = NaN);
        let [d, s, e] = await makePost(
            marketplaceSellItem_EP(),
            {
                itemId: heroData.index,
                code,
                price,
                type: 3,
            },
            true
        );
        if (d) {
            ui.showSuccess("You have successfully canceled your order!");
            document.getElementById("hero-sell-popup").classList.add("hidden");
            h();
            document.getElementById("hero-sell-code").value = "";
        } else {
            ui.showError(e);
            console.log(e);
        }
    }

    async function findUserHeroes() {
        if (typeof window.ethereum === "undefined" || !window.ethereum.isMetaMask) {
            ui.showError("Web3 Network error! Please, install Metamask.");
            return;
        }
        if (!metamask.isConnected) {
            ui.showError("Please, connect Metamask.");
            return;
        }
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(NFTAddress(), ERC721Abi(), signer);
            const address = await signer.getAddress();
            let userIndexes = await contract.getUsersTokens(address);
            let a = [];
            for (const i of userIndexes) {
                a.push(i.toNumber());
            }
            setUserHeroes(a);
        } catch (error) {
            console.log(error);
            ui.showError(error.message);
        }
    }

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

    useEffect(() => {
        ui.showContentLoading();
        findUserHeroes();
        h();
        scrollToTop();
        return () => {
            ui.hideContentLoading();
        };
    }, []);

    return (
        <div className="w-full flex justify-center items-center">
            <div className="w-full lg:w-[1000px] bg-dark-purple-100 bg-opacity-10 flex items-center justify-center p-4">
                <HeroTile {...heroData} userHeroes={userHeroes} />
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

function HeroTile({ index, name, tribe, status, imageLink, age, breed, skills, origin, userHeroes }) {
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
            {(() => {
                for (const i of userHeroes) {
                    if (i === index)
                        return (
                            <ButtonGreen
                                click={() => {
                                    document.getElementById("hero-sell-popup").classList.remove("hidden");
                                }}
                                additionalStyle={"md:w-[350px] w-full"}
                                text={"Sell on Marketplace"}
                            />
                        );
                    else return <></>;
                }
            })()}
            <div
                id="hero-sell-popup"
                className="z-10 animated-200 p-2 fixed inset-0 top-[120px] flex items-center justify-center bg-black bg-opacity-90 hidden"
            >
                <div
                    className={
                        "w-full max-w-[550px] flex p-4 rounded-md relative bg-dark-purple-500 border-2 border-opacity-50 " + tribePalette["border"][tribe]
                    }
                >
                    <div className="max-h-[450px] overflow-y-auto md:max-h-[1000px] w-full flex flex-col items-center mt-6">
                        <span className="font-semibold text-lg self-start ml-2">Hero to sell</span>
                        <div className="w-full border-b-2 border-gray-600"></div>
                        <div className="w-[150px] h-[150px] flex flex-shrink-0 mt-2">
                            <img src={imageLink} alt="hero" className="w-full object-cover rounded-md " />
                        </div>
                        <span className="no-flick font-semibold text-base">{name}</span>
                        <div className="w-full flex flex-col justify-center">
                            <span className="opacity-80 text-sm text-center">{}</span>
                        </div>
                        <span className="font-semibold text-lg mt-4 self-start ml-2">Sell price</span>
                        <div className="w-full border-b-2 border-gray-600"></div>
                        <div className="w-full flex gap-2 justify-center items-center mt-2">
                            <InputDefault id={"hero-sell-price"} type={"number"} additionalStyle={"max-w-[100px] text-center text-lg font-semibold"} />
                            <span className="text-purple-700 font-semibold text-lg">GAME</span>
                        </div>
                        <span className="font-semibold text-lg mt-4 self-start ml-2">Security</span>
                        <div className="w-full border-b-2 border-gray-600"></div>
                        <div className="w-full flex flex-col gap-2 items-center mt-2">
                            <span>Code from your authenticator</span>
                            <InputDefault id={"hero-sell-code"} type={"text"} additionalStyle={"text-center text-lg font-semibold"} />
                        </div>
                        <ButtonGreen click={() => {}} text="Sell" additionalStyle={"w-full mt-4 text-lg"} />
                    </div>
                    <div className="absolute flex p-2 top-0 right-0">
                        <div
                            onClick={() => {
                                document.getElementById("hero-sell-popup").classList.toggle("hidden");
                            }}
                            className="w-6 h-6 flex justify-center items-center cursor-pointer"
                        >
                            <CrossIcon size={32} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
