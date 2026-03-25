import React from 'react'
import { ThemeProvider } from './theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { ReactQueryClientProvider } from './tanstack-provider'

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryClientProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <TooltipProvider>
                    <SidebarProvider>
                        {children}
                        <Toaster />
                    </SidebarProvider>
                </TooltipProvider>
            </ThemeProvider>
        </ReactQueryClientProvider>
    )
}
