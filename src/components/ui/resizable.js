import { jsx as _jsx } from "react/jsx-runtime";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
// Placeholder components for resizable panels
// The actual react-resizable-panels API may differ from expectations
const ResizablePanelGroup = ({ className, children, ...props }) => (_jsx("div", { className: cn("flex h-full w-full", className), ...props, children: children }));
const ResizablePanel = ({ children, ...props }) => (_jsx("div", { ...props, children: children }));
const ResizableHandle = ({ withHandle, className, ...props }) => (_jsx("div", { className: cn("relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2", className), ...props, children: withHandle && (_jsx("div", { className: "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border", children: _jsx(GripVertical, { className: "h-2.5 w-2.5" }) })) }));
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
