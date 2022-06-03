import React, { useEffect, useRef } from "react";
import luckyBoxImage from "../../Images/Boxes/luckyBox.png";
import mysteryBoxImage from "../../Images/Boxes/mysteryBox.png";

import party from "party-js";
import anime from "animejs";
import { useStoreState } from "pullstate";
import { UIStorage } from "../../Storages/UIStorage";
import { useNavigate } from "react-router-dom";

const tempItem = {
    comment: "Nazko wears this backpack every day to travel to his job & home.",
    features: {},
    imgLink: "https://axiebch.com/wp-content/uploads/2022/04/reborn_box_serial_001.png",
    name: "Original Xiaomi Mi Backpack",
    rarity: "Guarantee",
};

const rarityColors = {
    guarantee: "text-gray-400",
    common: "text-blue-100",
    rare: "text-green-300",
    epic: "text-blue-400",
    mythical: "text-purple-400",
    legendary: "text-yellow-300",
    heroic: "text-red-500",
};

export default function OpenBoxCarousel({ item, boxType, winner, startPlaying }) {
    const ui = useStoreState(UIStorage);
    const navigate = useNavigate();

    const animation = useRef(null);

    useEffect(() => {
        if (startPlaying && animation.current) play();
    }, [startPlaying]);

    function play() {
        animation.current.restart();
    }

    function onWinnerAnimationFinished() {
        // console.log("stop!!");
        party.confetti(document.getElementById("target-item"));
        ui.showSuccess("Congratulations!");
    }

    function onLoseAnimationFinished() {
        console.log("stop lose!!");
    }

    function onActivateButton() {
        document.getElementById("view-inv").classList.remove("pointer-events-none");
    }

    function setWinnerAnimation() {
        animation.current = anime.timeline({
            duration: 1000,
            loop: false,
            autoplay: false,
            easing: "easeInOutElastic(1, .96)",
        });

        animation.current
            .add({
                targets: ".target-box",
                translateX: [700, "50%"],
            })
            .add({
                targets: ".target-box",
                rotate: "+=2turn",
                scale: 1.5,
            })
            .add({
                targets: ".target-box",
                translateY: [0, 1200],
            })
            .add({
                targets: ".target-item",
                translateY: [1200, 0],
                translateX: [0, "50%"],
                rotate: "+=2turn",
                scale: [1, 0.8],
            })
            .add({
                duration: 800,
                targets: ".target-item",
                scale: [0.8, 1],
                complete: onWinnerAnimationFinished,
            })
            .add({
                targets: ".target-text",
                opacity: [0, 1],
            })
            .add({
                targets: ".target-button",
                opacity: [0, 1],
                complete: onActivateButton,
            });
    }

    function setLoseAnimation() {
        animation.current = anime.timeline({
            duration: 1000,
            loop: false,
            autoplay: false,
            easing: "easeInOutElastic(1, .96)",
        });

        animation.current
            .add({
                targets: ".target-box",
                translateX: [700, "50%"],
            })
            .add({
                targets: ".target-box",
                rotate: "+=2turn",
                scale: 1.5,
            })
            .add({
                targets: ".target-box",
                translateY: [0, 1200],
                complete: onLoseAnimationFinished,
            })
            .add({
                targets: ".target-item",
                translateY: [1200, 1201],
            })
            .add({
                targets: ".target-text",
                opacity: [0, 0],
            })
            .add({
                targets: ".target-button",
                opacity: [0, 0],
            });
    }

    useEffect(() => {
        if(winner) setWinnerAnimation();
        else setLoseAnimation();

        // console.log("change animation");

        return ()=>{
            // console.log('destroyed');
            animation.current.pause();
            animation.current = null;
        }
    }, []);

    return (
        <>
            <div className="w-full h-full flex items-center justify-center overflow-x-hidden overflow-y-hidden">
                <div className="w-full h-1/2 relative">
                    <div className="target-box absolute h-full flex justify-center items-center">
                        <img src={boxType === "LUCKY" ? luckyBoxImage : mysteryBoxImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="target-item absolute h-full w-1/2 flex justify-center items-center">
                        <div id="target-item" className="w-full h-full relative">
                            <div className="target-text absolute z-10 w-full h-full flex flex-col items-center justify-center gap-4 text-center bg-opacity-70 bg-black rounded-lg">
                                <span className="text-3xl font-semibold">{item["name"]}</span>
                                <span className={"text-xl font-semibold " + rarityColors[item["rarity"]?.toLowerCase()]}>{item["rarity"]} item</span>
                                <span className="text-xl">{item["comment"]}</span>
                            </div>
                            <img src={item["imgLink"]} alt="" className="absolute w-full h-full object-cover rounded-lg" />
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        navigate("/inventory");
                    }}
                    id="view-inv"
                    className="target-button opacity-0 pointer-events-none absolute bottom-0 p-4 text-teal-400 border-2 border-teal-600 bg-dark-purple-100 bg-opacity-30 animated-100 hover:bg-opacity-60 rounded-lg"
                >
                    View my inventory
                </button>
            </div>
        </>
    );
}
