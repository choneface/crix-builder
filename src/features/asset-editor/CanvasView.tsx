"use client";

import { useRef, useEffect, useCallback } from "react";
import type { BitmapState } from "./useBitmap";
import type { ToolType, BrushSize } from "@/state/assetStore";

interface CanvasViewProps {
  bitmap: BitmapState;
  zoom: number;
  showGrid: boolean;
  transparentBackground: boolean;
  activeTool: ToolType;
  brushSize: BrushSize;
  currentColor: string;
  onPixelDraw: (x: number, y: number, color: string, brushSize: BrushSize) => void;
  onPixelErase: (x: number, y: number, brushSize: BrushSize) => void;
  onStrokeStart: () => void;
  onStrokeEnd: () => void;
}

export function CanvasView({
  bitmap,
  zoom,
  showGrid,
  transparentBackground,
  activeTool,
  brushSize,
  currentColor,
  onPixelDraw,
  onPixelErase,
  onStrokeStart,
  onStrokeEnd,
}: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Render bitmap to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Disable image smoothing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;

    const displayWidth = bitmap.width * zoom;
    const displayHeight = bitmap.height * zoom;

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Draw background
    if (transparentBackground) {
      // Checkerboard pattern for transparency
      const checkSize = Math.max(4, zoom);
      for (let y = 0; y < displayHeight; y += checkSize) {
        for (let x = 0; x < displayWidth; x += checkSize) {
          const isLight = ((x / checkSize) + (y / checkSize)) % 2 === 0;
          ctx.fillStyle = isLight ? "#ffffff" : "#cccccc";
          ctx.fillRect(x, y, checkSize, checkSize);
        }
      }
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, displayWidth, displayHeight);
    }

    // Draw bitmap pixels
    const imageData = new ImageData(
      new Uint8ClampedArray(bitmap.data),
      bitmap.width,
      bitmap.height
    );

    // Create a temporary canvas for the bitmap
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = bitmap.width;
    tempCanvas.height = bitmap.height;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.putImageData(imageData, 0, 0);

    // Scale up to display size with nearest-neighbor interpolation
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, displayWidth, displayHeight);

    // Draw grid
    if (showGrid && zoom >= 2) {
      ctx.strokeStyle = "rgba(128, 128, 128, 0.3)";
      ctx.lineWidth = 1;

      for (let x = 0; x <= bitmap.width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * zoom + 0.5, 0);
        ctx.lineTo(x * zoom + 0.5, displayHeight);
        ctx.stroke();
      }

      for (let y = 0; y <= bitmap.height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * zoom + 0.5);
        ctx.lineTo(displayWidth, y * zoom + 0.5);
        ctx.stroke();
      }
    }
  }, [bitmap, zoom, showGrid, transparentBackground]);

  const getPixelCoords = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / zoom);
      const y = Math.floor((e.clientY - rect.top) / zoom);

      if (x >= 0 && x < bitmap.width && y >= 0 && y < bitmap.height) {
        return { x, y };
      }
      return null;
    },
    [zoom, bitmap.width, bitmap.height]
  );

  // Bresenham's line algorithm for smooth drawing
  const drawLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      while (true) {
        if (activeTool === "pencil") {
          onPixelDraw(x0, y0, currentColor, brushSize);
        } else {
          onPixelErase(x0, y0, brushSize);
        }

        if (x0 === x1 && y0 === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
      }
    },
    [activeTool, currentColor, brushSize, onPixelDraw, onPixelErase]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const coords = getPixelCoords(e);
      if (!coords) return;

      isDrawingRef.current = true;
      lastPosRef.current = coords;
      onStrokeStart();

      // Apply tool at initial position
      if (activeTool === "pencil") {
        onPixelDraw(coords.x, coords.y, currentColor, brushSize);
      } else {
        onPixelErase(coords.x, coords.y, brushSize);
      }

      // Capture pointer for tracking outside canvas
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    },
    [getPixelCoords, activeTool, currentColor, brushSize, onPixelDraw, onPixelErase, onStrokeStart]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;

      const coords = getPixelCoords(e);
      if (!coords) return;

      const last = lastPosRef.current;
      if (last && (last.x !== coords.x || last.y !== coords.y)) {
        drawLine(last.x, last.y, coords.x, coords.y);
        lastPosRef.current = coords;
      }
    },
    [getPixelCoords, drawLine]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        lastPosRef.current = null;
        onStrokeEnd();
        (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
      }
    },
    [onStrokeEnd]
  );

  return (
    <div className="flex items-center justify-center p-4 overflow-auto h-full">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair"
        style={{
          imageRendering: "pixelated",
          border: "1px solid var(--borderDark)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  );
}
