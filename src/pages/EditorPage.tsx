import { EditorProvider } from "@/lib/editor-state";
import EditorToolbar from "@/components/editor/EditorToolbar";
import LayersPanel from "@/components/editor/LayersPanel";
import EditorCanvas from "@/components/editor/EditorCanvas";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import XamlPanel from "@/components/editor/XamlPanel";

export default function EditorPage() {
  return (
    <EditorProvider>
      <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
        <EditorToolbar />
        <div className="flex flex-1 overflow-hidden">
          <LayersPanel />
          <div className="flex flex-col flex-1 overflow-hidden">
            <EditorCanvas />
            <XamlPanel />
          </div>
          <PropertiesPanel />
        </div>
      </div>
    </EditorProvider>
  );
}
