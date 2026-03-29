"use client"

import React, { useState } from "react"
import { ChevronRight, PlayCircle, FileText } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ContentItem } from "@/types"
import Content from "./content"

export function CourseItem({ item }: { item: ContentItem & { children: ContentItem[] } }) {
    const [isOpen, setIsOpen] = useState(false)
    const hasChildren = (item.children && item.children.length > 0) || item.type === 'folder'

    if (!hasChildren) {
        return (
            <Content content={item} >
                <div className="flex items-center w-full gap-2 p-3 hover:bg-accent rounded-md transition-all group cursor-pointer">
                    {item.type === "question" ? (<PlayCircle className="h-4 w-4 text-muted-foreground" />) : (<FileText className="h-4 w-4 text-muted-foreground" />)}
                    <span className="font-medium text-sm">{item.name}</span>
                </div>
            </Content>
        )
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <CollapsibleTrigger className="flex items-center w-full gap-2 p-3 hover:bg-accent rounded-md transition-all group">
                <ChevronRight
                    className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-90"
                    )}
                />
                <span className="font-medium text-sm">{item.name}</span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 flex flex-col gap-1 mt-1 border-l ml-5">
                {item.children.map((child: ContentItem) => (
                    <Content key={child.id} content={child}>

                        <div className="flex items-center gap-2 p-2 hover:bg-accent/50 rounded-md cursor-pointer group w-full">
                            {child.type === "question" ? (<PlayCircle className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />) : (<FileText className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />)}
                            <span className="text-sm">{child.name}</span>
                        </div>
                    </Content>

                ))}
            </CollapsibleContent>
        </Collapsible>
    )
}