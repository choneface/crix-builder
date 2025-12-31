"use client";

import { COLOR_PALETTE, type BrushSize } from "@/state/assetStore";

interface InspectorProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  brushSize: BrushSize;
  onBrushSizeChange: (size: BrushSize) => void;
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const BRUSH_SIZES: BrushSize[] = [1, 2, 4, 8];
const ZOOM_LEVELS = [1, 2, 4, 8, 16];

export function Inspector({
  currentColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  showGrid,
  onShowGridChange,
  zoom,
  onZoomChange,
}: InspectorProps) {
  return (
    <div className="panel flex flex-col gap-2 w-48">
      <div className="titlebar text-xs" style={{ padding: "4px 6px" }}>
        INSPECTOR
      </div>

      <div className="p-2 flex flex-col gap-3">
        {/* Current Color */}
        <div>
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            COLOR
          </div>
          <div className="flex items-center gap-2">
            <div
              className="bevel-inset"
              style={{
                width: 32,
                height: 32,
                backgroundColor: currentColor,
              }}
            />
            <input
              type="text"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="bevel-inset px-2 py-1 text-xs flex-1"
              style={{
                background: "var(--panel2)",
                color: "var(--text)",
                border: "none",
                fontFamily: "var(--font)",
              }}
            />
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            PALETTE
          </div>
          <div className="bevel-inset p-1 grid grid-cols-4 gap-1">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className="w-6 h-6"
                style={{
                  backgroundColor: color,
                  border: currentColor === color
                    ? "2px solid var(--accent)"
                    : "1px solid var(--borderDark)",
                  cursor: "pointer",
                  outline: currentColor === color ? "1px solid var(--borderLight)" : "none",
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div>
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            BRUSH SIZE
          </div>
          <div className="flex gap-1">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => onBrushSizeChange(size)}
                className={`bevel btn flex-1 text-xs ${
                  brushSize === size ? "bevel-inset" : ""
                }`}
                style={{ padding: "6px 4px" }}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        {/* Grid Toggle */}
        <div>
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            GRID
          </div>
          <button
            onClick={() => onShowGridChange(!showGrid)}
            className={`bevel btn w-full text-xs ${showGrid ? "bevel-inset" : ""}`}
            style={{ padding: "6px 8px" }}
          >
            {showGrid ? "GRID ON" : "GRID OFF"}
          </button>
        </div>

        {/* Zoom Level */}
        <div>
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
            ZOOM
          </div>
          <div className="flex gap-1">
            {ZOOM_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => onZoomChange(level)}
                className={`bevel btn flex-1 text-xs ${
                  zoom === level ? "bevel-inset" : ""
                }`}
                style={{ padding: "6px 2px" }}
              >
                {level}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
