"use client"

import React, { useState, useEffect } from 'react'
import { Tables } from '@/types/supabase'
import { FullEditor, CodeFile } from '@/components/code-editor/full-editor'
import type * as Monaco from 'monaco-editor';
import { useTelemetry } from '@/providers/telemetry-provider';

interface CodeEditorPaneProps {
    codeFiles?: Tables<"code_files">[];
    onFilesChange?: (files: CodeFile[]) => void;
}

export default function CodeEditorPane({ codeFiles, onFilesChange }: CodeEditorPaneProps) {
    const telemetry = useTelemetry();
    const [localFiles, setLocalFiles] = useState<CodeFile[]>([]);

    useEffect(() => {
        if (codeFiles) {
            const newFiles = codeFiles.map((f) => ({
                id: f.id,
                name: f.file_name,
                content: f.initial_content,
                isEditable: f.is_editable ?? false,
                language: getLanguage(f.file_name)
            }));
            setLocalFiles(newFiles);
            onFilesChange?.(newFiles);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeFiles]);

    const handleFileChange = (id: string, newContent: string) => {
        setLocalFiles(prev => {
            const next = prev.map(f => f.id === id ? { ...f, content: newContent } : f);
            onFilesChange?.(next);
            return next;
        });
    }

    const handleEditorMount = (editor: any, monaco: any, file: CodeFile) => {
        editor.onDidChangeModelContent((event: Monaco.editor.IModelContentChangedEvent) => {
            const isUndo = event.isUndoing;
            const isRedo = event.isRedoing;
            event.changes.forEach((change: Monaco.editor.IModelContentChange) => {
                // action type
                let action = 'insert';

                if (isUndo) {
                    action = 'undo';
                } else if (isRedo) {
                    action = 'redo';
                } else if (change.text === '' && change.rangeLength > 0) {
                    action = 'delete';
                } else if (change.text.length > 1 && change.rangeLength === 0) {
                    action = 'paste';
                } else if (change.text.length > 0 && change.rangeLength > 0) {
                    action = 'replace'; // highlighted and typing over it
                }
                telemetry?.track('TEXT_EDIT', {
                    source: 'editor',
                    file_id: file.id,
                    file_name: file.name,
                    action: action,
                    range: { ...change.range },
                    text_added: change.text,
                    text_removed_length: change.rangeLength,
                });
            });
        });
    }
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <FullEditor
                files={localFiles}
                onFileChange={handleFileChange}
                onMount={handleEditorMount}
            />
        </div>
    )
}

function getLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'java': return 'java';
        case 'py': return 'python';
        case 'js': return 'javascript';
        case 'ts': return 'typescript';
        case 'jsx': return 'javascript';
        case 'tsx': return 'typescript';
        case 'html': return 'html';
        case 'css': return 'css';
        case 'json': return 'json';
        case 'md': return 'markdown';
        case 'sql': return 'sql';
        case 'cpp': return 'cpp';
        case 'c': return 'c';
        default: return 'typescript';
    }
}
