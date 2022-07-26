import axios from "axios";
import { ethers } from "ethers";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { MetaMaskStorage } from "../Storages/MetaMaskStorage";
import { UIStorage } from "../Storages/UIStorage";
import { ERC721Abi, NFTAddress } from "../Utils/BlockchainUtils";
import {
    getBoxesByHeroId_EP,
    getHeroById_EP,
    getInventory_EP,
    getTransferDetails_EP,
    marketplaceSellItem_EP,
    safeAuthorize_header,
} from "../Utils/EndpointsUtil";
import { getAxiosError, getDataFromResponse, makePost } from "../Utils/NetworkUtil";
import luckyBoxImage from "../Images/Boxes/luckyBox.png";
import mysteryBoxImage from "../Images/Boxes/mysteryBox.png";
import { getRandomInt, getRandomString } from "../Utils/RandomUtil";
import { formatDistanceToNowStrict } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { UserDataStorage } from "../Storages/UserDataStorage";
import { RARITY_PALETTE } from "../Utils/ColorPaletteUtils";
import { rarityToNumber } from "../Utils/ItemsUtil";
import { compactString, strToBase } from "../Utils/StringUtil";
import { TempLinkStorage } from "../Storages/Stuff/TempLinkStorage";
import { isTabletOrMobileBrowser, scrollToTop } from "../Utils/BrowserUtil";
import ButtonGreen from "../Components/UI/StyledComponents/ButtonGreen";
import ButtonDefault from "../Components/UI/StyledComponents/ButtonDefault";
import CancelIWhite from "../Icons/CancelWhite";
import CrossIcon from "../Icons/Cross";
import InputDefault from "../Components/UI/StyledComponents/InputDefault";

export default function InventoryPage({ inventoryTabStyle }) {
    const ui = useStoreState(UIStorage);

    const [selectedOption, setSelectedOption] = useState(isTabletOrMobileBrowser() ? "items" : "boxes");
    const [isMobile, setIsMobile] = useState(isTabletOrMobileBrowser());

    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <div className="w-full flex flex-col items-center px-2 gap-4 text-white">
            <div className="w-full flex justify-center text-xl gap-4 mt-8">
                {!isMobile ? (
                    <button
                        onClick={() => {
                            setSelectedOption("boxes");
                        }}
                        c
                        className={
                            "w-32 h-10 border-b-[1px] animated-100 " +
                            inventoryTabStyle +
                            (() => {
                                if (selectedOption === "boxes" && inventoryTabStyle) return " text-teal-400 bg-slate-600 hover:bg-slate-400 hover:bg-opacity-60 bg-opacity-40";
                                else if (selectedOption === "boxes") return " text-teal-400 border-teal-400";
                            })()
                        }
                    >
                        Boxes
                    </button>
                ) : (
                    <></>
                )}
                <button
                    onClick={() => {
                        setSelectedOption("items");
                    }}
                    className={
                        "w-32 h-10 border-b-[1px] animated-100 " +
                        inventoryTabStyle +
                        (() => {
                            if (selectedOption === "items" && inventoryTabStyle) return " text-teal-400 bg-slate-600 hover:bg-slate-400 hover:bg-opacity-60 bg-opacity-40";
                            else if (selectedOption === "items") return " text-teal-400 border-teal-400";
                        })()
                    }
                >
                    Items
                </button>
                {/* <button onClick={()=>{setSelectedOption('inventory')}} className={"w-32 h-10 border-b-[1px] animated-100 "+(selectedOption === 'inventory' ? 'text-teal-400 border-teal-400':'')}>Inventory</button> */}
            </div>
            {selectedOption === "boxes" ? <BoxTab /> : <InventoryTab />}
        </div>
    );
}

