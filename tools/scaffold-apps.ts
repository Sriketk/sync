#!/usr/bin/env bun
/**
 * Scaffold engine demo apps. Re-run safe — skips existing src/App.tsx overrides
 * unless --force is passed.
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(import.meta.dir, "..");

type DemoKind = "todo" | "doc";

const APPS: {
  slug: string;
  title: string;
  port: number;
  demo: DemoKind;
  extraDeps: string[];
}[] = [
  { slug: "yjs", title: "Y.js", port: 5174, demo: "doc", extraDeps: ["@repo/demo"] },
  {
    slug: "automerge",
    title: "Automerge",
    port: 5175,
    demo: "doc",
    extraDeps: ["@repo/demo"],
  },
  {
    slug: "actual-crdt",
    title: "Actual Budget CRDT",
    port: 5176,
    demo: "todo",
    extraDeps: ["@repo/demo", "@repo/crdt-core"],
  },
  {
    slug: "livestore",
    title: "LiveStore",
    port: 5177,
    demo: "todo",
    extraDeps: ["@repo/demo"],
  },
  { slug: "jazz", title: "Jazz", port: 5178, demo: "todo", extraDeps: ["@repo/demo"] },
  {
    slug: "powersync",
    title: "PowerSync",
    port: 5179,
    demo: "todo",
    extraDeps: ["@repo/demo"],
  },
  {
    slug: "electric-tanstack",
    title: "Electric SQL + TanStack DB",
    port: 5180,
    demo: "todo",
    extraDeps: ["@repo/demo"],
  },
  { slug: "zero", title: "Zero", port: 5181, demo: "todo", extraDeps: ["@repo/demo"] },
  {
    slug: "convex",
    title: "Convex",
    port: 5182,
    demo: "todo",
    extraDeps: ["@repo/demo"],
  },
  { slug: "ditto", title: "Ditto", port: 5183, demo: "todo", extraDeps: ["@repo/demo"] },
];

const force = process.argv.includes("--force");

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function appTsx(app: (typeof APPS)[0]) {
  const seedImport =
    app.demo === "doc"
      ? `import { seedDoc } from "@repo/demo/doc";`
      : `import { seedTodos } from "@repo/demo/todo";`;

  const seedUsage =
    app.demo === "doc"
      ? `<p className="rounded-md border bg-muted/50 p-3 text-sm">{seedDoc.content}</p>`
      : `<ul className="space-y-2 text-sm">
            {seedTodos.map((todo) => (
              <li key={todo.id} className="rounded-md border bg-muted/50 px-3 py-2">
                {todo.title}
              </li>
            ))}
          </ul>`;

  const demoLabel = app.demo === "doc" ? "doc" : "todo";

  return `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
${seedImport}

export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            <a href="http://localhost:5173" className="hover:underline">
              sync
            </a>
            {" / "}
            ${app.slug}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">${app.title}</h1>
          <p className="text-muted-foreground">
            Scaffolded demo — wire the ${app.title} sync engine here (${demoLabel} scenario).
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shared ${demoLabel} seed</CardTitle>
            <CardDescription>From @repo/demo — same data across comparable engines.</CardDescription>
          </CardHeader>
          <CardContent>${seedUsage}</CardContent>
        </Card>
      </main>
    </div>
  );
}
`;
}

function packageJson(app: (typeof APPS)[0]) {
  const deps: Record<string, string> = {
    "@repo/ui": "workspace:*",
    react: "^19.2.0",
    "react-dom": "^19.2.0",
  };
  for (const dep of app.extraDeps) {
    deps[dep] = "workspace:*";
  }

  return JSON.stringify(
    {
      name: app.slug,
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vp dev",
        build: "tsc -b && vp build",
        preview: "vp preview",
      },
      dependencies: deps,
      devDependencies: {
        "@tailwindcss/vite": "^4.1.18",
        "@types/react": "^19.2.7",
        "@types/react-dom": "^19.2.3",
        "@vitejs/plugin-react": "^5.1.1",
        tailwindcss: "^4.1.18",
        typescript: "~6.0.2",
        "vite-plus": "catalog:",
      },
    },
    null,
    2,
  );
}

function viteConfig(port: number) {
  return `import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: ${port} },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
`;
}

const tsconfig = `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`;

const tsconfigApp = `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
`;

const tsconfigNode = `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
`;

const mainTsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@repo/ui/globals.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

const viteEnv = `/// <reference types="vite/client" />
`;

for (const app of APPS) {
  const dir = path.join(ROOT, "apps", app.slug);
  const srcDir = path.join(dir, "src");
  await mkdir(srcDir, { recursive: true });

  const files: [string, string][] = [
    ["package.json", packageJson(app)],
    ["vite.config.ts", viteConfig(app.port)],
    ["tsconfig.json", tsconfig],
    ["tsconfig.app.json", tsconfigApp],
    ["tsconfig.node.json", tsconfigNode],
    [
      "index.html",
      `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${app.title} · sync</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    ],
    ["src/main.tsx", mainTsx],
    ["src/vite-env.d.ts", viteEnv],
    ["src/App.tsx", appTsx(app)],
  ];

  for (const [rel, content] of files) {
    const file = path.join(dir, rel);
    if (!force && (await exists(file))) continue;
    await writeFile(file, content);
  }

  console.log(`scaffolded apps/${app.slug} :${app.port}`);
}

console.log("done");
