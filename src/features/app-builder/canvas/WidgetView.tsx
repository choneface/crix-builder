"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useBuilderStore } from "../state/builderStore";
import type { Node, TextProps, ImageProps, ButtonProps, ContainerProps } from "../model/schema";
import { ResizeHandles } from "./ResizeHandles";

interface WidgetViewProps {
  node: Node;
  isSelected: boolean;
  zIndex: number;
}

export function WidgetView({ node, isSelected, zIndex }: WidgetViewProps) {
  const { selectNode, updateNodeRect, grid, deleteNode } = useBuilderStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; nodeX: number; nodeY: number } | null>(null);

  // Handle keyboard delete
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // Don't delete if typing in an input
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        deleteNode(node.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, node.id, deleteNode]);

  const snapToGrid = useCallback(
    (value: number) => {
      if (!grid.enabled) return value;
      return Math.round(value / grid.size) * grid.size;
    },
    [grid]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isResizing) return;
    e.stopPropagation();
    selectNode(node.id);

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      nodeX: node.rect.x,
      nodeY: node.rect.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newX = snapToGrid(dragStartRef.current.nodeX + dx);
    const newY = snapToGrid(dragStartRef.current.nodeY + dy);

    updateNodeRect(node.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const handleResize = (dw: number, dh: number, dx: number, dy: number) => {
    const newW = snapToGrid(Math.max(8, node.rect.w + dw));
    const newH = snapToGrid(Math.max(8, node.rect.h + dh));
    const newX = snapToGrid(Math.max(0, node.rect.x + dx));
    const newY = snapToGrid(Math.max(0, node.rect.y + dy));

    updateNodeRect(node.id, { w: newW, h: newH, x: newX, y: newY });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: node.rect.x,
        top: node.rect.y,
        width: node.rect.w,
        height: node.rect.h,
        zIndex,
        cursor: isDragging ? "grabbing" : "grab",
        outline: isSelected ? "2px solid var(--accent)" : "none",
        boxSizing: "border-box",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Widget Content */}
      <WidgetContent node={node} />

      {/* Resize Handles */}
      {isSelected && (
        <ResizeHandles
          onResize={handleResize}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={() => setIsResizing(false)}
        />
      )}
    </div>
  );
}

function WidgetContent({ node }: { node: Node }) {
  switch (node.type) {
    case "text":
      return <TextWidget props={node.props as TextProps} />;
    case "image":
      return <ImageWidget props={node.props as ImageProps} />;
    case "button":
      return <ButtonWidget props={node.props as ButtonProps} />;
    case "container":
      return <ContainerWidget props={node.props as ContainerProps} />;
    default:
      return null;
  }
}

function TextWidget({ props }: { props: TextProps }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontSize: props.fontSize,
        color: props.color,
        textAlign: props.align,
        overflow: "hidden",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {props.text}
    </div>
  );
}

function ImageWidget({ props }: { props: ImageProps }) {
  if (!props.src) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          color: "#888",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <img
      src={props.src}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: props.fit,
        opacity: props.opacity,
        pointerEvents: "none",
        userSelect: "none",
      }}
      draggable={false}
    />
  );
}

function ButtonWidget({ props }: { props: ButtonProps }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: props.bgColor,
        color: props.textColor,
        border: props.borderWidth
          ? `${props.borderWidth}px solid ${props.borderColor || "#000"}`
          : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 600,
        pointerEvents: "none",
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      {props.label}
    </div>
  );
}

function ContainerWidget({ props }: { props: ContainerProps }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: props.bgColor || "transparent",
        border: props.borderWidth
          ? `${props.borderWidth}px solid ${props.borderColor || "#ccc"}`
          : "none",
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    />
  );
}
