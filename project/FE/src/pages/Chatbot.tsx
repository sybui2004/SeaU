import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";
import Sidebar from "../components/layout/Sidebar";
import botIcon from "@assets/images/icon-bot.png";
import sentIcon from "@assets/images/icon-sent.png";
import { Button } from "@/components/ui/button";
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface ResponseMap {
  [key: string]: string;
}

function Chatbot() {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestions: string[] = [
    "Weather today",
    "How I can use knife?",
    "What is ChatGPT?",
    "What should I do when I sick?",
    "How do you do?",
  ];

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const getBotResponse = (message: string): string => {
    const responses: ResponseMap = {
      "Weather today": "Today is sunny with a high of 75°F.",
      "How I can use knife?":
        "Knives should be used carefully for cutting food. Always cut away from yourself.",
      "What is ChatGPT?":
        "ChatGPT is an AI language model developed by OpenAI.",
      "What should I do when I sick?":
        "You should rest, drink plenty of fluids, and consult a doctor if symptoms persist.",
      "How do you do?":
        "I'm doing well, thank you for asking! How can I help you today?",
    };

    return (
      responses[message] ||
      "I'm not sure how to respond to that. Can you try asking something else?"
    );
  };

  const handleSendMessage = (): void => {
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, newUserMessage]);
    setShowChat(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistory((prev) => [...prev, botResponse]);
    }, 0);

    setInputMessage("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputMessage(e.target.value);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="fixed flex-col ml-15 max-w-[calc(100%-80px)] w-full h-screen">
        <div className="flex items-center justify-start ml-10 mt-5 font-bold text-zinc-900 text-2xl tracking-tight cursor-pointer">
          Chatbot
        </div>

        {/* Main content area */}
        <div className="flex flex-col items-center justify-center w-full px-4 h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
          {!showChat ? (
            <div className="flex flex-col items-center justify-center flex-grow">
              {/* Bot icon */}
              <div className="w-60 h-60 mb-6">
                <img src={botIcon} alt="Chatbot Icon" />
              </div>

              {/* Suggestion buttons */}
              <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xl">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="bg-[#1CA7EC] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500 transition-colors"
                    onClick={() => {
                      setInputMessage(suggestion);

                      setTimeout(() => handleSendMessage(), 0);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full max-w-[60%] mx-auto h-full flex-grow p-4 mb-10 overflow-y-auto">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } mb-6`}
                >
                  {message.sender === "bot" && (
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                      <img
                        src={botIcon}
                        alt="Bot"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p>{message.text}</p>
                    <span
                      className={`text-xs ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      } block mt-1`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                  {message.sender === "user" && (
                    <div className="h-8 w-8 rounded-full overflow-hidden ml-2 bg-gray-300">
                      <div className="h-full w-full flex items-center justify-center text-white bg-gray-500">
                        U
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input area - always visible */}
          <div className="fixed bottom-4 w-full max-w-xl">
            <div
              className={`flex overflow-hidden items-center w-full h-12 gap-2 px-4 py-2.5 leading-none rounded-3xl border border-solid bg-zinc-100 transition-all duration-300 ${
                isHovered ? "border-[#1CA7EC] shadow-md" : "border-transparent"
              } text-zinc-900 max-md:px-5 max-md:max-w-full`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="mr-1">
                <img src={botIcon} alt="Chatbot Icon" className="w-10" />
              </div>
              <input
                type="text"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                placeholder="What do you need?..."
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />

              <Button
                variant="ghost"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="ml-2"
              >
                <img src={sentIcon} alt="Sent Message" className="w-7" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
