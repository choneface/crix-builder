import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SkinId = "paint" | "terminal" | "dark" | "neocities";

export type Skin = {
  id: SkinId;
  name: string;
  vars: Record<string, string>;
};

export const SKINS: Record<SkinId, Skin> = {
  paint: {
    id: "paint",
    name: "Classic Paint",
    vars: {
      "--bg": "#c0c0c0",
      "--panel": "#d4d4d4",
      "--panel2": "#e8e8e8",
      "--text": "#000000",
      "--muted": "#222222",
      "--borderDark": "#000000",
      "--borderMid": "#808080",
      "--borderLight": "#ffffff",
      "--accent": "#0000ff",
      "--accent2": "#008000",
      "--accent3": "#ff0000",
      "--shadow": "#808080",
      "--font": `ui-monospace, "Minecraftia", "Press Start 2P", "VT323", "MS Sans Serif", "Tahoma", monospace`,
    },
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    vars: {
      "--bg": "#000000",
      "--panel": "#0b0b0b",
      "--panel2": "#111111",
      "--text": "#00ff66",
      "--muted": "#00cc55",
      "--borderDark": "#00ff66",
      "--borderMid": "#007733",
      "--borderLight": "#55ff99",
      "--accent": "#00ff66",
      "--accent2": "#00ff66",
      "--accent3": "#00ff66",
      "--shadow": "#003311",
      "--font": `ui-monospace, "Minecraftia", "Press Start 2P", "VT323", "MS Sans Serif", monospace`,
    },
  },
  dark: {
    id: "dark",
    name: "Dark",
    vars: {
      "--bg": "#1b1b1b",
      "--panel": "#2a2a2a",
      "--panel2": "#333333",
      "--text": "#ffffff",
      "--muted": "#cccccc",
      "--borderDark": "#000000",
      "--borderMid": "#6b6b6b",
      "--borderLight": "#ffffff",
      "--accent": "#7aa2ff",
      "--accent2": "#6bff95",
      "--accent3": "#ff6b6b",
      "--shadow": "#000000",
      "--font": `ui-monospace, "Minecraftia", "Press Start 2P", "VT323", "MS Sans Serif", "Tahoma", monospace`,
    },
  },
  neocities: {
    id: "neocities",
    name: "Neocities",
    vars: {
      "--bg": "#000000",
      "--panel": "#0d0d0d",
      "--panel2": "#151515",
      "--text": "#ffffff",
      "--muted": "#c7c7c7",
      "--borderDark": "#00ffff",
      "--borderMid": "#ff00ff",
      "--borderLight": "#ffff00",
      "--accent": "#00ffff",
      "--accent2": "#ff00ff",
      "--accent3": "#ffff00",
      "--shadow": "#000000",
      "--font": `ui-monospace, "Minecraftia", "Press Start 2P", "VT323", "MS Sans Serif", "Tahoma", monospace`,
    },
  },
};

interface SkinState {
  skinId: SkinId;
  setSkinId: (id: SkinId) => void;
}

export const useSkinStore = create<SkinState>()(
  persist(
    (set) => ({
      skinId: "paint",
      setSkinId: (id) => set({ skinId: id }),
    }),
    {
      name: "crix-skin",
    }
  )
);

export function getSkin(skinId: SkinId): Skin {
  return SKINS[skinId];
}
