"use client"

import React from 'react'
import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'

export interface BaseEditorProps {
    value?: string;
    onChange?: (value: string | undefined) => void;
    language?: string;
    isEditable?: boolean;
    onMount?: (editor: any, monaco: any) => void;
}

export function BaseEditor({
    value = "",
    onChange,
    language = "typescript",
    isEditable = true,
    onMount
}: BaseEditorProps) {
    const { theme, resolvedTheme } = useTheme()

    // Fallback to resolvedTheme to ensure proper styling if system theme is used
    const editorTheme = (theme === 'dark' || resolvedTheme === 'dark') ? 'vs-dark' : 'light'

    return (
        <Editor
            height="100%"
            language={language}
            value={value}
            onChange={onChange}
            theme={editorTheme}
            onMount={onMount}
            options={{
                readOnly: !isEditable,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                tabSize: 4,
            }}
        />
    )
}
