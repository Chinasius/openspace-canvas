import { useState } from "react";
import { EditorProvider } from "@/lib/editor-state";
import EditorToolbar from "@/components/editor/EditorToolbar";
import LayersPanel from "@/components/editor/LayersPanel";
import EditorCanvas from "@/components/editor/EditorCanvas";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import XamlPanel from "@/components/editor/XamlPanel";
import ProjectSetupDialog from "@/components/editor/ProjectSetupDialog";
import { motion } from "framer-motion";

export default function EditorPage() {
  const [projectName, setProjectName] = useState<string | null>(null);

  if (!projectName) {
    return <ProjectSetupDialog onComplete={(name) => setProjectName(name)} />;
  }

  return (
    <EditorProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-screen w-screen flex flex-col bg-background overflow-hidden"
      >
        <EditorToolbar projectName={projectName} />
        <div className="flex flex-1 overflow-hidden">
          <LayersPanel />
          <div className="flex flex-col flex-1 overflow-hidden">
            <EditorCanvas />
            <XamlPanel />
          </div>
          <PropertiesPanel />
        </div>
      </motion.div>
    </EditorProvider>
  );
}
