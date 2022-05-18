import * as React from "react"

const MenuIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={96}
    height={96}
    viewBox="0 0 171 171"
    style={{
      fill: "#fff",
      pointerEvents: 'none',
    }}
    {...props}
  >
    <g
      fill="none"
      strokeMiterlimit={10}
      fontFamily="none"
      fontWeight="none"
      fontSize="none"
      textAnchor="none"
      style={{
        mixBlendMode: "normal",
      }}
    >
      <path d="M0 171.998V0h171.998v171.998z" />
      <path
        d="M14.25 35.625v14.25h142.5v-14.25zm0 42.75v14.25h142.5v-14.25zm0 42.75v14.25h142.5v-14.25z"
        fill="#fff"
      />
    </g>
  </svg>
)

export default MenuIcon;