import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

const demos = [
  { name: "Electric SQL", status: "Coming soon" },
  { name: "Zero", status: "Coming soon" },
  { name: "Jazz", status: "Coming soon" },
  { name: "LiveStore", status: "Coming soon" },
  { name: "PowerSync", status: "Coming soon" },
];

export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">sync</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Local-first sync engine playground
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Compare Electric SQL, CRDTs, Zero, Jazz, LiveStore, PowerSync, and
            more — each as its own app, with shared UI from{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-sm">@repo/ui</code>.
          </p>
        </div>

        <div className="grid gap-4">
          {demos.map((demo) => (
            <Card key={demo.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{demo.name}</CardTitle>
                  <CardDescription>{demo.status}</CardDescription>
                </div>
                <Button variant="outline" disabled>
                  Open
                </Button>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
