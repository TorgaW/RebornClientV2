import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UIStorage } from "../Storages/UIStorage";
import { RARITY_PALETTE } from "../Utils/ColorPaletteUtils";
import { getBoxById_EP, getTransferDetails_EP } from "../Utils/EndpointsUtil";
import { makePost } from "../Utils/NetworkUtil";
import { baseToStr } from "../Utils/StringUtil";
import luckyBox from '../Images/Boxes/luckyBox.png';
import mysteryBox from '../Images/Boxes/mysteryBox.png';

export default function ItemPhysicalViewPage() {
    const params = useParams();
    const navigate = useNavigate();

    const ui = useStoreState(UIStorage);

    const [rawData, setRawData] = useState({ transfer: undefined, item: undefined });

    async function getExactTransfer() {
        console.log(params);
        if (params && params.boxId) {
            ui.showContentLoading();
            let [d, s, e] = await makePost(getTransferDetails_EP(), {}, true);
            let t = undefined;
            if (d) {
                let box = Number(baseToStr(params.boxId));
                for (const i of d) {
                    if (i.boxID === box) {
                        t = i;
                        break;
                    }
                }
                // let [bd, bs, be] = await makePost(getBoxById_EP(), { index: box });
                // if (bd) {
                    setRawData({ transfer: t, item: t.filled });
                    console.log({ transfer: t, item: t.filled });
                    ui.hideContentLoading();
                // } else {
                //     ui.showError(be);
                //     ui.hideContentLoading();
                // }
            } else {
                ui.showError(e);
                ui.hideContentLoading();
            }
        } else {
            navigate("/notfound");
        }
    }

    useEffect(() => {
        getExactTransfer();

        return () => {
            ui.hideContentLoading();
        };
    }, []);

    return (
        <div className="w-full lg:w-[1000px] self-center px-4 flex flex-col text-white bg-dark-purple-100 bg-opacity-10 shadow-lg rounded-xl relative">
            <div className="w-full flex flex-col items-center text-center gap-4">
                <span className={"text-2xl font-semibold"+RARITY_PALETTE.text[rawData.item?.rarity?.toLowerCase()]}>{rawData.item?.name}</span>
                <div className="w-[200px] h-[200px] flex">
                    <img src={rawData.item?.imgLink} alt="item" className={"w-full h-full object-cover border-4 rounded-md"+RARITY_PALETTE.border[rawData.item?.rarity?.toLowerCase()]} />
                </div>
                <div className="w-full flex flex-col items-center text-center">
                    <span className={"font-semibold text-lg"+RARITY_PALETTE.text[rawData.item?.rarity?.toLowerCase()]}>{rawData.item?.rarity?.toUpperCase()}</span>
                    <div className="max-w-[500px] flex p-2 bg-dark-purple-400 rounded-md">
                        <span className="text-lg">{rawData.item?.comment}</span>
                    </div>
                </div>
            </div>
            {/* <h3 className="text-xl font-semibold mt-6 ml-2">This item is from</h3>
            <div className="w-full h-[1px] bg-white mt-1"></div>
            <div className="w-full flex items-center text-center p-4 gap-4 flex-col-reverse md:flex-row">
                <div className="w-full flex justify-center">
                    <div className="w-[250px] h-[250px] flex">
                        <img src={rawData.box?.type?.name === 'TYPE_LUCKY' ? luckyBox:mysteryBox} alt="box" />
                    </div>
                </div>
                <div className={"w-full flex flex-col items-center "+(rawData.box?.type?.name === 'TYPE_LUCKY' ? 'text-yellow-500':'text-teal-400')}>
                    <span className={"text-3xl font-semibold "}>{(rawData.box?.type?.name === 'TYPE_LUCKY' ? 'LUCKY':'MYSTERY')} BOX</span>
                    <span className={"text-xl font-semibold opacity-80 "}>{rawData.box?.serial}-{rawData.box?.number}</span>
                    <span className="italic">{rawData.box?.type?.name === 'TYPE_LUCKY' ? 'Bright yellow box with shining edges! You are so lucky!':'So much power in this box! Who knows what it holds...'}</span>
                </div>
            </div> */}
            <h3 className="text-xl font-semibold mt-6 ml-2">Your order</h3>
            <div className="w-full h-[1px] bg-white mt-1"></div>
            <div className="w-full flex flex-col gap-4 p-4 text-xl">
                <span className="self-center text-center">Current order status: <span className={'font-semibold '+(rawData.transfer?.status === 'Not send' ? "text-red-500":(rawData.transfer?.status === 'Shipped' ? 'text-green-500':'text-yellow-300'))}>{rawData.transfer?.status}</span></span>
            </div>
        </div>
    );
}