function BoxTab() {
    const ui = useStoreState(UIStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const userData = useStoreState(UserDataStorage);
    const [filter, setFilter] = useState({ unopened: true, burned: false, opened: false });
    const [rawBoxes, setRawBoxes] = useState([]);
    const [boxesComponents, setBoxesComponents] = useState([]);
    const [selectedBox, setSelectedBox] = useState({});

    function changeFilter(newValue) {
        setFilter({ ...filter, ...newValue });
    }

    function fillBoxes() {
        ui.showContentLoading();
        let t = [];
        let copyBoxes = Array.from(rawBoxes);
        console.log(copyBoxes, "fuck");
        copyBoxes.sort(function (a, b) {
            if (a.status.toLowerCase() === "owned" && b.status.toLowerCase() !== "owned") return -1;
            if (a.status.toLowerCase() === "burned" && b.status.toLowerCase() !== "burned") return -1;
            return 0;
        });
        for (const i of copyBoxes) {
            let safeType = i.type;
            if (i?.type !== "MYSTERY" && i?.type !== "LUCKY") safeType = i.type?.name?.slice(5) ?? "";
            i.type = safeType;
            if (i.status.toLowerCase() === "opened" && !filter.opened) continue;
            if (i.status.toLowerCase() === "burned" && !filter.burned) continue;
            if (i.status.toLowerCase() === "owned" && !filter.unopened) continue;
            // console.log(i.status);
            t.push(<BoxTile key={getRandomString(12)} {...i} selectCallback={selectCallback} />);
        }
        ui.hideContentLoading();
        setBoxesComponents(t);
    }

    async function sellBox() {
        if (selectedBox && selectedBox.type) {
            let price = document.getElementById("box-sell-price").value;
            let code = document.getElementById("box-sell-code").value;
            if (price > 0) {
                let [d, s, e] = await makePost(
                    marketplaceSellItem_EP(),
                    {
                        itemId: selectedBox.boxId,
                        price,
                        type: 1,
                        code,
                    },
                    true
                );
                if (d) {
                    ui.showSuccess("Your box is on marketplace now!");
                    document.getElementById("box-sell-popup").classList.add("hidden");
                    fillBoxes();
                    document.getElementById("box-sell-price").value = NaN;
                    document.getElementById("box-sell-code").value = "";
                    scrollToTop();
                } else {
                    ui.showError(e);
                    console.log(e);
                }
            } else ui.showError("Price must be more than 0!");
        }
    }

    async function getHeroesIDs() {
        if (typeof window.ethereum === "undefined" || !window.ethereum.isMetaMask) {
            ui.showError("Web3 Network error! Please, install Metamask.");
            return;
        }
        if (!metamask.isConnected) {
            ui.showError("Please, connect Metamask.");
            return;
        }
        try {
            ui.showContentLoading();
            console.log("hello");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(NFTAddress(), ERC721Abi(), signer);
            const address = await signer.getAddress();
            console.log(provider, signer, contract, address);
            let bigNumberHeroes = await contract.getUsersTokens(address);
            if (bigNumberHeroes.length === 0) {
                setTimeout(() => {
                    ui.hideContentLoading();
                }, 250);
                return;
            }
            let normalIndexes = [];
            let normalHeroes = [];
            for await (const i of bigNumberHeroes) {
                normalIndexes.push(i.toNumber());
                try {
                    let response = await axios.post(getHeroById_EP(), { index: i.toNumber() }, safeAuthorize_header());
                    let dat = getDataFromResponse(response);
                    normalHeroes.push(dat.name);
                } catch (error2) {
                    ui.showError(error2.message);
                    console.log(error2);
                }
            }

            let finalBoxes = [];
            let c = 0;
            for await (const i of normalIndexes) {
                let [data, status, error] = await makePost(getBoxesByHeroId_EP(), { heroId: i }, true);
                if (!data) {
                    ui.showError(error);
                    return;
                }
                for (const j of data) {
                    finalBoxes.push({ ...j, owner: normalHeroes[c] });
                }
                c++;
            }
            // console.log(finalBoxes);
            setRawBoxes(finalBoxes);
            setTimeout(() => {
                ui.hideContentLoading();
            }, 250);
        } catch (error) {
            console.log(error);
            ui.showError(error.message);
        }
    }

    function selectCallback(serial, number, type, boxId) {
        console.log({ serial, number, type, boxId });
        setSelectedBox({ serial, number, type, boxId });
        document.getElementById("box-sell-popup").classList.toggle("hidden");
    }

    useEffect(() => {
        if (userData.isLoggedIn) getHeroesIDs();
        // console.log('hi');
    }, [metamask, userData]);

    useEffect(() => {
        // console.log(filter);
        if (rawBoxes.length === 0) return;
        fillBoxes();
    }, [rawBoxes, filter]);

    useEffect(() => {
        return () => {
            ui.hideContentLoading();
        };
    }, []);

    return userData.isLoggedIn ? (
        <>
            <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
                <div className="w-full flex flex-wrap items-center justify-center gap-4 p-4">
                    <div className="w-[230px] flex items-center justify-between gap-2 p-2 border-[1px]  border-teal-600 rounded-md">
                        <span>Show unopened boxes</span>
                        <input
                            type="checkbox"
                            onChange={() => {
                                changeFilter({ unopened: document.getElementById("show-unopened").checked });
                            }}
                            name=""
                            id="show-unopened"
                            defaultChecked={filter.unopened}
                            className="h-5 w-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                        />
                    </div>
                    <div className="w-[230px] flex items-center justify-between gap-2 p-2 border-[1px] border-teal-600 rounded-md">
                        <span>Show burned boxes</span>
                        <input
                            type="checkbox"
                            onChange={() => {
                                changeFilter({ burned: document.getElementById("show-burned").checked });
                            }}
                            name=""
                            id="show-burned"
                            defaultChecked={filter.burned}
                            className="h-5 w-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                        />
                    </div>
                    <div className="w-[230px] flex items-center justify-between gap-2 p-2 border-[1px] border-teal-600 rounded-md">
                        <span>Show opened boxes</span>
                        <input
                            type="checkbox"
                            onChange={() => {
                                changeFilter({ opened: document.getElementById("show-opened").checked });
                            }}
                            name=""
                            id="show-opened"
                            defaultChecked={filter.opened}
                            className="h-5 w-5 rounded-lg hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-6 p-4">{boxesComponents}</div>
                <div
                    id="box-sell-popup"
                    className="z-10 animated-200 p-2 fixed inset-0 top-[120px] flex items-center justify-center bg-black bg-opacity-90 hidden"
                >
                    <div
                        className={
                            "w-full max-w-[550px] flex p-4 rounded-md relative bg-dark-purple-500 border-2 border-opacity-50 " +
                            (selectedBox.type === "LUCKY" ? "border-yellow-500" : "border-teal-400")
                        }
                    >
                        <div className="max-h-[450px] overflow-y-auto md:max-h-[1000px] w-full flex flex-col items-center mt-6">
                            <span className="font-semibold text-lg self-start ml-2">Box to sell</span>
                            <div className="w-full border-b-2 border-gray-600"></div>
                            <div className="w-[150px] h-[150px] flex flex-shrink-0 mt-2">
                                <img
                                    src={selectedBox?.type === "LUCKY" ? luckyBoxImage : mysteryBoxImage}
                                    alt="box"
                                    className="w-full object-cover rounded-md "
                                />
                            </div>
                            <span className={"no-flick font-semibold text-base " + (selectedBox?.type === "LUCKY" ? "text-yellow-500" : "text-teal-400")}>
                                {selectedBox?.type?.toUpperCase()} BOX
                            </span>
                            <div className="w-full flex flex-col justify-center">
                                <span className="opacity-80 text-sm text-center">{compactString(selectedBox?.comment, 120)}</span>
                            </div>
                            <span className="font-semibold text-lg mt-4 self-start ml-2">Sell price</span>
                            <div className="w-full border-b-2 border-gray-600"></div>
                            <div className="w-full flex gap-2 justify-center items-center mt-2">
                                <InputDefault id={"box-sell-price"} type={"number"} additionalStyle={"max-w-[100px] text-center text-lg font-semibold"} />
                                <span className="text-purple-700 font-semibold text-lg">GAME</span>
                            </div>
                            <span className="font-semibold text-lg mt-4 self-start ml-2">Security</span>
                            <div className="w-full border-b-2 border-gray-600"></div>
                            <div className="w-full flex flex-col gap-2 items-center mt-2">
                                <span>Code from your authenticator</span>
                                <InputDefault id={"box-sell-code"} type={"text"} additionalStyle={"text-center text-lg font-semibold"} />
                            </div>
                            <ButtonGreen
                                click={() => {
                                    sellBox();
                                }}
                                text="Sell"
                                additionalStyle={"w-full mt-4 text-lg"}
                            />
                        </div>
                        <div className="absolute flex p-2 top-0 right-0">
                            <div
                                onClick={() => {
                                    document.getElementById("box-sell-popup").classList.toggle("hidden");
                                }}
                                className="w-6 h-6 flex justify-center items-center cursor-pointer"
                            >
                                <CrossIcon size={32} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
            <div className="w-full flex flex-wrap items-center justify-center gap-2 p-4">
                <span>Please, sign in to see your inventory.</span>
            </div>
        </div>
    );
}

function BoxTile({ serial, number, owner, type, priceToOpen, status, eAt, boxId, selectCallback }) {
    const statusPalette = {
        Opened: "text-red-500",
        Burned: "text-amber-500",
        Owned: "text-green-300",
        opened: "text-red-500",
        burned: "text-amber-500",
        owned: "text-green-300",
    };
    return (
        <div
            className={
                "relative w-[230px] h-[420px] p-2 gap-2 flex flex-col flex-shrink-0 rounded-md bg-dark-purple-100 bg-opacity-10 animated-200 border-[2px] border-opacity-50 hover:border-opacity-100 " +
                (type === "LUCKY" ? "border-yellow-500" : "border-teal-400")
            }
        >
            <Link to={"/box/" + (boxId * 71 + 41)}>
                <div className="w-full h-full flex flex-col group hover:bg-dark-purple-100 rounded-md animated-200">
                    <div className="w-full flex flex-col items-start gap-1 text-left">
                        <span className={"p-1 px-2 bg-dark-purple-100 bg-opacity-80 rounded-md no-flick " + statusPalette[status]}>
                            {status?.toLowerCase() === "owned" ? formatDistanceToNowStrict(new Date(eAt)) + " left" : status}
                        </span>
                        <span className="text-green-300 p-1 px-2 bg-dark-purple-100 bg-opacity-80 rounded-md">{owner}</span>
                    </div>
                    <div className="w-full flex opacity-70 group-hover:opacity-100 animated-100">
                        <img
                            src={type === "LUCKY" ? luckyBoxImage : mysteryBoxImage}
                            alt="lucky box"
                            className={
                                "w-full h-full object-contain animated-200 " +
                                (getRandomInt(0, 1) ? "group-hover:rotate-6 group-hover:scale-110" : "group-hover:-rotate-6 group-hover:scale-110")
                            }
                        />
                    </div>
                    <div className="w-full mt-auto flex flex-col items-center p-1 bg-dark-purple-100 rounded-md bg-opacity-80">
                        <span className={"no-flick font-semibold text-sm " + (type === "LUCKY" ? "text-yellow-500" : "text-teal-400")}>
                            {type.toUpperCase()} BOX
                        </span>
                        <span className="no-flick text-sm">
                            {serial}-{number}
                        </span>
                        <span className="no-flick font-semibold text-purple-300">{priceToOpen} G</span>
                    </div>
                </div>
            </Link>
            {status?.toLowerCase() === "owned" ? (
                <ButtonGreen
                    text={"Sell on market"}
                    click={() => {
                        if (typeof selectCallback === "function") selectCallback(serial, number, type, boxId);
                    }}
                />
            ) : (
                <></>
            )}
        </div>
    );
}

function InventoryTab({ rawCopy }) {
    const ui = useStoreState(UIStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const userData = useStoreState(UserDataStorage);

    const [rawItems, setRawItems] = useState({ items: undefined, transfers: undefined });
    const [itemsView, setItemsView] = useState([]);
    const [itemsFilter, setItemsFilter] = useState("heroic,legendary,mythical,epic,rare,common,guarantee");
    const [selectedItemView, setSelectedItemView] = useState({});

    function addFilter(item) {
        let copy = itemsFilter;
        let splitted = copy.split(",");
        for (const i of splitted) if (i === item) return;
        if (splitted[0] === "") splitted = [];
        splitted.push(item);
        copy = splitted.join(",");
        setItemsFilter(copy);
        console.log(copy);
    }

    function removeFilter(item) {
        let copy = itemsFilter;
        let splitted = copy.split(",");
        for (const i of splitted) {
            if (i === item) {
                copy = splitted.filter((j) => j !== item).join(",");
                setItemsFilter(copy);
                console.log(copy);
                return;
            }
        }
    }

    function refillInventory() {
        let t = [];
        let filter = itemsFilter.split(",");
        if (filter[0] === "") filter = [];
        let rawCopy = Array.from(rawItems.items ?? []);
        rawCopy.sort((a, b) => {
            return rarityToNumber(b.rarity) - rarityToNumber(a.rarity);
        });
        for (const i of rawCopy) {
            for (const j of rawItems.transfers ?? []) {
                if (i.boxId === j.boxID) {
                    i.orderStatus = j.status;
                    i.orderID = j.id;
                    break;
                }
            }
        }
        for (const i of rawCopy) {
            if (filter.includes(i?.rarity?.toLowerCase())) t.push(<ItemTile {...i} callback={itemTileClickCallback} key={getRandomString(32)} />);
        }
        setSelectedItemView(rawCopy[0] ?? {});
        setItemsView(t);
    }

    async function getUserInventory() {
        ui.showContentLoading();
        try {
            let r = await axios.get(getInventory_EP(), safeAuthorize_header());
            let [transfers, s, e] = await makePost(getTransferDetails_EP(), {}, true);
            let items = getDataFromResponse(r);
            if (!transfers) {
                ui.showError(e);
                return;
            }
            for (const i of items) i._unique = getRandomString(1024);
            setRawItems({ items, transfers });
            ui.hideContentLoading();
        } catch (error) {
            ui.showError(getAxiosError(error));
            console.log(error.message);
            ui.hideContentLoading();
        }
    }

    function itemTileClickCallback(unique) {
        if (document.body.clientWidth < 768) {
            document.getElementById("small-screen-selected-item").classList.toggle("hidden");
            document.getElementById("small-screen-selected-item").focus();
        }
        for (const i of rawItems.items) {
            if (i._unique === unique) {
                setSelectedItemView(i);
                break;
            }
        }
    }

    function sellCallback() {
        document.getElementById("sell-popup").classList.remove("hidden");
        document.getElementById("small-screen-selected-item").classList.add("hidden");
        document.getElementById("sell-popup").focus();
    }

    async function sellItem() {
        if (selectedItemView && selectedItemView.name) {
            let price = document.getElementById("item-sell-price").value;
            let code = document.getElementById("item-sell-code").value;
            if (price > 0) {
                let [d, s, e] = await makePost(
                    marketplaceSellItem_EP(),
                    {
                        itemId: selectedItemView.itemId,
                        price,
                        type: 2,
                        code,
                    },
                    true
                );
                if (d) {
                    ui.showSuccess("Your item is on marketplace now!");
                    document.getElementById("sell-popup").classList.add("hidden");
                    getUserInventory();
                    document.getElementById("item-sell-price").value = NaN;
                    document.getElementById("item-sell-code").value = "";
                    scrollToTop();
                } else {
                    ui.showError(e);
                    console.log(e);
                }
            } else ui.showError("Price must be more than 0!");
        }
    }

    useEffect(() => {
        if (userData.isLoggedIn) getUserInventory();
    }, [userData]);

    useEffect(() => {
        refillInventory();
    }, [rawItems, itemsFilter]);

    useEffect(() => {
        return () => {
            ui.hideContentLoading();
        };
    }, []);

    return userData.isLoggedIn ? (
        <div className="w-full lg:w-[1000px] px-4 flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
            <div className="w-full p-8 border-[1px] my-4 border-teal-600 rounded-md flex justify-center flex-wrap gap-6">
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.guarantee}>Guarantee</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("guarantee");
                            else removeFilter("guarantee");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.common}>Common</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("common");
                            else removeFilter("common");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.rare}>Rare</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("rare");
                            else removeFilter("rare");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.epic}>Epic</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("epic");
                            else removeFilter("epic");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.mythical}>Mythical</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("mythical");
                            else removeFilter("mythical");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.legendary}>Legendary</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("legendary");
                            else removeFilter("legendary");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className={"text-lg font-semibold" + RARITY_PALETTE.text.heroic}>Heroic</span>
                    <input
                        defaultChecked={true}
                        onChange={(e) => {
                            if (e.target.checked) addFilter("heroic");
                            else removeFilter("heroic");
                        }}
                        type="checkbox"
                        name=""
                        id=""
                        className="h-7 w-7 rounded-md hover:outline-none hover:ring-2 hover:ring-purple-400 focus:ring-purple-600"
                    />
                </div>
            </div>
            <div className="w-full flex mt-4 gap-2">
                <div className="w-full flex flex-col gap-2">{itemsView}</div>
                {rawItems?.items?.length ? <SelectedItemBigScreen sellCallback={sellCallback} selectedItemView={selectedItemView} /> : <></>}
                {rawItems?.items?.length ? <SelectedItemSmallScreen sellCallback={sellCallback} selectedItemView={selectedItemView} /> : <></>}
            </div>
            <div id="sell-popup" className="z-10 animated-200 p-2 fixed inset-0 top-[120px] flex items-center justify-center bg-black bg-opacity-90 hidden">
                <div
                    className={
                        "w-full max-w-[550px] flex p-4 rounded-md relative bg-dark-purple-500 border-2" +
                        RARITY_PALETTE.border[selectedItemView?.rarity?.toLowerCase()]
                    }
                >
                    <div className="max-h-[450px] overflow-y-auto md:max-h-[1000px] w-full flex flex-col items-center mt-6">
                        <span className="font-semibold text-lg self-start ml-2">Item to sell</span>
                        <div className="w-full border-b-2 border-gray-600"></div>
                        <div className="w-[150px] h-[150px] flex flex-shrink-0 mt-2">
                            <img
                                src={selectedItemView?.imgLink}
                                alt="item"
                                className={"w-full object-cover border-4 rounded-md" + RARITY_PALETTE.border[selectedItemView?.rarity?.toLowerCase()]}
                            />
                        </div>
                        <div className="justify-center border-gray-700 w-[65%] flex p-2 border-b-2">
                            <span className={"font-semibold" + RARITY_PALETTE.text[selectedItemView?.rarity?.toLowerCase()]}>{selectedItemView?.rarity}</span>
                        </div>
                        <span className={"mt-2 font-semibold text-lg text-center" + RARITY_PALETTE.text[selectedItemView?.rarity?.toLowerCase()]}>
                            {selectedItemView?.name}
                        </span>
                        <div className="w-full flex flex-col justify-center">
                            <span className="opacity-80 text-sm text-center">{compactString(selectedItemView?.comment, 120)}</span>
                        </div>
                        <span className="font-semibold text-lg mt-4 self-start ml-2">Sell price</span>
                        <div className="w-full border-b-2 border-gray-600"></div>
                        <div className="w-full flex gap-2 justify-center items-center mt-2">
                            <InputDefault id={"item-sell-price"} type={"number"} additionalStyle={"max-w-[100px] text-center text-lg font-semibold"} />
                            <span className="text-purple-700 font-semibold text-lg">GAME</span>
                        </div>
                        <span className="font-semibold text-lg mt-4 self-start ml-2">Security</span>
                        <div className="w-full border-b-2 border-gray-600"></div>
                        <div className="w-full flex flex-col gap-2 items-center mt-2">
                            <span>Code from your authenticator</span>
                            <InputDefault id={"item-sell-code"} type={"text"} additionalStyle={"text-center text-lg font-semibold"} />
                        </div>
                        <ButtonGreen
                            click={() => {
                                sellItem();
                            }}
                            text="Sell"
                            additionalStyle={"w-full mt-4 text-lg"}
                        />
                    </div>
                    <div className="absolute flex p-2 top-0 right-0">
                        <div
                            onClick={() => {
                                document.getElementById("sell-popup").classList.toggle("hidden");
                            }}
                            className="w-6 h-6 flex justify-center items-center cursor-pointer"
                        >
                            <CrossIcon size={32} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
            <div className="w-full flex flex-wrap items-center justify-center gap-2 p-4">
                <span>Please, sign in to see your inventory.</span>
            </div>
        </div>
    );
}

