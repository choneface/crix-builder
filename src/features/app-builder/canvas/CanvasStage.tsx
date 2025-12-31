"use client";

import { useRef, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useBuilderStore } from "../state/builderStore";
import { GridOverlay } from "./GridOverlay";
import { WidgetView } from "./WidgetView";

export function CanvasStage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    background,
    grid,
    nodes,
    selectedNodeId,
    selectNode,
    canvasWidth,
    canvasHeight,
  } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-zone",
    data: {
      canvasRect: canvasRef.current?.getBoundingClientRect(),
    },
  });

  // Update canvas rect for drop positioning
  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      setNodeRef(el);
    },
    [setNodeRef]
  );

  // Click on canvas background deselects
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === e.currentTarget) {
      selectNode(null);
    }
  };

  // Calculate background style
  const backgroundStyle: React.CSSProperties = {};
  if (background) {
    if (background.type === "color") {
      backgroundStyle.backgroundColor = background.value;
    } else if (background.type === "image" && background.value) {
      backgroundStyle.backgroundImage = `url(${background.value})`;
      backgroundStyle.backgroundSize = "100% 100%";
      backgroundStyle.backgroundPosition = "top left";
      backgroundStyle.backgroundRepeat = "no-repeat";
    }
  }

  return (
    <div
      ref={setRefs}
      onClick={handleCanvasClick}
      className="relative"
      style={{
        width: canvasWidth,
        height: canvasHeight,
        ...backgroundStyle,
        outline: isOver ? "2px dashed var(--accent)" : "1px solid var(--borderDark)",
        overflow: "hidden",
      }}
    >
      {/* Grid Overlay */}
      {grid.enabled && (
        <GridOverlay
          width={canvasWidth}
          height={canvasHeight}
          gridSize={grid.size}
        />
      )}

      {/* Widgets */}
      {nodes.map((node, index) => (
        <WidgetView
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          zIndex={index + 1}
        />
      ))}
    </div>
  );
}
