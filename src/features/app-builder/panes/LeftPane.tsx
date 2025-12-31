"use client";

import { useState } from "react";
import { PalettePane } from "./PalettePane";
import { LayersPane } from "./LayersPane";

type LeftTab = "palette" | "layers";

export function LeftPane() {
  const [activeTab, setActiveTab] = useState<LeftTab>("palette");

  return (
    <div className="panel bevel flex flex-col" style={{ width: 160 }}>
      {/* Tab Buttons */}
      <div className="flex" style={{ borderBottom: "1px solid var(--borderDark)" }}>
        <button
          onClick={() => setActiveTab("palette")}
          className={`flex-1 btn text-xs py-2 ${activeTab === "palette" ? "bevel-inset" : "bevel"}`}
          style={{ borderRight: "1px solid var(--borderDark)" }}
        >
          PALETTE
        </button>
        <button
          onClick={() => setActiveTab("layers")}
          className={`flex-1 btn text-xs py-2 ${activeTab === "layers" ? "bevel-inset" : "bevel"}`}
        >
          LAYERS
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-2">
        {activeTab === "palette" && <PalettePane />}
        {activeTab === "layers" && <LayersPane />}
      </div>
    </div>
  );
}
