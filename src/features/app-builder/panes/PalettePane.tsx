"use client";

import { useDraggable } from "@dnd-kit/core";
import type { WidgetType } from "../model/schema";

const WIDGET_TYPES: { type: WidgetType; label: string; icon: string }[] = [
  { type: "text", label: "Text", icon: "T" },
  { type: "image", label: "Image", icon: "🖼" },
  { type: "button", label: "Button", icon: "▢" },
  { type: "container", label: "Container", icon: "⬜" },
];

export function PalettePane() {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        DRAG TO CANVAS
      </div>
      {WIDGET_TYPES.map((widget) => (
        <PaletteItem key={widget.type} {...widget} />
      ))}
    </div>
  );
}

function PaletteItem({
  type,
  label,
  icon,
}: {
  type: WidgetType;
  label: string;
  icon: string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: "palette-item",
      widgetType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bevel btn flex items-center gap-2 p-2"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <span style={{ width: 20, textAlign: "center" }}>{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}
