import React, { useState, useRef } from "react";
import { useEditor } from "@/lib/editor-state";
import { Eye, EyeOff, Lock, Unlock, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LayersPanel() {
  const { state, dispatch } = useEditor();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const dragYRef = useRef(0);

  const sortedElements = [...state.rootIds]
    .map((id) => state.elements[id])
    .filter(Boolean)
    .sort((a, b) => b.zIndex - a.zIndex);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    // Transparent drag image
    const img = new Image();
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragId) setOverId(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setOverId(null);
      return;
    }

    const dragEl = state.elements[dragId];
    const targetEl = state.elements[targetId];
    if (!dragEl || !targetEl) return;

    // Swap zIndex values
    dispatch({ type: "UPDATE_ELEMENT", id: dragId, updates: { zIndex: targetEl.zIndex } });
    dispatch({ type: "UPDATE_ELEMENT", id: targetId, updates: { zIndex: dragEl.zIndex } });

    setDragId(null);
    setOverId(null);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setOverId(null);
  };

  return (
    <div className="w-56 bg-surface border-r border-border flex flex-col shrink-0 overflow-hidden">
      <div className="h-8 border-b border-border flex items-center px-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Слои</span>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {sortedElements.length === 0 && (
          <p className="text-xs text-muted-foreground p-3 text-center">Добавьте элементы на холст</p>
        )}
        {sortedElements.map((el) => (
          <div
            key={el.id}
            draggable
            onDragStart={(e) => handleDragStart(e, el.id)}
            onDragOver={(e) => handleDragOver(e, el.id)}
            onDrop={(e) => handleDrop(e, el.id)}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex items-center gap-1 px-1 py-1 rounded text-xs cursor-pointer hover:bg-surface-hover group transition-all duration-150",
              state.selectedIds.includes(el.id) && "bg-gold/10 border border-gold/30",
              dragId === el.id && "opacity-40",
              overId === el.id && dragId !== el.id && "border-t-2 border-t-gold/60"
            )}
            onClick={() => dispatch({ type: "SELECT", ids: [el.id] })}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground/40 shrink-0 cursor-grab active:cursor-grabbing" />
            <span className="text-gold/60 text-[10px] w-7 shrink-0">{el.type.slice(0, 3)}</span>
            <span className="flex-1 truncate text-foreground/80">{el.name}</span>

            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "UPDATE_ELEMENT", id: el.id, updates: { visible: !el.visible } });
              }}
            >
              {el.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "UPDATE_ELEMENT", id: el.id, updates: { locked: !el.locked } });
              }}
            >
              {el.locked ? <Lock className="w-3 h-3 text-gold/60" /> : <Unlock className="w-3 h-3" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 opacity-0 group-hover:opacity-100 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "DELETE_ELEMENTS", ids: [el.id] });
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
