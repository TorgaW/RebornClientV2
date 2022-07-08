import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import CrossIcon from "../../Icons/Cross";
import ArrowIcon from "../../Icons/FilterArrow";
import SearchIcon from "../../Icons/Search";
import box from "../../Images/Boxes/luckyBox.png";
import { UIStorage } from "../../Storages/UIStorage";
import { marketplaceLoadLots_EP, marketplaceSellItem_EP, safeAuthorize_header, marketplaceBuyItem_EP } from "../../Utils/EndpointsUtil";
import { getDataFromResponse, makePost } from "../../Utils/NetworkUtil";
import { getRandomString } from "../../Utils/RandomUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";
import { getRandomInt } from "../../Utils/RandomUtil";
import { MetaMaskStorage } from "../../Storages/MetaMaskStorage";
import ButtonGreen from "../../Components/UI/StyledComponents/ButtonGreen";
import ButtonRed from "../../Components/UI/StyledComponents/ButtonRed";
import InputDefault from "../../Components/UI/StyledComponents/InputDefault";
import InventoryPage from "../InventoryPage";
import { compactString } from "../../Utils/StringUtil";
import { isTabletOrMobileBrowser } from "../../Utils/BrowserUtil";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import useStateRef from "react-usestateref";
import AdaptiveLoadingComponent from "../../Components/UI/AdaptiveLoadingComponent";

const rarityColor = {
    guarantee: "text-gray-400 border-gray-400 border-opacity-50",
    common: "text-blue-100 border-blue-100 border-opacity-50",
    rare: "text-green-300 border-green-300 border-opacity-50",
    epic: "text-blue-400 border-blue-400 border-opacity-50",
    mythical: "text-purple-400 border-purple-400 border-opacity-50",
    legendary: "text-yellow-300 border-yellow-300 border-opacity-50",
    heroic: "text-red-500 border-red-500 border-opacity-50",
};

const lotsTypes = {
    1: "Boxes",
    2: "Items",
    3: "Heroes",
};

export default function MarketplacePage() {
    const [marketSelectedOption, setMarketSelectedOption] = useState("buy");

    return (
        <div>
            <div className="w-full flex items-center flex-col relative text-white px-2">
                <div className="w-full flex justify-center items-center gap-4 text-xl my-6">
                    <button
                        onClick={() => {
                            setMarketSelectedOption("buy");
                        }}
                        className={"w-[100px] h-10 border-b-[1px] animated-100 " + (marketSelectedOption === "buy" ? "text-teal-400 border-teal-400" : "")}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => {
                            setMarketSelectedOption("sell");
                        }}
                        className={"w-[100px] h-10 border-b-[1px] animated-100 " + (marketSelectedOption === "sell" ? "text-teal-400 border-teal-400" : "")}
                    >
                        Sell
                    </button>
                    <button
                        onClick={() => {
                            setMarketSelectedOption("userLots");
                        }}
                        className={"w-[100px] h-10 border-b-[1px] animated-100 " + (marketSelectedOption === "userLots" ? "text-teal-400 border-teal-400" : "")}
                    >
                        My lots
                    </button>
                </div>
                {marketSelectedOption === "buy" ? <MarketplaceBuyPage /> : marketSelectedOption === "sell" ? <InventoryPage /> : <></>}
            </div>
        </div>
    );
}

