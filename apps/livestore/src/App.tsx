import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { seedTodos } from "@repo/demo/todo";

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
            livestore
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">LiveStore</h1>
          <p className="text-muted-foreground">
            Scaffolded demo — wire the LiveStore sync engine here (todo scenario).
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shared todo seed</CardTitle>
            <CardDescription>From @repo/demo — same data across comparable engines.</CardDescription>
          </CardHeader>
          <CardContent><ul className="space-y-2 text-sm">
            {seedTodos.map((todo) => (
              <li key={todo.id} className="rounded-md border bg-muted/50 px-3 py-2">
                {todo.title}
              </li>
            ))}
          </ul></CardContent>
        </Card>
      </main>
    </div>
  );
}