function ItemTile({ imgLink, name, rarity, _unique, callback }) {
    const navigate = useNavigate();

    function itemClick() {
        if (typeof callback === "function") callback(_unique);
    }

    return (
        <div
            onClick={() => {
                itemClick();
            }}
            className={
                "w-full md:h-[130px] h-[110px] px-4 md:px-8 py-2 gap-4 md:gap-5 items-center flex md:flex-row flex-col rounded-md group border-opacity-50 hover:bg-dark-purple-300 hover:border-opacity-100 animated-200 cursor-pointer border-2 justify-center " +
                RARITY_PALETTE.border[rarity?.toLowerCase()]
            }
        >
            <div className="flex md:gap-5 gap-3 md:max-w-[415px] max-w-[450px] w-full items-center md:justify-center justify-start">
                <div className="flex md:w-[95px] md:h-[95px] w-[80px] h-[80px] flex-shrink-0">
                    <img
                        src={imgLink}
                        alt="item"
                        className={
                            "w-full h-full object-cover rounded-md animated-200 " +
                            (getRandomInt(0, 1) ? "group-hover:rotate-3 group-hover:scale-110" : "group-hover:-rotate-3 group-hover:scale-110")
                        }
                    />
                </div>
                <span className="font-semibold md:text-lg text-center no-flick w-full md:max-w-[300px]">{name}</span>
            </div>
            {/* <div className="flex justify-between max-w-[450px] w-full gap-2 py-2 border-b-2 border-gray-800">
                <div className="flex justify-center items-center">
                    <span className={"no-flick md:text-base text-sm font-semibold " + RARITY_PALETTE.text[rarity?.toLowerCase()]}>{rarity}</span>
                </div>
                <div className="text-gray-300 text-sm no-flick flex items-center flex-wrap gap-1 justify-center">
                    <span>Order status:</span>
                    <span className={"no-flick " + (orderStatus === "Not send" ? "text-red-500" : orderStatus === "Shipped" ? "text-green-500" : "text-yellow-500")}>{orderStatus}</span>
                </div>
            </div> */}
        </div>
    );
}

