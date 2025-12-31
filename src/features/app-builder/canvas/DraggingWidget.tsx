"use client";

import type { WidgetType } from "../model/schema";
import { DEFAULT_SIZES } from "../model/defaults";

interface DraggingWidgetProps {
  type: WidgetType;
}

export function DraggingWidget({ type }: DraggingWidgetProps) {
  const size = DEFAULT_SIZES[type];

  return (
    <div
      style={{
        width: size.w,
        height: size.h,
        background: "var(--accent)",
        opacity: 0.7,
        border: "2px dashed #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        pointerEvents: "none",
      }}
    >
      {type}
    </div>
  );
}
