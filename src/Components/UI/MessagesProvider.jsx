import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import UseStateRef from "react-usestateref";
import { UIStorage } from "../../Storages/UIStorage";
import CancelWhite from "../../Icons/CancelWhite";
import { getRandomString } from "../../Utils/RandomUtil";
import noti_sound_neutral from "../../Audio/notification_sound1.mp3";
import noti_sound_success from "../../Audio/notification_sound2.mp3";
import noti_sound_error from "../../Audio/notification_sound3.mp3";
import { getLocalOptions } from "../../Utils/LocalStorageManager/LocalStorageManager";
// import { isInArray } from "../Utils/ArrayUtil";

export default function MessagesProvider() {
    // max messages is 2

    const ui = useStoreState(UIStorage);

    const [messagesBuffer, setMessagesBuffer, messagesBufferRef] = UseStateRef([]);
    const [messagesOnScreen, setMessagesOnScreen, messagesOnScreenRef] = UseStateRef([]);

    function addMessage(type, text) {
        console.log("adding");

        if (messagesOnScreenRef.current.length === 2) {
            let t = Array.from(messagesBufferRef.current);
            t.push(<Message key={getRandomString(64)} type={type} text={text} closeMessage={deleteMessage} mKey={getRandomString(64)} />);
            setMessagesBuffer(t);
            return;
        }

        UIStorage.update((s) => {
            s.uiMessages.push(<Message key={getRandomString(64)} type={type} text={text} closeMessage={deleteMessage} mKey={getRandomString(64)} />);
        });

        if (type === "error") {
            let options = getLocalOptions();
            let audio = new Audio(noti_sound_error);
            audio.volume = options?.soundVolume ?? 0.5;
            audio.play();
        }
        if (type === "success") {
            let options = getLocalOptions();
            let audio = new Audio(noti_sound_success);
            audio.volume = options?.soundVolume ?? 0.5;
            audio.play();
        }
        if (type === "notification") {
            let options = getLocalOptions();
            let audio = new Audio(noti_sound_neutral);
            audio.volume = options?.soundVolume ?? 0.5;
            audio.play();
        }
    }

    function deleteMessage(mKey) {
        for (const i of messagesOnScreenRef.current) {
            if (mKey === i.props.mKey) {
                if (messagesBufferRef.current.length > 0) {
                    let newBuff = Array.from(messagesBufferRef.current);
                    let tElement = newBuff.shift();
                    setMessagesBuffer(newBuff);
                    let newScreen = Array.from(messagesOnScreenRef.current.filter((a) => a.props.mKey !== mKey));
                    tElement ? newScreen.push(tElement) : (() => {})();
                    UIStorage.update((s) => {
                        s.uiMessages = newScreen;
                    });
                } else {
                    let newScreen = Array.from(messagesOnScreenRef.current.filter((a) => a.props.mKey !== mKey));
                    UIStorage.update((s) => {
                        s.uiMessages = newScreen;
                    });
                }
            }
        }
    }

    useEffect(() => {
        UIStorage.update((s) => {
            s.showSuccess = (text) => {
                addMessage("success", text);
            };
            s.showError = (text) => {
                addMessage("error", text);
            };
            s.showNotification = (text) => {
                addMessage("notification", text);
            };
        });
    }, []);

    useEffect(() => {
        setMessagesOnScreen(Array.from(ui.uiMessages));
    }, [ui]);

    return (
        <div
            className={
                "fixed left-0 w-full h-44 z-50 pointer-events-none flex justify-center text-white " +
                (ui.UIOptions.systemMessagesPlace === "up-right" || ui.UIOptions.systemMessagesPlace === "up-left" ? "top-32" : "bottom-7")
            }
        >
            <div
                className={
                    "w-full max-w-[1750px] h-full flex p-1 px-4 overflow-y-auto gap-2 " +
                    (ui.UIOptions.systemMessagesPlace === "up-right" || ui.UIOptions.systemMessagesPlace === "up-left" ? " flex-col " : " flex-col-reverse ") +
                    (ui.UIOptions.systemMessagesPlace === "up-right" || ui.UIOptions.systemMessagesPlace === "down-right" ? "items-end" : "items-start")
                }
            >
                {messagesOnScreen}
            </div>
        </div>
    );
}

function Message({ type, text, mKey, closeMessage }) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        let t1 = setTimeout(() => {
            setFadeOut(true);
        }, 5000);

        let t2 = setTimeout(() => {
            closeMessage(mKey);
        }, 6700);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    const notification = (inText) => {
        return (
            <div
                className={
                    "p-4 border-2 border-slate-300 flex-shrink-0 flex items-center gap-6 bg-black rounded-lg relative pointer-events-auto transition-all " +
                    (fadeOut ? "opacity-0" : "opacity-80 hover:opacity-100")
                }
                style={fadeOut ? { transitionDuration: "1700ms" } : {}}
            >
                <span>{inText}</span>
                <div
                    className="w-5 h-5 flex-shrink-0 flex justify-center items-center cursor-pointer select-none"
                    onClick={() => {
                        closeMessage(mKey);
                    }}
                >
                    <CancelWhite />
                </div>
            </div>
        );
    };

    const success = (inText) => {
        return (
            <div
                className={
                    "p-4 border-2 border-green-500 flex-shrink-0 flex items-center gap-6 bg-black rounded-lg relative pointer-events-auto transition-all " +
                    (fadeOut ? "opacity-0" : "opacity-80 hover:opacity-100")
                }
                style={fadeOut ? { transitionDuration: "1700ms" } : {}}
            >
                <span>{inText}</span>
                <div
                    className="w-5 h-5 flex-shrink-0 flex justify-center items-center cursor-pointer select-none"
                    onClick={() => {
                        closeMessage(mKey);
                    }}
                >
                    <CancelWhite />
                </div>
            </div>
        );
    };

    const error = (inText) => {
        return (
            <div
                className={
                    "p-4 border-2 border-red-500 flex-shrink-0 flex items-center gap-6 bg-black rounded-lg relative pointer-events-auto transition-all " +
                    (fadeOut ? "opacity-0" : "opacity-80 hover:opacity-100")
                }
                style={fadeOut ? { transitionDuration: "1700ms" } : {}}
            >
                <span>{inText}</span>
                <div
                    className="w-5 h-5 flex-shrink-0 flex justify-center items-center cursor-pointer select-none"
                    onClick={() => {
                        closeMessage(mKey);
                    }}
                >
                    <CancelWhite />
                </div>
            </div>
        );
    };

    if (type === "notification") return notification(text);
    else if (type === "success") return success(text);
    else if (type === "error") return error(text);
    return <></>;
}
