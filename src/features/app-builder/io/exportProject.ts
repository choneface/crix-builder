import type { Project } from "../model/schema";
import { Project as ProjectSchema } from "../model/schema";

export function exportProjectToJSON(project: Project): void {
  // Validate the project against the schema
  const validated = ProjectSchema.parse(project);

  // Create the JSON string
  const json = JSON.stringify(validated, null, 2);

  // Create blob and download
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `crix_project_${project.name.replace(/\s+/g, "_").toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importProjectFromJSON(json: string): Project {
  const data = JSON.parse(json);
  return ProjectSchema.parse(data);
}
