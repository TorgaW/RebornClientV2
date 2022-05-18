import React from 'react'
import DiscordIcon from '../Icons/Discord';
import TelegramIcon from '../Icons/Telegram';
import TwitterIcon from '../Icons/Twitter';

export default function AboutPage() {
  return (
    <div className="w-full flex relative">
            <div className="w-full h-full overflow-y-auto flex flex-col items-center px-4 lg:px-10">
                <div className="w-full my-4 flex-shrink-0 flex flex-col justify-center items-center gap-20">
                    <div className="w-full h-auto flex justify-center items-center">
                        {/* <div className="border border-white w-full h-0 mr-2"></div> */}
                        <h2 className="text-4xl font-semibold flex-shrink-0 text-white">About this project</h2>
                        {/* <div className="border border-white w-full h-0 ml-2"></div> */}
                    </div>
                    <div className="w-full flex flex-col text-white max-w-[1750px] self-center gap-20 text-3xl">
                        <div className="w-full flex gap-4 items-center flex-wrap">
                            <span className=" font-bold text-teal-400 flex-shrink-0">BCH Reborn</span>
                            <span className=" font-bold flex-shrink-0">is an</span>
                            <span className=" font-bold p-2 bg-slate-800 text-slate-100 rounded-md w-full">experimental, open-ended, NFT-based metaverse.</span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className=" font-bold">It includes:</span>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="p-2 bg-purple-900 bg-opacity-40 text-slate-100 rounded-md">- a fantasy story</span>
                                <span className="w-full italic opacity-80 text-2xl text-slate-300">developed in manga style</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                <span className="  p-2 bg-purple-900 bg-opacity-40 text-slate-100 rounded-md">- a carefully developed PFP project</span>
                                <span className=" w-full italic opacity-80 text-2xl text-slate-300">
                                    with 15+ traits and variable rarities (from common to ultra-rare)
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                <span className=" p-2 bg-purple-900 bg-opacity-40 text-slate-100 rounded-md">
                                    - a unique physical items rewarding system for NFT Holders
                                </span>
                                <span className=" w-full italic opacity-80 text-2xl text-slate-300">with free delivery to any place of the world</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 opacity-60">
                            <span className=" font-bold">Feature goals:</span>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="  p-2 bg-purple-500 bg-opacity-20 text-slate-100 rounded-md">- a one-of-a-kind crypto bonus system</span>
                                <span className=" w-full italic opacity-80 text-2xl text-slate-300">
                                    with NFT holders being able to earn different tokens both inside & outside of its native chain SmartBCH
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                <span className="  p-2 bg-purple-500 bg-opacity-20 text-slate-100 rounded-md">- a breeding</span>
                                <span className=" w-full italic opacity-80 text-2xl text-slate-300">and flipping functionality</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                <span className="  p-2 bg-purple-500 bg-opacity-20 text-slate-100 rounded-md">- a Play-2-Earn opportunity</span>
                                <span className=" w-full italic opacity-80 text-2xl text-slate-300">based on different in-built experiences</span>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-4 p-2 bg-slate-900 rounded-md text-2xl">
                            <span className="">
                                <span className="text-purple-600 font-bold">$GAME</span> is a native token of{" "}
                                <span className="text-teal-400 font-bold">BCH Reborn</span> metaverse, living on{" "}
                                <span className="text-green-500 font-bold">SmartBCH</span> blockchain.
                            </span>
                            <span className="">
                                You need some <span className="text-purple-600 font-bold">$GAME</span> to play this game! You can buy{" "}
                                <span className="text-purple-600 font-bold">$GAME</span> token at{" "}
                                <span
                                    className="underline cursor-pointer"
                                    onClick={() => {
                                        window.open("https://app.mistswap.fi/swap", "_blank").focus();
                                    }}
                                >
                                    MistSwap DEX
                                </span>
                                .{" "}
                            </span>
                            <span className="">
                                If you have non-native cryptos (e.g. BNB, ETH, MATIC etc.) - please use the{" "}
                                <span
                                    className="underline cursor-pointer"
                                    onClick={() => {
                                        window.open("https://coinflex.com/home", "_blank").focus();
                                    }}
                                >
                                    bridge
                                </span>{" "}
                                first to inject them into <span className="text-green-500 font-bold">SmartBCH</span>.
                            </span>
                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <span className="font-bold">Media</span>
                            <div className="flex w-full items-center gap-10">
                                <div
                                    className="flex justify-center items-center w-10 h-10 cursor-pointer"
                                    onClick={() => {
                                        window.open("https://t.me/GameTokenBCH", "_blank").focus();
                                    }}
                                >
                                    <TelegramIcon />
                                </div>
                                <div
                                    className="flex justify-center items-center w-10 h-10 cursor-pointer"
                                    onClick={() => {
                                        window.open("https://twitter.com/bchreborn", "_blank").focus();
                                    }}
                                >
                                    <TwitterIcon />
                                </div>
                                <div
                                    className="flex justify-center items-center w-10 h-10 cursor-pointer"
                                    onClick={() => {
                                        window.open("https://www.discord.gg/axiebch", "_blank").focus();
                                    }}
                                >
                                    <DiscordIcon />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            <span className="font-bold">How to get NFTs (Heroes)?</span>
                            <span className="text-2xl p-2 bg-slate-900 rounded-md">
                                There are only 100 Founding Heroes ever exist. They are going to be auctioned through{" "}
                                <span
                                    className="underline cursor-pointer text-green-200"
                                    onClick={() => {
                                        window.open("https://oasis.cash/", "_blank").focus();
                                    }}
                                >
                                    oasis.cash
                                </span>{" "}
                                NFT marketplace.
                                <br /> All the rest (except very rare limited editions) Heroes - non-Founding, or Battling - can be generated through breeding
                                only, and then sold to players through an in-built marketplace.
                            </span>
                        </div>
                        <span className="text-3xl font-bold">
                            Join <span className="text-teal-400 font-bold">BCH Reborn</span> community!<br />
                            <span className="text-yellow-400">It's gonna be an exciting journey!</span>
                        </span>
                        <div className="w-full h-20"></div>
                    </div>
                </div>
            </div>
        </div>
  )
}
