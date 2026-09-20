"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

const suggestions = [
  {
    title: "Explain a legal provision",
    description: "Understand a provision in simple language.",
    prompt: "Explain a legal provision in simple language.",
  },
  {
    title: "Summarize a case",
    description: "Get the facts, issues and judgment.",
    prompt: "Help me summarize a legal case.",
  },
  {
    title: "Compare provisions",
    description: "Understand the difference between two provisions.",
    prompt: "Compare two legal provisions and explain the difference.",
  },
  {
    title: "Understand a concept",
    description: "Learn a legal concept with an example.",
    prompt: "Explain a legal concept with a practical example.",
  },
];

function AIIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
    >
      <path d="M12 3l1.35 4.65L18 9l-4.65 1.35L12 15l-1.35-4.65L6 9l4.65-1.35L12 3Z" />
      <path d="M19 14l.65 2.35L22 17l-2.35.65L19 14Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
      <path d="M4 5v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
      <path d="M20 19v-4h-4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path d="m20.5 11.5-8.4 8.4a5 5 0 0 1-7.1-7.1l8.6-8.6a3.5 3.5 0 0 1 5 5l-8.7 8.7a2 2 0 0 1-2.8-2.8l8-8" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function AssistantMarkdown({ content }: { content: string }) {
  return (
    <div className="text-[14px] leading-7 text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-1 text-xl font-semibold tracking-tight text-foreground">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-lg font-semibold tracking-tight text-foreground">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-[15px] font-semibold text-foreground">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-4 last:mb-0">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),

          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-6 last:mb-0">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-1.5 pl-6 last:mb-0">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-2 border-border pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),

          hr: () => (
            <hr className="my-5 border-border" />
          ),

          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),

          code: ({ children, className }) => {
            const isBlock = Boolean(className);

            if (isBlock) {
              return (
                <code
                  className={`${className} block overflow-x-auto rounded-lg bg-secondary p-4 text-xs leading-6`}
                >
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[12px]">
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg bg-secondary text-foreground">
              {children}
            </pre>
          ),

          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="border-b border-border bg-secondary/50">
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-xs font-semibold text-foreground">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-border px-3 py-2 align-top text-sm">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const submittedQueryRef = useRef<string | null>(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      180,
    )}px`;
  }, [input]);

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/ai", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load conversations.");
      }

      setConversations(data?.conversations ?? []);
    } catch (error) {
      console.error("Unable to load AI conversations:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const loadConversation = async (id: string) => {
    if (isThinking || isLoadingHistory) return;

    try {
      const response = await fetch(`/api/ai?conversationId=${encodeURIComponent(id)}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load conversation.");
      }

      setConversationId(id);
      setMessages(data?.messages ?? []);
      setSidebarOpen(false);
      setCopiedId(null);
    } catch (error) {
      console.error("Unable to load AI conversation:", error);
    }
  };

  useEffect(() => {
    void loadConversations();
  }, []);

  const sendMessage = async (text?: string, options?: { regenerate?: boolean }) => {
    const messageText = (text ?? input).trim();

    if (!messageText || isThinking || isSendingRef.current) return;

    isSendingRef.current = true;

    const optimisticId = crypto.randomUUID();
    const userMessage: Message = {
      id: optimisticId,
      role: "user",
      content: messageText,
    };

    if (!options?.regenerate) {
      setMessages((previous) => [...previous, userMessage]);
    }

    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          conversationId,
          regenerate: Boolean(options?.regenerate),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to generate an AI response.",
        );
      }

      if (!data?.message || !data?.conversationId) {
        throw new Error("The AI returned an incomplete response.");
      }

      setConversationId(data.conversationId);

      const assistantMessage: Message = {
        id: data.messageId ?? crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        created_at: data.createdAt,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      await loadConversations();
    } catch (error) {
      console.error("AI chat error:", error);

      if (!options?.regenerate) {
        setMessages((previous) =>
          previous.filter((message) => message.id !== optimisticId),
        );
      }

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Unable to generate an AI response. Please try again.",
      };

      setMessages((previous) => [...previous, errorMessage]);
    } finally {
      isSendingRef.current = false;
      setIsThinking(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const startNewChat = () => {
    if (isThinking) return;

    setConversationId(null);
    setMessages([]);
    setInput("");
    setIsThinking(false);
    setCopiedId(null);
    setSidebarOpen(false);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const copyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch {
      console.error("Unable to copy message.");
    }
  };

  const regenerate = async (message: Message) => {
    if (isThinking) return;

    const messageIndex = messages.findIndex(
      (item) => item.id === message.id,
    );

    if (messageIndex === -1) return;

    const previousUserMessage = [...messages]
      .slice(0, messageIndex)
      .reverse()
      .find((item) => item.role === "user");

    if (!previousUserMessage) return;

    setMessages((previous) =>
      previous.filter((item) => item.id !== message.id),
    );

    await sendMessage(previousUserMessage.content, { regenerate: true });
  };

  return (
    <div className="flex h-[calc(100vh-80px)] min-h-[600px] overflow-hidden bg-background text-foreground">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-border bg-secondary/30 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <button
            type="button"
            onClick={startNewChat}
            className="flex flex-1 items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-secondary/40"
          >
            <PlusIcon />
            New chat
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-2 rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
          >
            ×
          </button>
        </div>

        <div className="flex-1 px-3 py-4">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Recent chats
          </p>

          {isLoadingHistory ? (
            <p className="px-2 pt-3 text-xs leading-5 text-muted-foreground">
              Loading conversations...
            </p>
          ) : conversations.length > 0 ? (
            <div className="mt-3 space-y-1.5">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => void loadConversation(conversation.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    conversation.id === conversationId
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                  }`}
                >
                  <span className="block truncate">{conversation.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="px-2 pt-3 text-xs leading-5 text-muted-foreground">
              Your conversations will appear here.
            </p>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-secondary p-3">
            <p className="text-xs font-medium text-foreground">
              Laws & Judgments AI
            </p>

            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              Research assistance powered by AI.
            </p>
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[62px] shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
              aria-label="Open chat history"
            >
              <MenuIcon />
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AIIcon className="h-4 w-4" />
            </div>

            <div>
              <h1 className="text-sm font-semibold text-foreground">
                AI Assistant
              </h1>

              <p className="text-[11px] text-muted-foreground">
                Legal research assistant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={startNewChat}
            className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-secondary sm:flex"
          >
            <PlusIcon />
            New chat
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-5 py-10 sm:px-8">
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <AIIcon className="h-6 w-6" />
                </div>

                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
                  How can I help?
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Ask about Indian laws, provisions, judgments, or legal
                  concepts.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.title}
                    type="button"
                    onClick={() => sendMessage(suggestion.prompt)}
                    className="group rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/50 hover:bg-secondary/30 hover:shadow-sm"
                  >
                    <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <AIIcon className="h-4 w-4" />
                    </div>

                    <p className="text-sm font-medium text-foreground">
                      {suggestion.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl px-5 py-7 sm:px-8">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-7 flex gap-3.5 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <AIIcon className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] ${
                      message.role === "user"
                        ? "rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground"
                        : "min-w-0 flex-1"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <AssistantMarkdown content={message.content} />
                    ) : (
                      <div className="whitespace-pre-wrap text-[14px] leading-7 text-primary-foreground">
                        {message.content}
                      </div>
                    )}

                    {message.role === "assistant" && (
                      <div className="mt-3 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => copyMessage(message)}
                          title="Copy"
                          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                        >
                          <CopyIcon />
                          {copiedId === message.id ? "Copied" : "Copy"}
                        </button>

                        <button
                          type="button"
                          onClick={() => regenerate(message)}
                          title="Regenerate response"
                          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                        >
                          <RefreshIcon />
                          Regenerate
                        </button>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground sm:flex">
                      You
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="mb-7 flex gap-3.5">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <AIIcon className="h-4 w-4" />
                  </div>

                  <div className="flex items-center gap-1 rounded-xl bg-card px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />

                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: "120ms" }}
                    />

                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: "240ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent px-4 pb-4 pt-3 sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit}>
              <div className="rounded-2xl border border-border bg-card shadow-[0_2px_10px_rgba(40,35,30,0.04)] transition focus-within:border-primary/40">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={isThinking}
                  placeholder="Ask a legal question..."
                  className="block max-h-[180px] min-h-[50px] w-full resize-none bg-transparent px-4 pb-2 pt-3.5 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                />

                <div className="flex items-center justify-between px-2.5 pb-2.5">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      title="Attach a file"
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <PaperclipIcon />
                    </button>

                    <button
                      type="button"
                      title="Voice input"
                      className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <MicIcon />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden text-[10px] text-muted-foreground sm:block">
                      Enter to send · Shift + Enter for new line
                    </span>

                    <button
                      type="submit"
                      disabled={!input.trim() || isThinking}
                      aria-label="Send message"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <p className="mt-2 text-center text-[10px] leading-4 text-muted-foreground">
              AI can make mistakes. Verify important legal information against
              authoritative sources.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}