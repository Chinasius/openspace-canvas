import { useEditor } from "@/lib/editor-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PropertiesPanel() {
  const { state, dispatch } = useEditor();
  const selectedId = state.selectedIds[0];
  const el = selectedId ? state.elements[selectedId] : null;

  if (!el) {
    return (
      <div className="w-56 bg-surface border-l border-border flex flex-col shrink-0">
        <div className="h-8 border-b border-border flex items-center px-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Свойства</span>
        </div>
        <p className="text-xs text-muted-foreground p-3 text-center">Выберите элемент</p>
      </div>
    );
  }

  const update = (updates: Record<string, any>) =>
    dispatch({ type: "UPDATE_ELEMENT", id: el.id, updates });

  const updateProp = (key: string, value: any) =>
    dispatch({ type: "UPDATE_ELEMENT", id: el.id, updates: { props: { ...el.props, [key]: value } } });

  return (
    <div className="w-56 bg-surface border-l border-border flex flex-col shrink-0 overflow-hidden">
      <div className="h-8 border-b border-border flex items-center px-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Свойства</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Тип</Label>
          <p className="text-sm text-gold">{el.type}</p>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Имя</Label>
          <Input
            value={el.name}
            onChange={(e) => update({ name: e.target.value })}
            className="h-7 text-xs bg-background"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">X</Label>
            <Input
              type="number"
              value={el.x}
              onChange={(e) => update({ x: parseInt(e.target.value) || 0 })}
              className="h-7 text-xs bg-background"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Y</Label>
            <Input
              type="number"
              value={el.y}
              onChange={(e) => update({ y: parseInt(e.target.value) || 0 })}
              className="h-7 text-xs bg-background"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Ширина</Label>
            <Input
              type="number"
              value={el.width}
              onChange={(e) => dispatch({ type: "RESIZE_ELEMENT", id: el.id, width: parseInt(e.target.value) || 20, height: el.height })}
              className="h-7 text-xs bg-background"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Высота</Label>
            <Input
              type="number"
              value={el.height}
              onChange={(e) => dispatch({ type: "RESIZE_ELEMENT", id: el.id, width: el.width, height: parseInt(e.target.value) || 20 })}
              className="h-7 text-xs bg-background"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Z-Index</Label>
          <Input
            type="number"
            value={el.zIndex}
            onChange={(e) => update({ zIndex: parseInt(e.target.value) || 0 })}
            className="h-7 text-xs bg-background"
          />
        </div>

        {el.props.content !== undefined && (
          <div>
            <Label className="text-xs text-muted-foreground">Контент</Label>
            <Input
              value={el.props.content}
              onChange={(e) => updateProp("content", e.target.value)}
              className="h-7 text-xs bg-background"
            />
          </div>
        )}

        {["Slider", "ProgressBar"].includes(el.type) && (
          <div>
            <Label className="text-xs text-muted-foreground">Значение</Label>
            <Input
              type="number"
              value={el.props.value}
              onChange={(e) => updateProp("value", parseInt(e.target.value) || 0)}
              className="h-7 text-xs bg-background"
            />
          </div>
        )}

        <div>
          <Label className="text-xs text-muted-foreground">Фон</Label>
          <Input
            value={el.props.background || ""}
            onChange={(e) => updateProp("background", e.target.value)}
            placeholder="#333333"
            className="h-7 text-xs bg-background"
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Цвет текста</Label>
          <Input
            value={el.props.foreground || ""}
            onChange={(e) => updateProp("foreground", e.target.value)}
            placeholder="#ffffff"
            className="h-7 text-xs bg-background"
          />
        </div>
      </div>
    </div>
  );
}
