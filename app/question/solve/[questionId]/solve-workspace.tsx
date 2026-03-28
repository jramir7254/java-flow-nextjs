"use client"

import React, { useState, useRef } from 'react'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { Home, Settings, Play } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import InfoPane from './_panes/info-pane'
import CodeEditorPane from './_panes/code-editor-pane'
import TestCasesPane, { SubmitResult } from './_panes/test-cases-pane'
import { submitSolution } from './actions'
import { CodeFile } from '@/components/code-editor/full-editor'
import { Tables } from '@/types/supabase'

export type QuestionWithDetails = Tables<"question_details"> & {
    content_item: {
        name: string;
        course: Pick<Tables<"courses">, "id" | "name"> | null;
    } | null;
    code_files: Tables<"code_files">[];
    test_cases: Tables<"test_cases">[];
    answers: { content: string }[];
}

export default function SolveWorkspace({ questionInfo }: { questionInfo: QuestionWithDetails | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResults, setSubmitResults] = useState<Record<string, SubmitResult>>({})
    const latestFilesRef = useRef<CodeFile[]>([])

    const handleRun = async () => {
        if (!questionInfo) return;
        
        setIsSubmitting(true);
        setSubmitResults({});

        try {
            const currentFiles = latestFilesRef.current.map(f => ({
                fileName: f.name,
                content: f.content || "" 
            }));

            const results = await submitSolution(questionInfo.id, currentFiles);
            setSubmitResults(results);
        } catch (error) {
            console.error(error);
            // Optionally could set error state here, but for now we log it
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className=" flex h-full flex-col overflow-hidden bg-background">
            {/* Top Bar */}
            <div className="flex shrink-0 items-center justify-between border-b p-2">
                <div className="flex flex-1 items-center justify-start gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <Home className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="h-6 w-px bg-border"></div>
                    <h5 className="text-sm font-semibold truncate">
                        {questionInfo?.content_item?.name || "Loading..."}
                    </h5>
                </div>

                <div className="flex flex-1 items-center justify-center gap-3">
                    <Button
                        onClick={handleRun}
                        disabled={isSubmitting}
                        className="gap-2"
                    >
                        <Play className="h-4 w-4 fill-current" />
                        RUN
                    </Button>
                </div>

                <div className="flex flex-1 items-center justify-end gap-3">
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Main Split Layout */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup orientation="horizontal">
                    <ResizablePanel defaultSize="30" minSize="20">
                        <InfoPane
                            questionInfo={questionInfo?.instructions}
                            answer={questionInfo?.answers?.[0]?.content}
                            aiEnabled={questionInfo?.ai_enabled ?? false}
                        />
                    </ResizablePanel>

                    <ResizableHandle className="w-2 bg-muted hover:bg-muted-foreground/20 transition-colors cursor-col-resize" />

                    <ResizablePanel minSize="20">
                        <ResizablePanelGroup orientation="vertical">
                            <ResizablePanel minSize="20">
                                <CodeEditorPane 
                                    codeFiles={questionInfo?.code_files} 
                                    onFilesChange={(files) => {
                                        latestFilesRef.current = files;
                                    }}
                                />
                            </ResizablePanel>

                            <ResizableHandle className="h-2 bg-muted hover:bg-muted-foreground/20 transition-colors cursor-row-resize" />

                            <ResizablePanel minSize="20" defaultSize="30">
                                <TestCasesPane 
                                    testCases={questionInfo?.test_cases} 
                                    submitResults={submitResults} 
                                    loadingResult={isSubmitting} 
                                />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}