function MarketplaceBuyPage() {
    const [filter, setFilter] = useState({ rarity: null, price: null, rarityColor: "", type: null, priceFilter: null });

    const ui = useStoreState(UIStorage);

    const metamask = useStoreState(MetaMaskStorage);

    const [popUpData, setPopUpData] = useState({});

    const [lotsView, setLotsView] = useState([]);

    const [lotsData, setLotsData] = useState([]);

    const [selectedLot, setSelectedLot] = useState({});

    async function loadLots() {
        let price = filter.priceFilter ? filter.priceFilter : -1;
        let type = filter.type ? filter.type : null;
        let rarity = filter.rarity ? filter.rarity : null;

        let [d, s, e] = await makePost(
            marketplaceLoadLots_EP(),
            {
                price: price,
                type: type,
                rarity: rarity,
            },
            true
        );
        let t = Array.from(d.items);
        let a = [];
        for (const i of t) {
            a.push(<ItemTile key={getRandomString(12)} {...i} buyItem={buyItem} setPopUpData={setPopUpData} imgLink={i.boxItem.imgLink} description={i.boxItem.comment} />);
        }
        setLotsView(a);
        console.log(d);
    }

    async function buyItem() {
        if (selectedLot && selectedLot.itemId) {
            let code = document.getElementById("item-buy-code").value;
            let [d, s, e] = await makePost(
                marketplaceBuyItem_EP(),
                {
                    itemType: 2,
                    sellerName: selectedLot.username,
                    price: selectedLot.price,
                    itemId: selectedLot.itemId,
                    code,
                },
                true
            );

            if (d) {
                ui.showSuccess("Congratulations on your purchase!");
                document.getElementById("popUpVision").classList.add("hidden");
                document.getElementById("item-buy-code").value = "";
            } else {
                ui.showError(e);
                console.log(e);
                loadLots();
            }
        }
    }

    useEffect(() => {
        loadLots();
    }, [filter]);

    useEffect(() => {
        ui.showContentLoading();
        setTimeout(() => {
            ui.hideContentLoading();
        }, 500);
        loadLots();
    }, []);

    return (
        <>
            <div className="pb-4 w-full flex flex-col items-center">
                <div className="w-full lg:w-[1000px] flex md:flex-row flex-col items-center flex-wrap gap-4 justify-center md:justify-between p-4 px-8 pb-6">
                    <div className="flex justify-start items-center relative">
                        <div className="absolute left-1">
                            <SearchIcon />
                        </div>
                        <SearchBar />
                    </div>
                    <div className="flex justify-center flex-wrap md:max-w-[800px] max-w-[220px] items-center gap-2">
                        <div className="flex justify-center items-center gap-2">
                            {filter.rarity ? (
                                <div className="relative h-[42px] md:text-base text-sm px-7 border-2 border-gray-800 rounded-md text-center flex items-center justify-center">
                                    <div className={"w-[15px] h-[15px] rounded-xl " + filter.rarityColor}></div>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: null });
                                        }}
                                        className="absolute p-[2px] top-0 right-0"
                                    >
                                        <CrossIcon size="16" />
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                            {filter.price ? (
                                <div className="relative h-[42px] md:text-base text-sm px-7 border-2 border-gray-800 rounded-md text-center flex items-center justify-center">
                                    <span>{filter.price}</span>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, price: null, priceFilter: null });
                                        }}
                                        className="absolute p-[2px] top-0 right-0"
                                    >
                                        <CrossIcon size="16" />
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                            {filter.type ? (
                                <div className="relative h-[42px] md:text-base text-sm px-7 border-2 border-gray-800 rounded-md text-center flex items-center justify-center">
                                    <span>{lotsTypes[filter.type]}</span>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, type: null });
                                        }}
                                        className="absolute p-[2px] top-0 right-0"
                                    >
                                        <CrossIcon size="16" />
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <div className="relative group">
                                <button className="hover:bg-zinc-800 px-4 animated-100 rounded-md flex flex-shrink-0 items-center gap-2 justify-center w-[100px] h-[42px]">
                                    <span>Rarity</span>
                                    <ArrowIcon />
                                </button>
                                <div className="absolute flex flex-col shadow-lg top-10 animated-200 bg-gray-900 w-[140px] h-[200px] overflow-auto rounded-b-md pointer-events-none hover:pointer-events-auto z-10 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Guarantee", rarityColor: "bg-gray-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["guarantee"]}
                                    >
                                        Guarantee
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Common", rarityColor: "bg-blue-100" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["common"]}
                                    >
                                        Common
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Rare", rarityColor: "bg-green-300" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["rare"]}
                                    >
                                        Rare
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Epic", rarityColor: "bg-blue-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["epic"]}
                                    >
                                        Epic
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Mythical", rarityColor: "bg-purple-400" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["mythical"]}
                                    >
                                        Mythical
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Legendary", rarityColor: "bg-yellow-300" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["legendary"]}
                                    >
                                        Legendary
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, rarity: "Heroic", rarityColor: "bg-red-500" });
                                        }}
                                        className={"p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100 " + rarityColor["heroic"]}
                                    >
                                        Heroic
                                    </button>
                                </div>
                            </div>
                            <div className="relative group">
                                <button className="hover:bg-zinc-800 px-4 animated-100 rounded-md flex flex-shrink-0 items-center gap-2 justify-center w-[100px] h-[42px]">
                                    <span>Price</span>
                                    <ArrowIcon />
                                </button>
                                <div className="absolute rounded-r-md flex flex-col shadow-lg animated-200 bg-gray-900 w-[140px] rounded-b-md top-10 pointer-events-none hover:pointer-events-auto z-10 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, price: "To highest", priceFilter: 0 });
                                        }}
                                        className="p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100"
                                    >
                                        To highest
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter({ ...filter, price: "To lowest", priceFilter: 1 });
                                        }}
                                        className="p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100"
                                    >
                                        To lowest
                                    </button>
                                </div>
                            </div>
                            <div className="relative group">
                                <button className="hover:bg-zinc-800 px-4 animated-100 rounded-md flex flex-shrink-0 items-center gap-2 justify-center w-[100px] h-[42px]">
                                    <span>Type</span>
                                    <ArrowIcon />
                                </button>
                                <div className="absolute rounded-r-md flex flex-col shadow-lg animated-200 bg-gray-900 w-[120px] rounded-b-md top-10 pointer-events-none hover:pointer-events-auto z-10 opacity-0 group-hover:opacity-100">
                                    <button onClick={()=>{
                                        setFilter({...filter, type: 1});
                                    }} className="p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100">Boxes</button>
                                    <button onClick={()=>{
                                        setFilter({...filter, type: 2});
                                    }} className="p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100">Items</button>
                                    <button onClick={()=>{
                                        setFilter({...filter, type: 3});
                                    }} className="p-3 group-hover:pointer-events-auto hover:bg-zinc-800 rounded-md animated-100">Heroes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[1000px] flex justify-center p-4 flex-wrap gap-6">{lotsView}</div>
                <div className="w-full flex justify-center gap-4">
                    <button className={"w-12 p-4 rounded-lg bg-dark-purple-100 bg-opacity-30 hover:bg-dark-purple-100 hover:bg-opacity-50 "}>1</button>
                </div>
            </div>
            <PopUpTile popUpData={popUpData} setSelectedLot={setSelectedLot} />
        </>
    );
}

