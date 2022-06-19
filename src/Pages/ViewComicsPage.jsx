import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UIStorage } from "../Storages/UIStorage";
import { scrollToTop } from "../Utils/BrowserUtil";
import { getSpecificComics_EP, getSpecificNews_EP } from "../Utils/EndpointsUtil";
import { getDataFromResponse } from "../Utils/NetworkUtil";
import { getRandomString } from "../Utils/RandomUtil";

export default function ViewComicsPage() {
    const params = useParams();
    const navigate = useNavigate();

    const ui = useStoreState(UIStorage);

    const [articleData, setArticleData] = useState({});
    const [parsedImages, setParsedImages] = useState([]);

    function parseComics(data) {
        let dummyDOM = document.createElement("div");
        dummyDOM.innerHTML = data.articleText;
        let images = dummyDOM.getElementsByTagName("img");
        let a = [];
        for (const i of images) {
            a.push(
                <div key={getRandomString(24)} className="w-full relative">
                    <div className="absolute h-[2px] top-0 left-0 right-0 bg-black"></div>
                    <img src={i.src} alt="comics" className="w-full" />
                    <div className="absolute h-[2px] bottom-0 left-0 right-0 bg-black"></div>
                </div>
            );
        }
        setParsedImages(a);
        setArticleData(data);
    }

    useEffect(() => {
        async function s() {
            if (params && params.comicsIndex) {
                let idx = Number(params.comicsIndex);
                if (!isNaN(idx)) {
                    try {
                        let realIndex = ((idx-(89*621))/8984) - 1;
                        // console.log(realIndex);
                        let response = await axios.post(getSpecificComics_EP(), { index: realIndex });
                        let data = getDataFromResponse(response);

                        /* parse comics */
                        parseComics(data);
                        // setArticleData(data);
                        setTimeout(()=>{ui.hideContentLoading()},250)
                    } catch (error) {
                        navigate("/pagenotfound");
                    }
                }
            }
        }
        ui.showContentLoading();
        s();
        scrollToTop();
        return () => {
            ui.hideContentLoading();
        };
    }, []);

    return (
        <div className="w-full flex p-4 justify-center text-white">
            <div className="w-full max-w-[1200px] p-4 gap-4 flex flex-col rounded-lg bg-dark-purple-100 bg-opacity-10">
                <div className="w-full flex flex-col items-center text-center border-b-[1px] border-teal-600 p-4 gap-2">
                    <span className="text-4xl font-semibold">{articleData.heading ?? ""}</span>
                    <div className="w-full flex items-center justify-center gap-4 text-gray-400">
                        <span>{articleData.username ?? ""}</span>
                        <div className="h-4 border-l-2 border-teal-700 opacity-50"></div>
                        <span>{new Date(articleData.currentDate ?? 0).toUTCString()}</span>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                <button onClick={()=>{
                      navigator.clipboard.writeText(window.location.href);
                      ui.showSuccess('Link has been copied to your clipboard!')
                      }} className="p-2 text-teal-400 underline">
                      Share via link
                    </button>
                </div>
                <div className="w-full flex flex-col">
                  {parsedImages}
                </div>
                <div className="w-full flex">
                    <button onClick={()=>{navigate('/')}} className="p-4 text-teal-400 border-2 border-teal-600 bg-dark-purple-100 bg-opacity-30 animated-100 hover:bg-opacity-60 rounded-lg">
                      Back home
                    </button>
                </div>
            </div>
        </div>
    );
}
