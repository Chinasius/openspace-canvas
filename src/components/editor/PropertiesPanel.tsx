import { useEditor } from "@/lib/editor-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

function NumericField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</Label>
      <div className="flex items-center h-7 rounded-md border border-border bg-background overflow-hidden">
        <button
          onClick={() => onChange(value - step)}
          className="w-6 h-full flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-surface-hover transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="flex-1 h-full bg-transparent text-center text-xs text-foreground outline-none border-x border-border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => onChange(value + step)}
          className="w-6 h-full flex items-center justify-center text-muted-foreground hover:text-gold hover:bg-surface-hover transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

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

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Type badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 font-mono">
            {el.type}
          </span>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Имя</Label>
          <Input
            value={el.name}
            onChange={(e) => update({ name: e.target.value })}
            className="h-7 text-xs bg-background"
          />
        </div>

        {/* Position */}
        <div>
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">Позиция</p>
          <div className="grid grid-cols-2 gap-2">
            <NumericField label="X" value={el.x} onChange={(v) => update({ x: v })} step={state.gridSnap ? state.gridSize : 1} />
            <NumericField label="Y" value={el.y} onChange={(v) => update({ y: v })} step={state.gridSnap ? state.gridSize : 1} />
          </div>
        </div>

        {/* Size */}
        <div>
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">Размер</p>
          <div className="grid grid-cols-2 gap-2">
            <NumericField
              label="W"
              value={el.width}
              onChange={(v) => dispatch({ type: "RESIZE_ELEMENT", id: el.id, width: v, height: el.height })}
            />
            <NumericField
              label="H"
              value={el.height}
              onChange={(v) => dispatch({ type: "RESIZE_ELEMENT", id: el.id, width: el.width, height: v })}
            />
          </div>
        </div>

        {/* Z-Index */}
        <NumericField label="Z-Index" value={el.zIndex} onChange={(v) => update({ zIndex: v })} />

        {/* Content */}
        {el.props.content !== undefined && (
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Контент</Label>
            <Input
              value={el.props.content}
              onChange={(e) => updateProp("content", e.target.value)}
              className="h-7 text-xs bg-background"
            />
          </div>
        )}

        {/* Value (Slider, ProgressBar) */}
        {["Slider", "ProgressBar"].includes(el.type) && (
          <NumericField label="Значение" value={el.props.value} onChange={(v) => updateProp("value", v)} />
        )}

        {/* Colors */}
        <div>
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-2">Стили</p>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Фон</Label>
              <div className="flex gap-1.5">
                <div
                  className="w-7 h-7 rounded border border-border shrink-0"
                  style={{ backgroundColor: el.props.background || "transparent" }}
                />
                <Input
                  value={el.props.background || ""}
                  onChange={(e) => updateProp("background", e.target.value)}
                  placeholder="#333"
                  className="h-7 text-xs bg-background font-mono"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Текст</Label>
              <div className="flex gap-1.5">
                <div
                  className="w-7 h-7 rounded border border-border shrink-0"
                  style={{ backgroundColor: el.props.foreground || "#fff" }}
                />
                <Input
                  value={el.props.foreground || ""}
                  onChange={(e) => updateProp("foreground", e.target.value)}
                  placeholder="#fff"
                  className="h-7 text-xs bg-background font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
