import React, { useEffect, useState } from "react";
import { scrollToTop } from "../../Utils/BrowserUtil";
import { clampNumber } from "../../Utils/MathUtils";
import { getRandomString } from "../../Utils/RandomUtil";

export default function PageSelector({ maxPages, callback, scroll }) {
    const [selectedPage, setSelectedPage] = useState(1);

    const [pagesView, setPagesView] = useState([]);

    function pageChangedCallback(newPage) {
        let r = clampNumber(newPage, 1, maxPages)
        if (r === selectedPage) return;
        if (typeof callback === "function") callback(r);
        setSelectedPage(r);
        if(typeof scroll === 'number') scrollToTop(scroll);
    }

    useEffect(() => {
        if (maxPages > 0 && maxPages <= 5) {
            let t = [];
            for (let i = 1; i <= maxPages; i++) {
                if (selectedPage === i)
                    t.push(
                        <button
                            key={getRandomString(12)}
                            className="w-12 h-12 border-[1px] border-teal-400 text-teal-400 bg-dark-purple-300 rounded-md flex-shrink-0"
                        >
                            {i}
                        </button>
                    );
                else
                    t.push(
                        <button
                            key={getRandomString(12)}
                            onClick={() => {
                                pageChangedCallback(i);
                            }}
                            className="w-12 h-12 border-[1px] border-teal-400 hover:bg-dark-purple-200 animated-100 rounded-md flex-shrink-0"
                        >
                            {i}
                        </button>
                    );
            }
            setPagesView(t);
        } else if (maxPages > 5) {
            if (selectedPage <= 4) {
                let t = [];
                for (let i = 1; i <= 5; i++) {
                    if (selectedPage === i)
                        t.push(
                            <button
                                key={getRandomString(12)}
                                onClick={() => {
                                    pageChangedCallback(i);
                                }}
                                className="w-12 h-12 border-[1px] border-teal-400 text-teal-400 bg-dark-purple-300 rounded-md flex-shrink-0"
                            >
                                {i}
                            </button>
                        );
                    else
                        t.push(
                            <button
                                key={getRandomString(12)}
                                onClick={() => {
                                    pageChangedCallback(i);
                                }}
                                className="w-12 h-12 border-[1px] border-teal-400 hover:bg-dark-purple-200 animated-100 rounded-md flex-shrink-0"
                            >
                                {i}
                            </button>
                        );
                }
                setPagesView(t);
            }
            else if (selectedPage > 4 && selectedPage <= maxPages - 4) {
                let t = [];
                const prevPage = selectedPage - 1;
                const nextPage = selectedPage + 1;
                t.push(
                    <button
                        key={getRandomString(12)}
                        onClick={() => {
                            pageChangedCallback(1);
                        }}
                        className="w-12 h-12 border-[1px] border-teal-400 hover:bg-dark-purple-200 rounded-md flex-shrink-0"
                    >
                        ...
                    </button>
                );
                t.push(
                    <button
                        key={getRandomString(12)}
                        onClick={() => {
                            pageChangedCallback(prevPage);
                        }}
                        className="w-12 h-12 border-[1px] border-teal-400 hover:bg-dark-purple-200 rounded-md flex-shrink-0"
                    >
                        {prevPage}
                    </button>
                );
                t.push(
                    <button
                        key={getRandomString(12)}
                        className="w-12 h-12 border-[1px] border-teal-400 text-teal-400 bg-dark-purple-300 rounded-md flex-shrink-0"
                    >
                        {selectedPage}
                    </button>
                );
                t.push(
                    <button
                        key={getRandomString(12)}
                        onClick={() => {
                            pageChangedCallback(nextPage);
                        }}
                        className="w-12 h-12 border-[1px] border-teal-400 hover:bg-dark-purple-200 rounded-md flex-shrink-0"
                    >
                        {nextPage}
                    </button>
                );
                t.push(
                    <button
                        key={getRandomString(12)}
                        onClick={() => {
                            pageChangedCallback(maxPages);
                        }}
                        className="w-12 h-12 border-[1px] border-teal-400 hover:bg-dark-purple-200 rounded-md flex-shrink-0"
                    >
                        ...
                    </button>
                );
                setPagesView(t);
            }
            else if (selectedPage > maxPages - 4) {
                let t = [];
                for (let i = maxPages-4; i <= maxPages; i++) {
                    if (selectedPage === i)
                    t.push(
                        <button
                            key={getRandomString(12)}
                            className="w-12 h-12 border-[1px] border-teal-400 text-teal-400 bg-dark-purple-300 rounded-md flex-shrink-0"
                        >
                            {i}
                        </button>
                    );
                else
                    t.push(
                        <button
                            key={getRandomString(12)}
                            onClick={() => {
                                pageChangedCallback(i);
                            }}
                            className="w-12 h-12 border-[1px] border-teal-400 hover:bg-dark-purple-200 animated-100 rounded-md flex-shrink-0"
                        >
                            {i}
                        </button>
                    );
                }
                setPagesView(t);
            }
        }
    }, [selectedPage, maxPages]);

    return (
        <div className="w-full max-w-[500px] h-20 flex items-center justify-between text-white p-2 gap-2">
            <button onClick={()=>{pageChangedCallback(selectedPage - 1)}} className="border-[1px] border-teal-400 h-full rounded-md px-4 text-teal-400 animated-100 hover:bg-dark-purple-300">&#60;</button>
            <div className="w-full flex justify-center items-center gap-2 overflow-x-auto p-2">{pagesView}</div>
            <button onClick={()=>{pageChangedCallback(selectedPage + 1)}} className="border-[1px] border-teal-400 h-full rounded-md px-4 text-teal-400 animated-100 hover:bg-dark-purple-300">&#62;</button>
        </div>
    );
}
