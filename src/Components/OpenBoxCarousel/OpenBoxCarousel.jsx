import React, { useEffect, useRef, useState } from "react";
import img1 from "../../Images/1.jpg";
import img2 from "../../Images/2.jpg";
import img3 from "../../Images/3.jpg";
import img4 from "../../Images/4.jpg";
import img5 from "../../Images/5.jpg";
import img6 from "../../Images/6.jpg";
import img7 from "../../Images/7.jpg";
import img8 from "../../Images/8.jpg";
import img9 from "../../Images/9.jpg";
import img10 from "../../Images/10.jpg";
import img11 from "../../Images/11.jpg";
import img12 from "../../Images/12.jpg";
import img13 from "../../Images/13.jpg";
import img14 from "../../Images/14.jpg";
import img15 from "../../Images/15.jpg";
import img16 from "../../Images/16.jpg";
import img17 from "../../Images/17.jpg";
import img18 from "../../Images/18.jpg";
import img19 from "../../Images/19.jpg";
import img20 from "../../Images/20.jpg";
import img21 from "../../Images/21.jpg";
import luckyBoxImg from "../../Images/Boxes/luckyBox.png";
import mysteryBoxImg from "../../Images/Boxes/mysteryBox.png";

import party from "party-js";
import anime from "animejs";
import { RARITY_PALETTE } from "../../Utils/ColorPaletteUtils";
import { useStoreState } from "pullstate";
import { UIStorage } from "../../Storages/UIStorage";
import ButtonDefault from "../UI/StyledComponents/ButtonDefault";
import { useNavigate } from "react-router-dom";
import BigCross from "../../Icons/BigCross";
import { UserBalanceStorage } from "../../Storages/UserBalanceStorage";

export default function OpenBoxCarousel({ boxData, win, itemData }) {
    const animation = useRef(null);
    const ui = useStoreState(UIStorage);
    const navigate = useNavigate();

    const [animationFinished, setAnimationFinished] = useState(false);

    // const tempItem = {
    //     comment: "Nazko wears this backpack every day to travel to his job & home.",
    //     features: {},
    //     imgLink: "https://axiebch.com/wp-content/uploads/2022/04/reborn_box_serial_001.png",
    //     name: "Original Xiaomi Mi Backpack",
    //     rarity: "Guarantee",
    // };

    useEffect(() => {
        animation.current = null;
        animation.current = anime.timeline({
            loop: false,
            autoplay: false,
            easing: "easeInOutElastic(1, .6)",
        });

        animation.current.add({
            targets: [".target-item", ".target-cross"],
            opacity: 0,
            duration: 1,
        });

        if (win) {
            animation.current.add({
                targets: ".target-item",
                opacity: [0, 1],
                duration: 1,
                delay: 300,
            });
            animation.current
                .add({
                    targets: ".target-box",
                    translateX: [1000, 0],
                    duration: 1500,
                })
                .add({
                    targets: ".target-box",
                    translateY: [0, -100, 1000],
                    rotate: "+=8turn",
                    duration: 2000,
                })
                .add({
                    targets: ".target-item",
                    translateY: [1000, 0],
                    scale: [0.5, 0.7],
                    duration: 1500,
                    delay: 500,
                    complete: () => {
                        ui.showSuccess("Congratulations! You have won an item!");
                        party.confetti(document.getElementById("target-item"));
                        setAnimationFinished(true);
                    },
                })
                .add({
                    targets: ".target-text",
                    opacity: [0, 1],
                });
            animation.current.play();
        } else {
            animation.current.add({
                targets: ".target-cross",
                opacity: [0, 1],
                duration: 1,
                delay: 300,
            });
            animation.current
                .add({
                    targets: ".target-box",
                    translateX: [1000, 0],
                    duration: 1500,
                })
                .add({
                    targets: ".target-box",
                    translateY: [0, -100, 1000],
                    rotate: "+=8turn",
                    duration: 2000,
                })
                .add({
                    targets: ".target-cross",
                    translateY: [1000, 0],
                    scale: [0.5, 1, 5],
                    duration: 2000,
                    delay: 1000,
                    complete: () => {
                        ui.showNotification("Unfortunately, this box was empty.");
                        setAnimationFinished(true);
                    },
                });

            animation.current.play();
        }
    }, [win]);

    useEffect(() => {
        return () => {
            try {
                animation.current.pause();
            } catch (error) {}
            animation.current = null;
        };
    }, []);

    return (
        <div className="w-full h-full flex items-center">
            <div className="w-full h-2/3 flex relative justify-center">
                <div className="flex h-full target-box">
                    <img src={boxData?.type?.name === "TYPE_LUCKY" ? luckyBoxImg : mysteryBoxImg} alt="box" className="h-full w-full object-contain" />
                </div>
                <div id="target-item" className="absolute flex h-full target-item">
                    <div className="w-full h-full flex relative">
                        <img
                            src={itemData?.imgLink}
                            alt="box"
                            className={"h-full w-full object-contain border-8 rounded-md" + RARITY_PALETTE.border[itemData?.rarity?.toLowerCase()]}
                        />
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-center bg-black bg-opacity-80 target-text px-4">
                            <span className={"font-semibold text-sm md:text-xl lg:text-2xl" + RARITY_PALETTE.text[itemData?.rarity?.toLowerCase()]}>
                                {itemData?.name}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="absolute flex h-full target-cross">
                    <div className="w-full h-full flex justify-center items-center relative">
                        <BigCross className={"h-full w-full"} />
                    </div>
                </div>
                {animationFinished ? (
                    <div className="absolute left-0 right-0 bottom-0 w-full h-12 flex justify-center">
                        <ButtonDefault
                            text={"Go to inventory"}
                            click={() => {
                                navigate("/inventory");
                            }}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
