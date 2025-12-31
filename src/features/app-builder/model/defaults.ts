import type { WidgetType, TextProps, ImageProps, ButtonProps, ContainerProps, Rect, Background, GridConfig } from "./schema";

// Generate unique IDs
export function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// Default sizes per widget type
export const DEFAULT_SIZES: Record<WidgetType, { w: number; h: number }> = {
  text: { w: 128, h: 32 },
  image: { w: 64, h: 64 },
  button: { w: 96, h: 40 },
  container: { w: 128, h: 128 },
};

// Default props per widget type
export function getDefaultProps(type: WidgetType): TextProps | ImageProps | ButtonProps | ContainerProps {
  switch (type) {
    case "text":
      return {
        text: "Text",
        fontSize: 16,
        color: "#000000",
        align: "left",
      } satisfies TextProps;
    case "image":
      return {
        src: "",
        fit: "contain",
        opacity: 1,
      } satisfies ImageProps;
    case "button":
      return {
        label: "Button",
        bgColor: "#4a90d9",
        textColor: "#ffffff",
        borderColor: "#2a5a8a",
        borderWidth: 2,
      } satisfies ButtonProps;
    case "container":
      return {
        bgColor: "transparent",
        borderColor: "#cccccc",
        borderWidth: 1,
      } satisfies ContainerProps;
  }
}

// Default widget name based on type and count
export function getDefaultName(type: WidgetType, existingCount: number): string {
  const typeNames: Record<WidgetType, string> = {
    text: "Text",
    image: "Image",
    button: "Button",
    container: "Container",
  };
  return `${typeNames[type]} ${existingCount + 1}`;
}

// Default rect for a widget dropped at a position
export function createDefaultRect(type: WidgetType, x: number, y: number): Rect {
  const size = DEFAULT_SIZES[type];
  return {
    x,
    y,
    w: size.w,
    h: size.h,
  };
}

// Default background
export const DEFAULT_BACKGROUND: Background = {
  type: "color",
  value: "#ffffff",
};

// Default grid config
export const DEFAULT_GRID: GridConfig = {
  enabled: true,
  size: 16,
};

// Canvas dimensions (fixed for v0)
export const CANVAS_WIDTH = 320;
export const CANVAS_HEIGHT = 240;
