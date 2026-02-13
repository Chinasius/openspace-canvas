import React, { createContext, useContext, useReducer, useCallback } from "react";

// ---- Types ----
export type ElementType =
  | "Window" | "Panel" | "StackPanel" | "Grid"
  | "Button" | "TextBlock" | "TextBox" | "Image"
  | "CheckBox" | "RadioButton"
  | "Slider" | "ProgressBar" | "ListBox" | "ComboBox" | "TabControl";

export interface EditorElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  props: Record<string, any>;
  children: string[]; // child element IDs
  parentId: string | null;
  zIndex: number;
  locked: boolean;
  visible: boolean;
}

export interface EditorState {
  elements: Record<string, EditorElement>;
  rootIds: string[];
  selectedIds: string[];
  activeTool: "select" | "move" | "text" | "shape";
  zoom: number;
  panX: number;
  panY: number;
  gridSnap: boolean;
  gridSize: number;
}

type Action =
  | { type: "ADD_ELEMENT"; element: EditorElement }
  | { type: "UPDATE_ELEMENT"; id: string; updates: Partial<EditorElement> }
  | { type: "DELETE_ELEMENTS"; ids: string[] }
  | { type: "SELECT"; ids: string[] }
  | { type: "SET_TOOL"; tool: EditorState["activeTool"] }
  | { type: "SET_ZOOM"; zoom: number }
  | { type: "SET_PAN"; x: number; y: number }
  | { type: "MOVE_ELEMENT"; id: string; x: number; y: number }
  | { type: "RESIZE_ELEMENT"; id: string; width: number; height: number }
  | { type: "LOAD_STATE"; state: EditorState }
  | { type: "CLEAR" };

const initialState: EditorState = {
  elements: {},
  rootIds: [],
  selectedIds: [],
  activeTool: "select",
  zoom: 1,
  panX: 0,
  panY: 0,
  gridSnap: true,
  gridSize: 20,
};

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "ADD_ELEMENT": {
      const el = action.element;
      return {
        ...state,
        elements: { ...state.elements, [el.id]: el },
        rootIds: el.parentId ? state.rootIds : [...state.rootIds, el.id],
        selectedIds: [el.id],
      };
    }
    case "UPDATE_ELEMENT": {
      const existing = state.elements[action.id];
      if (!existing) return state;
      return {
        ...state,
        elements: { ...state.elements, [action.id]: { ...existing, ...action.updates } },
      };
    }
    case "DELETE_ELEMENTS": {
      const newElements = { ...state.elements };
      const idsToDelete = new Set(action.ids);
      action.ids.forEach((id) => delete newElements[id]);
      return {
        ...state,
        elements: newElements,
        rootIds: state.rootIds.filter((id) => !idsToDelete.has(id)),
        selectedIds: state.selectedIds.filter((id) => !idsToDelete.has(id)),
      };
    }
    case "SELECT":
      return { ...state, selectedIds: action.ids };
    case "SET_TOOL":
      return { ...state, activeTool: action.tool };
    case "SET_ZOOM":
      return { ...state, zoom: Math.max(0.1, Math.min(5, action.zoom)) };
    case "SET_PAN":
      return { ...state, panX: action.x, panY: action.y };
    case "MOVE_ELEMENT": {
      const el = state.elements[action.id];
      if (!el || el.locked) return state;
      const x = state.gridSnap ? Math.round(action.x / state.gridSize) * state.gridSize : action.x;
      const y = state.gridSnap ? Math.round(action.y / state.gridSize) * state.gridSize : action.y;
      return {
        ...state,
        elements: { ...state.elements, [action.id]: { ...el, x, y } },
      };
    }
    case "RESIZE_ELEMENT": {
      const el = state.elements[action.id];
      if (!el || el.locked) return state;
      return {
        ...state,
        elements: { ...state.elements, [action.id]: { ...el, width: Math.max(20, action.width), height: Math.max(20, action.height) } },
      };
    }
    case "LOAD_STATE":
      return action.state;
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
  addElement: (type: ElementType, x?: number, y?: number) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

let idCounter = 0;
function genId() {
  return `el_${Date.now()}_${idCounter++}`;
}

const defaultSizes: Record<ElementType, { w: number; h: number }> = {
  Window: { w: 400, h: 300 },
  Panel: { w: 300, h: 200 },
  StackPanel: { w: 200, h: 300 },
  Grid: { w: 300, h: 300 },
  Button: { w: 120, h: 40 },
  TextBlock: { w: 160, h: 30 },
  TextBox: { w: 200, h: 36 },
  Image: { w: 200, h: 150 },
  CheckBox: { w: 140, h: 30 },
  RadioButton: { w: 140, h: 30 },
  Slider: { w: 200, h: 30 },
  ProgressBar: { w: 200, h: 20 },
  ListBox: { w: 180, h: 200 },
  ComboBox: { w: 180, h: 36 },
  TabControl: { w: 300, h: 250 },
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addElement = useCallback(
    (type: ElementType, x = 100, y = 100) => {
      const size = defaultSizes[type];
      const el: EditorElement = {
        id: genId(),
        type,
        name: `${type}_${Object.keys(state.elements).length + 1}`,
        x,
        y,
        width: size.w,
        height: size.h,
        props: { content: type === "Button" ? "Button" : type === "TextBlock" ? "Text" : "", value: 50 },
        children: [],
        parentId: null,
        zIndex: Object.keys(state.elements).length,
        locked: false,
        visible: true,
      };
      dispatch({ type: "ADD_ELEMENT", element: el });
    },
    [state.elements]
  );

  return (
    <EditorContext.Provider value={{ state, dispatch, addElement }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
