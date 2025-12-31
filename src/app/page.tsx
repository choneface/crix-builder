"use client";

import { useState, useMemo } from "react";
import { useSkinStore, getSkin, SKINS, type SkinId } from "@/state/skinStore";
import { AssetEditor } from "@/features/asset-editor";

type TabId = "asset-editor" | "app-builder" | "scripting";

const TABS: { id: TabId; label: string }[] = [
  { id: "asset-editor", label: "ASSET EDITOR" },
  { id: "app-builder", label: "APP BUILDER" },
  { id: "scripting", label: "SCRIPTING" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("asset-editor");
  const { skinId, setSkinId } = useSkinStore();
  const skin = getSkin(skinId);
  const cssVars = useMemo(() => skin.vars as React.CSSProperties, [skin]);

  const isTerminal = skinId === "terminal";
  const isNeo = skinId === "neocities";

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

        .tab {
          padding: 8px 16px;
          cursor: pointer;
          user-select: none;
          font-size: 12px;
          text-transform: uppercase;
          border-top: 2px solid var(--borderLight);
          border-left: 2px solid var(--borderLight);
          border-right: 2px solid var(--borderMid);
          border-bottom: none;
          background: var(--panel);
          margin-right: 2px;
          position: relative;
          top: 1px;
        }
        .tab:hover {
          background: var(--panel2);
        }
        .tab.active {
          background: var(--panel);
          border-bottom: 2px solid var(--panel);
          z-index: 1;
        }
        .tab.inactive {
          background: var(--borderMid);
          border-top: 2px solid var(--borderMid);
          border-left: 2px solid var(--borderMid);
          opacity: 0.8;
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

      {/* Title Bar */}
      <div className="titlebar" style={{ color: isNeo ? "#000" : "#fff" }}>
        <div>CRIX BUILDER</div>
        <div className="flex items-center gap-4">
          <select
            value={skinId}
            onChange={(e) => setSkinId(e.target.value as SkinId)}
            className="bevel btn"
            style={{
              padding: "4px 8px",
              background: "var(--panel)",
              color: "var(--text)",
              outline: "none",
              border: "none",
              fontSize: 10,
            }}
          >
            {Object.values(SKINS).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="win-controls">
            <div className="win-btn" />
            <div className="win-btn" />
            <div className="win-btn" />
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        className="panel flex items-end px-2 pt-2"
        style={{ borderBottom: "1px solid var(--borderDark)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "active" : "inactive"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`flex-1 flex flex-col ${isTerminal ? "crt" : ""}`}>
        {activeTab === "asset-editor" && <AssetEditorTab />}
        {activeTab === "app-builder" && <ComingSoonTab title="APP BUILDER" />}
        {activeTab === "scripting" && <ComingSoonTab title="SCRIPTING" />}
      </div>
    </div>
  );
}

function AssetEditorTab() {
  return <AssetEditor />;
}

function ComingSoonTab({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="panel bevel p-8 text-center">
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, color: "var(--muted)" }}>
          Coming soon!
        </div>
      </div>
    </div>
  );
}
