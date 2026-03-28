"use client"

import React, { useState, useEffect } from 'react'
import { Tables } from '@/types/supabase'
import { FullEditor, CodeFile } from '@/components/code-editor/full-editor'

interface CodeEditorPaneProps {
    codeFiles?: Tables<"code_files">[];
    onFilesChange?: (files: CodeFile[]) => void;
}

export default function CodeEditorPane({ codeFiles, onFilesChange }: CodeEditorPaneProps) {
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

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <FullEditor 
                files={localFiles} 
                onFileChange={handleFileChange}
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
