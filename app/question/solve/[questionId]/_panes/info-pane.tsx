"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Markdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area'

interface InfoPaneProps {
    questionInfo?: string;
    answer?: string;
    aiEnabled?: boolean;
}
// BUG: The markdown renderer text doesnt break words
// TODO: Style the markdown renderer better
export default function InfoPane({ questionInfo, answer, aiEnabled }: InfoPaneProps) {
    const tabItems = [];
    if (questionInfo) tabItems.push({ id: 'question', title: 'Question' });
    if (answer) tabItems.push({ id: 'answer', title: 'Answer' });
    if (aiEnabled) tabItems.push({ id: 'ai', title: 'AI' });

    if (tabItems.length === 0) {
        return (
            <div className="flex h-full flex-col bg-background p-4">
                <p className="text-sm text-muted-foreground">No information available.</p>
            </div>
        )
    }

    return (
        <div className="flex h-full w-full flex-col bg-background">
            <Tabs defaultValue={tabItems[0].id} className="flex h-full w-full flex-col">
                <div className="px-4 py-2 border-b">
                    <TabsList className="w-full justify-start">
                        {tabItems.map((tab) => (
                            <TabsTrigger key={tab.id} value={tab.id} className="flex-1 sm:flex-none">
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {questionInfo && (
                    <TabsContent value="question" className="flex-1 m-0 focus-visible:outline-none overflow-hidden h-full">
                        <ScrollArea className="h-full w-full">
                            <div className="p-4 prose prose-sm dark:prose-invert max-w-none break-words w-full">
                                <Markdown>{questionInfo}</Markdown>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                )}

                {answer && (
                    <TabsContent value="answer" className="flex-1 m-0 focus-visible:outline-none overflow-hidden h-full">
                        <ScrollArea className="h-full w-full">
                            <div className="p-4 prose prose-sm dark:prose-invert max-w-none break-words w-full">
                                <Markdown>{answer}</Markdown>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                )}

                {aiEnabled && (
                    <TabsContent value="ai" className="flex-1 m-0 focus-visible:outline-none overflow-hidden h-full">
                        <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground p-4">
                            ai chat
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
