import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import MetamaskIcon from "../../Icons/MetaMask";
import ProfileIcon from "../../Icons/Profile";
import { getLocalOptions, saveLocalOptions } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { MetaMaskStorage } from "../../Storages/MetaMaskStorage";
import { UserDataStorage } from "../../Storages/UserDataStorage";
import { isTabletOrMobileBrowser } from "../../Utils/BrowserUtil";
import MenuIcon from "../../Icons/Menu";
import CancelIWhite from "../../Icons/CancelWhite";
import { CurrenciesStorage } from "../../Storages/CurrenciesStorage";
import { UIStorage } from "../../Storages/UIStorage";
import { UserBalanceStorage } from "../../Storages/UserBalanceStorage";

export default function UpperMenu() {
    const ui = useStoreState(UIStorage);
    const userData = useStoreState(UserDataStorage);
    const metamask = useStoreState(MetaMaskStorage);
    const currencies = useStoreState(CurrenciesStorage);
    const balance = useStoreState(UserBalanceStorage);

    const [isOnMobile, setIsOnMobile] = useState(isTabletOrMobileBrowser());

    function toggleSmallSizeMenuDesktop() {
        document.getElementById("small-menu-desktop").classList.toggle("-translate-x-full");
    }

    function toggleMobileMenu() {
        document.getElementById("small-menu-mobile").classList.toggle("-translate-x-full");
    }

    return !isOnMobile ? (
        //desktop menu
        <>
            <div className="fixed w-full left-0 top-0 h-20 flex justify-center bg-black overflow-x-auto text-white z-20">
                <div className="max-w-[1750px] w-full flex px-2">
                    <div className="hidden gap-3 text-2xl py-2 md:flex">
                        <Link to="/">
                            <div className="flex justify-center items-center font-bold h-full px-2 rounded-md hover:bg-zinc-800 animated-100">Home</div>
                        </Link>
                        <Link to="/heroes">
                            <div className="flex justify-center items-center font-bold h-full px-2 rounded-md hover:bg-zinc-800 animated-100">Heroes</div>
                        </Link>
                        <Link to="/inventory">
                            <div className="flex justify-center items-center font-bold h-full px-2 rounded-md hover:bg-zinc-800 animated-100">Inventory</div>
                        </Link>
                        {/* <Link to="/marketplace">
                            <div className="flex justify-center items-center font-bold h-full px-2 rounded-md hover:bg-zinc-800 animated-100">Marketplace</div>
                        </Link> */}
                        {/* <Link to="/about">
                            <div className="text-lg text-gray-300 flex justify-center items-center font-bold h-full px-2 rounded-md hover:bg-zinc-900 animated-100">
                                About project
                            </div>
                        </Link> */}
                    </div>

                    {/* small size window */}
                    <div className="flex items-center md:hidden overflow-y-hidden">
                        <div
                            onClick={() => {
                                toggleSmallSizeMenuDesktop();
                            }}
                            className="flex w-[64px] h-[64px] p-2 rounded-md hover:bg-zinc-800 cursor-pointer select-none"
                        >
                            <div className="w-12 flex justify-center items-center hover:">
                                <MenuIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex py-2 ml-auto gap-4">
                        <Link to={userData.isLoggedIn ? "profile/accountsettings" : "signin"}>
                            <div
                                onClick={() => {}}
                                className="h-full w-[150px] rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-800 animated-100 px-2"
                            >
                                {userData.isLoggedIn ? (
                                    <div className="w-full h-full flex items-center justify-end gap-2">
                                        <div className="w-full overflow-hidden overflow-ellipsis text-right font-semibold">
                                            <span>{userData.userData.username}</span>
                                        </div>
                                        <div className="h-full w-10 flex justify-center items-center flex-shrink-0">
                                            <ProfileIcon />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex justify-center items-center">
                                        <span className="text-2xl font-semibold">Sign in</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                        <Link to="/metamask">
                            <div className="h-full w-[75px] rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-800 animated-100 select-none">
                                <div className="h-10 w-10 flex justify-center items-center">
                                    <MetamaskIcon connected={metamask.isConnected} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="fixed w-full left-0 top-20 h-10 flex justify-center bg-dark-purple-500 overflow-x-auto text-white z-20">
                <div className="max-w-[1750px] w-full flex px-2">
                    <div className="hidden md:flex gap-4 py-2 text-teal-200">
                        {ui.UIOptions.showGamePrice ? <span>GAME: {currencies.GAMEPrice}$</span> : <></>}
                        {ui.UIOptions.showBCHPrice ? <span>BCH: {currencies.BCHPrice}$</span> : <></>}
                    </div>
                    <div className="flex py-2 ml-auto items-center gap-4 text-teal-200">
                        <span>Your deposit: {balance.userBalance}G</span>
                        <span>Wallet: {metamask.wallet === "" ? "not connected" : metamask.wallet.slice(0, 5) + "..." + metamask.wallet.slice(38, 42)}</span>
                    </div>
                </div>
            </div>

            {/* small size desktop menu */}
            <div
                id="small-menu-desktop"
                className="fixed md:hidden w-full h-full flex p-5 bg-black z-[51] animated-500 overflow-x-hidden text-white transform -translate-x-full"
            >
                <div className="w-full h-full flex flex-col gap-4 relative">
                    <div className="w-full p-2 flex justify-center items-center">
                        <span className="text-4xl font-semibold text-teal-400">Reborn Cash</span>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <div className="flex gap-4 py-2 text-teal-200">
                            <span>GAME: {currencies.GAMEPrice}$</span>
                            <span>BCH: {currencies.BCHPrice}$</span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full h-full gap-2">
                        <Link to="/">
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        toggleSmallSizeMenuDesktop();
                                    }}
                                    className="w-full text-3xl p-4 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                >
                                    Home
                                </button>
                            </div>
                        </Link>
                        <Link to="/heroes">
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        toggleSmallSizeMenuDesktop();
                                    }}
                                    className="w-full text-3xl p-4 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                >
                                    Heroes
                                </button>
                            </div>
                        </Link>
                        <Link to="/inventory">
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        toggleSmallSizeMenuDesktop();
                                    }}
                                    className="w-full text-3xl p-4 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                >
                                    Inventory
                                </button>
                            </div>
                        </Link>
                        {/* <Link to="/marketplace">
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        toggleSmallSizeMenuDesktop();
                                    }}
                                    className="w-full text-3xl p-4 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                >
                                    Marketplace
                                </button>
                            </div>
                        </Link> */}
                        <div className="mt-auto">
                            <Link to="/about">
                                <div className="w-full flex justify-center items-center">
                                    <button
                                        onClick={() => {
                                            toggleSmallSizeMenuDesktop();
                                        }}
                                        className="w-full text-2xl p-2 rounded-md hover:bg-zinc-900 font-semibold text-gray-300 animated-100"
                                    >
                                        About project
                                    </button>
                                </div>
                            </Link>
                        </div>
                        <div className="w-full flex p-2 justify-center items-center text-teal-400 opacity-70">
                            <span>BCH Reborn 2022, v0.2</span>
                        </div>
                    </div>
                    <div className="absolute w-12 h-12 left-0 top-0 flex">
                        <div
                            onClick={() => {
                                toggleSmallSizeMenuDesktop();
                            }}
                            className="w-full h-full flex p-2 rounded-md hover:bg-zinc-800 animated-100 cursor-pointer select-none"
                        >
                            <div className="w-full h-full flex justify-center items-center">
                                <CancelIWhite />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        // mobile devices menu
        <>
            <div className="fixed w-full left-0 top-0 h-[120px] flex flex-col bg-black overflow-x-auto text-white z-20">
                <div className="w-full h-full flex justify-center items-center relative">
                    <span className="text-3xl font-bold text-teal-400">BCH Reborn</span>
                    <div
                        onClick={() => {
                            toggleMobileMenu();
                        }}
                        className="absolute p-1 rounded-md right-4 top-1/2 h-12 w-12 -translate-y-1/2 flex justify-center items-center animated-100 hover:bg-zinc-800"
                    >
                        <MenuIcon />
                    </div>
                </div>
                <div className="w-full h-10 flex justify-center items-center gap-8 flex-shrink-0 text-teal-400">
                    <span>GAME: {currencies.GAMEPrice}$</span>
                    <span>BCH: {currencies.BCHPrice}$</span>
                </div>
            </div>

            <div
                id="small-menu-mobile"
                className="fixed md:hidden w-full h-full flex p-5 bg-black z-[51] animated-500 overflow-x-hidden text-white transform -translate-x-full"
            >
                <div className="w-full h-full flex flex-col gap-4 relative">
                    <div className="w-full p-2 flex justify-center items-center">
                        <span className="text-4xl font-semibold text-teal-400">Reborn Cash</span>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <div className="flex gap-4 py-2 text-teal-200">
                            <span>GAME: {currencies.GAMEPrice}$</span>
                            <span>BCH: {currencies.BCHPrice}$</span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full h-full gap-2">
                        {userData.isLoggedIn ? (
                            <>
                                <Link to="profile/accountsettings">
                                    <div
                                        onClick={() => {
                                            toggleMobileMenu();
                                        }}
                                        className="h-16 flex justify-center items-center"
                                    >
                                        <div className="w-full p-1 border-[1px] rounded-md flex justify-center items-center gap-2">
                                            <div className="h-14 w-14 flex justify-center items-center">
                                                <ProfileIcon />
                                            </div>
                                            <span className="text-xl">{userData.userData.username}</span>
                                        </div>
                                    </div>
                                </Link>
                                <span className="self-center text-teal-400">Your deposit: {balance.userBalance}G</span>
                            </>
                        ) : (
                            <div className="w-full h-12 flex gap-4">
                                <Link to="/signin" className="w-full h-full">
                                    <button
                                        onClick={() => {
                                            toggleMobileMenu();
                                        }}
                                        className="w-full text-xl border-[1px] p-2 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                    >
                                        Sign in
                                    </button>
                                </Link>
                                <Link to="/signup" className="w-full h-full">
                                    <button
                                        onClick={() => {
                                            toggleMobileMenu();
                                        }}
                                        className="w-full text-xl border-[1px] p-2 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                    >
                                        Sign up
                                    </button>
                                </Link>
                            </div>
                        )}
                        <Link to="/" className="mt-8">
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        toggleMobileMenu();
                                    }}
                                    className="w-full text-3xl border-[1px] border-teal-400 p-4 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                >
                                    Home
                                </button>
                            </div>
                        </Link>
                        <Link to="/heroes">
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        toggleMobileMenu();
                                    }}
                                    className="w-full text-3xl border-[1px] border-teal-400 p-4 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                >
                                    Heroes
                                </button>
                            </div>
                        </Link>
                        <Link to="/inventory">
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        toggleMobileMenu();
                                    }}
                                    className="w-full text-3xl border-[1px] border-teal-400 p-4 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                >
                                    Inventory
                                </button>
                            </div>
                        </Link>
                        {/* <Link to="/marketplace">
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        toggleMobileMenu();
                                    }}
                                    className="w-full text-3xl border-[1px] border-teal-400 p-4 rounded-md hover:bg-zinc-800 font-semibold animated-100"
                                >
                                    Marketplace
                                </button>
                            </div>
                        </Link> */}
                        <div className="mt-auto">
                            <Link to="/about">
                                <div className="w-full flex justify-center items-center">
                                    <button
                                        onClick={() => {
                                            toggleMobileMenu();
                                        }}
                                        className="w-full text-2xl p-2 rounded-md hover:bg-zinc-900 font-semibold text-gray-300 animated-100"
                                    >
                                        About project
                                    </button>
                                </div>
                            </Link>
                        </div>
                        <div className="w-full flex p-2 justify-center items-center text-teal-400 opacity-70">
                            <span>BCH Reborn 2022, v0.2</span>
                        </div>
                    </div>
                    <div className="absolute w-12 h-12 right-0 top-0 flex">
                        <div
                            onClick={() => {
                                toggleMobileMenu();
                            }}
                            className="w-full h-full flex p-2 rounded-md hover:bg-zinc-800 animated-100 cursor-pointer select-none"
                        >
                            <div className="w-full h-full flex justify-center items-center">
                                <CancelIWhite />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
