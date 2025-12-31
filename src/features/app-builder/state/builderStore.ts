import { create } from "zustand";
import type { Node, Background, GridConfig, WidgetType, Rect, Project } from "../model/schema";
import { SCHEMA_VERSION } from "../model/schema";
import {
  generateId,
  getDefaultProps,
  getDefaultName,
  createDefaultRect,
  DEFAULT_BACKGROUND,
  DEFAULT_GRID,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "../model/defaults";

interface BuilderState {
  // Project metadata
  projectId: string;
  projectName: string;

  // Screen state
  canvasWidth: number;
  canvasHeight: number;
  background: Background;
  grid: GridConfig;
  nodes: Node[];

  // UI state
  selectedNodeId: string | null;
  draggingWidgetType: WidgetType | null;

  // Project actions
  setProjectName: (name: string) => void;
  resetProject: () => void;
  loadProject: (project: Project) => void;
  getProject: () => Project;

  // Canvas dimension actions
  setCanvasDimensions: (width: number, height: number) => void;

  // Background actions
  setBackground: (bg: Background) => void;
  setBackgroundImage: (dataUrl: string, width: number, height: number) => void;

  // Grid actions
  setGridEnabled: (enabled: boolean) => void;
  setGridSize: (size: number) => void;

  // Node actions
  addNode: (type: WidgetType, x: number, y: number) => string;
  updateNode: (id: string, updates: Partial<Node>) => void;
  updateNodeRect: (id: string, rect: Partial<Rect>) => void;
  updateNodeProps: (id: string, props: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  moveNodeUp: (id: string) => void;
  moveNodeDown: (id: string) => void;
  reorderNodes: (fromIndex: number, toIndex: number) => void;

  // Selection actions
  selectNode: (id: string | null) => void;

  // Drag state actions
  setDraggingWidgetType: (type: WidgetType | null) => void;
}

function createInitialState() {
  return {
    projectId: generateId(),
    projectName: "Untitled Project",
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    background: DEFAULT_BACKGROUND,
    grid: DEFAULT_GRID,
    nodes: [] as Node[],
    selectedNodeId: null as string | null,
    draggingWidgetType: null as WidgetType | null,
  };
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...createInitialState(),

  // Project actions
  setProjectName: (name) => set({ projectName: name }),

  resetProject: () => set({ ...createInitialState(), projectId: generateId() }),

  loadProject: (project) =>
    set({
      projectId: project.id,
      projectName: project.name,
      canvasWidth: project.screen.canvasWidth,
      canvasHeight: project.screen.canvasHeight,
      background: project.screen.background ?? DEFAULT_BACKGROUND,
      grid: project.screen.grid,
      nodes: project.screen.nodes,
      selectedNodeId: null,
    }),

  getProject: () => {
    const state = get();
    return {
      id: state.projectId,
      name: state.projectName,
      schemaVersion: SCHEMA_VERSION,
      screen: {
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight,
        background: state.background,
        grid: state.grid,
        nodes: state.nodes,
      },
    };
  },

  // Canvas dimension actions
  setCanvasDimensions: (width, height) => set({ canvasWidth: width, canvasHeight: height }),

  // Background actions
  setBackground: (bg) => set({ background: bg }),

  setBackgroundImage: (dataUrl, width, height) =>
    set({
      background: { type: "image", value: dataUrl },
      canvasWidth: width,
      canvasHeight: height,
    }),

  // Grid actions
  setGridEnabled: (enabled) =>
    set((state) => ({
      grid: { ...state.grid, enabled },
    })),

  setGridSize: (size) =>
    set((state) => ({
      grid: { ...state.grid, size },
    })),

  // Node actions
  addNode: (type, x, y) => {
    const state = get();
    const existingCount = state.nodes.filter((n) => n.type === type).length;
    const id = generateId();
    const node: Node = {
      id,
      name: getDefaultName(type, existingCount),
      type,
      rect: createDefaultRect(type, x, y),
      props: getDefaultProps(type),
    };

    set({
      nodes: [...state.nodes, node],
      selectedNodeId: id,
    });

    return id;
  },

  updateNode: (id, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    })),

  updateNodeRect: (id, rectUpdates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, rect: { ...node.rect, ...rectUpdates } }
          : node
      ),
    })),

  updateNodeProps: (id, propsUpdates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, props: { ...node.props, ...propsUpdates } }
          : node
      ),
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  moveNodeUp: (id) =>
    set((state) => {
      const index = state.nodes.findIndex((n) => n.id === id);
      if (index < state.nodes.length - 1) {
        const newNodes = [...state.nodes];
        [newNodes[index], newNodes[index + 1]] = [newNodes[index + 1], newNodes[index]];
        return { nodes: newNodes };
      }
      return {};
    }),

  moveNodeDown: (id) =>
    set((state) => {
      const index = state.nodes.findIndex((n) => n.id === id);
      if (index > 0) {
        const newNodes = [...state.nodes];
        [newNodes[index], newNodes[index - 1]] = [newNodes[index - 1], newNodes[index]];
        return { nodes: newNodes };
      }
      return {};
    }),

  reorderNodes: (fromIndex, toIndex) =>
    set((state) => {
      const newNodes = [...state.nodes];
      const [removed] = newNodes.splice(fromIndex, 1);
      newNodes.splice(toIndex, 0, removed);
      return { nodes: newNodes };
    }),

  // Selection actions
  selectNode: (id) => set({ selectedNodeId: id }),

  // Drag state actions
  setDraggingWidgetType: (type) => set({ draggingWidgetType: type }),
}));

// Selectors
export const selectSelectedNode = (state: BuilderState): Node | null => {
  if (!state.selectedNodeId) return null;
  return state.nodes.find((n) => n.id === state.selectedNodeId) ?? null;
};
