import JSZip from "jszip";
import type { Project, Node, TextProps, ImageProps, ButtonProps, ContainerProps, TextInputProps } from "../model/schema";
import type { ExportMetadata } from "../panes/ExportDialog";

interface SkinPart {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  asset?: string;
  content?: string;
  font_size?: number;
  text_color?: string;
  text_align?: string;
  vertical_align?: string;
  action?: string;
  draw?: {
    normal: string;
    hover: string;
    pressed: string;
  };
  text_input_draw?: {
    normal: string;
    hover: string;
    focused: string;
    invalid: string;
  };
  hit?: {
    type: string;
  };
  max_length?: number;
  validation?: string;
  binding?: string;
  padding?: number;
}

interface SkinJson {
  skin: {
    name: string;
    author: string;
    version: string;
  };
  window: {
    width: number;
    height: number;
    resizable: boolean;
  };
  assets: Record<string, string>;
  parts: SkinPart[];
}

// Convert hex color to 0xRRGGBB format
function colorToHex(color: string): string {
  // Remove # if present and convert to 0x format
  const hex = color.replace("#", "").toUpperCase();
  return `0x${hex}`;
}

// Lighten a hex color
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * percent));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * percent));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Darken a hex color
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round(255 * percent));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * percent));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Create a button state image with text
async function createButtonImage(
  width: number,
  height: number,
  bgColor: string,
  textColor: string,
  label: string,
  borderColor?: string,
  borderWidth?: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Draw border if specified
  if (borderColor && borderWidth && borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
  }

  // Draw text centered
  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.min(height * 0.4, 16)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, width / 2, height / 2);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

