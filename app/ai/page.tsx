"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
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
      <path d="M19 14l.65 2.35L22 17l-2.35.65L19 20l-.65-2.35L16 17l2.35-.65L19 14Z" />
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

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      180
    )}px`;
  }, [input]);

  const sendMessage = async (text?: string) => {
    const messageText = (text ?? input).trim();

    if (!messageText || isThinking) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: messageText,
    };

    setMessages((previous) => [...previous, userMessage]);
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to generate an AI response."
        );
      }

      if (!data?.message) {
        throw new Error("The AI returned an empty response.");
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.message,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I’m unable to generate a response right now. Please try again.",
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setIsThinking(false);
    setCopiedId(null);

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
      (item) => item.id === message.id
    );

    if (messageIndex === -1) return;

    const previousUserMessage = [...messages]
      .slice(0, messageIndex)
      .reverse()
      .find((item) => item.role === "user");

    if (!previousUserMessage) return;

    setMessages((previous) =>
      previous.filter((item) => item.id !== message.id)
    );

    await sendMessage(previousUserMessage.content);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] min-h-[600px] overflow-hidden bg-[#faf9f6]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[#e6e0d8] bg-[#f7f5f1] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#e6e0d8] px-4 py-4">
          <button
            type="button"
            onClick={startNewChat}
            className="flex flex-1 items-center gap-2.5 rounded-lg border border-[#ddd6cd] bg-white px-3 py-2.5 text-sm font-medium text-[#34383d] transition hover:border-[#c9b8b1] hover:bg-[#fffefa]"
          >
            <PlusIcon />
            New chat
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="ml-2 rounded-lg p-2 text-[#747b82] hover:bg-[#ebe7e1] lg:hidden"
          >
            ×
          </button>
        </div>

        <div className="flex-1 px-3 py-4">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#96928c]">
            Recent chats
          </p>

          {messages.length > 0 ? (
            <div className="mt-3">
              <button
                type="button"
                className="w-full rounded-lg bg-[#ebe6df] px-3 py-2.5 text-left text-sm text-[#42474d]"
              >
                {messages.find((message) => message.role === "user")
                  ?.content.slice(0, 32) || "Current conversation"}
                {(messages.find((message) => message.role === "user")
                  ?.content.length ?? 0) > 32
                  ? "..."
                  : ""}
              </button>
            </div>
          ) : (
            <p className="px-2 pt-3 text-xs leading-5 text-[#99958f]">
              Your conversations will appear here.
            </p>
          )}
        </div>

        <div className="border-t border-[#e6e0d8] p-4">
          <div className="rounded-lg bg-[#eeeae4] p-3">
            <p className="text-xs font-medium text-[#565b60]">
              Laws & Judgments AI
            </p>
            <p className="mt-1 text-[11px] leading-4 text-[#8a8782]">
              Research assistance powered by AI.
            </p>
          </div>
        </div>
      </aside>

      {/* Main chat */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Chat header */}
        <header className="flex h-[62px] shrink-0 items-center justify-between border-b border-[#e6e0d8] bg-[#faf9f6]/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-[#656c73] hover:bg-[#eeeae4] lg:hidden"
              aria-label="Open chat history"
            >
              <MenuIcon />
            </button>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0e5e2] text-[#861725]">
              <AIIcon className="h-4 w-4" />
            </div>

            <div>
              <h1 className="text-sm font-semibold text-[#30353b]">
                AI Assistant
              </h1>
              <p className="text-[11px] text-[#92979c]">
                Legal research assistant
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={startNewChat}
            className="hidden items-center gap-2 rounded-lg border border-[#ddd6cd] bg-white px-3 py-2 text-xs font-medium text-[#555b61] transition hover:bg-[#f5f2ed] sm:flex"
          >
            <PlusIcon />
            New chat
          </button>
        </header>

        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-5 py-10 sm:px-8">
              <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0e5e2] text-[#861725]">
                  <AIIcon className="h-6 w-6" />
                </div>

                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#2e3338] sm:text-3xl">
                  How can I help?
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#7b838b]">
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
                    className="group rounded-xl border border-[#e2dcd4] bg-white p-4 text-left transition hover:border-[#cdbab4] hover:bg-[#fffefa] hover:shadow-sm"
                  >
                    <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1e5e2] text-[#861725]">
                      <AIIcon className="h-4 w-4" />
                    </div>

                    <p className="text-sm font-medium text-[#34393e]">
                      {suggestion.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#858c93]">
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
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0e5e2] text-[#861725]">
                      <AIIcon className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] ${
                      message.role === "user"
                        ? "rounded-2xl rounded-br-md bg-[#861725] px-4 py-3 text-white"
                        : "min-w-0 flex-1"
                    }`}
                  >
                    <div
                      className={`whitespace-pre-wrap text-[14px] leading-7 ${
                        message.role === "user"
                          ? "text-white"
                          : "text-[#34393e]"
                      }`}
                    >
                      {message.content}
                    </div>

                    {message.role === "assistant" && (
                      <div className="mt-3 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => copyMessage(message)}
                          title="Copy"
                          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-[#858b91] transition hover:bg-[#eeeae4] hover:text-[#4d5359]"
                        >
                          <CopyIcon />
                          {copiedId === message.id ? "Copied" : "Copy"}
                        </button>

                        <button
                          type="button"
                          onClick={() => regenerate(message)}
                          title="Regenerate response"
                          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-[#858b91] transition hover:bg-[#eeeae4] hover:text-[#4d5359]"
                        >
                          <RefreshIcon />
                          Regenerate
                        </button>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d6a13a] text-[11px] font-semibold text-white sm:flex">
                      You
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="mb-7 flex gap-3.5">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0e5e2] text-[#861725]">
                    <AIIcon className="h-4 w-4" />
                  </div>

                  <div className="flex items-center gap-1 rounded-xl bg-white px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a8f94]" />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a8f94]"
                      style={{ animationDelay: "120ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8a8f94]"
                      style={{ animationDelay: "240ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="shrink-0 bg-gradient-to-t from-[#faf9f6] via-[#faf9f6] to-transparent px-4 pb-4 pt-3 sm:px-6 sm:pb-5">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit}>
              <div className="rounded-2xl border border-[#dcd6ce] bg-white shadow-[0_2px_10px_rgba(40,35,30,0.04)] transition focus-within:border-[#bdaaa4]">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={isThinking}
                  placeholder="Ask a legal question..."
                  className="block max-h-[180px] min-h-[50px] w-full resize-none bg-transparent px-4 pb-2 pt-3.5 text-sm leading-6 text-[#30353b] outline-none placeholder:text-[#a1a6ab] disabled:opacity-60"
                />

                <div className="flex items-center justify-between px-2.5 pb-2.5">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      title="Attach a file"
                      className="rounded-lg p-2 text-[#7f858b] transition hover:bg-[#f2efea] hover:text-[#4f555a]"
                    >
                      <PaperclipIcon />
                    </button>

                    <button
                      type="button"
                      title="Voice input"
                      className="rounded-lg p-2 text-[#7f858b] transition hover:bg-[#f2efea] hover:text-[#4f555a]"
                    >
                      <MicIcon />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden text-[10px] text-[#a1a5a9] sm:block">
                      Enter to send · Shift + Enter for new line
                    </span>

                    <button
                      type="submit"
                      disabled={!input.trim() || isThinking}
                      aria-label="Send message"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#861725] text-white transition hover:bg-[#74131f] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <p className="mt-2 text-center text-[10px] leading-4 text-[#9a9ea2]">
              AI can make mistakes. Verify important legal information against
              authoritative sources.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}