import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UIStorage } from "../Storages/UIStorage";
import { burnBox_EP, getBoxById_EP, getHeroById_EP, safeAuthorize_header } from "../Utils/EndpointsUtil";
import { getDataFromResponse } from "../Utils/NetworkUtil";
import luckyBoxImage from "../Images/Boxes/luckyBox.png";
import mysteryBoxImage from "../Images/Boxes/mysteryBox.png";
import AdaptiveLoadingComponent from "../Components/UI/AdaptiveLoadingComponent";
import { UserDataStorage } from "../Storages/UserDataStorage";
import { MetaMaskStorage } from "../Storages/MetaMaskStorage";
import { ethers } from "ethers";
import { ERC721Abi, NFTAddress } from "../Utils/BlockchainUtils";
import { getRandomString } from "../Utils/RandomUtil";
import { TempLinkStorage } from "../Storages/Stuff/TempLinkStorage";
import { sleepFor } from "../Utils/CodeUtils";
import { UserBalanceStorage } from "../Storages/UserBalanceStorage";
import { isTabletOrMobileBrowser } from "../Utils/BrowserUtil";

export default function BoxPage() {
    const params = useParams();
    const navigate = useNavigate();

    const ui = useStoreState(UIStorage);
    const userData = useStoreState(UserDataStorage);
    const userBalance = useStoreState(UserBalanceStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const tempLink = useStoreState(TempLinkStorage);

    const [isMobile, setIsMobile] = useState(isTabletOrMobileBrowser());

    const [boxInfo, setBoxInfo] = useState({});
    const [isOwner, setIsOwner] = useState(false);
    const [ownerHero, setOwnerHero] = useState({});

    async function getBoxInfo() {
        if (params && params.boxIndex) {
            ui.showContentLoading();
            let realIndex = (params.boxIndex - 41) / 71;
            try {
                let response = await axios.post(getBoxById_EP(), { index: realIndex });
                let data = getDataFromResponse(response);
                data.type = data.type.name.slice(5);
                setBoxInfo(data);
                console.log(data);
                response = await axios.post(getHeroById_EP(), { index: data.heroId });
                data = getDataFromResponse(response);
                setOwnerHero(data);
                if (!isMobile) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(NFTAddress(), ERC721Abi(), signer);
                    const address = await signer.getAddress();
                    let bigNumberHeroes = await contract.getUsersTokens(address);
                    let normalHeroes = [];
                    for (const i of bigNumberHeroes) normalHeroes.push(i.toNumber());
                    if (normalHeroes.includes(data.index)) setIsOwner(true);
                }
                setTimeout(() => {
                    ui.hideContentLoading();
                }, 200);
            } catch (error) {
                ui.hideContentLoading();
                navigate("/notfound");
            }
        }
    }

    async function openBox() {
        if (isOwner) {
            if (userBalance.userBalance < boxInfo.priceToOpen) {
                ui.showError("Not enough balance!");
                return;
            }
            ui.showContentLoading();
            let link = getRandomString(64);
            tempLink.setLinkFor(link, 600);
            await sleepFor(500);
            // console.log('/box/'+((boxInfo.boxId+12) * 77)+'/open/'+link);
            navigate("/box/" + (boxInfo.boxId + 12) * 77 + "/" + (ownerHero.index + 12) * 77 + "/open/" + link);
        } else ui.showError("You are not the owner.");
    }

    async function burnBox() {
        if (isOwner) {
            try {
                ui.showContentLoading();
                let response = await axios.post(
                    burnBox_EP(),
                    {
                        userAddress: metamask.wallet,
                        heroId: ownerHero.index,
                        boxId: boxInfo.boxId,
                    },
                    safeAuthorize_header()
                );

                let data = getDataFromResponse(response);
                if (response?.data?.message === "burned") {
                    ui.showSuccess("You have successfully burned this box!");
                    getBoxInfo();
                } else {
                    ui.hideContentLoading();
                    ui.showError("Failed to burn this box.");
                    console.log(data);
                }
            } catch (error) {
                console.log(error);
                ui.showError(error.message);
                ui.hideContentLoading();
            }
        } else ui.showError("You are not the owner.");
    }

    useEffect(() => {
        if (metamask.isConnected) getBoxInfo();
        if (isMobile) getBoxInfo();
        document.getElementById("content-wrapper").scrollTop = 0;
    }, [metamask]);

    return (
        <div className="w-full flex flex-col items-center px-2 gap-4 text-white">
            <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative mt-4">
                <div className={"w-full flex flex-wrap md:flex-nowrap gap-4"}>
                    <div className="w-full max-h-[400px] md:w-[400px] md:h-[400px] flex-shrink-0">
                        <img src={boxInfo?.type === "LUCKY" ? luckyBoxImage : mysteryBoxImage} alt="box" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-full flex flex-col items-center py-10 gap-2 text-center">
                        <h1 className={"text-4xl font-semibold " + (boxInfo?.type === "LUCKY" ? "text-yellow-500" : "text-teal-400")}>{boxInfo?.type} BOX</h1>
                        <span className={"text-2xl font-semibold opacity-80 " + (boxInfo?.type === "LUCKY" ? "text-yellow-500" : "text-teal-400")}>
                            {boxInfo?.serial}-{boxInfo?.number}
                        </span>
                        {boxInfo?.type === "LUCKY" ? (
                            <span className="italic text-yellow-400 opacity-90">Bright yellow box with shining edges! You are so lucky!</span>
                        ) : (
                            <span className="italic text-teal-400 opacity-90">So much power in this box! Who knows what it holds...</span>
                        )}
                        {userData.isLoggedIn ? (
                            isOwner ? (
                                boxInfo?.status === "Owned" ? (
                                    <div className="w-full flex flex-col items-center">
                                        <span className="font-semibold text-purple-400 mt-10">Try to open it for {boxInfo?.priceToOpen}G</span>
                                        <button
                                            onClick={() => {
                                                openBox();
                                            }}
                                            className={
                                                "text-black text-xl font-semibold w-full p-2 rounded-md bg-opacity-80 mt-2 animated-100 hover:bg-opacity-100 " +
                                                (boxInfo?.type === "LUCKY" ? "bg-yellow-400" : "bg-teal-400")
                                            }
                                        >
                                            Open
                                        </button>
                                        <span className="text-sm mt-5 opacity-80">or burn for free</span>
                                        <button
                                            onClick={() => {
                                                burnBox();
                                            }}
                                            className={
                                                "text-white bg-slate-700 font-semibold w-full p-1 rounded-md bg-opacity-50 mt-2 animated-100 hover:bg-opacity-70 "
                                            }
                                        >
                                            Burn
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full text-center">
                                        {boxInfo?.status === "Burned" ? (
                                            <span className="italic text-red-400">This box has been already burned.</span>
                                        ) : (
                                            <span className="italic text-red-400">This box has been already opened.</span>
                                        )}
                                    </div>
                                )
                            ) : (
                                <div className="w-full text-center">
                                    <span>You are not the owner of this box.</span>
                                </div>
                            )
                        ) : (
                            <div className="w-full text-center">
                                <span>Please, sign in to open this box.</span>
                            </div>
                        )}
                    </div>
                </div>
                {boxInfo?.type === "LUCKY" ? (
                    <div className="w-full flex flex-col p-4">
                        <span className="text-xl font-semibold p-2">Contains</span>
                        <ItemTile {...boxInfo?.filledWith} />
                    </div>
                ) : (
                    <></>
                )}
                <div className="w-full flex flex-col p-4">
                    <span className="text-xl font-semibold p-2">Owned by</span>
                    <HeroTile {...ownerHero} />
                </div>
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

    // console.log(skills);

    return (
        <div
            className={
                "flex flex-col items-center gap-4 p-2 border-y-[1px] border-opacity-50 animated-200 " + (tribePalette["border"][tribe] ?? "border-white")
            }
        >
            <div className="w-full flex flex-col items-center gap-2 mt-2">
                <div className="flex flex-col items-center">
                    <div
                        className={
                            "w-[200px] h-[200px] relative flex flex-shrink-0 rounded-lg border-[6px] border-opacity-50 animated-200 overflow-x-hidden overflow-y-hidden " +
                            (tribePalette["border"][tribe] ?? "border-white")
                        }
                    >
                        <img
                            onLoad={() => {
                                setImgLoaded(true);
                            }}
                            src={imageLink}
                            alt="hero"
                            className="w-full h-full animated-200 group-hover:scale-110"
                        />
                        {imgLoaded ? (
                            <></>
                        ) : (
                            <div className="absolute inset-0 flex">
                                <AdaptiveLoadingComponent />
                            </div>
                        )}
                    </div>
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
                <div className="bg-gray-800 bg-opacity-50 md:w-[500px] w-full text-center p-1 rounded-lg">
                    <span className={"text-3xl font-bold text-opacity-70 " + tribePalette["text"][tribe]}>{tribe}</span>
                </div>
                <div className="md:w-[500px] w-full flex justify-center flex-shrink-0 mb-2">
                    <div className="w-full flex flex-col gap-4 px-2 pl-0">
                        <SkillTile skillVal={skills?.sexy} skillTitle={"Sexy"} />
                        <SkillTile skillVal={skills?.lucky} skillTitle={"Lucky"} />
                        <SkillTile skillVal={skills?.brave} skillTitle={"Brave"} />
                    </div>
                    <div className="w-full flex flex-col gap-4 px-2 pr-0">
                        <SkillTile skillVal={skills?.healthy} skillTitle={"Healthy"} />
                        <SkillTile skillVal={skills?.smart} skillTitle={"Smart"} />
                        <SkillTile skillVal={skills?.skilled} skillTitle={"Skilled"} />
                    </div>
                </div>
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
        <div className={"group relative w-full p-2 rounded-md text-center font-semibold bg-opacity-20 " + skillsPalette[skillTitle.toLowerCase()]}>
            <div className="relative z-10 flex justify-between">
                <span className="font-semibold">{skillTitle}</span>
                <span className="font-semibold">{skillVal}</span>
            </div>
            <div
                className={"absolute inset-0 h-full rounded-md bg-opacity-30 group-hover:bg-opacity-60 animated-100 " + skillsPalette[skillTitle.toLowerCase()]}
                style={{ width: skillVal + "%" }}
            ></div>
        </div>
    );
}

function ItemTile({ name, comment, features, imgLink, rarity }) {
    const rarityPalette = {
        border: {
            guarantee: "border-gray-400",
            common: "border-blue-100",
            rare: "border-green-300",
            epic: "border-blue-400",
            mythical: "border-purple-400",
            legendary: "border-yellow-300",
            heroic: "border-red-500",
        },
        bg: {
            guarantee: "bg-gray-400",
            common: "bg-blue-100",
            rare: "bg-green-300",
            epic: "bg-blue-400",
            mythical: "bg-purple-400",
            legendary: "bg-yellow-300",
            heroic: "bg-red-500",
        },
        text: {
            guarantee: "text-gray-400",
            common: "text-blue-100",
            rare: "text-green-300",
            epic: "text-blue-400",
            mythical: "text-purple-400",
            legendary: "text-yellow-300",
            heroic: "text-red-500",
        },
    };

    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className={"w-full flex flex-col items-center p-4 gap-4 text-white border-y-[1px] " + rarityPalette.border[rarity?.toLowerCase()]}>
            <div className="flex flex-col items-center gap-2">
                <div
                    className={
                        "w-[200px] h-[200px] relative flex flex-shrink-0 rounded-lg border-[6px] border-opacity-50 animated-200 overflow-x-hidden overflow-y-hidden " +
                        (rarityPalette.border[rarity?.toLowerCase()] ?? "border-white")
                    }
                >
                    <img
                        onLoad={() => {
                            setImgLoaded(true);
                        }}
                        src={imgLink}
                        alt="hero"
                        className="w-full h-full animated-200 group-hover:scale-110"
                    />
                    {imgLoaded ? (
                        <></>
                    ) : (
                        <div className="absolute inset-0 flex">
                            <AdaptiveLoadingComponent />
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col items-center">
                    <span className={"text-xl font-semibold "}>{name}</span>
                    <span className={"opacity-80 " + rarityPalette.text[rarity?.toLowerCase()]}>{rarity} item</span>
                </div>
                <p className={""}>{comment}</p>
            </div>
        </div>
    );
}
