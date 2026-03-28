"use client"

import React from 'react'
import { Tables } from '@/types/supabase'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

export interface SubmitResult {
    passedTests?: boolean;
    input?: string;
    result?: string;
    expectedResult?: string;
    error?: string;
}

interface TestCasesPaneProps {
    testCases?: Tables<"test_cases">[];
    submitResults?: Record<string, SubmitResult>;
    loadingResult?: boolean;
}

export default function TestCasesPane({ testCases, submitResults, loadingResult }: TestCasesPaneProps) {
    if (!testCases || testCases.length === 0) {
        return (
            <div className="flex h-full flex-col bg-background p-4 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    No public test cases available.
                </p>
            </div>
        )
    }

    return (
        <div className="flex h-full w-full flex-col bg-background relative">
            {loadingResult && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <h4 className="text-sm font-medium">Submitting...</h4>
                </div>
            )}
            <Tabs defaultValue={testCases[0].id} className="flex h-full w-full flex-col">
                <div className="px-4 py-2 border-b">
                    <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
                        {testCases.map((tc, index) => (
                            <TabsTrigger key={tc.id} value={tc.id} className="flex-1 sm:flex-none">
                                Case {index + 1}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {testCases.map((tc, index) => {
                    const result = submitResults?.[tc.id];

                    return (
                        <TabsContent key={tc.id} value={tc.id} className="flex-1 m-0 focus-visible:outline-none overflow-hidden h-full">
                            <ScrollArea className="h-full w-full">
                                <div className="p-4 space-y-6">
                                    {/* Test Case Inputs / Expected */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold">Test Case {index + 1} Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Input</p>
                                                <pre className="p-2.5 bg-muted/50 border rounded-md text-xs font-mono whitespace-pre-wrap">
                                                    {tc.input || "(Empty)"}
                                                </pre>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Expected Output</p>
                                                <pre className="p-2.5 bg-muted/50 border rounded-md text-xs font-mono whitespace-pre-wrap">
                                                    {tc.expected_output || "(Empty)"}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Run Results */}
                                    {result && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <div>
                                                {result.passedTests ? (
                                                    <h2 className="text-lg font-semibold text-green-600 dark:text-green-400">Success</h2>
                                                ) : (
                                                    <h2 className="text-lg font-semibold text-destructive">Failed</h2>
                                                )}
                                                <div className="h-px w-48 bg-border mt-1 mb-4" />
                                            </div>

                                            <div className="space-y-4">
                                                {result.result && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Actual Output</p>
                                                        <pre className="w-full p-2.5 rounded-md bg-muted/50 whitespace-pre-wrap text-sm font-mono border">
                                                            {result.result}
                                                        </pre>
                                                    </div>
                                                )}
                                                {result.error && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Error</p>
                                                        <pre className="w-full p-2.5 rounded-md bg-destructive/10 text-destructive whitespace-pre-wrap text-sm font-mono border border-destructive/20">
                                                            {result.error}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    )
                })}
            </Tabs>
        </div>
    )
}
