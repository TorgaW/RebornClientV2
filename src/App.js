import { Routes, Route, Link } from "react-router-dom";
import React, { useEffect, useState, Suspense } from "react";
// import HomePage from "./Pages/HomePage";
import UpperMenu from "./Components/UI/UpperMenu";
import NotFoundPage from "./Pages/Stuff/NotFoundPage";
import MetaMaskConnector from "./Components/MetaMaskConnector";
// import SignInPage from "./Pages/Authorization/SignInPage";
// import SignUpPage from "./Pages/Authorization/SignUpPage";
// import ForgotPasswordPage from "./Pages/Authorization/ForgotPasswordPage";
import AuthHasherComponent from "./Components/Auth/AuthHasherComponent";
// import ProofAuthWithCodePage from "./Pages/Authorization/ProofAuthWithCodePage";
import MessagesProvider from "./Components/UI/MessagesProvider";
import { createLocalOptionsIfNotExist, getLocalOptions } from "./Utils/LocalStorageManager/LocalStorageManager";
import { UIStorage } from "./Storages/UIStorage";
import AutoLoginComponent from "./Components/Auth/AutoLoginComponent";
import CurrenciesUpdateComponent from "./Components/CurrenciesUpdateComponent";
import AbsoluteLoadingComponent from "./Components/UI/AbsoluteLoadingComponent";
// import DepositOption from "./Pages/UserProfileOptions/DepositOption";
// import AboutPage from "./Pages/AboutPage";
// import UIOption from "./Pages/UserProfileOptions/UIOption";
// import AccountOption from "./Pages/UserProfileOptions/AccountOption";
// import MetaMaskPage from "./Pages/MetaMaskPage";
import UserBalanceComponent from "./Components/UserBalanceComponent";
import DiscordIcon from "./Icons/Discord";
import TelegramIcon from "./Icons/Telegram";
import TwitterIcon from "./Icons/Twitter";
// import HeroesPage from "./Pages/HeroesPage";
import { isTabletOrMobileBrowser } from "./Utils/BrowserUtil";
// import ViewNewsPage from "./Pages/ViewNewsPage";
// import ViewComicsPage from "./Pages/ViewComicsPage";
// import InventoryPage from "./Pages/InventoryPage";
// import BoxPage from "./Pages/BoxPage";
import { getRandomString } from "./Utils/RandomUtil";
import TemporaryLinkComponent from "./Components/TemporaryLinks/TemporaryLinkComponent";
// import OpenBoxPage from "./Pages/OpenBoxPage";
// import MarketplacePage from "./Pages/Marketplace/MarketplacePage";
// import ViewHeroPage from "./Pages/ViewHeroPage";
// import TwoFAEnabledPage from "./Pages/Authorization/TwoFAEnabledPage";
// import ItemPhysicalViewPage from "./Pages/ItemPhysicalViewPage";
// import TestHomePage from "./Pages/TestPages/TestHomePage";

/* REACT LAZY */

const HomePage = React.lazy(()=>import("./Pages/HomePage"));
const SignInPage = React.lazy(() => import("./Pages/Authorization/SignInPage"));
const SignUpPage = React.lazy(() => import("./Pages/Authorization/SignUpPage"));
const HeroesPage = React.lazy(() => import("./Pages/HeroesPage"));
const ViewNewsPage = React.lazy(() => import("./Pages/ViewNewsPage"));
const ViewComicsPage = React.lazy(() => import("./Pages/ViewComicsPage"));
const InventoryPage = React.lazy(() => import("./Pages/InventoryPage"));
const BoxPage = React.lazy(() => import("./Pages/BoxPage"));
const ForgotPasswordPage = React.lazy(() => import("./Pages/Authorization/ForgotPasswordPage"));
const ProofAuthWithCodePage = React.lazy(() => import("./Pages/Authorization/ProofAuthWithCodePage"));
const AboutPage = React.lazy(()=>import("./Pages/AboutPage"));
const UIOption = React.lazy(()=>import("./Pages/UserProfileOptions/UIOption"));
const AccountOption = React.lazy(()=>import("./Pages/UserProfileOptions/AccountOption"));
const DepositOption = React.lazy(()=>import("./Pages/UserProfileOptions/DepositOption"));
const MetaMaskPage = React.lazy(()=>import("./Pages/MetaMaskPage"));
const OpenBoxPage = React.lazy(()=>import("./Pages/OpenBoxPage"));
// const MarketplacePage = React.lazy(()=>import("./Pages/Marketplace/MarketplacePage"));
const ViewHeroPage = React.lazy(()=>import("./Pages/ViewHeroPage"));
const TwoFAEnabledPage = React.lazy(()=>import("./Pages/Authorization/TwoFAEnabledPage"));
const ItemPhysicalViewPage = React.lazy(()=>import("./Pages/ItemPhysicalViewPage"));
const TestHomePage = React.lazy(()=>import("./Pages/TestPages/TestHomePage"));

