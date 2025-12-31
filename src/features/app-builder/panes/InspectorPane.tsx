"use client";

import { useBuilderStore, selectSelectedNode } from "../state/builderStore";
import type { Node, TextProps, ImageProps, ButtonProps, ContainerProps, TextInputProps } from "../model/schema";

export function InspectorPane() {
  const selectedNode = useBuilderStore(selectSelectedNode);

  return (
    <div className="panel bevel flex flex-col" style={{ width: 180 }}>
      <div
        className="bevel-inset px-2 py-1 text-xs"
        style={{ borderBottom: "1px solid var(--borderDark)" }}
      >
        INSPECTOR
      </div>

      <div className="flex-1 overflow-auto p-2">
        {selectedNode ? (
          <WidgetInspector node={selectedNode} />
        ) : (
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            Select a widget to edit its properties.
          </div>
        )}
      </div>
    </div>
  );
}

function WidgetInspector({ node }: { node: Node }) {
  const updateNode = useBuilderStore((state) => state.updateNode);
  const updateNodeRect = useBuilderStore((state) => state.updateNodeRect);
  const updateNodeProps = useBuilderStore((state) => state.updateNodeProps);

  return (
    <div className="flex flex-col gap-3">
      {/* Identity Section */}
      <InspectorSection title="IDENTITY">
        <InspectorField label="Name">
          <input
            type="text"
            value={node.name}
            onChange={(e) => updateNode(node.id, { name: e.target.value })}
            className="bevel-inset px-1 py-0.5 text-xs w-full"
            style={{
              background: "var(--panel2)",
              color: "var(--text)",
              border: "none",
              fontFamily: "var(--font)",
            }}
          />
        </InspectorField>
        <InspectorField label="ID">
          <input
            type="text"
            value={node.id}
            readOnly
            className="bevel-inset px-1 py-0.5 text-xs w-full"
            style={{
              background: "var(--panel2)",
              color: "var(--muted)",
              border: "none",
              fontFamily: "var(--font)",
              fontSize: 9,
            }}
          />
        </InspectorField>
        <InspectorField label="Type">
          <span className="text-xs" style={{ textTransform: "uppercase" }}>
            {node.type}
          </span>
        </InspectorField>
      </InspectorSection>

      {/* Layout Section */}
      <InspectorSection title="LAYOUT">
        <div className="grid grid-cols-2 gap-1">
          <InspectorField label="X">
            <NumberInput
              value={node.rect.x}
              onChange={(x) => updateNodeRect(node.id, { x })}
            />
          </InspectorField>
          <InspectorField label="Y">
            <NumberInput
              value={node.rect.y}
              onChange={(y) => updateNodeRect(node.id, { y })}
            />
          </InspectorField>
          <InspectorField label="W">
            <NumberInput
              value={node.rect.w}
              onChange={(w) => updateNodeRect(node.id, { w })}
              min={8}
            />
          </InspectorField>
          <InspectorField label="H">
            <NumberInput
              value={node.rect.h}
              onChange={(h) => updateNodeRect(node.id, { h })}
              min={8}
            />
          </InspectorField>
        </div>
      </InspectorSection>

      {/* Type-specific Properties */}
      {node.type === "text" && (
        <TextPropsEditor
          props={node.props as TextProps}
          onChange={(props) => updateNodeProps(node.id, props)}
        />
      )}
      {node.type === "image" && (
        <ImagePropsEditor
          props={node.props as ImageProps}
          onChange={(props) => updateNodeProps(node.id, props)}
        />
      )}
      {node.type === "button" && (
        <ButtonPropsEditor
          props={node.props as ButtonProps}
          onChange={(props) => updateNodeProps(node.id, props)}
        />
      )}
      {node.type === "container" && (
        <ContainerPropsEditor
          props={node.props as ContainerProps}
          onChange={(props) => updateNodeProps(node.id, props)}
        />
      )}
      {node.type === "text_input" && (
        <TextInputPropsEditor
          props={node.props as TextInputProps}
          onChange={(props) => updateNodeProps(node.id, props)}
        />
      )}
    </div>
  );
}

function InspectorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="text-xs mb-1"
        style={{ color: "var(--muted)", fontWeight: 600 }}
      >
        {title}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function InspectorField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs" style={{ color: "var(--muted)", fontSize: 9 }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const num = parseInt(e.target.value, 10);
        if (!isNaN(num)) {
          onChange(Math.max(min, max !== undefined ? Math.min(max, num) : num));
        }
      }}
      className="bevel-inset px-1 py-0.5 text-xs w-full"
      style={{
        background: "var(--panel2)",
        color: "var(--text)",
        border: "none",
        fontFamily: "var(--font)",
      }}
      min={min}
      max={max}
    />
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-1">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="bevel"
        style={{ width: 20, height: 20, padding: 0, cursor: "pointer" }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bevel-inset px-1 py-0.5 text-xs flex-1"
        style={{
          background: "var(--panel2)",
          color: "var(--text)",
          border: "none",
          fontFamily: "var(--font)",
        }}
      />
    </div>
  );
}

// Text Props Editor
function TextPropsEditor({
  props,
  onChange,
}: {
  props: TextProps;
  onChange: (props: Partial<TextProps>) => void;
}) {
  return (
    <InspectorSection title="TEXT">
      <InspectorField label="Content">
        <textarea
          value={props.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="bevel-inset px-1 py-0.5 text-xs w-full"
          style={{
            background: "var(--panel2)",
            color: "var(--text)",
            border: "none",
            fontFamily: "var(--font)",
            resize: "vertical",
            minHeight: 40,
          }}
        />
      </InspectorField>
      <InspectorField label="Font Size">
        <NumberInput
          value={props.fontSize}
          onChange={(fontSize) => onChange({ fontSize })}
          min={8}
          max={128}
        />
      </InspectorField>
      <InspectorField label="Color">
        <ColorInput
          value={props.color}
          onChange={(color) => onChange({ color })}
        />
      </InspectorField>
      <InspectorField label="Align">
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              onClick={() => onChange({ align })}
              className={`bevel btn text-xs flex-1 ${
                props.align === align ? "bevel-inset" : ""
              }`}
              style={{ padding: "2px 4px" }}
            >
              {align[0].toUpperCase()}
            </button>
          ))}
        </div>
      </InspectorField>
    </InspectorSection>
  );
}

// Image Props Editor
function ImagePropsEditor({
  props,
  onChange,
}: {
  props: ImageProps;
  onChange: (props: Partial<ImageProps>) => void;
}) {
  return (
    <InspectorSection title="IMAGE">
      <InspectorField label="Source URL">
        <input
          type="text"
          value={props.src}
          onChange={(e) => onChange({ src: e.target.value })}
          className="bevel-inset px-1 py-0.5 text-xs w-full"
          style={{
            background: "var(--panel2)",
            color: "var(--text)",
            border: "none",
            fontFamily: "var(--font)",
          }}
          placeholder="https://..."
        />
      </InspectorField>
      <InspectorField label="Fit">
        <div className="flex gap-1">
          {(["contain", "cover", "fill"] as const).map((fit) => (
            <button
              key={fit}
              onClick={() => onChange({ fit })}
              className={`bevel btn text-xs flex-1 ${
                props.fit === fit ? "bevel-inset" : ""
              }`}
              style={{ padding: "2px 4px", fontSize: 9 }}
            >
              {fit.toUpperCase()}
            </button>
          ))}
        </div>
      </InspectorField>
      <InspectorField label="Opacity">
        <input
          type="range"
          value={props.opacity}
          onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
      </InspectorField>
    </InspectorSection>
  );
}

