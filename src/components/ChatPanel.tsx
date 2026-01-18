import { useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "I'm generating your application. You can give me additional instructions to customize it!",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    
    setMessages([...messages, newMessage]);
    setInput("");
    
    // API integration point
    // Backend API will be connected here to process chat messages
    
    // Simulate assistant response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'll make those changes for you. Updating the application now...",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col glass-card border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          AI Assistant
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Edit your application with natural language</p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${message.role === "user" 
                  ? "bg-gradient-to-br from-primary to-accent" 
                  : "bg-secondary border border-border/50"
                }
              `}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Bot className="w-4 h-4 text-foreground" />
              )}
            </div>
            <div
              className={`
                max-w-[80%] p-3 rounded-2xl text-sm
                ${message.role === "user"
                  ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "glass-card border border-border/50 text-foreground"
                }
              `}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tell me what to change..."
            className="flex-1 px-4 py-3 rounded-xl glass-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
