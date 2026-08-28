import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  BookOpen,
  Map,
  Target,
} from "lucide-react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your AI Mentor 👋. I can help you with courses, your roadmap, skills, and career goals.",
    },
  ]);

  const suggestions = [
    {
      icon: Map,
      text: "Explain my roadmap",
    },
    {
      icon: BookOpen,
      text: "Which course should I start?",
    },
    {
      icon: Target,
      text: "What skills should I learn?",
    },
  ];

  const sendMessage = () => {
    const value = message.trim();

    if (!value) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: value,
      },
      {
        role: "ai",
        text: "I'm ready to help. AI backend connection will be added next.",
      },
    ]);

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const useSuggestion = (text) => {
    setMessage(text);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-5 md:px-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Bot size={23} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              AI Mentor
            </h1>

            <p className="text-sm text-slate-500">
              Your personalized learning assistant
            </p>
          </div>

          <div className="ml-auto hidden items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 sm:flex">
            <Sparkles size={14} />
            Pathfinder AI
          </div>
        </div>
      </header>

      {/* Chat */}
      <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-4xl flex-col px-4 py-6 md:px-6">
        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto pb-6">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                item.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {item.role === "ai" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  item.role === "user"
                    ? "rounded-br-md bg-indigo-600 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                }`}
              >
                {item.text}
              </div>

              {item.role === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="mb-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Try asking
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {suggestions.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.text}
                    onClick={() => useSuggestion(item.text)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Icon
                      size={18}
                      className="text-indigo-600"
                    />

                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-end gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask your AI Mentor..."
              className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          AI Mentor can help guide your learning journey.
        </p>
      </main>
    </div>
  );
};

export default Chat;