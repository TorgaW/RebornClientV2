import React from "react";

export default function ButtonRed({ text, click, customStyle, additionalStyle }) {
    if(customStyle && typeof customStyle === 'string'){
        return (
            <button
                onClick={() => {
                    if (typeof click === "function") click();
                }}
                className={customStyle}
            >
                {text}
            </button>
        );
    }
    return (
        <button
            onClick={() => {
                if (typeof click === "function") click();
            }}
            className={"p-2 bg-red-900 bg-opacity-70 hover:bg-opacity-100 animated-100 rounded-md font-semibold text-white " + (additionalStyle ?? "")}
        >
            {text}
        </button>
    );
}
