"use client"

import React, { useState } from "react"
import { ChevronRight, PlayCircle, FileText } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function CourseItem({ item }: { item: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const hasChildren = item.children && item.children.length > 0

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <CollapsibleTrigger className="flex items-center w-full gap-2 p-3 hover:bg-accent rounded-md transition-all group">
                {hasChildren ? (
                    <ChevronRight className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-90"
                    )} />
                ) : (
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium text-sm">{item.name}</span>
            </CollapsibleTrigger>

            {hasChildren && (
                <CollapsibleContent className="pl-6 flex flex-col gap-1 mt-1 border-l ml-5">
                    {item.children.map((child: any) => (
                        <div key={child.id} className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md cursor-pointer group">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                            <span className="text-sm">{child.name}</span>
                        </div>
                    ))}
                </CollapsibleContent>
            )}
        </Collapsible>
    )
}