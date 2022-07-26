import React from "react";
import { useState } from "react";

export default function IconComponent({ Icon, size, color, hoveredColor, animation, buttonStyle }) {
    const [hovered, setHovered] = useState(false);

    return (
        <button onMouseOut={()=>{
            setHovered(false);
        }} onMouseOver={() => {
            setHovered(true);
        }} className={" " + buttonStyle}>
            <Icon size={size} hovered={hovered} hoveredColor={hoveredColor} color={color} animation={animation}/>
        </button>
    );
}
