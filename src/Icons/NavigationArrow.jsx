import React from "react";

function NavigationArrow({ size, color, hoveredColor, animation, hovered }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 172 172">
            <g fill="none" strokeMiterlimit="10" fontFamily="none" fontSize="none" fontWeight="none" textAnchor="none" style={{ mixBlendMode: "normal" }}>
                <path d="M0 172V0h172v172z"></path>
                <path
                    className={animation}
                    fill={hovered ? hoveredColor : color}
                    d="M51.488 17.144a5.734 5.734 0 00-3.942 1.736l-22.43 22.43a5.734 5.734 0 00-.021 9.103c.01.008.022.015.033.022l22.418 22.419a5.734 5.734 0 108.108-8.108L42.507 51.6h54.96c22.23 0 40.133 17.902 40.133 40.133s-17.902 40.134-40.133 40.134h-68.8a5.734 5.734 0 100 11.466h68.8c28.428 0 51.6-23.17 51.6-51.6 0-28.428-23.172-51.6-51.6-51.6h-54.96l13.147-13.146a5.734 5.734 0 00-4.166-9.843z"
                ></path>
            </g>
        </svg>
    );
}

export default NavigationArrow;
