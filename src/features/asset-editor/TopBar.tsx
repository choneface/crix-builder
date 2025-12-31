"use client";

import { useState } from "react";
import { DIMENSION_PRESETS } from "@/state/assetStore";
import type { SkinId } from "@/state/skinStore";

interface TopBarProps {
  assetName: string;
  onAssetNameChange: (name: string) => void;
  canvasWidth: number;
  canvasHeight: number;
  onDimensionsChange: (width: number, height: number) => void;
  transparentBackground: boolean;
  onTransparentBackgroundChange: (transparent: boolean) => void;
  onExport: () => void;
  skinId: SkinId;
}

export function TopBar({
  assetName,
  onAssetNameChange,
  canvasWidth,
  canvasHeight,
  onDimensionsChange,
  transparentBackground,
  onTransparentBackgroundChange,
  onExport,
  skinId,
}: TopBarProps) {
  const [widthInput, setWidthInput] = useState(String(canvasWidth));
  const [heightInput, setHeightInput] = useState(String(canvasHeight));

  const handleWidthBlur = () => {
    const w = parseInt(widthInput, 10);
    if (!isNaN(w) && w > 0) {
      onDimensionsChange(w, canvasHeight);
    } else {
      setWidthInput(String(canvasWidth));
    }
  };

  const handleHeightBlur = () => {
    const h = parseInt(heightInput, 10);
    if (!isNaN(h) && h > 0) {
      onDimensionsChange(canvasWidth, h);
    } else {
      setHeightInput(String(canvasHeight));
    }
  };

  const handlePresetClick = (preset: number) => {
    setWidthInput(String(preset));
    setHeightInput(String(preset));
    onDimensionsChange(preset, preset);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: "width" | "height") => {
    if (e.key === "Enter") {
      if (type === "width") handleWidthBlur();
      else handleHeightBlur();
    }
  };

  return (
    <div
      className="panel p-2 flex flex-wrap items-center gap-3"
      style={{ borderBottom: "1px solid var(--borderDark)" }}
    >
      {/* Asset Name */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          NAME
        </span>
        <input
          type="text"
          value={assetName}
          onChange={(e) => onAssetNameChange(e.target.value)}
          className="bevel-inset px-2 py-1 text-xs"
          style={{
            width: 100,
            background: "var(--panel2)",
            color: "var(--text)",
            border: "none",
            fontFamily: "var(--font)",
          }}
        />
      </div>

      {/* Canvas Dimensions */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          SIZE
        </span>
        <input
          type="text"
          value={widthInput}
          onChange={(e) => setWidthInput(e.target.value)}
          onBlur={handleWidthBlur}
          onKeyDown={(e) => handleKeyDown(e, "width")}
          className="bevel-inset px-2 py-1 text-xs text-center"
          style={{
            width: 50,
            background: "var(--panel2)",
            color: "var(--text)",
            border: "none",
            fontFamily: "var(--font)",
          }}
        />
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          x
        </span>
        <input
          type="text"
          value={heightInput}
          onChange={(e) => setHeightInput(e.target.value)}
          onBlur={handleHeightBlur}
          onKeyDown={(e) => handleKeyDown(e, "height")}
          className="bevel-inset px-2 py-1 text-xs text-center"
          style={{
            width: 50,
            background: "var(--panel2)",
            color: "var(--text)",
            border: "none",
            fontFamily: "var(--font)",
          }}
        />
      </div>

      {/* Presets */}
      <div className="flex items-center gap-1">
        {DIMENSION_PRESETS.slice(0, 4).map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className="bevel btn text-xs"
            style={{ padding: "4px 6px" }}
            title={`${preset}x${preset}`}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Background Toggle */}
      <button
        onClick={() => onTransparentBackgroundChange(!transparentBackground)}
        className={`bevel btn text-xs ${transparentBackground ? "" : "bevel-inset"}`}
        style={{ padding: "6px 8px" }}
      >
        {transparentBackground ? "TRANSPARENT" : "SOLID BG"}
      </button>

      {/* Export Button */}
      <button
        onClick={onExport}
        className="bevel btn text-xs"
        style={{
          padding: "6px 12px",
          background: "var(--accent2)",
          color: skinId === "terminal" ? "#000" : "#fff",
        }}
      >
        EXPORT PNG
      </button>
    </div>
  );
}
