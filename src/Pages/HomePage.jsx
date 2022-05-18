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
import { getDataFromResponse } from "../Utils/NetworkUtil";
import { getRandomString } from "../Utils/RandomUtil";
import { Link, useNavigate } from "react-router-dom";
import { clampNumber } from "../Utils/MathUtils";
import AdaptiveLoadingComponent from "../Components/UI/AdaptiveLoadingComponent";

export default function HomePage() {
    const ui = useStoreState(UIStorage);

    const [selectedOption, setSelectedOption] = useState("news");

    const [allNews, setAllNews] = useState([]);
    const [allComics, setAllComics] = useState([]);

    const [newsQuantity, setNewsQuantity] = useState(0);
    const [comicsQuantity, setComicsQuantity] = useState(0);

    const [numberOfNewsPages, setNumberOfNewsPages] = useState(0);
    const [numberOfComicsPages, setNumberOfComicsPages] = useState(0);

    const [selectedNewsPage, setSelectedNewsPage] = useState(1);
    const [selectedComicsPage, setSelectedComicsPage] = useState(1);

    const [inWait, setInWait] = useState(true);

    const [newsTiles, setNewsTiles] = useState([]);
    const [comicsTiles, setComicsTiles] = useState([]);

    useEffect(() => {
        async function startup() {
            try {
                let response = await axios.get(getNewsQuantity_EP());
                let quantity = getDataFromResponse(response);
                if (quantity) setNewsQuantity(quantity);
                // setNewsQuantity(15);
                // console.log(quantity);
            } catch (error) {
                console.log(error);
                ui.showError(error.message);
            }
            try {
                let response = await axios.get(getComicsQuantity_EP());
                let quantity = getDataFromResponse(response);
                if (quantity) setComicsQuantity(quantity);
                // console.log(quantity);
            } catch (error) {
                console.log(error);
                ui.showError(error.message);
            }
            // try {
            //     let comics = await axios.post(getAllComics_EP(), {});
            //     comics = getDataFromResponse(comics);
            //     let copyComics = Array.from(comics);
            //     copyComics.sort((a, b) => new Date(b.currentDate) - new Date(a.currentDate));
            //     // console.log(copyNews);
            //     setAllComics(copyComics);
            // } catch (error) {
            //     console.log(error);
            //     ui.showError(error.message);
            // }
        }
        startup();
    }, []);

    useEffect(() => {
        if (newsQuantity > 0) setNumberOfNewsPages(Math.ceil(newsQuantity / 5));
    }, [newsQuantity]);
    useEffect(() => {
        if (comicsQuantity > 0) setNumberOfComicsPages(Math.ceil(comicsQuantity / 5));
    }, [comicsQuantity]);

    useEffect(() => {
        if (allNews.length === 0) return;
        let tNews = Array.from(allNews).slice((selectedNewsPage - 1) * 5, selectedNewsPage * 5);
        let news = [];
        for (const i of tNews) {
            let key = getRandomString(32);
            news.push(<NewsTile key={key} {...i} />);
        }
        setNewsTiles(news);
        setTimeout(() => {
            setInWait(false);
        }, 250);
        // console.log(tNews);
    }, [allNews]);

    useEffect(() => {
        if (allComics.length === 0) return;
        let tComics = Array.from(allComics).slice((selectedComicsPage - 1) * 5, selectedComicsPage * 5);
        let comics = [];
        for (const i of tComics) {
            let key = getRandomString(32);
            comics.push(<ComicsTile key={key} {...i} />);
        }
        setComicsTiles(comics);
        setTimeout(() => {
            setInWait(false);
        }, 250);
        // console.log(tComics);
    }, [allComics]);

    useEffect(() => {
        async function s() {
            try {
                let news = await axios.post(getNewsByIndex_EP(), { index: (selectedNewsPage-1)*5 });
                news = getDataFromResponse(news);
                let copyNews = Array.from(news);
                copyNews.sort((a, b) => new Date(b.currentDate) - new Date(a.currentDate));
                // console.log(copyNews);
                setAllNews(copyNews);
            } catch (error) {
                console.log(error);
                ui.showError(error.message);
            }
        }
        s();
    }, [selectedNewsPage]);

    useEffect(() => {
        async function s() {
            try {
                let comics = await axios.post(getComicsByIndex_EP(), { index: (selectedComicsPage-1)*5 });
                comics = getDataFromResponse(comics);
                let copyComics = Array.from(comics);
                copyComics.sort((a, b) => new Date(b.currentDate) - new Date(a.currentDate));
                // console.log(copyComics);
                setAllComics(copyComics);
            } catch (error) {
                console.log(error);
                ui.showError(error.message);
            }
        }
        s();
    }, [selectedComicsPage]);

    function newsPageChanged(newPage) {
        if(newPage === selectedNewsPage) return;
        setInWait(true);
        setTimeout(()=>{setSelectedNewsPage(newPage)},100);
    }

    function comicsPageChanged(newPage) {
        if(newPage === selectedComicsPage) return;
        setInWait(true);
        setTimeout(()=>{setSelectedComicsPage(newPage)},100);
    }

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
                {inWait ? (
                    <div className="absolute inset-0 flex">
                        <AdaptiveLoadingComponent />
                    </div>
                ) : (
                    <></>
                )}
                {selectedOption === "news" ? newsTiles : comicsTiles}
                <div className="w-full flex justify-center">
                    {selectedOption === "news" ? (
                        <NewsPageSelector number={numberOfNewsPages} callback={newsPageChanged} />
                    ) : (
                        <ComicsPageSelector number={numberOfComicsPages} callback={comicsPageChanged} />
                    )}
                </div>
            </div>
        </div>
    );
}

