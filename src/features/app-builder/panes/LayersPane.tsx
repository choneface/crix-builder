"use client";

import { useBuilderStore, selectSelectedNode } from "../state/builderStore";

export function LayersPane() {
  const nodes = useBuilderStore((state) => state.nodes);
  const selectedNodeId = useBuilderStore((state) => state.selectedNodeId);
  const selectNode = useBuilderStore((state) => state.selectNode);
  const moveNodeUp = useBuilderStore((state) => state.moveNodeUp);
  const moveNodeDown = useBuilderStore((state) => state.moveNodeDown);
  const deleteNode = useBuilderStore((state) => state.deleteNode);

  // Reverse the list so higher z-index (later in array) appears at top
  const reversedNodes = [...nodes].reverse();

  if (nodes.length === 0) {
    return (
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        No widgets yet.
        <br />
        Drag from Palette.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
        LAYERS (TOP → BOTTOM)
      </div>
      {reversedNodes.map((node, reversedIndex) => {
        const isSelected = node.id === selectedNodeId;
        const actualIndex = nodes.length - 1 - reversedIndex;

        return (
          <div
            key={node.id}
            onClick={() => selectNode(node.id)}
            className={`bevel btn text-xs p-1 flex items-center gap-1 ${
              isSelected ? "bevel-inset" : ""
            }`}
            style={{
              cursor: "pointer",
              background: isSelected ? "var(--accent)" : undefined,
              color: isSelected ? "#fff" : undefined,
            }}
          >
            <span className="flex-1 truncate" title={node.name}>
              {node.name}
            </span>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveNodeUp(node.id);
                }}
                className="bevel"
                style={{
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  lineHeight: 1,
                  padding: 0,
                }}
                title="Bring Forward"
                disabled={actualIndex === nodes.length - 1}
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveNodeDown(node.id);
                }}
                className="bevel"
                style={{
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  lineHeight: 1,
                  padding: 0,
                }}
                title="Send Backward"
                disabled={actualIndex === 0}
              >
                ↓
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
                className="bevel"
                style={{
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  lineHeight: 1,
                  padding: 0,
                  color: "#c00",
                }}
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
