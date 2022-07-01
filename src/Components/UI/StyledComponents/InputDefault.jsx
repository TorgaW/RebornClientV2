import React from "react";

export default function InputDefault({ id, type, customStyle, additionalStyle, changed, keyDown }) {
    if (customStyle && typeof customStyle === "string") {
        return (
            <input
                id={id ?? ""}
                type={type ?? ""}
                onChange={() => {
                    if (typeof changed === "function") changed();
                }}
                onKeyDown={(e) => {
                    if (typeof keyDown === "function") keyDown(e);
                }}
                className={customStyle}
            />
        );
    }
    return (
        <input
            id={id ?? ""}
            type={type ?? ""}
            onChange={() => {
                if (typeof changed === "function") changed();
            }}
            onKeyDown={(e) => {
                if (typeof keyDown === "function") keyDown(e);
            }}
            className={"w-full h-10 rounded-md ring-2 ring-teal-800 focus:ring-teal-400 focus:outline-none bg-dark-purple-500 p-2 " + (additionalStyle ?? "")}
        />
    );
}
