import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/types";

const AI_ID = "AI_ASSISTANT";

const FloatingChatbox = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // State lưu tin nhắn cục bộ (Chỉ tồn tại trong phiên làm việc hiện tại)
    const [localMessages, setLocalMessages] = useState<Message[]>([]);

    const { user } = useAuthStore();
    const { socket, initSocket, sendMessage } = useChatStore();

    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Khởi tạo socket
    useEffect(() => {
        if (user) initSocket(user.fireBaseUid);
    }, [user, initSocket]);

    // 2. 🔥 MỚI: Reset tin nhắn khi User thay đổi (Login/Logout)
    // Điều này đảm bảo mỗi lần đăng nhập là một trang giấy trắng
    useEffect(() => {
        setLocalMessages([]);
    }, [user]);

    // 3. Lắng nghe Socket (Chỉ tin nhắn của AI)
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message: Message) => {
            if (message.senderId === AI_ID || message.receiverId === AI_ID) {
                setLocalMessages((prev) => [...prev, message]);
                if (message.senderId === AI_ID) {
                    setIsTyping(false);
                }
            }
        };

        const handleMessageSent = (message: Message) => {
            if (message.receiverId === AI_ID) {
                setLocalMessages((prev) => [...prev, message]);
            }
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_sent", handleMessageSent);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_sent", handleMessageSent);
        };
    }, [socket]);

    // 4. Auto Scroll (Giữ nguyên logic fix lỗi trôi tin nhắn)
    useEffect(() => {
        if (scrollRef.current && open) {
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({
                    behavior: isTyping ? "smooth" : "auto",
                    block: "end",
                });
            }, 100);
        }
    }, [localMessages, isTyping, open]);

    const handleSend = () => {
        if (!user || !input.trim()) return;

        sendMessage(AI_ID, user.fireBaseUid, input.trim());

        setInput("");
        setIsTyping(true);
    };

    return (
        <>
            {/* BUTTON MỞ CHAT */}
            <Button
                size="icon"
                onClick={() => setOpen(true)}
                className={`
                    fixed bottom-[100px] right-6 z-50
                    size-14 rounded-full
                    bg-green-500 text-black
                    hover:bg-green-400
                    shadow-lg
                    transition-all duration-300 ease-out
                    ${open ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"}
                `}
            >
                <MessageCircle className="size-6" />
            </Button>

            {/* HỘP THOẠI CHAT */}
            <div
                className={`
                    fixed bottom-24 right-6 z-40
                    w-80 md:w-96 h-[500px]
                    rounded-xl
                    bg-zinc-900 border border-zinc-700
                    shadow-2xl
                    flex flex-col
                    transition-all duration-300 ease-out
                    ${open
                        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                        : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                    }
                `}
            >
                {/* HEADER */}
                <div className="px-4 py-3 border-b border-zinc-700 flex items-center justify-between bg-zinc-800/50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="size-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Bot className="size-5 text-green-500" />
                            </div>
                            <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-zinc-900 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Music Assistant</h3>
                            <p className="text-xs text-zinc-400">New Session</p>
                        </div>
                    </div>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                    >
                        <X className="size-4" />
                    </Button>
                </div>

                {/* MESSAGES LIST */}
                <ScrollArea className="flex-1 px-4 py-3 bg-zinc-900/50">
                    <div className="space-y-4">
                        {/* Tin nhắn chào mừng luôn hiện khi bắt đầu phiên mới */}
                        {localMessages.length === 0 && (
                            <div className="text-center text-zinc-500 text-sm mt-8 space-y-2">
                                <Bot className="size-10 mx-auto text-zinc-600" />
                                <p>👋 Xin chào! Đây là cuộc hội thoại mới.</p>
                                <p className="text-xs">Bạn cần tôi gợi ý nhạc gì không?</p>
                            </div>
                        )}

                        {localMessages.map((m) => (
                            <div
                                key={m._id || Math.random()}
                                className={`flex ${m.senderId === user?.fireBaseUid ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`
                                        max-w-[85%]
                                        px-3 py-2 rounded-2xl
                                        text-sm leading-relaxed
                                        shadow-sm
                                        ${m.senderId === user?.fireBaseUid
                                            ? "bg-green-600 text-white rounded-br-none"
                                            : "bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700"
                                        }
                                    `}
                                >
                                    <ReactMarkdown
                                        components={{
                                            strong: ({ node, ...props }) => <span className="font-bold text-yellow-400" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-1 space-y-1" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-1 space-y-1" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                                        }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-zinc-800 border border-zinc-700 px-4 py-3 rounded-2xl rounded-bl-none">
                                    <div className="flex gap-1.5">
                                        <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={scrollRef} className="h-1" />
                    </div>
                </ScrollArea>

                {/* INPUT AREA */}
                <div className="p-3 border-t border-zinc-700 bg-zinc-900 rounded-b-xl">
                    <div className="relative flex items-center">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Gợi ý nhạc chill..."
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="bg-zinc-800 border-none text-white pr-12 h-11 focus-visible:ring-1 focus-visible:ring-green-500 rounded-full"
                            disabled={isTyping}
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className={`
                                absolute right-1 size-9 rounded-full
                                bg-green-500 text-black
                                hover:bg-green-400
                                transition-all
                                disabled:opacity-50 disabled:bg-zinc-700 disabled:text-zinc-500
                            `}
                        >
                            <Send className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FloatingChatbox;