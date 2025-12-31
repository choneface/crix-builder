"use client";

import { useState } from "react";

export interface ExportMetadata {
  appName: string;
  version: string;
  author: string;
  skinName: string;
  fontPath: string;
  fontSize: number;
}

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (metadata: ExportMetadata) => void;
  defaultAppName: string;
}

export function ExportDialog({
  isOpen,
  onClose,
  onExport,
  defaultAppName,
}: ExportDialogProps) {
  const [appName, setAppName] = useState(defaultAppName);
  const [version, setVersion] = useState("1.0.0");
  const [author, setAuthor] = useState("");
  const [skinName, setSkinName] = useState(defaultAppName);
  const [fontSize, setFontSize] = useState(16);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      appName,
      version,
      author,
      skinName,
      fontPath: "skin/font.ttf",
      fontSize,
    });
  };

  const isValid = appName.trim() && version.trim() && author.trim() && skinName.trim();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="panel bevel"
        style={{ width: 400, maxWidth: "90vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div
          className="titlebar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>EXPORT APP BUNDLE</span>
          <button
            onClick={onClose}
            className="bevel btn"
            style={{
              width: 20,
              height: 20,
              padding: 0,
              fontSize: 12,
              lineHeight: "18px",
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            Enter the metadata for your app bundle.
          </div>

          {/* App Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "var(--muted)" }}>
              APP NAME *
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="bevel-inset px-2 py-1 text-xs"
              style={{
                background: "var(--panel2)",
                color: "var(--text)",
                border: "none",
                fontFamily: "var(--font)",
              }}
              placeholder="My App"
            />
          </div>

          {/* Version */}
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "var(--muted)" }}>
              VERSION *
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="bevel-inset px-2 py-1 text-xs"
              style={{
                background: "var(--panel2)",
                color: "var(--text)",
                border: "none",
                fontFamily: "var(--font)",
              }}
              placeholder="1.0.0"
            />
          </div>

          {/* Author */}
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "var(--muted)" }}>
              AUTHOR *
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bevel-inset px-2 py-1 text-xs"
              style={{
                background: "var(--panel2)",
                color: "var(--text)",
                border: "none",
                fontFamily: "var(--font)",
              }}
              placeholder="Your Name"
            />
          </div>

          {/* Skin Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "var(--muted)" }}>
              SKIN NAME *
            </label>
            <input
              type="text"
              value={skinName}
              onChange={(e) => setSkinName(e.target.value)}
              className="bevel-inset px-2 py-1 text-xs"
              style={{
                background: "var(--panel2)",
                color: "var(--text)",
                border: "none",
                fontFamily: "var(--font)",
              }}
              placeholder="My App Skin"
            />
          </div>

          {/* Font Size */}
          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "var(--muted)" }}>
              DEFAULT FONT SIZE
            </label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10) || 16)}
              className="bevel-inset px-2 py-1 text-xs"
              style={{
                width: 80,
                background: "var(--panel2)",
                color: "var(--text)",
                border: "none",
                fontFamily: "var(--font)",
              }}
              min={8}
              max={72}
            />
          </div>

          {/* Info */}
          <div
            className="bevel-inset p-2 text-xs"
            style={{ color: "var(--muted)", background: "var(--panel2)" }}
          >
            The bundle will be exported as a .zip file. Extract it to get the
            .crix directory structure.
            <br />
            <br />
            Note: You will need to provide your own font.ttf file in the
            skin/ folder.
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={onClose}
              className="bevel btn text-xs"
              style={{ padding: "6px 12px" }}
            >
              CANCEL
            </button>
            <button
              onClick={handleExport}
              disabled={!isValid}
              className="bevel btn text-xs"
              style={{
                padding: "6px 12px",
                background: isValid ? "var(--accent2)" : "var(--borderMid)",
                color: isValid ? "#fff" : "var(--muted)",
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              EXPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
