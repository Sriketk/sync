import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { categoryLabels, engines, type EngineStatus } from "./data/engines";

const statusLabel: Record<EngineStatus, string> = {
  scaffolded: "Scaffolded",
  wip: "In progress",
  done: "Done",
};

export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">sync</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Local-first & sync engine playground
          </h1>
          <p className="text-muted-foreground">
            One app per engine under{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-sm">apps/</code>
            . Shared demos in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-sm">
              @repo/demo
            </code>
            , DIY CRDT in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-sm">
              @repo/crdt-core
            </code>
            .
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Implementations</CardTitle>
            <CardDescription>
              Run an app with{" "}
              <code className="text-foreground">bun run --filter &lt;slug&gt; dev</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {engines.map((engine) => (
                <li
                  key={engine.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-medium">{engine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {categoryLabels[engine.category]} · {engine.demo} demo
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <code className="rounded bg-muted px-2 py-1 text-sm">
                      apps/{engine.slug}
                    </code>
                    <span className="text-xs text-muted-foreground">
                      {statusLabel[engine.status]}
                    </span>
                    <a
                      href={`http://localhost:${engine.port}`}
                      className="text-sm text-primary underline-offset-4 hover:underline"
                    >
                      :{engine.port}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