function SearchBar() {
    function checkText() {
        let t = document.getElementById("input");
        let val = t.value;
        if (isStringEmptyOrSpaces(val)) t.classList.remove("min-w-[270px]");
        else t.classList.add("min-w-[270px]");
    }
    function filterText() {
        let input = document.getElementById("input").value.toLowerCase();
    }

    return (
        <input
            onKeyUp={() => {
                filterText();
            }}
            onChange={() => {
                checkText();
            }}
            className="animated-300 pl-10 placeholder:italic placeholder:text-slate-500 text-white rounded-md shadow-none bg-black bg-opacity-70 ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none w-[141px] focus:w-[270px]"
            placeholder="Search for..."
            type="text"
            name="search"
            id="input"
        />
    );
}

function ItemTile({ rarity, username, itemName, price, description, imgLink, itemId, itemType, setPopUpData }) {
    // let rarityUpperCase = String(rarity).charAt(0).toUpperCase() + rarity.slice(1);

    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div
            onClick={() => {
                document.getElementById("popUpVision").classList.remove("pointer-events-none");
                document.getElementById("popUpVision").classList.remove("opacity-0");
                document.getElementById("popUpVision").classList.add("opacity-100");
                setPopUpData({ rarity, itemName, price, username, description, imgLink, itemId, itemType });
            }}
            className={
                "w-full md:h-[130px] h-[100px] px-4 md:px-8 py-2 gap-1 md:gap-5 items-center flex rounded-md group hover:bg-dark-purple-300 hover:border-opacity-100 animated-200 cursor-pointer border-2 justify-center " +
                rarityColor[rarity.toLowerCase()]
            }
        >
            <div className="flex gap-2 items-center justify-between w-[150px] md:w-[250px]">
                <div className="flex relative md:w-[95px] md:h-[95px] w-[80px] h-[70px]">
                    <img
                        onLoad={() => {
                            setImgLoaded(true);
                        }}
                        className={"h-full w-full object-cover rounded-md animated-200 group-hover:scale-110  " + (getRandomInt(0, 1) ? "group-hover:-rotate-3" : "group-hover:rotate-3")}
                        src={imgLink}
                        alt=""
                    />
                    {imgLoaded ? (
                        <></>
                    ) : (
                        <div className="absolute inset-0 flex">
                            <AdaptiveLoadingComponent />
                        </div>
                    )}
                </div>
                <div className="w-[100px] px-2 md:w-[150px] text-white text-center md:font-bold font-semibold md:text-xl text-xs">
                    <span>{compactString(itemName, 30)}</span>
                </div>
            </div>
            <div className="max-w-[800px] md:gap-0 gap-4 w-full justify-between flex py-2 border-b-2 border-gray-800 items-center">
                <div className="md:text-sm text-xs font-semibold">
                    <span>{rarity}</span>
                </div>
                <div className="text-white text-large md:text-xl">
                    <span>{price}$</span>
                </div>
            </div>
            <div className="max-w-[200px] w-full md:flex hidden items-center justify-center mt-2 gap-1 text-xs md:text-sm">
                <div className="text-gray-500">
                    <span>Owner:</span>
                </div>
                <div className="text-white italic md:text-sm text-xs font-light">
                    <span>{username}</span>
                </div>
            </div>
        </div>
    );
}