function NewsPageSelector({ number, callback }) {
    const [selectedPage, setSelectedPage] = useState(1);
    const [pagesInView, setPagesInView] = useState([]);

    function changeSelection() {
        if (number === 1) return;
        let pages = [];
        // number = 100;
        if (number <= 6) {
            for (let i = 1; i <= number; i++) {
                if (selectedPage === i)
                    pages.push(
                        <button
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md bg-dark-purple-100 bg-opacity-50 select-none"
                        >
                            {i}
                        </button>
                    );
                else
                    pages.push(
                        <button
                            onClick={() => {
                                setSelectedPage(i);
                            }}
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                        >
                            {i}
                        </button>
                    );
            }
            setPagesInView(pages);
            return;
        }
        if (selectedPage > 4 && selectedPage < number - 4) {
            pages.push(
                <button
                    onClick={() => {
                        setSelectedPage(1);
                    }}
                    key={getRandomString(12)}
                    className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                >
                    1
                </button>
            );
            pages.push(
                <div
                    key={getRandomString(12)}
                    className="w-12 h-12 flex justify-center items-center flex-shrink-0 border-teal-400 border-[1px] rounded-md select-none"
                >
                    ...
                </div>
            );
            pages.push(
                <button key={getRandomString(12)} className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md bg-dark-purple-100 bg-opacity-50 select-none">
                    {selectedPage}
                </button>
            );
            pages.push(
                <button
                    onClick={() => {
                        setSelectedPage(selectedPage + 1);
                    }}
                    key={getRandomString(12)}
                    className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                >
                    {selectedPage + 1}
                </button>
            );
            pages.push(
                <div
                    key={getRandomString(12)}
                    className="w-12 h-12 flex justify-center items-center flex-shrink-0 border-teal-400 border-[1px] rounded-md select-none"
                >
                    ...
                </div>
            );
            pages.push(
                <button
                    onClick={() => {
                        setSelectedPage(number);
                    }}
                    key={getRandomString(12)}
                    className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                >
                    {number}
                </button>
            );
            setPagesInView(pages);
            return;
        }
        if (selectedPage <= 4) {
            for (let i = 1; i < 7; i++) {
                if (selectedPage === i)
                    pages.push(
                        <button
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md bg-dark-purple-100 bg-opacity-50 select-none"
                        >
                            {i}
                        </button>
                    );
                else
                    pages.push(
                        <button
                            onClick={() => {
                                setSelectedPage(i);
                            }}
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                        >
                            {i}
                        </button>
                    );
            }
            setPagesInView(pages);
            return;
        }
        if (selectedPage >= number - 6) {
            for (let i = number - 5; i < number + 1; i++) {
                if (selectedPage === i)
                    pages.push(
                        <button
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md bg-dark-purple-100 bg-opacity-50 select-none"
                        >
                            {i}
                        </button>
                    );
                else
                    pages.push(
                        <button
                            onClick={() => {
                                setSelectedPage(i);
                            }}
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                        >
                            {i}
                        </button>
                    );
            }
            setPagesInView(pages);
            return;
        }
    }

    useEffect(() => {
        changeSelection();
        callback(selectedPage);
        // console.log('from me',selectedPage);
    }, [selectedPage, number]);

    // useEffect(() => {
    //     if (selectedPage !== 1) {
    //         setSelectedPage(1);
    //         return;
    //     }
    //     changeSelection();
    //     // console.log('');
    // }, [forType]);

    return number > 1 ? (
        <div className="w-full max-w-[584px] h-20 flex items-center justify-between text-teal-400 gap-4">
            <button
                onClick={() => {
                    setSelectedPage(clampNumber(selectedPage - 1, 1, number));
                }}
                className="w-28 h-12 p-2 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
            >
                Previous
            </button>
            <div className={"w-full flex gap-2 overflow-x-auto " + (number <= 6 ? "justify-center" : "")}>{pagesInView}</div>
            <button
                onClick={() => {
                    setSelectedPage(clampNumber(selectedPage + 1, 1, number));
                }}
                className="w-28 h-12 p-2 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
            >
                Next
            </button>
        </div>
    ) : (
        <></>
    );
}

