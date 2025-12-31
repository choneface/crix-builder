"use client";

import type { ToolType } from "@/state/assetStore";

interface ToolBarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function ToolBar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolBarProps) {
  return (
    <div className="panel flex flex-col gap-2 p-2 w-16">
      <div className="titlebar text-xs" style={{ padding: "4px 6px" }}>
        TOOLS
      </div>

      <div className="flex flex-col gap-1 p-1">
        {/* Pencil Tool */}
        <button
          className={`bevel btn flex items-center justify-center ${
            activeTool === "pencil" ? "bevel-inset" : ""
          }`}
          onClick={() => onToolChange("pencil")}
          title="Pencil (P)"
          style={{ padding: "8px" }}
        >
          <PencilIcon active={activeTool === "pencil"} />
        </button>

        {/* Eraser Tool */}
        <button
          className={`bevel btn flex items-center justify-center ${
            activeTool === "eraser" ? "bevel-inset" : ""
          }`}
          onClick={() => onToolChange("eraser")}
          title="Eraser (E)"
          style={{ padding: "8px" }}
        >
          <EraserIcon active={activeTool === "eraser"} />
        </button>

        <div className="my-2" style={{ borderTop: "1px solid var(--borderMid)" }} />

        {/* Undo */}
        <button
          className="bevel btn flex items-center justify-center"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          style={{ padding: "8px", opacity: canUndo ? 1 : 0.4 }}
        >
          <UndoIcon />
        </button>

        {/* Redo */}
        <button
          className="bevel btn flex items-center justify-center"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          style={{ padding: "8px", opacity: canRedo ? 1 : 0.4 }}
        >
          <RedoIcon />
        </button>
      </div>
    </div>
  );
}

function PencilIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 14L3 10L11 2L14 5L6 13L2 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill={active ? "var(--accent)" : "none"}
      />
      <path d="M10 3L13 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EraserIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="6"
        width="12"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill={active ? "var(--accent)" : "none"}
      />
      <path d="M4 6V4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 6V4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6L2 8L4 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8H10C12.2091 8 14 9.79086 14 12V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12 6L14 8L12 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8H6C3.79086 8 2 9.79086 2 12V12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
