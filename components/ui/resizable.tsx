"use client"

import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  orientation = "horizontal",
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      orientation={orientation}
      aria-orientation={orientation}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex items-center justify-center bg-transparent outline-none shrink-0",
        "aria-[orientation=vertical]:w-2.5 aria-[orientation=vertical]:h-full aria-[orientation=vertical]:cursor-col-resize",
        "aria-[orientation=horizontal]:h-2.5 aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-row-resize",
        "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
        "before:rounded-[2px] before:bg-primary before:z-10",
        "before:opacity-0 before:transition-[opacity,background-color] before:duration-[400ms]",
        "hover:before:opacity-100 data-[resize-handle-state=drag]:before:opacity-100",
        "before:w-[2px] before:h-[30px] aria-[orientation=horizontal]:before:w-[30px] aria-[orientation=horizontal]:before:h-[2px]",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border aria-[orientation=horizontal]:rotate-90" />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
