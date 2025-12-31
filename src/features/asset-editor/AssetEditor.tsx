"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAssetStore } from "@/state/assetStore";
import { useSkinStore, getSkin } from "@/state/skinStore";
import { useBitmap } from "./useBitmap";
import { CanvasView } from "./CanvasView";
import { ToolBar } from "./ToolBar";
import { Inspector } from "./Inspector";
import { TopBar } from "./TopBar";

export function AssetEditor() {
  const {
    assetName,
    canvasWidth,
    canvasHeight,
    activeTool,
    brushSize,
    currentColor,
    showGrid,
    zoom,
    transparentBackground,
    setAssetName,
    setCanvasDimensions,
    setActiveTool,
    setBrushSize,
    setCurrentColor,
    setShowGrid,
    setZoom,
    setTransparentBackground,
  } = useAssetStore();

  const { skinId, setSkinId } = useSkinStore();
  const skin = getSkin(skinId);
  const cssVars = useMemo(() => skin.vars as React.CSSProperties, [skin]);

  const {
    bitmap,
    setPixel,
    erasePixel,
    resize,
    undo,
    redo,
    canUndo,
    canRedo,
    saveSnapshot,
    getImageData,
  } = useBitmap(canvasWidth, canvasHeight);

  // Track if we need to resize bitmap when canvas dimensions change
  const prevDimensionsRef = useRef({ width: canvasWidth, height: canvasHeight });
  useEffect(() => {
    const prev = prevDimensionsRef.current;
    if (prev.width !== canvasWidth || prev.height !== canvasHeight) {
      resize(canvasWidth, canvasHeight);
      prevDimensionsRef.current = { width: canvasWidth, height: canvasHeight };
    }
  }, [canvasWidth, canvasHeight, resize]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === "p" || e.key === "P") {
        setActiveTool("pencil");
      } else if (e.key === "e" || e.key === "E") {
        setActiveTool("eraser");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveTool, undo, redo]);

  const handleStrokeStart = useCallback(() => {
    saveSnapshot();
  }, [saveSnapshot]);

  const handleStrokeEnd = useCallback(() => {
    // Stroke is already recorded via saveSnapshot on start
  }, []);

  const handleDimensionsChange = useCallback((width: number, height: number) => {
    setCanvasDimensions(width, height);
  }, [setCanvasDimensions]);

  const handleExport = useCallback(() => {
    const imageData = getImageData();

    // Create a canvas to export from
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;

    // If not transparent, fill with white first
    if (!transparentBackground) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the bitmap
    ctx.putImageData(imageData, 0, 0);

    // Export as PNG
    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${assetName || "asset"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [getImageData, bitmap.width, bitmap.height, transparentBackground, assetName]);

  const isTerminal = skinId === "terminal";

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        ...(cssVars as React.CSSProperties),
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font)",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        .ui { font-family: var(--font); letter-spacing: 0.02em; }

        .panel {
          background: var(--panel);
          border: 1px solid var(--borderDark);
        }

        .bevel {
          border-top: 2px solid var(--borderLight);
          border-left: 2px solid var(--borderLight);
          border-right: 2px solid var(--borderMid);
          border-bottom: 2px solid var(--borderMid);
          background: var(--panel);
        }

        .bevel-inset {
          border-top: 2px solid var(--borderMid);
          border-left: 2px solid var(--borderMid);
          border-right: 2px solid var(--borderLight);
          border-bottom: 2px solid var(--borderLight);
          background: var(--panel2);
        }

        .btn {
          cursor: pointer;
          user-select: none;
          text-align: center;
          font-size: 12px;
          line-height: 1;
        }
        .btn:active { transform: translate(1px, 1px); }
        .btn:disabled { cursor: not-allowed; }

        .titlebar {
          background: var(--accent);
          color: #fff;
          padding: 6px 8px;
          border-bottom: 1px solid var(--borderDark);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          text-transform: uppercase;
        }

        .win-controls { display: flex; gap: 6px; }
        .win-btn {
          width: 14px; height: 14px;
          border: 1px solid var(--borderDark);
          background: var(--panel2);
        }

        .crt { position: relative; }
        .crt::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 2px,
            rgba(0,0,0,0.28) 3px,
            rgba(0,0,0,0) 4px
          );
          opacity: 0.65;
          z-index: 100;
        }
      `}</style>

      {/* Top Bar */}
      <TopBar
        assetName={assetName}
        onAssetNameChange={setAssetName}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        onDimensionsChange={handleDimensionsChange}
        transparentBackground={transparentBackground}
        onTransparentBackgroundChange={setTransparentBackground}
        onExport={handleExport}
        skinId={skinId}
        onSkinChange={setSkinId}
      />

      {/* Main Content */}
      <div className={`flex-1 flex gap-2 p-2 ${isTerminal ? "crt" : ""}`}>
        {/* Left: Tools */}
        <ToolBar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />

        {/* Center: Canvas */}
        <div className="flex-1 panel bevel-inset overflow-hidden">
          <CanvasView
            bitmap={bitmap}
            zoom={zoom}
            showGrid={showGrid}
            transparentBackground={transparentBackground}
            activeTool={activeTool}
            brushSize={brushSize}
            currentColor={currentColor}
            onPixelDraw={setPixel}
            onPixelErase={erasePixel}
            onStrokeStart={handleStrokeStart}
            onStrokeEnd={handleStrokeEnd}
          />
        </div>

        {/* Right: Inspector */}
        <Inspector
          currentColor={currentColor}
          onColorChange={setCurrentColor}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          showGrid={showGrid}
          onShowGridChange={setShowGrid}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      </div>

      {/* Status Bar */}
      <div
        className="panel p-2 text-xs flex items-center justify-between"
        style={{ borderTop: "1px solid var(--borderDark)" }}
      >
        <div className="flex items-center gap-4">
          <span>
            SIZE: {bitmap.width}x{bitmap.height}
          </span>
          <span>
            ZOOM: {zoom}x
          </span>
          <span>
            TOOL: {activeTool.toUpperCase()}
          </span>
        </div>
        <div style={{ color: "var(--muted)" }}>
          CRIX ASSET EDITOR
        </div>
      </div>
    </div>
  );
}
