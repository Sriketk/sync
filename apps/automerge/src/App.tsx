import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { seedDoc } from "@repo/demo/doc";

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
            automerge
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Automerge</h1>
          <p className="text-muted-foreground">
            Scaffolded demo — wire the Automerge sync engine here (doc scenario).
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shared doc seed</CardTitle>
            <CardDescription>From @repo/demo — same data across comparable engines.</CardDescription>
          </CardHeader>
          <CardContent><p className="rounded-md border bg-muted/50 p-3 text-sm">{seedDoc.content}</p></CardContent>
        </Card>
      </main>
    </div>
  );
}
