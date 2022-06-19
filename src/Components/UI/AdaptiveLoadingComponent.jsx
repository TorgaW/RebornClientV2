import React from "react";

export default function AdaptiveLoadingComponent({ rounded, top }) {
    return !top ? (
        <div className={"w-full h-full flex justify-center items-center bg-dark-purple-500 bg-opacity-100 z-10 " + rounded}>
            <div className="lds-dual-ring"></div>
        </div>
    ) : (
        <div className={"w-full h-full flex justify-center items-start bg-dark-purple-500 bg-opacity-100 z-10 " + rounded}>
            <div className="lds-dual-ring mt-10"></div>
        </div>
    );
}