function PopUpTile({ setSelectedLot, popUpData, buyItem }) {
    const userData = useStoreState(UserDataStorage);

    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div id="popUpVision" className="flex z-10 pointer-events-none animated-100 inset-0 opacity-0 w-full h-full justify-center items-center bg-black fixed top-0 bg-opacity-70">
            <div
                className={
                    "relative py-5 md:w-[500px] w-[430px] max-h-[70vh] overflow-y-auto flex flex-col gap-4 items-center bg-dark-purple-400 border-2 md:mt-[70px] mt-[110px] rounded-xl shadow-lg mx-6 " +
                    rarityColor[popUpData?.rarity?.toLowerCase()]
                }
            >
                <div className="absolute w-full z-10 top-0 flex justify-end pt-2 pr-2">
                    <button
                        className="fixed"
                        onClick={() => {
                            document.getElementById("popUpVision").classList.add("pointer-events-none");
                            document.getElementById("popUpVision").classList.remove("opacity-100");
                            document.getElementById("popUpVision").classList.add("opacity-0");
                        }}
                    >
                        <CrossIcon size="32" />
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center h-full w-full gap-4 px-4">
                    <div className="w-full px-10 md:py-2 text-center flex justify-center">
                        <span className="md:text-3xl text-2xl font-bold text-white">{popUpData?.itemName}</span>
                    </div>
                    <div className={"md:w-[200px] md:h-[200px] w-[130px] h-[130px] border-4 rounded-md " + rarityColor[popUpData?.rarity?.toLowerCase()]}>
                        <img
                            onLoad={() => {
                                setImgLoaded(true);
                            }}
                            className="w-full h-full object-cover"
                            src={popUpData?.imgLink}
                            alt=""
                        />
                        {imgLoaded ? (
                            <></>
                        ) : (
                            <div className="absolute inset-0 flex">
                                <AdaptiveLoadingComponent />
                            </div>
                        )}
                    </div>
                    <div className="border-t-2 border-b-2 border-gray-800 w-full flex flex-col items-center gap-3 py-2">
                        <div className={rarityColor[popUpData?.rarity?.toLowerCase()]}>
                            <span className="md:text-xl text-large font-semibold">{popUpData?.rarity}</span>
                        </div>
                        <div className="flex justify-center items-center gap-1">
                            <div className="text-gray-500 md:text-base text-sm">
                                <span>Owner:</span>
                            </div>
                            <div className="text-white italic md:text-sm text-xs font-light">
                                <span>{popUpData?.username}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center flex justify-center items-center py-2">
                        <span className="text-white md:text-base text-sm">{isTabletOrMobileBrowser() ? compactString(popUpData?.description, 150) : popUpData?.description}</span>
                    </div>
                    {userData.isLoggedIn ? (
                        <ButtonGreen
                            click={() => {
                                setSelectedLot({ popUpData });
                                document.getElementById("orderConfirmation").classList.remove("pointer-events-none");
                                document.getElementById("orderConfirmation").classList.remove("opacity-0");
                                document.getElementById("orderConfirmation").classList.add("opacity-100");
                            }}
                            additionalStyle="w-[300px] text-white tracking-wider"
                            text={"Buy for " + popUpData?.price + "$"}
                        />
                    ) : (
                        <div className="bg-dark-purple-200 bg-opacity-80 flex items-center justify-center py-2 px-4 rounded-md gap-2">
                            <span className="md:text-lg text-sm font-semibold text-gray-500">Please, sign in to buy for</span>
                            <span className="md:text-xl text-lg text-white font-semibold">{popUpData?.price}$</span>
                        </div>
                    )}
                </div>
                <div id="orderConfirmation" className="animated-100 absolute w-full h-full flex pointer-events-none top-0 opacity-0 justify-center items-center rounded-xl bg-opacity-80 bg-black">
                    <div className="text-white flex flex-col gap-6 justify-center items-center rounded-xl bg-dark-purple-400 w-[250px] h-[250px]">
                        <div className="">
                            <span className="text-xl font-semibold">Are you sure?</span>
                        </div>
                        <div className="flex gap-5">
                            <ButtonGreen
                                click={() => {
                                    buyItem();
                                }}
                                additionalStyle="w-[70px]"
                                text="Yes"
                            />
                            <ButtonRed
                                click={() => {
                                    document.getElementById("orderConfirmation").classList.add("pointer-events-none");
                                    document.getElementById("orderConfirmation").classList.add("opacity-0");
                                    document.getElementById("orderConfirmation").classList.remove("opacity-100");
                                }}
                                additionalStyle="w-[70px]"
                                text="No"
                            />
                        </div>
                        <div className="w-full flex flex-col gap-2 items-center">
                            <span>Code from your authenticator</span>
                            <InputDefault id={"item-buy-code"} type={"text"} additionalStyle={"text-center w-[200px] text-lg font-semibold"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
