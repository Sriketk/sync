import { createFileRoute } from "@tanstack/react-router";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebrtcProvider } from "y-webrtc";
import { Editor } from "../components/Editor";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-svh bg-background p-8">
      <Editor
        onReady={(quill) => {
          const ydoc = new Y.Doc();
          const ytext = ydoc.getText("quill");
          const provider = new WebrtcProvider("quill-demo-room", ydoc);
          const binding = new QuillBinding(ytext, quill, provider.awareness);

          return () => {
            binding.destroy();
            provider.destroy();
            ydoc.destroy();
          };
        }}
      />
    </div>
  );
}