/* */

function App() {
    const [showLoading, setShowLoading] = useState(false);

    function loadUIOptions() {
        createLocalOptionsIfNotExist();
        let opts = getLocalOptions();
        console.log("player options", opts);
        // console.log('type',typeof opts);
        if (opts)
            UIStorage.update((s) => {
                s.UIOptions = opts;
            });
    }

    useEffect(() => {
        loadUIOptions();

        UIStorage.update((s) => {
            s.showContentLoading = () => {
                setShowLoading(true);
            };
            s.hideContentLoading = () => {
                setShowLoading(false);
            };
            s.isMobile = isTabletOrMobileBrowser();
        });
    }, []);

    return (
        <div className="merriweather">
            <AutoLoginComponent />
            <MetaMaskConnector />
            <UpperMenu />
            <AuthHasherComponent />
            <CurrenciesUpdateComponent />
            <UserBalanceComponent />
            <TemporaryLinkComponent />
            <div id="content-wrapper" className="absolute inset-0 top-[120px] flex flex-col justify-between bg-dark-purple-500 overflow-y-auto">
                {/* loading component */}
                {showLoading ? <AbsoluteLoadingComponent /> : <></>}

                <Suspense fallback={<AbsoluteLoadingComponent />}>
                    <Routes>
                        <Route path="/signin" element={<SignInPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/forgotpass" element={<ForgotPasswordPage />} />
                        <Route path="/qr/:qr/:private/:hash" element={<TwoFAEnabledPage />} />
                        <Route path="/auth/:username/:authHash" element={<ProofAuthWithCodePage />} />
                        <Route path="/profile/accountsettings" element={<AccountOption />} />
                        {/* <Route path="/profile/privacysettings" element={<UserProfilePage />}/> */}
                        <Route path="/profile/uisettings" element={<UIOption />} />
                        <Route path="/profile/deposit" element={<DepositOption />} />
                        {/* <Route path="/marketplace" element={<MarketplacePage />} /> */}
                        <Route path="/news/:newsIndex" element={<ViewNewsPage />} />
                        <Route path="/comics/:comicsIndex" element={<ViewComicsPage />} />
                        <Route path="/hero/:heroIndex" element={<ViewHeroPage />} />
                        <Route path="/box/:boxIndex/:heroIndex/open/:hash" element={<OpenBoxPage />} />
                        <Route path="/box/:boxIndex" element={<BoxPage />} />
                        <Route path="/heroes" element={<HeroesPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/inventory/item/:boxId" element={<ItemPhysicalViewPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/metamask" element={<MetaMaskPage />} />
                        <Route exact path="/test/home" element={<TestHomePage />} />
                        <Route path="/" element={<HomePage />}></Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
                <footer className="w-full h-[220px] pt-4 py-4 flex flex-col justify-center items-center bg-black flex-shrink-0 mt-20">
                    <span className="text-teal-800 text-xl font-bold">Reborn.cash</span>
                    <span className="text-teal-800 font-semibold text-center">An experimental, open-ended, NFT-based metaverse.</span>
                    <span className="text-purple-900 font-semibold">Based on $GAME token.</span>
                    <div className="w-full p-2 flex justify-center gap-8">
                        <div
                            onClick={() => {
                                window.open("https://t.me/GameTokenBCH", "_blank").focus();
                            }}
                            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
                        >
                            <TelegramIcon color={"#1a918a"} />
                        </div>
                        <div
                            onClick={() => {
                                window.open("https://twitter.com/bchreborn", "_blank").focus();
                            }}
                            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
                        >
                            <TwitterIcon color={"#1a918a"} />
                        </div>
                        <div
                            onClick={() => {
                                window.open("https://www.discord.gg/axiebch", "_blank").focus();
                            }}
                            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
                        >
                            <DiscordIcon color={"#1a918a"} />
                        </div>
                    </div>
                    <Link to={"/about"} className="mt-2">
                        <span className="text-teal-400 opacity-50 font-semibold animated-200 cursor-pointer hover:opacity-100">About project</span>
                    </Link>
                    <span className="text-teal-800 mt-auto">Reborn web-client version: 2022, v0.2</span>
                </footer>
            </div>
            <MessagesProvider />
        </div>
    );
}

export default App;
