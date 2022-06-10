import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { UIStorage } from "../Storages/UIStorage";
import HomeInfiniteCarousel from "../Components/HomePageExternal/HomeInfiniteCarousel";
import axios from "axios";
import {
    getAllComics_EP,
    getAllNews_EP,
    getComicsByIndex_EP,
    getComicsQuantity_EP,
    getNewsByIndex_EP,
    getNewsQuantity_EP,
    safeAuthorize_header,
} from "../Utils/EndpointsUtil";
import { getDataFromResponse, makePost } from "../Utils/NetworkUtil";
import { getRandomString } from "../Utils/RandomUtil";
import { Link, useNavigate } from "react-router-dom";
import { clampNumber } from "../Utils/MathUtils";
import AdaptiveLoadingComponent from "../Components/UI/AdaptiveLoadingComponent";
import PageSelector from "../Components/UI/PageSelector";
import { insertInString } from "../Utils/StringUtil";

export default function HomePage() {
    const [selectedOption, setSelectedOption] = useState("news");

    const [inWait, setInWait] = useState(true);

    useEffect(()=>{
        setInWait(true);
        setTimeout(()=>{setInWait(false)},150);
    },[selectedOption]);

    return (
        <div className="w-full flex flex-col items-center px-2 gap-4">
            <div className="w-full lg:w-[1000px] bg-dark-purple-100 bg-opacity-10 shadow-lg mt-10 rounded-xl flex flex-col p-4 text-white items-center justify-center gap-5">
                <HomeInfiniteCarousel />
            </div>
            <div className="w-full flex justify-center gap-4 text-white text-xl">
                <button
                    onClick={() => {
                        setSelectedOption("news");
                    }}
                    className={"w-32 h-10 border-b-[1px] animated-100 " + (selectedOption === "news" ? "text-teal-400 border-teal-400" : "")}
                >
                    News
                </button>
                <button
                    onClick={() => {
                        setSelectedOption("comics");
                    }}
                    className={"w-32 h-10 border-b-[1px] animated-100 " + (selectedOption === "comics" ? "text-teal-400 border-teal-400" : "")}
                >
                    Comics
                </button>
            </div>
            <div className="w-full lg:w-[1000px] flex flex-col bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
                {selectedOption === "news" ? <NewsSelector /> : <ComicsSelector />}
                {inWait ? (
                    <div className="absolute inset-0 flex z-50">
                        <AdaptiveLoadingComponent />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

function NewsSelector() {
    const ui = useStoreState(UIStorage);

    const [showLoading, setShowLoading] = useState(false);

    const [selectedPage, setSelectedPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [numberOfNews, setNumberOfNews] = useState(0);
    const [newsView, setNewsView] = useState([]);

    async function updateNumberOfPages() {
        let response = await axios.get(getNewsQuantity_EP());
        let quantity = getDataFromResponse(response);
        setNumberOfNews(quantity);
        console.log(numberOfNews);
        if (quantity && quantity > 0) setNumberOfPages(Math.ceil(quantity / 4));
    }

    async function updateNews() {
        setShowLoading(true);
        let [news, status, error] = await makePost(getNewsByIndex_EP(), { index: numberOfNews }, false);
        if (!error) {
            let copyNews = Array.from(news);
            copyNews.sort((a, b) => new Date(b.currentDate) - new Date(a.currentDate));
            let newsComponents = [];
            for (const i of copyNews) {
                let key = getRandomString(32);
                newsComponents.push(<NewsTile key={key} {...i} />);
            }
            setNewsView(newsComponents);
            setTimeout(() => {
                setShowLoading(false);
            }, 200);
        } else {
            console.log(error);
            ui.showError(error);
            setTimeout(() => {
                setShowLoading(false);
            }, 200);
        }
    }

    useEffect(() => {
        updateNumberOfPages();
    }, []);

    useEffect(() => {
        updateNews();
    }, [selectedPage]);

    return (
        <>
            <div className="min-h-[1600px] md:min-h-[780px] flex flex-col">
                {newsView}
                <div className="w-full flex justify-center mt-10 z-50">
                    <PageSelector
                        maxPages={numberOfPages}
                        callback={(a) => {
                            setSelectedPage(a);
                        }}
                    />
                </div>
            </div>
            {showLoading ? (
                <div className="absolute inset-0 w-full h-full">
                    <AdaptiveLoadingComponent />
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

function ComicsSelector() {
    const ui = useStoreState(UIStorage);

    const [showLoading, setShowLoading] = useState(false);

    const [selectedPage, setSelectedPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [comicsView, setComicsView] = useState([]);

    async function updateNumberOfPages() {
        let response = await axios.get(getComicsQuantity_EP());
        let quantity = getDataFromResponse(response);
        if (quantity && quantity > 0) setNumberOfPages(Math.ceil(quantity / 4));
    }

    async function updateComics() {
        setShowLoading(true);
        let [comics, status, error] = await makePost(getComicsByIndex_EP(), { index: (selectedPage - 1) * 4 + 1 }, false);
        if (!error) {
            let copyComics = Array.from(comics);
            copyComics.sort((a, b) => new Date(b.currentDate) - new Date(a.currentDate));
            let comicsComponents = [];
            for (const i of copyComics) {
                let key = getRandomString(32);
                comicsComponents.push(<ComicsTile key={key} {...i} />);
            }
            setComicsView(comicsComponents);
            setTimeout(() => {
                setShowLoading(false);
            }, 200);
        } else {
            console.log(error);
            ui.showError(error);
            setTimeout(() => {
                setShowLoading(false);
            }, 200);
        }
    }

    useEffect(() => {
        updateNumberOfPages();
    }, []);

    useEffect(() => {
        updateComics();
    }, [selectedPage]);

    return (
        <>
            <div className="min-h-[1600px] md:min-h-[780px] flex flex-col">
                {comicsView}
                <div className="w-full flex justify-center mt-10">
                    <PageSelector
                        maxPages={numberOfPages}
                        callback={(a) => {
                            setSelectedPage(a);
                        }}
                    />
                </div>
            </div>
            {showLoading ? (
                <div className="absolute inset-0 w-full h-full z-50">
                    <AdaptiveLoadingComponent />
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

function NewsTile({ heading, previewImage, shortDescription, currentDate, newsId }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    return (
        <Link to={"/news/" + ((newsId + 1) * 8984 + 89 * 621)}>
            <div className="w-full text-gray-300 border-b-[1px] border-teal-700 flex flex-col items-center md:flex-row p-4 cursor-pointer animated-100 hover:bg-dark-purple-100 hover:bg-opacity-20">
                <div className="w-full h-[280px] md:w-[250px] md:h-[140px] flex flex-shrink-0 relative">
                    {!imgLoaded ? (
                        <div className="absolute inset-0 w-full h-full">
                            <AdaptiveLoadingComponent />
                        </div>
                    ) : (
                        <></>
                    )}
                    <img
                        onLoad={() => {
                            setImgLoaded(true);
                        }}
                        src={previewImage}
                        alt="preview"
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
                <div className="w-full h-full p-2 flex flex-col justify-center gap-2 text-center">
                    <span className="text-xl font-semibold text-gray-200">{heading}</span>
                    <span className="text-gray-400 text-sm">{shortDescription}</span>
                </div>
                <div className="w-[100px] h-full flex items-center justify-end flex-shrink-0">
                    <span className="text-gray-400">{new Date(currentDate).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
}

function ComicsTile({ heading, previewImage, shortDescription, currentDate, comicsId }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    return (
        <Link to={"/comics/" + ((comicsId + 1) * 8984 + 89 * 621)}>
            <div className="w-full text-gray-300 border-b-[1px] border-teal-700 flex flex-col items-center md:flex-row p-4 cursor-pointer animated-100 hover:bg-dark-purple-100 hover:bg-opacity-20">
                <div className="w-full h-[280px] md:w-[250px] md:h-[140px] flex flex-shrink-0 relative">
                    {!imgLoaded ? (
                        <div className="absolute inset-0 w-full h-full">
                            <AdaptiveLoadingComponent />
                        </div>
                    ) : (
                        <></>
                    )}
                    <img
                        onLoad={() => {
                            setImgLoaded(true);
                        }}
                        src={previewImage}
                        alt="preview"
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
                <div className="w-full h-full p-2 flex flex-col justify-center gap-2 text-center">
                    <span className="text-xl font-semibold text-gray-200">{heading}</span>
                    <span className="text-gray-400 text-sm">{shortDescription}</span>
                </div>
                <div className="w-[100px] h-full flex items-center justify-end flex-shrink-0">
                    <span className="text-gray-400">{new Date(currentDate).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
}
