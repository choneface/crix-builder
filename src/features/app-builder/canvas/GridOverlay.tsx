"use client";

interface GridOverlayProps {
  width: number;
  height: number;
  gridSize: number;
}

export function GridOverlay({ width, height, gridSize }: GridOverlayProps) {
  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 0.3,
      }}
    >
      <defs>
        <pattern
          id={`grid-${gridSize}`}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="#888"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${gridSize})`} />
    </svg>
  );
}
