"use client";

import { useRef, useState } from "react";
import { useBuilderStore } from "../state/builderStore";
import { exportBundle } from "../io/exportBundle";
import { ExportDialog, type ExportMetadata } from "./ExportDialog";

const GRID_SIZES = [8, 16, 32];

export function TopBar() {
  const {
    projectName,
    setProjectName,
    background,
    setBackground,
    setBackgroundImage,
    canvasWidth,
    canvasHeight,
    grid,
    setGridEnabled,
    setGridSize,
    getProject,
  } = useBuilderStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bgColor, setBgColor] = useState(
    background.type === "color" ? background.value : "#ffffff"
  );
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleBgColorChange = (value: string) => {
    setBgColor(value);
    setBackground({ type: "color", value });
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read the file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Create an image to get dimensions
      const img = new Image();
      img.onload = () => {
        setBackgroundImage(dataUrl, img.width, img.height);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleClearImage = () => {
    setBackground({ type: "color", value: bgColor });
  };

  const handleExport = async (metadata: ExportMetadata) => {
    setShowExportDialog(false);
    const project = getProject();
    await exportBundle(project, metadata);
  };

  const hasBackgroundImage = background.type === "image" && background.value;

  return (
    <>
      <div
        className="panel p-2 flex flex-wrap items-center gap-3"
        style={{ borderBottom: "1px solid var(--borderDark)" }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Project Name */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            PROJECT
          </span>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bevel-inset px-2 py-1 text-xs"
            style={{
              width: 120,
              background: "var(--panel2)",
              color: "var(--text)",
              border: "none",
              fontFamily: "var(--font)",
            }}
          />
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--borderDark)",
          }}
        />

        {/* Canvas Size Display */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            SIZE
          </span>
          <span className="text-xs bevel-inset px-2 py-1" style={{ background: "var(--panel2)" }}>
            {canvasWidth} x {canvasHeight}
          </span>
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--borderDark)",
          }}
        />

        {/* Background Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            BG
          </span>

          {hasBackgroundImage ? (
            <>
              <span className="text-xs bevel-inset px-2 py-1" style={{ background: "var(--panel2)" }}>
                IMAGE
              </span>
              <button
                onClick={handleClearImage}
                className="bevel btn text-xs"
                style={{ padding: "4px 8px" }}
              >
                CLEAR
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => handleBgColorChange(e.target.value)}
                  className="bevel"
                  style={{ width: 24, height: 24, padding: 0, cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => handleBgColorChange(e.target.value)}
                  className="bevel-inset px-2 py-1 text-xs"
                  style={{
                    width: 70,
                    background: "var(--panel2)",
                    color: "var(--text)",
                    border: "none",
                    fontFamily: "var(--font)",
                  }}
                />
              </div>
            </>
          )}

          <button
            onClick={handleImageUpload}
            className="bevel btn text-xs"
            style={{ padding: "4px 8px" }}
          >
            UPLOAD IMAGE
          </button>
        </div>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--borderDark)",
          }}
        />

        {/* Grid Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            GRID
          </span>
          <button
            onClick={() => setGridEnabled(!grid.enabled)}
            className={`bevel btn text-xs ${grid.enabled ? "bevel-inset" : ""}`}
            style={{ padding: "4px 8px" }}
          >
            {grid.enabled ? "ON" : "OFF"}
          </button>
          {grid.enabled && (
            <div className="flex items-center gap-1">
              {GRID_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setGridSize(size)}
                  className={`bevel btn text-xs ${grid.size === size ? "bevel-inset" : ""}`}
                  style={{ padding: "4px 6px" }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Export Button */}
        <button
          onClick={() => setShowExportDialog(true)}
          className="bevel btn text-xs"
          style={{
            padding: "6px 12px",
            background: "var(--accent2)",
            color: "#fff",
          }}
        >
          EXPORT BUNDLE
        </button>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        defaultAppName={projectName}
      />
    </>
  );
}
