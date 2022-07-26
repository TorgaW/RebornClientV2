import axios from "axios";
import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UIStorage } from "../Storages/UIStorage";
import { scrollToTop } from "../Utils/BrowserUtil";
import { getSpecificNews_EP } from "../Utils/EndpointsUtil";
import { getDataFromResponse } from "../Utils/NetworkUtil";
import IconComponent from "../Icons/IconComponent";
import NavigationArrow from "../Icons/NavigationArrow";

export default function ViewNewsPage() {
    const params = useParams();
    const navigate = useNavigate();

    const ui = useStoreState(UIStorage);

    const [articleData, setArticleData] = useState({});

    useEffect(() => {
        async function s() {
            if (params && params.newsIndex) {
                let idx = Number(params.newsIndex);
                if (!isNaN(idx)) {
                    try {
                        let realIndex = (idx - 89 * 621) / 8984 - 1;
                        // console.log(realIndex);
                        let response = await axios.post(getSpecificNews_EP(), { index: realIndex });
                        let data = getDataFromResponse(response);
                        setArticleData(data);
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
        s();
        scrollToTop();
        return () => {
            ui.hideContentLoading();
        };
    }, []);

    useEffect(() => {
        document.getElementById("content-wrapper").scrollTop = 0;
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
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            ui.showSuccess("Link has been copied to your clipboard!");
                        }}
                        className="p-2 text-teal-400 underline"
                    >
                        Share via link
                    </button>
                </div>
                <div className="w-full h-[300px] md:w-[700px] md:h-[300px] flex self-center">
                    <img src={articleData.previewImage} alt="preview" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div dangerouslySetInnerHTML={{ __html: articleData.articleText }}></div>
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
