"use client";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, pointerWithin } from "@dnd-kit/core";
import { useBuilderStore } from "./state/builderStore";
import { TopBar } from "./panes/TopBar";
import { LeftPane } from "./panes/LeftPane";
import { CanvasStage } from "./canvas/CanvasStage";
import { InspectorPane } from "./panes/InspectorPane";
import { DraggingWidget } from "./canvas/DraggingWidget";
import type { WidgetType } from "./model/schema";

export function AppBuilderTab() {
  const {
    draggingWidgetType,
    setDraggingWidgetType,
    addNode,
    grid,
  } = useBuilderStore();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Check if dragging from palette
    if (active.data.current?.type === "palette-item") {
      setDraggingWidgetType(active.data.current.widgetType as WidgetType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Check if dropped on canvas
    if (over?.id === "canvas-drop-zone" && active.data.current?.type === "palette-item") {
      const widgetType = active.data.current.widgetType as WidgetType;

      // Get drop position from the over data
      const dropRect = over.rect;
      const canvasRect = over.data.current?.canvasRect;

      if (canvasRect && event.delta) {
        // Calculate position relative to canvas
        let x = Math.max(0, event.activatorEvent instanceof PointerEvent
          ? event.activatorEvent.clientX - canvasRect.left + event.delta.x - 40
          : 0);
        let y = Math.max(0, event.activatorEvent instanceof PointerEvent
          ? event.activatorEvent.clientY - canvasRect.top + event.delta.y - 20
          : 0);

        // Snap to grid if enabled
        if (grid.enabled) {
          x = Math.round(x / grid.size) * grid.size;
          y = Math.round(y / grid.size) * grid.size;
        }

        addNode(widgetType, x, y);
      } else {
        // Fallback: place at center-ish position
        addNode(widgetType, 64, 64);
      }
    }

    setDraggingWidgetType(null);
  };

  const handleDragCancel = () => {
    setDraggingWidgetType(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={pointerWithin}
    >
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content */}
        <div className="flex-1 flex gap-2 p-2 min-h-0">
          {/* Left Pane: Palette + Layers */}
          <LeftPane />

          {/* Center: Canvas */}
          <div className="flex-1 panel bevel-inset overflow-hidden flex items-center justify-center">
            <CanvasStage />
          </div>

          {/* Right: Inspector */}
          <InspectorPane />
        </div>
      </div>

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {draggingWidgetType && <DraggingWidget type={draggingWidgetType} />}
      </DragOverlay>
    </DndContext>
  );
}