// Button Props Editor
function ButtonPropsEditor({
  props,
  onChange,
}: {
  props: ButtonProps;
  onChange: (props: Partial<ButtonProps>) => void;
}) {
  return (
    <InspectorSection title="BUTTON">
      <InspectorField label="Label">
        <input
          type="text"
          value={props.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="bevel-inset px-1 py-0.5 text-xs w-full"
          style={{
            background: "var(--panel2)",
            color: "var(--text)",
            border: "none",
            fontFamily: "var(--font)",
          }}
        />
      </InspectorField>
      <InspectorField label="BG Color">
        <ColorInput
          value={props.bgColor}
          onChange={(bgColor) => onChange({ bgColor })}
        />
      </InspectorField>
      <InspectorField label="Text Color">
        <ColorInput
          value={props.textColor}
          onChange={(textColor) => onChange({ textColor })}
        />
      </InspectorField>
      <InspectorField label="Border Color">
        <ColorInput
          value={props.borderColor || "#000000"}
          onChange={(borderColor) => onChange({ borderColor })}
        />
      </InspectorField>
      <InspectorField label="Border Width">
        <NumberInput
          value={props.borderWidth || 0}
          onChange={(borderWidth) => onChange({ borderWidth })}
          min={0}
          max={10}
        />
      </InspectorField>
    </InspectorSection>
  );
}

// Container Props Editor
function ContainerPropsEditor({
  props,
  onChange,
}: {
  props: ContainerProps;
  onChange: (props: Partial<ContainerProps>) => void;
}) {
  return (
    <InspectorSection title="CONTAINER">
      <InspectorField label="BG Color">
        <ColorInput
          value={props.bgColor || "transparent"}
          onChange={(bgColor) => onChange({ bgColor })}
        />
      </InspectorField>
      <InspectorField label="Border Color">
        <ColorInput
          value={props.borderColor || "#cccccc"}
          onChange={(borderColor) => onChange({ borderColor })}
        />
      </InspectorField>
      <InspectorField label="Border Width">
        <NumberInput
          value={props.borderWidth || 0}
          onChange={(borderWidth) => onChange({ borderWidth })}
          min={0}
          max={10}
        />
      </InspectorField>
    </InspectorSection>
  );
}

// Text Input Props Editor
function TextInputPropsEditor({
  props,
  onChange,
}: {
  props: TextInputProps;
  onChange: (props: Partial<TextInputProps>) => void;
}) {
  return (
    <>
      <InspectorSection title="TEXT INPUT">
        <InspectorField label="Placeholder">
          <input
            type="text"
            value={props.placeholder}
            onChange={(e) => onChange({ placeholder: e.target.value })}
            className="bevel-inset px-1 py-0.5 text-xs w-full"
            style={{
              background: "var(--panel2)",
              color: "var(--text)",
              border: "none",
              fontFamily: "var(--font)",
            }}
          />
        </InspectorField>
        <InspectorField label="Font Size">
          <NumberInput
            value={props.fontSize}
            onChange={(fontSize) => onChange({ fontSize })}
            min={8}
            max={128}
          />
        </InspectorField>
        <InspectorField label="Max Length">
          <NumberInput
            value={props.maxLength || 0}
            onChange={(maxLength) => onChange({ maxLength: maxLength || undefined })}
            min={0}
            max={1000}
          />
        </InspectorField>
        <InspectorField label="Padding">
          <NumberInput
            value={props.padding}
            onChange={(padding) => onChange({ padding })}
            min={0}
            max={32}
          />
        </InspectorField>
      </InspectorSection>

      <InspectorSection title="COLORS">
        <InspectorField label="Text Color">
          <ColorInput
            value={props.textColor}
            onChange={(textColor) => onChange({ textColor })}
          />
        </InspectorField>
        <InspectorField label="BG Color">
          <ColorInput
            value={props.bgColor}
            onChange={(bgColor) => onChange({ bgColor })}
          />
        </InspectorField>
        <InspectorField label="Border Color">
          <ColorInput
            value={props.borderColor}
            onChange={(borderColor) => onChange({ borderColor })}
          />
        </InspectorField>
        <InspectorField label="Border Width">
          <NumberInput
            value={props.borderWidth}
            onChange={(borderWidth) => onChange({ borderWidth })}
            min={0}
            max={10}
          />
        </InspectorField>
      </InspectorSection>

      <InspectorSection title="VALIDATION">
        <InspectorField label="Allowed Chars">
          <input
            type="text"
            value={props.validation || ""}
            onChange={(e) => onChange({ validation: e.target.value || undefined })}
            className="bevel-inset px-1 py-0.5 text-xs w-full"
            style={{
              background: "var(--panel2)",
              color: "var(--text)",
              border: "none",
              fontFamily: "var(--font)",
            }}
            placeholder="e.g. 0123456789"
          />
        </InspectorField>
        <InspectorField label="Binding">
          <input
            type="text"
            value={props.binding || ""}
            onChange={(e) => onChange({ binding: e.target.value || undefined })}
            className="bevel-inset px-1 py-0.5 text-xs w-full"
            style={{
              background: "var(--panel2)",
              color: "var(--text)",
              border: "none",
              fontFamily: "var(--font)",
            }}
            placeholder="e.g. inputs.value"
          />
        </InspectorField>
      </InspectorSection>
    </>
  );
}
