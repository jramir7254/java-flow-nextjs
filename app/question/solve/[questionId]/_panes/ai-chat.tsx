"use client"

import { useState } from "react"
import {
    ChatContainerContent,
    ChatContainerRoot,
} from "@/components/ui/chat-container"
import { Markdown } from "@/components/ui/markdown"
import {
    Message,
    MessageAvatar,
    MessageContent,
} from "@/components/ui/message"
import {
    PromptInput,
    PromptInputAction,
    PromptInputActions,
    PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp, Square } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AiChatPaneProps {
    instructions?: string;
    getLatestCode?: () => any[];
    chatMessages?: { id: string, role: string, content: string }[];
    setChatMessages?: React.Dispatch<React.SetStateAction<{ id: string, role: string, content: string }[]>>;
}

export default function AiChatPane({ instructions, getLatestCode, chatMessages = [], setChatMessages }: AiChatPaneProps) {
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleValueChange = (value: string) => {
        setInput(value)
    }

    const onSubmitMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now().toString(), role: "user", content: input };
        const newMessagesContext = [...chatMessages, userMsg];

        if (setChatMessages) setChatMessages(newMessagesContext);
        setInput("");
        setIsLoading(true);

        try {
            let systemPrompt = "You are a helpful AI coding assistant. Help the user with their coding question.";
            if (instructions) {
                systemPrompt += "\n\nQuestion Instructions:\n" + instructions;
            }
            if (getLatestCode) {
                const files = getLatestCode();
                if (files && files.length > 0) {
                    systemPrompt += "\n\nUser's Current Code:\n";
                    files.forEach(f => {
                        systemPrompt += `--- ${f.name} ---\n${f.content || ''}\n\n`;
                    });
                }
            }

            const payloadMessages = [
                { role: "system", content: systemPrompt },
                ...newMessagesContext.map(m => ({ role: m.role, content: m.content }))
            ];

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: payloadMessages })
            });

            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            const aiMsgId = Date.now().toString() + "-ai";
            let accumulatedAiContent = "";

            if (setChatMessages) {
                setChatMessages((prev) => [...prev, { id: aiMsgId, role: "assistant", content: "" }]);
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunkText = decoder.decode(value, { stream: true });
                accumulatedAiContent += chunkText;

                // Update the AI message in the state
                if (setChatMessages) {
                    setChatMessages((prev) =>
                        prev.map(msg => msg.id === aiMsgId ? { ...msg, content: accumulatedAiContent } : msg)
                    );
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex h-full w-full flex-col overflow-hidden relative">
            <ScrollArea>

                <ChatContainerRoot className="flex-1 overflow-y-auto">
                    <ChatContainerContent className="space-y-4 p-4 pb-[120px]">
                        {chatMessages.length === 0 && (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground mt-[15%]">
                                <p>Hello! Ask me anything about this code question.</p>
                            </div>
                        )}

                        {chatMessages.map((message) => {
                            const isAssistant = message.role === "assistant"

                            return (
                                <Message
                                    key={message.id}
                                    className={message.role === "user" ? "justify-end" : "justify-start"}
                                >
                                    {isAssistant && (
                                        <MessageAvatar
                                            src="/avatars/ai.png"
                                            alt="AI Assistant"
                                            fallback="AI"
                                        />
                                    )}
                                    <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
                                        {isAssistant ? (
                                            <div className="bg-secondary text-foreground prose dark:prose-invert rounded-lg p-3 text-sm max-w-none wrap-break-word">
                                                <Markdown>{message.content}</Markdown>
                                            </div>
                                        ) : (
                                            <MessageContent className="bg-primary text-primary-foreground text-sm">
                                                {message.content}
                                            </MessageContent>
                                        )}
                                    </div>
                                </Message>
                            )
                        })}
                    </ChatContainerContent>
                </ChatContainerRoot>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4 flex justify-center w-full">
                <PromptInput
                    value={input}
                    onValueChange={handleValueChange}
                    isLoading={isLoading}
                    onSubmit={onSubmitMessage}
                    className="w-full"
                >
                    <PromptInputTextarea placeholder="Ask about this code..." />
                    <PromptInputActions className="justify-end pt-2">
                        <PromptInputAction
                            tooltip={isLoading ? "Stop generation" : "Send message"}
                        >
                            {isLoading ? (
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => { /* Implement stop logic if needed later */ }}
                                >
                                    <Square className="size-5 fill-current" />
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={onSubmitMessage}
                                    disabled={!input.trim()}
                                >
                                    <ArrowUp className="size-5" />
                                </Button>
                            )}
                        </PromptInputAction>
                    </PromptInputActions>
                </PromptInput>
            </div>
        </div>
    )
}