function SelectedItemBigScreen({ selectedItemView, sellCallback }) {
    const navigate = useNavigate();
    return (
        <>
            <div className="hidden md:flex flex-col w-full">
                <div
                    className={
                        "w-full hidden md:flex gap-4 justify-center flex-col items-center border-2 border-opacity-30 rounded-md md:sticky top-0 px-3 pt-14 pb-6" +
                        RARITY_PALETTE.border[selectedItemView?.rarity?.toLowerCase()]
                    }
                >
                    <div className="w-[200px] h-[200px] flex flex-shrink-0">
                        <img
                            src={selectedItemView?.imgLink}
                            alt="item"
                            className={"w-full object-cover border-4 rounded-md" + RARITY_PALETTE.border[selectedItemView?.rarity?.toLowerCase()]}
                        />
                    </div>
                    <span className={"text-2xl font-semibold text-center" + RARITY_PALETTE.text[selectedItemView?.rarity?.toLowerCase()]}>
                        {selectedItemView?.name}
                    </span>
                    <div className="w-full flex flex-col justify-center">
                        <span className="opacity-80 text-center">{compactString(selectedItemView?.comment, 120)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className={selectedItemView?.orderStatus === "Shipped" ? "text-green-500" : "text-yellow-400"}>
                            Order status: {selectedItemView?.orderStatus}
                        </span>
                        <span>Order ID: {selectedItemView?.orderID}</span>
                    </div>
                    <div className="w-full flex justify-around px-2">
                        <ButtonDefault
                            text={"View information"}
                            click={() => {
                                if (typeof selectedItemView?.boxId === "number") {
                                    let p = strToBase(selectedItemView?.boxId.toString());
                                    navigate("/inventory/item/" + p);
                                }
                            }}
                        />
                        <ButtonGreen
                            click={() => {
                                if (typeof sellCallback === "function") sellCallback();
                            }}
                            text={"Sell on market"}
                        />
                    </div>
                    <div className="absolute top-0 justify-center border-b-2 border-gray-700 border-opacity-100 w-[80%] flex p-2">
                        <span className={"font-semibold text-xl " + RARITY_PALETTE.text[selectedItemView?.rarity?.toLowerCase()]}>
                            {selectedItemView?.rarity}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

function SelectedItemSmallScreen({ selectedItemView, sellCallback }) {
    const navigate = useNavigate();
    return (
        <>
            <div
                id="small-screen-selected-item"
                className="fixed inset-0 top-[120px] flex z-10 items-center justify-center p-2 hidden md:hidden bg-black bg-opacity-90"
            >
                <div
                    className={
                        "w-full max-w-[500px] justify-center flex flex-col gap-5 items-center border-2 border-opacity-30 rounded-md px-2 pt-14 pb-5 relative bg-dark-purple-500" +
                        RARITY_PALETTE.border[selectedItemView?.rarity?.toLowerCase()]
                    }
                >
                    <div className="w-[150px] h-[150px] flex flex-shrink-0">
                        <img
                            src={selectedItemView?.imgLink}
                            alt="item"
                            className={"w-full object-cover border-4 rounded-md" + RARITY_PALETTE.border[selectedItemView?.rarity?.toLowerCase()]}
                        />
                    </div>
                    <span className={"font-semibold text-lg text-center" + RARITY_PALETTE.text[selectedItemView?.rarity?.toLowerCase()]}>
                        {selectedItemView?.name}
                    </span>
                    <div className="w-full flex flex-col justify-center">
                        <span className="opacity-80 text-sm text-center">{compactString(selectedItemView?.comment, 120)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className={selectedItemView?.orderStatus === "Shipped" ? "text-green-500" : "text-yellow-400"}>
                            Order status: {selectedItemView?.orderStatus}
                        </span>
                        <span>Order ID: {selectedItemView?.orderID}</span>
                    </div>
                    <div className="w-full flex justify-around px-2">
                        <ButtonDefault
                            text={"Information"}
                            click={() => {
                                if (typeof selectedItemView?.boxId === "number") {
                                    let p = strToBase(selectedItemView?.boxId.toString());
                                    navigate("/inventory/item/" + p);
                                }
                            }}
                        />
                        <ButtonGreen
                            click={() => {
                                if (typeof sellCallback === "function") sellCallback();
                            }}
                            text={"Sell on market"}
                        />
                    </div>
                    <div className="absolute top-0 justify-center border-gray-700 w-[65%] flex p-2 border-b-2">
                        <span className={"font-semibold" + RARITY_PALETTE.text[selectedItemView?.rarity?.toLowerCase()]}>{selectedItemView?.rarity}</span>
                    </div>
                    <div
                        onClick={() => {
                            document.getElementById("small-screen-selected-item").classList.toggle("hidden");
                        }}
                        className="absolute top-0 right-0 flex p-2 cursor-pointer"
                    >
                        <div className="w-6 h-6 flex justify-center items-center">
                            <CrossIcon size={32} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
