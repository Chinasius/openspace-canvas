import { useState, useEffect } from "react";
import { useEditor } from "@/lib/editor-state";
import { elementsToXaml, xamlToElements } from "@/lib/xaml-engine";
import { cn } from "@/lib/utils";

export default function XamlPanel() {
  const { state, dispatch } = useEditor();
  const [xaml, setXaml] = useState("");
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  // Sync elements -> XAML
  useEffect(() => {
    const generated = elementsToXaml(state.elements, state.rootIds);
    setXaml(generated);
    setError("");
  }, [state.elements, state.rootIds]);

  const handleXamlChange = (value: string) => {
    setXaml(value);
    try {
      const { elements, rootIds } = xamlToElements(value);
      dispatch({ type: "CLEAR" });
      Object.values(elements).forEach((el) => dispatch({ type: "ADD_ELEMENT", element: el }));
      setError("");
    } catch (e) {
      setError("Ошибка парсинга XAML");
    }
  };

  return (
    <div className={cn("border-t border-border bg-surface flex flex-col shrink-0 transition-all", collapsed ? "h-8" : "h-48")}>
      <div
        className="h-8 flex items-center px-3 cursor-pointer hover:bg-surface-hover shrink-0"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">XAML</span>
        {error && <span className="ml-2 text-[10px] text-destructive">{error}</span>}
        <span className="ml-auto text-xs text-muted-foreground">{collapsed ? "▲" : "▼"}</span>
      </div>
      {!collapsed && (
        <textarea
          value={xaml}
          onChange={(e) => handleXamlChange(e.target.value)}
          className="flex-1 bg-background text-foreground font-mono text-xs p-3 resize-none outline-none border-none"
          spellCheck={false}
        />
      )}
    </div>
  );
}
