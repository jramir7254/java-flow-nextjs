"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { BaseEditor } from './base-editor'

export interface CodeFile {
    id: string;
    name: string;
    content: string;
    isEditable: boolean;
    language?: string;
}

interface FullEditorProps {
    files: CodeFile[];
    onFileChange?: (id: string, content: string) => void;
    className?: string;
    onMount?: (editor: any, monaco: any, file: CodeFile) => void;
}

export function FullEditor({ files, onFileChange, className, onMount }: FullEditorProps) {
    const [activeFileId, setActiveFileId] = useState<string | null>(null)

    useEffect(() => {
        if (files.length > 0 && !activeFileId) {
            setActiveFileId(files[0].id)
        }
    }, [files, activeFileId])

    const activeFile = files.find((f) => f.id === activeFileId)

    const handleEditorChange = (value: string | undefined) => {
        if (activeFileId && onFileChange) {
            onFileChange(activeFileId, value || "")
        }
    }

    if (files.length === 0) {
        return (
            <div className="flex h-full items-center justify-center bg-muted/10 text-muted-foreground italic">
                No files to display
            </div>
        )
    }

    return (
        <div className={cn("flex h-full flex-col bg-background", className)}>
            {/* Tab Bar */}
            <div className="flex shrink-0 border-b bg-muted/5 overflow-x-auto no-scrollbar">
                {files.map((file) => {
                    const isActive = file.id === activeFileId
                    return (
                        <button
                            key={file.id}
                            onClick={() => setActiveFileId(file.id)}
                            className={cn(
                                "group relative flex items-center gap-2 px-4 py-2 text-sm transition-colors border-r",
                                isActive
                                    ? "bg-background text-foreground font-medium"
                                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                            )}
                        >
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            {!file.isEditable && (
                                <span className="text-[10px] opacity-50 uppercase font-bold tracking-tight">
                                    RO
                                </span>
                            )}
                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden">
                {activeFile ? (
                    <BaseEditor
                        key={activeFile.id} // Key ensures re-mount or fresh state when switching files
                        value={activeFile.content}
                        language={activeFile.language || "typescript"}
                        isEditable={activeFile.isEditable}
                        onChange={handleEditorChange}
                        onMount={(editor, monaco) => onMount?.(editor, monaco, activeFile)}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select a file to start editing
                    </div>
                )}
            </div>
        </div>
    )
}
