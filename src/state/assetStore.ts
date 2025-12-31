import { create } from "zustand";

export type ToolType = "pencil" | "eraser";
export type BrushSize = 1 | 2 | 4 | 8;

// Common presets for quick selection
export const DIMENSION_PRESETS = [16, 32, 64, 128, 256, 512] as const;

interface AssetState {
  // Asset metadata
  assetName: string;
  canvasWidth: number;
  canvasHeight: number;

  // Tool state
  activeTool: ToolType;
  brushSize: BrushSize;
  currentColor: string;

  // View options
  showGrid: boolean;
  zoom: number;
  transparentBackground: boolean;

  // Actions
  setAssetName: (name: string) => void;
  setCanvasWidth: (width: number) => void;
  setCanvasHeight: (height: number) => void;
  setCanvasDimensions: (width: number, height: number) => void;
  setActiveTool: (tool: ToolType) => void;
  setBrushSize: (size: BrushSize) => void;
  setCurrentColor: (color: string) => void;
  setShowGrid: (show: boolean) => void;
  setZoom: (zoom: number) => void;
  setTransparentBackground: (transparent: boolean) => void;
}

// Clamp dimensions to reasonable bounds
function clampDimension(value: number): number {
  return Math.max(1, Math.min(1024, Math.floor(value)));
}

export const useAssetStore = create<AssetState>((set) => ({
  assetName: "untitled",
  canvasWidth: 128,
  canvasHeight: 128,
  activeTool: "pencil",
  brushSize: 1,
  currentColor: "#000000",
  showGrid: true,
  zoom: 4,
  transparentBackground: true,

  setAssetName: (name) => set({ assetName: name }),
  setCanvasWidth: (width) => set({ canvasWidth: clampDimension(width) }),
  setCanvasHeight: (height) => set({ canvasHeight: clampDimension(height) }),
  setCanvasDimensions: (width, height) => set({
    canvasWidth: clampDimension(width),
    canvasHeight: clampDimension(height)
  }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setBrushSize: (size) => set({ brushSize: size }),
  setCurrentColor: (color) => set({ currentColor: color }),
  setShowGrid: (show) => set({ showGrid: show }),
  setZoom: (zoom) => set({ zoom }),
  setTransparentBackground: (transparent) => set({ transparentBackground: transparent }),
}));

// Color palette presets
export const COLOR_PALETTE = [
  "#000000", "#ffffff", "#ff0000", "#00ff00",
  "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
  "#808080", "#c0c0c0", "#800000", "#008000",
  "#000080", "#808000", "#800080", "#008080",
];
