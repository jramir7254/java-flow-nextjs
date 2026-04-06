"use client"

import React from 'react'
import { useTheme } from 'next-themes'
import { useSettings } from '@/providers/settings-provider'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Minus, Plus, Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
] as const

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { theme, setTheme } = useTheme()
    const { editorFontSize, setEditorFontSize } = useSettings()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Customize your editor experience.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Color Scheme</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {themes.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => setTheme(value)}
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors",
                                        theme === value
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border hover:bg-muted/50 text-muted-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Editor Font Size</Label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setEditorFontSize(editorFontSize - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted/50"
                            >
                                <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium tabular-nums">{editorFontSize}</span>
                            <button
                                onClick={() => setEditorFontSize(editorFontSize + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted/50"
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