// Create a simple colored rectangle as PNG data
async function createColoredRect(
  width: number,
  height: number,
  color: string,
  borderColor?: string,
  borderWidth?: number
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Draw border if specified
  if (borderColor && borderWidth && borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

// Convert data URL to Blob
function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Generate app.toml content
function generateAppToml(metadata: ExportMetadata): string {
  return `# ${metadata.appName} App Bundle
#
# Run with: crix run ${metadata.appName.toLowerCase().replace(/\s+/g, "_")}.crix

[app]
name = "${metadata.appName}"
version = "${metadata.version}"
author = "${metadata.author}"

[skin]
path = "skin/skin.json"

[fonts]
default = "${metadata.fontPath}"
size = ${metadata.fontSize}.0

[actions]
# Add your action mappings here
`;
}

export async function exportBundle(
  project: Project,
  metadata: ExportMetadata
): Promise<void> {
  const zip = new JSZip();
  const bundleName = metadata.appName.toLowerCase().replace(/\s+/g, "_") + ".crix";

  // Create folder structure
  const bundle = zip.folder(bundleName)!;
  const skinFolder = bundle.folder("skin")!;
  const imagesFolder = skinFolder.folder("images")!;
  bundle.folder("resources");
  bundle.folder("scripts");

  // Collect assets and parts
  const assets: Record<string, string> = {};
  const parts: SkinPart[] = [];

  // Add background as first part (z=0)
  if (project.screen.background) {
    if (project.screen.background.type === "image" && project.screen.background.value) {
      assets["background"] = "images/background.png";
      parts.push({
        id: "background",
        type: "image",
        asset: "background",
        x: 0,
        y: 0,
        width: project.screen.canvasWidth,
        height: project.screen.canvasHeight,
        z: 0,
      });

      // Save background image
      const bgBlob = dataUrlToBlob(project.screen.background.value);
      imagesFolder.file("background.png", bgBlob);
    } else if (project.screen.background.type === "color") {
      // Create a solid color background image
      assets["background"] = "images/background.png";
      parts.push({
        id: "background",
        type: "image",
        asset: "background",
        x: 0,
        y: 0,
        width: project.screen.canvasWidth,
        height: project.screen.canvasHeight,
        z: 0,
      });

      const bgBlob = await createColoredRect(
        project.screen.canvasWidth,
        project.screen.canvasHeight,
        project.screen.background.value
      );
      imagesFolder.file("background.png", bgBlob);
    }
  }

  // Convert nodes to parts
  for (let i = 0; i < project.screen.nodes.length; i++) {
    const node = project.screen.nodes[i];
    const zIndex = i + 1;

    const basePart = {
      id: node.id,
      x: node.rect.x,
      y: node.rect.y,
      width: node.rect.w,
      height: node.rect.h,
      z: zIndex,
    };

    switch (node.type) {
      case "text": {
        const props = node.props as TextProps;
        parts.push({
          ...basePart,
          type: "static_text",
          content: props.text,
          font_size: props.fontSize,
          text_color: colorToHex(props.color),
          text_align: props.align,
        });
        break;
      }

      case "image": {
        const props = node.props as ImageProps;
        if (!props.src) continue;

        // Register the asset
        const assetKey = `image_${node.id}`;
        assets[assetKey] = `images/${node.id}.png`;

        parts.push({
          ...basePart,
          type: "image",
          asset: assetKey,
        });

        // Save the image
        const imgBlob = dataUrlToBlob(props.src);
        imagesFolder.file(`${node.id}.png`, imgBlob);
        break;
      }

      case "button": {
        const props = node.props as ButtonProps;

        // Generate asset keys for button states
        const normalKey = `${node.id}_normal`;
        const hoverKey = `${node.id}_hover`;
        const pressedKey = `${node.id}_pressed`;

        // Register assets
        assets[normalKey] = `images/${node.id}_normal.png`;
        assets[hoverKey] = `images/${node.id}_hover.png`;
        assets[pressedKey] = `images/${node.id}_pressed.png`;

        // Create button part
        parts.push({
          ...basePart,
          type: "button",
          action: "", // Empty action for now - can be filled in later
          draw: {
            normal: normalKey,
            hover: hoverKey,
            pressed: pressedKey,
          },
          hit: {
            type: "rect",
          },
        });

        // Generate button state images
        // Normal state
        const normalBlob = await createButtonImage(
          node.rect.w,
          node.rect.h,
          props.bgColor,
          props.textColor,
          props.label,
          props.borderColor,
          props.borderWidth
        );
        imagesFolder.file(`${node.id}_normal.png`, normalBlob);

        // Hover state (lighter)
        const hoverBlob = await createButtonImage(
          node.rect.w,
          node.rect.h,
          lightenColor(props.bgColor, 0.1),
          props.textColor,
          props.label,
          props.borderColor,
          props.borderWidth
        );
        imagesFolder.file(`${node.id}_hover.png`, hoverBlob);

        // Pressed state (darker)
        const pressedBlob = await createButtonImage(
          node.rect.w,
          node.rect.h,
          darkenColor(props.bgColor, 0.15),
          props.textColor,
          props.label,
          props.borderColor,
          props.borderWidth
        );
        imagesFolder.file(`${node.id}_pressed.png`, pressedBlob);
        break;
      }

      case "container": {
        const props = node.props as ContainerProps;
        if (props.bgColor && props.bgColor !== "transparent") {
          const assetKey = `container_${node.id}`;
          assets[assetKey] = `images/${node.id}.png`;

          parts.push({
            ...basePart,
            type: "image",
            asset: assetKey,
          });

          const containerBlob = await createColoredRect(
            node.rect.w,
            node.rect.h,
            props.bgColor,
            props.borderColor,
            props.borderWidth
          );
          imagesFolder.file(`${node.id}.png`, containerBlob);
        }
        break;
      }

      case "text_input": {
        const props = node.props as TextInputProps;

        // Generate asset keys for input states
        const normalKey = `${node.id}_normal`;
        const hoverKey = `${node.id}_hover`;
        const focusedKey = `${node.id}_focused`;
        const invalidKey = `${node.id}_invalid`;

        // Register assets
        assets[normalKey] = `images/${node.id}_normal.png`;
        assets[hoverKey] = `images/${node.id}_hover.png`;
        assets[focusedKey] = `images/${node.id}_focused.png`;
        assets[invalidKey] = `images/${node.id}_invalid.png`;

        // Create text input part
        parts.push({
          ...basePart,
          type: "text_input",
          font_size: props.fontSize,
          text_color: colorToHex(props.textColor),
          padding: props.padding,
          max_length: props.maxLength,
          validation: props.validation,
          binding: props.binding,
          text_input_draw: {
            normal: normalKey,
            hover: hoverKey,
            focused: focusedKey,
            invalid: invalidKey,
          },
          hit: {
            type: "rect",
          },
        });

        // Generate input state images
        // Normal state
        const normalBlob = await createColoredRect(
          node.rect.w,
          node.rect.h,
          props.bgColor,
          props.borderColor,
          props.borderWidth
        );
        imagesFolder.file(`${node.id}_normal.png`, normalBlob);

        // Hover state (slightly lighter border)
        const hoverBlob = await createColoredRect(
          node.rect.w,
          node.rect.h,
          props.bgColor,
          lightenColor(props.borderColor, 0.2),
          props.borderWidth
        );
        imagesFolder.file(`${node.id}_hover.png`, hoverBlob);

        // Focused state (accent-colored border)
        const focusedBlob = await createColoredRect(
          node.rect.w,
          node.rect.h,
          props.bgColor,
          "#4a90d9", // Accent blue for focus
          props.borderWidth + 1
        );
        imagesFolder.file(`${node.id}_focused.png`, focusedBlob);

        // Invalid state (red border)
        const invalidBlob = await createColoredRect(
          node.rect.w,
          node.rect.h,
          props.bgColor,
          "#d94a4a", // Red for invalid
          props.borderWidth
        );
        imagesFolder.file(`${node.id}_invalid.png`, invalidBlob);
        break;
      }
    }
  }

  // Generate skin.json
  const skinJson: SkinJson = {
    skin: {
      name: metadata.skinName,
      author: metadata.author,
      version: metadata.version,
    },
    window: {
      width: project.screen.canvasWidth,
      height: project.screen.canvasHeight,
      resizable: false,
    },
    assets,
    parts,
  };

  skinFolder.file("skin.json", JSON.stringify(skinJson, null, 2));

  // Generate app.toml
  bundle.file("app.toml", generateAppToml(metadata));

  // Generate the zip
  const content = await zip.generateAsync({ type: "blob" });

  // Download
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${bundleName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
