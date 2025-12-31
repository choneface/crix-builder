"use client";

import { useRef } from "react";

interface ResizeHandlesProps {
  onResize: (dw: number, dh: number, dx: number, dy: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
}

type HandlePosition = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const HANDLE_SIZE = 8;

const HANDLES: { pos: HandlePosition; cursor: string; style: React.CSSProperties }[] = [
  // Corners
  {
    pos: "nw",
    cursor: "nwse-resize",
    style: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 },
  },
  {
    pos: "ne",
    cursor: "nesw-resize",
    style: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 },
  },
  {
    pos: "sw",
    cursor: "nesw-resize",
    style: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 },
  },
  {
    pos: "se",
    cursor: "nwse-resize",
    style: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 },
  },
  // Edges
  {
    pos: "n",
    cursor: "ns-resize",
    style: { top: -HANDLE_SIZE / 2, left: "50%", marginLeft: -HANDLE_SIZE / 2 },
  },
  {
    pos: "s",
    cursor: "ns-resize",
    style: { bottom: -HANDLE_SIZE / 2, left: "50%", marginLeft: -HANDLE_SIZE / 2 },
  },
  {
    pos: "e",
    cursor: "ew-resize",
    style: { right: -HANDLE_SIZE / 2, top: "50%", marginTop: -HANDLE_SIZE / 2 },
  },
  {
    pos: "w",
    cursor: "ew-resize",
    style: { left: -HANDLE_SIZE / 2, top: "50%", marginTop: -HANDLE_SIZE / 2 },
  },
];

export function ResizeHandles({ onResize, onResizeStart, onResizeEnd }: ResizeHandlesProps) {
  return (
    <>
      {HANDLES.map((handle) => (
        <ResizeHandle
          key={handle.pos}
          position={handle.pos}
          cursor={handle.cursor}
          style={handle.style}
          onResize={onResize}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      ))}
    </>
  );
}

function ResizeHandle({
  position,
  cursor,
  style,
  onResize,
  onResizeStart,
  onResizeEnd,
}: {
  position: HandlePosition;
  cursor: string;
  style: React.CSSProperties;
  onResize: (dw: number, dh: number, dx: number, dy: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
}) {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onResizeStart();
    startRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    let dw = 0,
      dh = 0,
      offsetX = 0,
      offsetY = 0;

    // Calculate resize based on handle position
    if (position.includes("e")) {
      dw = dx;
    }
    if (position.includes("w")) {
      dw = -dx;
      offsetX = dx;
    }
    if (position.includes("s")) {
      dh = dy;
    }
    if (position.includes("n")) {
      dh = -dy;
      offsetY = dy;
    }

    onResize(dw, dh, offsetX, offsetY);
    startRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startRef.current) {
      startRef.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      onResizeEnd();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        background: "var(--accent)",
        border: "1px solid #fff",
        cursor,
        zIndex: 10,
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );
}
