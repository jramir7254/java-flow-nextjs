"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

const FONT_SIZE_KEY = 'editor-font-size'
const DEFAULT_FONT_SIZE = 14
const MIN_FONT_SIZE = 10
const MAX_FONT_SIZE = 28

interface SettingsContextValue {
    editorFontSize: number
    setEditorFontSize: (size: number) => void
}

const SettingsContext = createContext<SettingsContextValue>({
    editorFontSize: DEFAULT_FONT_SIZE,
    setEditorFontSize: () => {},
})

export function useSettings() {
    return useContext(SettingsContext)
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [editorFontSize, setEditorFontSizeState] = useState(DEFAULT_FONT_SIZE)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem(FONT_SIZE_KEY)
        if (stored) {
            const parsed = parseInt(stored, 10)
            if (!isNaN(parsed) && parsed >= MIN_FONT_SIZE && parsed <= MAX_FONT_SIZE) {
                setEditorFontSizeState(parsed)
            }
        }
        setLoaded(true)
    }, [])

    const setEditorFontSize = (size: number) => {
        const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size))
        setEditorFontSizeState(clamped)
        localStorage.setItem(FONT_SIZE_KEY, String(clamped))
    }

    if (!loaded) {
        return null
    }

    return (
        <SettingsContext.Provider value={{ editorFontSize, setEditorFontSize }}>
            {children}
        </SettingsContext.Provider>
    )
}
