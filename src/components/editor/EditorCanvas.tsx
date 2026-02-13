import React, { useRef, useState, useCallback, useEffect } from "react";
import { useEditor, EditorElement } from "@/lib/editor-state";
import { cn } from "@/lib/utils";

// Render individual element on canvas
function CanvasElement({ el }: { el: EditorElement }) {
  const { state, dispatch } = useEditor();
  const isSelected = state.selectedIds.includes(el.id);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "SELECT", ids: e.shiftKey ? [...state.selectedIds, el.id] : [el.id] });
    if (el.locked) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, elX: el.x, elY: el.y };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        const dx = (e.clientX - dragStart.current.x) / state.zoom;
        const dy = (e.clientY - dragStart.current.y) / state.zoom;
        dispatch({ type: "MOVE_ELEMENT", id: el.id, x: dragStart.current.elX + dx, y: dragStart.current.elY + dy });
      }
      if (resizing) {
        const dx = (e.clientX - resizeStart.current.x) / state.zoom;
        const dy = (e.clientY - resizeStart.current.y) / state.zoom;
        dispatch({ type: "RESIZE_ELEMENT", id: el.id, width: resizeStart.current.w + dx, height: resizeStart.current.h + dy });
      }
    },
    [dragging, resizing, el.id, state.zoom, dispatch]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    setResizing(false);
  }, []);

  useEffect(() => {
    if (dragging || resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, resizing, handleMouseMove, handleMouseUp]);

  if (!el.visible) return null;

  

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: el.width, h: el.height };
  };

  const renderContent = () => {
    const style: React.CSSProperties = {
      width: "100%",
      height: "100%",
      ...(el.props.background ? { backgroundColor: el.props.background } : {}),
      ...(el.props.foreground ? { color: el.props.foreground } : {}),
      ...(el.props.fontSize ? { fontSize: `${el.props.fontSize}px` } : {}),
    };

    switch (el.type) {
      case "Window":
        return (
          <div className="h-full flex flex-col bg-[#1a1a1a] border border-[#333] rounded overflow-hidden" style={style}>
            <div className="h-6 bg-[#252525] border-b border-[#333] flex items-center px-2 shrink-0">
              <span className="text-[10px] text-[#999]">{el.props.content || el.name}</span>
              <div className="ml-auto flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#555]" />
                <div className="w-2 h-2 rounded-full bg-[#555]" />
                <div className="w-2 h-2 rounded-full bg-[#555]" />
              </div>
            </div>
            <div className="flex-1" />
          </div>
        );
      case "Button":
        return (
          <button className="w-full h-full bg-gold/80 text-background text-xs font-medium rounded hover:bg-gold transition-colors" style={style}>
            {el.props.content || "Button"}
          </button>
        );
      case "TextBlock":
        return <p className="text-xs text-foreground" style={style}>{el.props.content || "TextBlock"}</p>;
      case "TextBox":
        return <div className="w-full h-full border border-[#444] bg-[#1a1a1a] rounded px-2 flex items-center text-xs text-[#888]" style={style}>TextBox</div>;
      case "CheckBox":
        return (
          <div className="flex items-center gap-2 text-xs" style={style}>
            <div className="w-3.5 h-3.5 border border-[#555] rounded-sm" />
            <span>{el.props.content || "CheckBox"}</span>
          </div>
        );
      case "RadioButton":
        return (
          <div className="flex items-center gap-2 text-xs" style={style}>
            <div className="w-3.5 h-3.5 border border-[#555] rounded-full" />
            <span>{el.props.content || "RadioButton"}</span>
          </div>
        );
      case "Slider":
        return (
          <div className="w-full h-full flex items-center px-1" style={style}>
            <div className="w-full h-1.5 bg-[#333] rounded-full relative">
              <div className="absolute h-full bg-gold/70 rounded-full" style={{ width: `${el.props.value || 50}%` }} />
              <div className="absolute w-3 h-3 bg-gold rounded-full -top-[3px]" style={{ left: `calc(${el.props.value || 50}% - 6px)` }} />
            </div>
          </div>
        );
      case "ProgressBar":
        return (
          <div className="w-full h-full flex items-center" style={style}>
            <div className="w-full h-2 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full bg-gold/70 rounded-full" style={{ width: `${el.props.value || 50}%` }} />
            </div>
          </div>
        );
      case "Image":
        return <div className="w-full h-full bg-[#1a1a1a] border border-dashed border-[#444] flex items-center justify-center text-[10px] text-[#555]" style={style}>Image</div>;
      case "Panel":
      case "StackPanel":
      case "Grid":
        return <div className="w-full h-full border border-dashed border-[#444] bg-[#111]/50 flex items-center justify-center text-[10px] text-[#555]" style={style}>{el.type}</div>;
      case "ListBox":
        return (
          <div className="w-full h-full border border-[#444] bg-[#1a1a1a] rounded overflow-hidden" style={style}>
            {["Item 1", "Item 2", "Item 3"].map((item) => (
              <div key={item} className="px-2 py-1 text-[10px] border-b border-[#333] text-[#888] hover:bg-[#252525]">{item}</div>
            ))}
          </div>
        );
      case "ComboBox":
        return (
          <div className="w-full h-full border border-[#444] bg-[#1a1a1a] rounded flex items-center px-2 text-xs text-[#888]" style={style}>
            <span className="flex-1">Select...</span>
            <span className="text-[10px]">▼</span>
          </div>
        );
      case "TabControl":
        return (
          <div className="w-full h-full border border-[#444] bg-[#1a1a1a] rounded overflow-hidden" style={style}>
            <div className="flex border-b border-[#333]">
              {["Tab 1", "Tab 2", "Tab 3"].map((t, i) => (
                <div key={t} className={cn("px-3 py-1 text-[10px]", i === 0 ? "bg-[#252525] text-gold/70 border-b border-gold/50" : "text-[#666]")}>{t}</div>
              ))}
            </div>
            <div className="p-2 text-[10px] text-[#555]">Tab content</div>
          </div>
        );
      default:
        return <div className="w-full h-full bg-secondary" style={style} />;
    }
  };

  return (
    <div
      className={cn("absolute cursor-move", isSelected && "ring-1 ring-gold/60")}
      style={{
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        zIndex: el.zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderContent()}
      {/* Resize handle */}
      {isSelected && !el.locked && (
        <div
          className="absolute -right-1 -bottom-1 w-3 h-3 bg-gold border border-background cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
}

export default function EditorCanvas() {
  const { state, dispatch } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [panning, setPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      dispatch({ type: "SET_ZOOM", zoom: state.zoom + delta });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
      dispatch({ type: "SELECT", ids: [] });
      if (e.button === 1 || (e.button === 0 && state.activeTool === "move")) {
        setPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY, panX: state.panX, panY: state.panY };
      }
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (panning) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        dispatch({ type: "SET_PAN", x: panStart.current.panX + dx, y: panStart.current.panY + dy });
      }
    };
    const onUp = () => setPanning(false);

    if (panning) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    }
  }, [panning, dispatch]);

  const sortedElements = state.rootIds
    .map((id) => state.elements[id])
    .filter(Boolean)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-hidden bg-[#050505] relative cursor-crosshair"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      data-canvas="true"
    >
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(40 10% 18% / 0.3) 1px, transparent 1px)`,
          backgroundSize: `${state.gridSize * state.zoom}px ${state.gridSize * state.zoom}px`,
          backgroundPosition: `${state.panX}px ${state.panY}px`,
        }}
      />

      {/* Elements */}
      <div
        style={{
          transform: `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`,
          transformOrigin: "0 0",
        }}
        data-canvas="true"
      >
        {sortedElements.map((el) => (
          <CanvasElement key={el.id} el={el} />
        ))}
      </div>

      {/* Origin marker */}
      <div
        className="absolute w-4 h-4 pointer-events-none"
        style={{
          left: state.panX - 8,
          top: state.panY - 8,
        }}
      >
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold/20" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gold/20" />
      </div>
    </div>
  );
}
