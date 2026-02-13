import { EditorElement, ElementType } from "./editor-state";

// Generate XAML from elements
export function elementsToXaml(elements: Record<string, EditorElement>, rootIds: string[]): string {
  const indent = (level: number) => "  ".repeat(level);

  function renderElement(el: EditorElement, level: number): string {
    const attrs: string[] = [];
    attrs.push(`Name="${el.name}"`);
    attrs.push(`Width="${el.width}"`);
    attrs.push(`Height="${el.height}"`);
    attrs.push(`Canvas.Left="${el.x}"`);
    attrs.push(`Canvas.Top="${el.y}"`);

    if (el.props.content) attrs.push(`Content="${el.props.content}"`);
    if (el.props.value !== undefined && ["Slider", "ProgressBar"].includes(el.type))
      attrs.push(`Value="${el.props.value}"`);
    if (el.props.background) attrs.push(`Background="${el.props.background}"`);
    if (el.props.foreground) attrs.push(`Foreground="${el.props.foreground}"`);
    if (el.props.fontSize) attrs.push(`FontSize="${el.props.fontSize}"`);
    if (!el.visible) attrs.push(`Visibility="Collapsed"`);

    const children = el.children
      .map((cid) => elements[cid])
      .filter(Boolean);

    if (children.length === 0) {
      return `${indent(level)}<${el.type} ${attrs.join(" ")} />`;
    }

    const childXaml = children.map((c) => renderElement(c, level + 1)).join("\n");
    return `${indent(level)}<${el.type} ${attrs.join(" ")}>\n${childXaml}\n${indent(level)}</${el.type}>`;
  }

  const rootElements = rootIds.map((id) => elements[id]).filter(Boolean);
  const body = rootElements.map((el) => renderElement(el, 1)).join("\n");

  return `<Canvas xmlns="openspace">\n${body}\n</Canvas>`;
}

// Parse XAML to elements (simplified parser)
export function xamlToElements(xaml: string): { elements: Record<string, EditorElement>; rootIds: string[] } {
  const elements: Record<string, EditorElement> = {};
  const rootIds: string[] = [];

  // Simple regex-based parser for self-closing and paired tags
  const tagRegex = /<(\w+)\s([^>]*?)\/?>|<(\w+)\s([^>]*?)>([\s\S]*?)<\/\3>/g;

  const validTypes = new Set<string>([
    "Window", "Panel", "StackPanel", "Grid",
    "Button", "TextBlock", "TextBox", "Image",
    "CheckBox", "RadioButton",
    "Slider", "ProgressBar", "ListBox", "ComboBox", "TabControl",
  ]);

  let match;
  let counter = 0;

  function parseAttrs(attrStr: string): Record<string, string> {
    const result: Record<string, string> = {};
    const attrRegex = /(\w+(?:\.\w+)?)="([^"]*)"/g;
    let m;
    while ((m = attrRegex.exec(attrStr)) !== null) {
      result[m[1]] = m[2];
    }
    return result;
  }

  while ((match = tagRegex.exec(xaml)) !== null) {
    const type = (match[1] || match[3]) as string;
    const attrStr = match[2] || match[4] || "";

    if (type === "Canvas" || !validTypes.has(type)) continue;

    const attrs = parseAttrs(attrStr);
    const id = `el_import_${counter++}`;

    const el: EditorElement = {
      id,
      type: type as ElementType,
      name: attrs.Name || `${type}_${counter}`,
      x: parseInt(attrs["Canvas.Left"] || "100"),
      y: parseInt(attrs["Canvas.Top"] || "100"),
      width: parseInt(attrs.Width || "120"),
      height: parseInt(attrs.Height || "40"),
      props: {
        content: attrs.Content || "",
        value: attrs.Value ? parseInt(attrs.Value) : 50,
        background: attrs.Background || "",
        foreground: attrs.Foreground || "",
        fontSize: attrs.FontSize || "",
      },
      children: [],
      parentId: null,
      zIndex: counter,
      locked: false,
      visible: attrs.Visibility !== "Collapsed",
    };

    elements[id] = el;
    rootIds.push(id);
  }

  return { elements, rootIds };
}
