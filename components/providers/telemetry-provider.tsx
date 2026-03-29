"use client"

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { TelemetryManager } from '@/lib/services/telemetry'

const TelemetryContext = createContext<TelemetryManager | null>(null)

export function useTelemetry() {
    return useContext(TelemetryContext)
}

export function TelemetryProvider({ questionId, children }: { questionId: string, children: React.ReactNode }) {
    const telemetryRef = useRef<TelemetryManager | null>(null)

    if (!telemetryRef.current) {
        telemetryRef.current = new TelemetryManager(questionId)
    }

    useEffect(() => {
        const telemetry = telemetryRef.current!
        telemetry.start();

        const handleFocus = () => telemetry.track('FOCUS_IN');
        const handleBlur = () => telemetry.track('FOCUS_OUT');
        const handleResize = () => telemetry.track('RESIZE', { w: window.innerWidth, h: window.innerHeight });

        const handleCopy = (e: ClipboardEvent) => handleGlobalClipboard(e, 'COPY')
        const handleCut = (e: ClipboardEvent) => handleGlobalClipboard(e, 'CUT')
        const handlePaste = (e: ClipboardEvent) => handleGlobalClipboard(e, 'PASTE')

        const handleGlobalClipboard = (e: ClipboardEvent, type: 'COPY' | 'CUT' | 'PASTE') => {
            const target = e.target as HTMLElement;
            let context = 'PAGE';

            // TODO: fix these, they dont really work, also copy in the code editor doesnt work since i think it eats the event
            if (target.closest('.cm-editor') || target.closest('.monaco-editor') || target.closest('[data-panel="editor"]')) context = 'EDITOR';
            if (target.closest('.terminal-wrapper')) context = 'TERMINAL';
            else if (target.closest('[data-panel="ai"]')) context = 'AI_CHAT';
            else if (target.tagName === 'BODY') context = 'NO_FOCUS';

            let textContent = "";
            if (type === 'PASTE') {
                textContent = e.clipboardData?.getData('text') || "";
            } else {
                textContent = window.getSelection()?.toString() || "";
            }

            telemetry.track(type, { context, textContent });
        }

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('resize', handleResize);

        window.addEventListener('copy', handleCopy);
        window.addEventListener('cut', handleCut);
        window.addEventListener('paste', handlePaste);

        const handleUnload = () => {
            telemetry.destroy();
        };
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('resize', handleResize);

            window.removeEventListener('copy', handleCopy);
            window.removeEventListener('cut', handleCut);
            window.removeEventListener('paste', handlePaste);
            window.removeEventListener('beforeunload', handleUnload);

            telemetry.destroy();
        };
    }, []);

    return (
        <TelemetryContext.Provider value={telemetryRef.current}>
            {children}
        </TelemetryContext.Provider>
    )
}
