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
import { AppHeader } from '@/components/ui/app-header'
import { Separator } from '@/components/ui/separator'

import InfoPane from './_panes/info-pane'
import CodeEditorPane from './_panes/code-editor-pane'
import TestCasesPane, { SubmitResult } from './_panes/test-cases-pane'
import { submitSolution } from './actions'
import { CodeFile } from '@/components/code-editor/full-editor'
import { Tables } from '@/types/supabase'
import { useTelemetry } from '@/providers/telemetry-provider'
import { useEffect } from 'react'
import { SettingsDialog } from '@/components/settings-dialog'

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
    const [chatMessages, setChatMessages] = useState<{ id: string, role: string, content: string }[]>([])
    const [settingsOpen, setSettingsOpen] = useState(false)
    const telemetry = useTelemetry()
    const submitResultsRef = useRef(submitResults)
    submitResultsRef.current = submitResults

    useEffect(() => {
        if (telemetry) {
            telemetry.setSessionStateGetter(() => {
                const finalCode = latestFilesRef.current.map(f => `${f.name}:\n${f.content || ''}`).join('\n\n')
                const results = submitResultsRef.current
                const passedVals = Object.values(results)
                const isPassed = passedVals.length > 0 && passedVals.every(r => r.passedTests === true)
                return { finalCode, isPassed }
            })
        }
    }, [telemetry])

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

            const passedVals = Object.values(results);
            const isPassed = passedVals.length > 0 && passedVals.every(r => r.passedTests === true);

            const submitPayload: Record<string, unknown> = {
                status: isPassed ? 'passed' : 'failed',
                code_snapshot: currentFiles,
            };

            if (!isPassed) {
                const failed = passedVals.find(r => !r.passedTests);
                if (failed) {
                    submitPayload.failed_test = {
                        input: failed.input,
                        expected: failed.expectedResult,
                        actual: failed.result,
                        error: failed.error,
                    };
                }
            }

            telemetry?.track('SUBMIT', submitPayload);
            telemetry?.updateSession();
        } catch (error) {
            console.error(error);
            // Optionally could set error state here, but for now we log it
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-1 w-full bg-sidebar">
            <div className="flex flex-1 w-full flex-col overflow-hidden bg-background md:m-2 md:rounded-xl md:shadow-sm border border-border min-h-0 relative">
                {/* Top Bar */}
            <AppHeader
                className="border-b"
                left={
                    <>
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                            <Link href="/courses">
                                <Home className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Separator orientation="vertical" className="mx-2 h-6" />
                        <h5 className="text-lg font-semibold truncate">
                            {questionInfo?.content_item?.name || "Loading..."}
                        </h5>
                    </>
                }
                center={
                    <Button
                        onClick={handleRun}
                        disabled={isSubmitting}
                        className="gap-2 h-8"
                    >
                        <Play className="h-4 w-4 fill-current" />
                        RUN
                    </Button>
                }
                right={
                    <>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSettingsOpen(true)}>
                            <Settings className="h-5 w-5" />
                        </Button>
                        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
                    </>
                }
            />

            {/* Main Split Layout */}
            <div className="flex-1 overflow-hidden min-h-0 relative">
                <ResizablePanelGroup orientation="horizontal">
                    <ResizablePanel id="info" defaultSize="30" minSize="20" collapsible collapsedSize={0} className="flex flex-col">
                        <InfoPane
                            questionInfo={questionInfo?.instructions}
                            answer={questionInfo?.answers?.[0]?.content}
                            aiEnabled={questionInfo?.ai_enabled ?? false}
                            getLatestCode={() => latestFilesRef.current}
                            chatMessages={chatMessages}
                            setChatMessages={setChatMessages}
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

                            <ResizablePanel id="test-cases" minSize="20" defaultSize="30" collapsible collapsedSize={0}>
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
        </div>
    )
}
