/**
 * Opening splash: the name is traced in outline, filled, then the whole panel melts
 * downwards through an SVG turbulence displacement to uncover the page.
 * Pure SVG + CSS (the displacement is SMIL), so it runs before hydration and needs no JS.
 */
export function Splash({ text }: { text: string }) {
  return (
    <div aria-hidden className="splash pointer-events-none fixed inset-0 z-50">
      <svg width="100%" height="100%" className="block">
        <defs>
          <filter
            id="splash-melt"
            x="-10%"
            y="-60%"
            width="120%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            {/* Noise that varies across x but barely along y: every column drips by a different amount. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.0007"
              numOctaves="2"
              seed="11"
              result="noise"
            />
            {/* Neutral red channel so nothing moves sideways; green carries the vertical drip. */}
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.5  1 0 0 0 0  0 0 0 0 0  0 0 0 0 1"
              result="drip"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="drip"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                values="0;1100"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.55 0 0.8 0.45"
                begin="1.75s"
                dur="1s"
                fill="freeze"
              />
            </feDisplacementMap>
          </filter>
        </defs>
        <g filter="url(#splash-melt)">
          <g className="splash-fall">
            <rect width="100%" height="100%" className="fill-accent" />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              className="splash-name fill-on-accent"
            >
              {text}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
