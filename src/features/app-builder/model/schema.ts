import { z } from "zod";

// Widget types
export const WidgetType = z.enum(["text", "image", "button", "container"]);
export type WidgetType = z.infer<typeof WidgetType>;

// Rectangle/bounds
export const Rect = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});
export type Rect = z.infer<typeof Rect>;

// Text widget props
export const TextProps = z.object({
  text: z.string(),
  fontSize: z.number(),
  color: z.string(),
  align: z.enum(["left", "center", "right"]),
});
export type TextProps = z.infer<typeof TextProps>;

// Image widget props
export const ImageProps = z.object({
  src: z.string(),
  fit: z.enum(["contain", "cover", "fill"]),
  opacity: z.number().min(0).max(1),
});
export type ImageProps = z.infer<typeof ImageProps>;

// Button widget props
export const ButtonProps = z.object({
  label: z.string(),
  bgColor: z.string(),
  textColor: z.string(),
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
});
export type ButtonProps = z.infer<typeof ButtonProps>;

// Container widget props
export const ContainerProps = z.object({
  bgColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderWidth: z.number().optional(),
});
export type ContainerProps = z.infer<typeof ContainerProps>;

// Union of all widget props
export const WidgetProps = z.union([TextProps, ImageProps, ButtonProps, ContainerProps]);
export type WidgetProps = z.infer<typeof WidgetProps>;

// Node (widget instance)
export const Node = z.object({
  id: z.string(),
  name: z.string(),
  type: WidgetType,
  rect: Rect,
  props: z.record(z.string(), z.unknown()),
});
export type Node = z.infer<typeof Node>;

// Background configuration
export const Background = z.object({
  type: z.enum(["color", "image"]),
  value: z.string(),
});
export type Background = z.infer<typeof Background>;

// Grid configuration
export const GridConfig = z.object({
  enabled: z.boolean(),
  size: z.number(),
});
export type GridConfig = z.infer<typeof GridConfig>;

// Screen
export const Screen = z.object({
  canvasWidth: z.number(),
  canvasHeight: z.number(),
  background: Background.nullable(),
  grid: GridConfig,
  nodes: z.array(Node),
});
export type Screen = z.infer<typeof Screen>;

// Project
export const Project = z.object({
  id: z.string(),
  name: z.string(),
  schemaVersion: z.number(),
  screen: Screen,
});
export type Project = z.infer<typeof Project>;

// Current schema version
export const SCHEMA_VERSION = 1;
