import { OPTIONS } from "../data/customizer";

export default function SneakerArt({ upperColor, sole, laces }) {
  const upper =
    OPTIONS.upper_color.find((item) => item.value === upperColor)?.swatch ||
    OPTIONS.upper_color[0].swatch;
  const lace =
    OPTIONS.laces.find((item) => item.value === laces)?.swatch ||
    OPTIONS.laces[0].swatch;
  const soleColor =
    sole === "Gum" ? "#b77f4e" : sole === "Cloud" ? "#f5f3ec" : "#e7e0d3";

  return (
    <svg
      className="sneaker-art"
      viewBox="45 103 540 230"
      role="img"
      aria-label={`${upperColor} sneaker with ${sole} sole and ${laces} laces`}
    >
      <ellipse
        cx="310"
        cy="323"
        rx="235"
        ry="17"
        fill="#645b50"
        opacity=".17"
      />
      <g strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M66 261 C155 262 229 271 307 277 C395 284 470 283 546 268 C558 267 566 274 562 286 C553 309 524 317 483 318 L164 318 C110 318 75 305 67 285 Z"
          fill={soleColor}
          stroke="#776e62"
          strokeOpacity=".28"
          strokeWidth="2"
        />
        <path
          d="M77 285 C145 295 223 297 307 301 C405 305 487 305 545 287"
          fill="none"
          stroke="#5b5147"
          strokeOpacity=".22"
          strokeWidth="3"
        />
        {sole === "Cloud" && (
          <path
            d="M92 292 Q113 303 134 292 Q155 306 177 296 Q199 308 221 300 Q245 311 267 302 Q289 313 313 304 Q336 314 359 305 Q382 313 405 303 Q431 309 454 300 Q480 304 505 294"
            fill="none"
            stroke="#a9a397"
            strokeWidth="2"
            opacity=".7"
          />
        )}
        {sole === "Gum" && (
          <path
            d="M102 301 l12 8 m20 -7 l11 9 m19 -8 l11 9 m20 -8 l11 9 m20 -8 l11 9 m20 -8 l11 9 m20 -8 l11 9 m20 -8 l11 9 m20 -8 l11 9 m20 -8 l11 9"
            stroke="#805837"
            strokeWidth="2"
            opacity=".45"
          />
        )}
        <path
          d="M72 264 C68 236 72 207 79 176 C85 153 94 138 108 129 C119 122 131 127 145 142 L183 169 C201 182 220 182 237 169 L262 146 C274 134 289 136 301 150 L337 188 C360 197 393 203 432 212 C481 222 522 237 544 261 C549 267 544 273 535 276 C430 286 324 281 237 274 C175 270 126 269 77 271 Z"
          fill={upper}
          stroke="#38332f"
          strokeOpacity=".35"
          strokeWidth="2.5"
        />
        <path
          d="M83 175 C96 161 112 161 132 178 L152 199 C148 226 151 251 163 270 L78 268 C73 241 76 202 83 175 Z"
          fill="#000"
          opacity=".1"
        />
        <path
          d="M94 167 C100 152 109 141 119 139 C134 140 149 160 170 174 C189 188 210 184 233 166 L257 151 C239 166 227 192 205 204 C170 201 147 184 126 168 C111 156 100 157 94 167 Z"
          fill="#26272a"
          stroke="#19191b"
          strokeWidth="2"
        />
        <path
          d="M123 141 C138 141 154 163 172 175 C188 186 206 186 223 176"
          fill="none"
          stroke="#e9e1d3"
          strokeOpacity=".5"
          strokeWidth="5"
        />
        <path
          d="M218 190 C229 173 248 155 264 149 C286 148 316 177 343 202 L303 237 L214 211 Z"
          fill="#fff"
          opacity=".13"
        />
        <path
          d="M432 212 C484 226 522 240 544 261 C548 266 544 272 535 276 C507 280 478 281 450 281 C451 253 444 229 432 212 Z"
          fill="#fff"
          opacity=".1"
        />
        <path
          d="M235 179 L292 221 M251 164 L311 210 M267 153 L328 198"
          stroke="#201e1e"
          strokeOpacity=".18"
          strokeWidth="10"
        />
        <path
          d="M235 179 L292 221 M251 164 L311 210 M267 153 L328 198"
          stroke={lace}
          strokeWidth="6"
        />
        <path
          d="M291 183 L243 213 M308 195 L262 225 M326 205 L282 234"
          stroke={lace}
          strokeWidth="5"
        />
        <path
          d="M177 228 C211 215 252 221 285 237 C315 235 347 223 384 219 C360 239 322 257 286 255 C249 240 211 233 177 240 Z"
          fill="#f5ecdb"
          opacity=".82"
        />
        <text
          x="391"
          y="258"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fontWeight="700"
          letterSpacing="2"
          fill="#f5ecdb"
        >
          F&amp;F
        </text>
      </g>
    </svg>
  );
}
