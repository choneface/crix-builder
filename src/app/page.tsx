"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSkinStore, getSkin, SKINS, type SkinId } from "@/state/skinStore";

export default function Home() {
  const { skinId, setSkinId } = useSkinStore();
  const skin = getSkin(skinId);
  const cssVars = useMemo(() => skin.vars as React.CSSProperties, [skin]);

  const isTerminal = skinId === "terminal";
  const isNeo = skinId === "neocities";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        ...(cssVars as React.CSSProperties),
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font)",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        a { color: var(--accent); text-decoration: underline; }
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
          padding: 10px 12px;
          text-align: center;
          font-size: 14px;
          line-height: 1;
          text-decoration: none;
          display: inline-block;
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
          font-size: 14px;
          text-transform: uppercase;
        }

        .win-controls { display: flex; gap: 6px; }
        .win-btn {
          width: 18px; height: 18px;
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
        }
      `}</style>

      <div className={`panel ui w-full max-w-xl ${isTerminal ? "crt" : ""}`}>
        <div className="titlebar" style={{ color: isNeo ? "#000" : "#fff" }}>
          <div>CRIX BUILDER</div>
          <div className="win-controls">
            <div className="win-btn" />
            <div className="win-btn" />
            <div className="win-btn" />
          </div>
        </div>

        <div className="p-4">
          <div className="bevel-inset p-4">
            <div style={{ fontSize: 22, fontWeight: 900 }}>CRIX BUILDER</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
              ASSET CREATION TOOL FOR CRIX APPS
            </div>

            <div className="mt-4" style={{ fontSize: 13, lineHeight: 1.4 }}>
              Build pixel-perfect assets for your Crix applications.
              <br />
              No fluff. No gradients. Just pixels.
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Link
                href="/assets"
                className="bevel btn"
                style={{
                  background: "var(--accent2)",
                  color: isTerminal ? "#000" : "#fff",
                  textDecoration: "none",
                }}
              >
                OPEN ASSET EDITOR
              </Link>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="bevel-inset px-3 py-2" style={{ fontSize: 12 }}>
              SKIN
            </div>
            <select
              value={skinId}
              onChange={(e) => setSkinId(e.target.value as SkinId)}
              className="bevel btn flex-1"
              style={{
                padding: "10px 12px",
                background: "var(--panel)",
                color: "var(--text)",
                outline: "none",
                border: "none",
              }}
            >
              {Object.values(SKINS).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-center" style={{ fontSize: 12, color: "var(--muted)" }}>
            CRIX BUILDER v0
          </div>
        </div>
      </div>
    </div>
  );
}