function ComicsPageSelector({ number, callback }) {
    const [selectedPage, setSelectedPage] = useState(1);
    const [pagesInView, setPagesInView] = useState([]);

    function changeSelection() {
        if (number === 1) return;
        let pages = [];
        // number = 100;
        if (number <= 6) {
            for (let i = 1; i <= number; i++) {
                if (selectedPage === i)
                    pages.push(
                        <button
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md bg-dark-purple-100 bg-opacity-50 select-none"
                        >
                            {i}
                        </button>
                    );
                else
                    pages.push(
                        <button
                            onClick={() => {
                                setSelectedPage(i);
                            }}
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                        >
                            {i}
                        </button>
                    );
            }
            setPagesInView(pages);
            return;
        }
        if (selectedPage > 4 && selectedPage < number - 4) {
            pages.push(
                <button
                    onClick={() => {
                        setSelectedPage(1);
                    }}
                    key={getRandomString(12)}
                    className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                >
                    1
                </button>
            );
            pages.push(
                <div
                    key={getRandomString(12)}
                    className="w-12 h-12 flex justify-center items-center flex-shrink-0 border-teal-400 border-[1px] rounded-md select-none"
                >
                    ...
                </div>
            );
            pages.push(
                <button key={getRandomString(12)} className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md bg-dark-purple-100 bg-opacity-50 select-none">
                    {selectedPage}
                </button>
            );
            pages.push(
                <button
                    onClick={() => {
                        setSelectedPage(selectedPage + 1);
                    }}
                    key={getRandomString(12)}
                    className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                >
                    {selectedPage + 1}
                </button>
            );
            pages.push(
                <div
                    key={getRandomString(12)}
                    className="w-12 h-12 flex justify-center items-center flex-shrink-0 border-teal-400 border-[1px] rounded-md select-none"
                >
                    ...
                </div>
            );
            pages.push(
                <button
                    onClick={() => {
                        setSelectedPage(number);
                    }}
                    key={getRandomString(12)}
                    className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                >
                    {number}
                </button>
            );
            setPagesInView(pages);
            return;
        }
        if (selectedPage <= 4) {
            for (let i = 1; i < 7; i++) {
                if (selectedPage === i)
                    pages.push(
                        <button
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md bg-dark-purple-100 bg-opacity-50 select-none"
                        >
                            {i}
                        </button>
                    );
                else
                    pages.push(
                        <button
                            onClick={() => {
                                setSelectedPage(i);
                            }}
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                        >
                            {i}
                        </button>
                    );
            }
            setPagesInView(pages);
            return;
        }
        if (selectedPage >= number - 6) {
            for (let i = number - 5; i < number + 1; i++) {
                if (selectedPage === i)
                    pages.push(
                        <button
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md bg-dark-purple-100 bg-opacity-50 select-none"
                        >
                            {i}
                        </button>
                    );
                else
                    pages.push(
                        <button
                            onClick={() => {
                                setSelectedPage(i);
                            }}
                            key={getRandomString(12)}
                            className="w-12 h-12 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100 select-none"
                        >
                            {i}
                        </button>
                    );
            }
            setPagesInView(pages);
            return;
        }
    }

    useEffect(() => {
        changeSelection();
        callback(selectedPage);
        // console.log(selection);
    }, [selectedPage]);

    // useEffect(() => {
    //     if (selectedPage !== 1) {
    //         setSelectedPage(1);
    //         return;
    //     }
    //     changeSelection();
    //     // console.log('');
    // }, [forType]);

    return number > 1 ? (
        <div className="w-full max-w-[584px] h-20 flex items-center justify-between text-teal-400 gap-4">
            <button
                onClick={() => {
                    setSelectedPage(clampNumber(selectedPage - 1, 1, number));
                }}
                className="w-28 h-12 p-2 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100"
            >
                Previous
            </button>
            <div className={"w-full flex gap-2 overflow-x-auto " + (number <= 6 ? "justify-center" : "")}>{pagesInView}</div>
            <button
                onClick={() => {
                    setSelectedPage(clampNumber(selectedPage + 1, 1, number));
                }}
                className="w-28 h-12 p-2 flex-shrink-0 border-teal-400 border-[1px] rounded-md hover:bg-dark-purple-100"
            >
                Next
            </button>
        </div>
    ) : (
        <></>
    );
}

function NewsTile({ heading, previewImage, shortDescription, currentDate, newsId }) {
    return (
        <Link to={"/news/" + ((newsId + 1) * 8984 + 89 * 621)}>
            <div className="w-full text-gray-300 border-b-[1px] border-teal-700 flex flex-col items-center md:flex-row p-4 cursor-pointer animated-100 hover:bg-dark-purple-100 hover:bg-opacity-20">
                <div className="w-full h-[280px] md:w-[250px] md:h-[140px] flex flex-shrink-0">
                    <img src={previewImage} alt="preview" className="w-full h-full object-cover rounded-md" />
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
    return (
        <Link to={"/comics/" + ((comicsId + 1) * 8984 + 89 * 621)}>
            <div className="w-full text-gray-300 border-b-[1px] border-teal-700 flex flex-col items-center md:flex-row p-4 cursor-pointer animated-100 hover:bg-dark-purple-100 hover:bg-opacity-20">
                <div className="w-full h-[280px] md:w-[250px] md:h-[140px] flex flex-shrink-0">
                    <img src={previewImage} alt="preview" className="w-full h-full object-cover rounded-md" />
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
