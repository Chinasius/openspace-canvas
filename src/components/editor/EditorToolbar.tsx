import { useEditor, ElementType } from "@/lib/editor-state";
import {
  MousePointer, Move, Type, Square,
  Save, Download, Upload, FileCode, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarItem, MenubarSeparator, MenubarShortcut
} from "@/components/ui/menubar";
import { elementsToXaml, xamlToElements } from "@/lib/xaml-engine";

export default function EditorToolbar() {
  const { state, dispatch, addElement } = useEditor();

  const tools: { id: typeof state.activeTool; icon: any; label: string }[] = [
    { id: "select", icon: MousePointer, label: "Выделение" },
    { id: "move", icon: Move, label: "Перемещение" },
    { id: "text", icon: Type, label: "Текст" },
    { id: "shape", icon: Square, label: "Фигура" },
  ];

  const handleExportXaml = () => {
    const xaml = elementsToXaml(state.elements, state.rootIds);
    const blob = new Blob([xaml], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project.xaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportXaml = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xaml,.xml";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const { elements, rootIds } = xamlToElements(reader.result as string);
        dispatch({ type: "CLEAR" });
        Object.values(elements).forEach((el) => dispatch({ type: "ADD_ELEMENT", element: el }));
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSave = () => {
    localStorage.setItem("openspace-project", JSON.stringify(state));
  };

  return (
    <div className="h-10 bg-surface border-b border-border flex items-center px-2 gap-1 shrink-0">
      {/* Logo */}
      <span className="font-display text-sm text-gradient-gold mr-2 select-none tracking-wider">
        OpenSpace
      </span>

      {/* Menu */}
      <Menubar className="border-none bg-transparent h-8">
        <MenubarMenu>
          <MenubarTrigger className="text-xs text-foreground/80 hover:text-foreground">Файл</MenubarTrigger>
          <MenubarContent className="bg-surface border-border">
            <MenubarItem onClick={handleSave}>
              <Save className="w-3.5 h-3.5 mr-2" /> Сохранить <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleExportXaml}>
              <Download className="w-3.5 h-3.5 mr-2" /> Экспорт XAML
            </MenubarItem>
            <MenubarItem onClick={handleImportXaml}>
              <Upload className="w-3.5 h-3.5 mr-2" /> Импорт XAML
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => dispatch({ type: "CLEAR" })}>
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Очистить
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Tools */}
      {tools.map((t) => (
        <Button
          key={t.id}
          variant={state.activeTool === t.id ? "default" : "ghost"}
          size="icon"
          className="w-7 h-7"
          title={t.label}
          onClick={() => dispatch({ type: "SET_TOOL", tool: t.id })}
        >
          <t.icon className="w-3.5 h-3.5" />
        </Button>
      ))}

      <div className="w-px h-5 bg-border mx-1" />

      {/* Quick add elements */}
      <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
        {(["Button", "TextBlock", "Window", "Panel"] as ElementType[]).map((type) => (
          <Button
            key={type}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground hover:text-gold"
            onClick={() => addElement(type, 100 + Math.random() * 200, 100 + Math.random() * 200)}
          >
            + {type}
          </Button>
        ))}
      </div>

      {/* Zoom */}
      <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom - 0.1 })}>−</Button>
        <span className="w-12 text-center">{Math.round(state.zoom * 100)}%</span>
        <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => dispatch({ type: "SET_ZOOM", zoom: state.zoom + 0.1 })}>+</Button>
      </div>
    </div>
  );
}
