import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "./src/lib/sanity/env";

const configuredProjectId = projectId || "your-project-id";

export default defineConfig({
  name: "taologos",
  title: "Taologos CMS",
  projectId: configuredProjectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
});
