import { useCallback, useRef, useState } from "react";
import { UndoStack } from "./undoStack";
import type { BrushSize } from "@/state/assetStore";

export interface BitmapState {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export interface UseBitmapResult {
  bitmap: BitmapState;
  setPixel: (x: number, y: number, color: string, brushSize: BrushSize) => void;
  erasePixel: (x: number, y: number, brushSize: BrushSize) => void;
  clear: () => void;
  resize: (newWidth: number, newHeight: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveSnapshot: () => void;
  getImageData: () => ImageData;
}

function createEmptyBitmap(width: number, height: number): BitmapState {
  return {
    data: new Uint8ClampedArray(width * height * 4),
    width,
    height,
  };
}

function hexToRgba(hex: string): [number, number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255,
    ];
  }
  return [0, 0, 0, 255];
}

export function useBitmap(initialWidth: number, initialHeight: number): UseBitmapResult {
  const [bitmap, setBitmap] = useState<BitmapState>(() =>
    createEmptyBitmap(initialWidth, initialHeight)
  );
  const undoStackRef = useRef(new UndoStack());
  const [, forceUpdate] = useState({});

  const setPixel = useCallback(
    (x: number, y: number, color: string, brushSize: BrushSize) => {
      setBitmap((prev) => {
        const newData = new Uint8ClampedArray(prev.data);
        const [r, g, b, a] = hexToRgba(color);

        // Apply brush (square pattern)
        const halfBrush = Math.floor(brushSize / 2);
        for (let dy = 0; dy < brushSize; dy++) {
          for (let dx = 0; dx < brushSize; dx++) {
            const px = x - halfBrush + dx;
            const py = y - halfBrush + dy;

            if (px >= 0 && px < prev.width && py >= 0 && py < prev.height) {
              const idx = (py * prev.width + px) * 4;
              newData[idx] = r;
              newData[idx + 1] = g;
              newData[idx + 2] = b;
              newData[idx + 3] = a;
            }
          }
        }

        return { ...prev, data: newData };
      });
    },
    []
  );

  const erasePixel = useCallback(
    (x: number, y: number, brushSize: BrushSize) => {
      setBitmap((prev) => {
        const newData = new Uint8ClampedArray(prev.data);

        const halfBrush = Math.floor(brushSize / 2);
        for (let dy = 0; dy < brushSize; dy++) {
          for (let dx = 0; dx < brushSize; dx++) {
            const px = x - halfBrush + dx;
            const py = y - halfBrush + dy;

            if (px >= 0 && px < prev.width && py >= 0 && py < prev.height) {
              const idx = (py * prev.width + px) * 4;
              newData[idx] = 0;
              newData[idx + 1] = 0;
              newData[idx + 2] = 0;
              newData[idx + 3] = 0;
            }
          }
        }

        return { ...prev, data: newData };
      });
    },
    []
  );

  const clear = useCallback(() => {
    setBitmap((prev) => ({
      ...prev,
      data: new Uint8ClampedArray(prev.width * prev.height * 4),
    }));
  }, []);

  const resize = useCallback((newWidth: number, newHeight: number) => {
    undoStackRef.current.clear();
    setBitmap(createEmptyBitmap(newWidth, newHeight));
  }, []);

  const saveSnapshot = useCallback(() => {
    undoStackRef.current.push(bitmap.data);
    forceUpdate({});
  }, [bitmap.data]);

  const undo = useCallback(() => {
    const previous = undoStackRef.current.undo(bitmap.data);
    if (previous) {
      setBitmap((prev) => ({ ...prev, data: previous }));
    }
    forceUpdate({});
  }, [bitmap.data]);

  const redo = useCallback(() => {
    const next = undoStackRef.current.redo(bitmap.data);
    if (next) {
      setBitmap((prev) => ({ ...prev, data: next }));
    }
    forceUpdate({});
  }, [bitmap.data]);

  const getImageData = useCallback((): ImageData => {
    return new ImageData(
      new Uint8ClampedArray(bitmap.data),
      bitmap.width,
      bitmap.height
    );
  }, [bitmap]);

  return {
    bitmap,
    setPixel,
    erasePixel,
    clear,
    resize,
    undo,
    redo,
    canUndo: undoStackRef.current.canUndo(),
    canRedo: undoStackRef.current.canRedo(),
    saveSnapshot,
    getImageData,
  };
}
