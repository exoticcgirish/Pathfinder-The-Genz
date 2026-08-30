import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Send,
  Sparkles,
  User,
  BookOpen,
  Map,
  Target,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  sendChatMessage,
  getChatHistory,
  clearChatHistory,
} from "../../services/chatService";


const Chat = () => {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const messagesEndRef =
    useRef(null);


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
    {
      icon: Sparkles,
      text: "What should I learn today?",
    },
  ];



  const welcomeMessage = {
    role: "ai",
    text:
      "Hi! I'm your AI Mentor 👋. I understand your learning roadmap, current skills, progress, and career goal. Ask me what you should learn next, what to practice, or where you're stuck.",
  };



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);



  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        setError("");

        const response =
          await getChatHistory();

        const chats =
          response?.data?.chats || [];

        if (!chats.length) {
          setMessages([
            welcomeMessage,
          ]);

          return;
        }

        const formatted = [];

        chats.forEach((chat) => {
          if (chat.message) {
            formatted.push({
              role: "user",
              text: chat.message,
              createdAt:
                chat.createdAt,
            });
          }

          if (chat.response) {
            formatted.push({
              role: "ai",
              text: chat.response,
              createdAt:
                chat.createdAt,
            });
          }
        });

        setMessages([
          welcomeMessage,
          ...formatted,
        ]);
      } catch (err) {
        console.error(
          "CHAT HISTORY ERROR:",
          err
        );

        setMessages([
          welcomeMessage,
        ]);

        setError(
          err.response?.data?.message ||
            "Unable to load previous conversations."
        );
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, []);



  const sendMessage = async (
    customMessage
  ) => {
    const value = (
      customMessage || message
    ).trim();

    if (
      !value ||
      loading
    ) {
      return;
    }

    const userMessage = {
      role: "user",
      text: value,
    };

    setMessages(
      (previous) => [
        ...previous,
        userMessage,
      ]
    );

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response =
        await sendChatMessage(
          value
        );

      const aiResponse =
        response?.data?.chat?.response;

      if (!aiResponse) {
        throw new Error(
          "AI Mentor returned an empty response."
        );
      }

      setMessages(
        (previous) => [
          ...previous,
          {
            role: "ai",
            text: aiResponse,
          },
        ]
      );
    } catch (err) {
      console.error(
        "SEND CHAT ERROR:",
        err
      );

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "AI Mentor is temporarily unavailable.";

      setError(
        errorMessage
      );

      setMessages(
        (previous) => [
          ...previous,
          {
            role: "ai",
            text:
              "I couldn't generate a response right now. Please try again in a moment.",
            error: true,
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };



  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };



  const useSuggestion = (
    text
  ) => {
    sendMessage(text);
  };



  const handleClearHistory =
    async () => {
      try {
        setError("");

        await clearChatHistory();

        setMessages([
          welcomeMessage,
        ]);
      } catch (err) {
        console.error(
          "CLEAR CHAT ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to clear chat history."
        );
      }
    };



  const renderMessage = (
    text
  ) => {
    if (!text) {
      return null;
    }

    return text
      .split("\n")
      .map(
        (
          line,
          index
        ) => {
          const trimmed =
            line.trim();

          if (
            trimmed.startsWith(
              "### "
            )
          ) {
            return (
              <h3
                key={index}
                className="mb-2 mt-4 text-base font-extrabold text-slate-900"
              >
                {trimmed.replace(
                  "### ",
                  ""
                )}
              </h3>
            );
          }

          if (
            trimmed.startsWith(
              "#### "
            )
          ) {
            return (
              <h4
                key={index}
                className="mb-1 mt-3 text-sm font-bold text-slate-900"
              >
                {trimmed.replace(
                  "#### ",
                  ""
                )}
              </h4>
            );
          }

          if (
            trimmed.startsWith(
              "- "
            ) ||
            trimmed.startsWith(
              "* "
            )
          ) {
            return (
              <div
                key={index}
                className="ml-3 flex gap-2"
              >
                <span>
                  •
                </span>

                <span>
                  {trimmed.slice(
                    2
                  )}
                </span>
              </div>
            );
          }

          if (
            /^\d+\./.test(
              trimmed
            )
          ) {
            return (
              <p
                key={index}
                className="ml-1"
              >
                {trimmed}
              </p>
            );
          }

          if (
            trimmed === "---"
          ) {
            return (
              <hr
                key={index}
                className="my-3 border-slate-200"
              />
            );
          }

          if (
            trimmed.startsWith(
              "```"
            )
          ) {
            return null;
          }

          return (
            <p
              key={index}
              className={
                trimmed
                  ? "mb-2"
                  : "h-2"
              }
            >
              {line}
            </p>
          );
        }
      );
  };


  return (
    <div className="min-h-screen bg-slate-50">

      {}

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


          <div className="ml-auto flex items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 sm:flex">

              <Sparkles size={14} />

              Pathfinder AI

            </div>


            {messages.length > 1 && (

              <button
                onClick={
                  handleClearHistory
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                title="Clear chat history"
              >

                <Trash2 size={17} />

              </button>

            )}

          </div>

        </div>

      </header>


      {}

      <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-4xl flex-col px-4 py-6 md:px-6">



        {error && (

          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

            {error}

          </div>

        )}



        {historyLoading ? (

          <div className="flex flex-1 items-center justify-center">

            <div className="text-center">

              <Loader2
                className="mx-auto mb-3 animate-spin text-indigo-600"
                size={32}
              />

              <p className="text-sm text-slate-500">
                Loading your AI Mentor...
              </p>

            </div>

          </div>

        ) : (

          <>

            {}

            <div className="flex-1 space-y-5 overflow-y-auto pb-8">

              {messages.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className={`flex gap-3 ${
                      item.role ===
                      "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >


                    {item.role ===
                      "ai" && (

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">

                        <Bot
                          size={18}
                        />

                      </div>

                    )}



                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 md:max-w-[78%] ${
                        item.role ===
                        "user"
                          ? "rounded-br-md bg-indigo-600 text-white shadow-sm"
                          : item.error
                          ? "rounded-bl-md border border-red-200 bg-red-50 text-red-700"
                          : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                      }`}
                    >

                      {item.role ===
                      "ai"
                        ? renderMessage(
                            item.text
                          )
                        : item.text}

                    </div>



                    {item.role ===
                      "user" && (

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">

                        <User
                          size={18}
                        />

                      </div>

                    )}

                  </div>

                )
              )}



              {loading && (

                <div className="flex gap-3 justify-start">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">

                    <Bot
                      size={18}
                    />

                  </div>


                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                      <Loader2
                        size={16}
                        className="animate-spin text-indigo-600"
                      />

                      Pathfinder is thinking...

                    </div>

                  </div>

                </div>

              )}


              <div
                ref={
                  messagesEndRef
                }
              />

            </div>


            {}

            {messages.length ===
              1 && (

              <div className="mb-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Try asking
                </p>


                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  {suggestions.map(
                    (item) => {

                      const Icon =
                        item.icon;

                      return (
                        <button
                          key={
                            item.text
                          }
                          onClick={() =>
                            useSuggestion(
                              item.text
                            )
                          }
                          disabled={
                            loading
                          }
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          <Icon
                            size={
                              18
                            }
                            className="shrink-0 text-indigo-600"
                          />

                          {
                            item.text
                          }

                        </button>
                      );
                    }
                  )}

                </div>

              </div>

            )}


            {}

            <div className="sticky bottom-0 bg-slate-50 pb-1 pt-2">

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

                <div className="flex items-end gap-3">

                  <textarea
                    value={
                      message
                    }
                    onChange={(
                      event
                    ) =>
                      setMessage(
                        event
                          .target
                          .value
                      )
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    rows={1}
                    disabled={
                      loading
                    }
                    placeholder="Ask your AI Mentor..."
                    className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                  />


                  <button
                    onClick={() =>
                      sendMessage()
                    }
                    disabled={
                      !message.trim() ||
                      loading
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    {loading ? (

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                    ) : (

                      <Send
                        size={18}
                      />

                    )}

                  </button>

                </div>

              </div>


              <p className="mt-3 text-center text-xs text-slate-400">
                Pathfinder AI uses your roadmap,
                skill gaps and progress to personalize
                guidance.
              </p>

            </div>

          </>

        )}

      </main>

    </div>
  );
};

export default Chat;