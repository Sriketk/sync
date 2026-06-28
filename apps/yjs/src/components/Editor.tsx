import Quill, { type Delta } from "quill";
import QuillCursors from "quill-cursors";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  type Ref,
} from "react";

Quill.register("modules/cursors", QuillCursors);

function assignRef(ref: Ref<Quill | null>, value: Quill | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export type EditorProps = {
  readOnly?: boolean;
  defaultValue?: Delta;
  onTextChange?: (
    delta: Delta,
    oldContent: Delta,
    source: string,
  ) => void;
  onSelectionChange?: (range: unknown) => void;
  /** Yjs hook — runs after Quill init. Return value runs on cleanup. */
  onReady?: (quill: Quill) => void | (() => void);
};

/**
 * Uncontrolled Quill editor — official React pattern:
 * https://quilljs.com/playground/react
 */
export const Editor = forwardRef<Quill | null, EditorProps>(
  function Editor(
    {
      readOnly = false,
      defaultValue,
      onTextChange,
      onSelectionChange,
      onReady,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const onReadyRef = useRef(onReady);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
      onReadyRef.current = onReady;
    });

    useEffect(() => {
      if (typeof ref === "function") return;
      ref?.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div"),
      );

      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: "Start collaborating...",
        modules: {
          cursors: true,
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
          ],
          history: {
            userOnly: true,
          },
        },
      });

      assignRef(ref, quill);

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (delta, oldContent, source) => {
        onTextChangeRef.current?.(delta, oldContent, source);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (range) => {
        onSelectionChangeRef.current?.(range);
      });

      const cleanupReady = onReadyRef.current?.(quill);

      return () => {
        cleanupReady?.();
        assignRef(ref, null);
        container.innerHTML = "";
      };
    }, [ref]);

    return <div ref={containerRef} />;
  },
);

Editor.displayName = "Editor";
