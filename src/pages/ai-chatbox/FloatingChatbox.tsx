import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore"
import ReactMarkdown from "react-markdown";

const AI_ID = "AI_ASSISTANT"

const FloatingChatbox = () => {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false) // 1. State trạng thái typing

    const { user } = useAuthStore()
    const { messages, sendMessage, initSocket } = useChatStore()

    // Ref để tự động cuộn xuống cuối
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (user) initSocket(user.fireBaseUid)
    }, [user])

    const aiMessages = messages.filter(
        (m) => m.senderId === AI_ID || m.receiverId === AI_ID
    )

    // 2. Logic tắt typing khi có tin nhắn mới từ AI
    useEffect(() => {
        const lastMessage = aiMessages[aiMessages.length - 1];
        if (lastMessage?.senderId === AI_ID) {
            setIsTyping(false);
        }

        // Tự động cuộn xuống khi có tin nhắn mới hoặc đang typing
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [aiMessages, isTyping, open]);

    const handleSend = () => {
        if (!user || !input.trim()) return

        sendMessage(AI_ID, user.fireBaseUid, input.trim())
        setInput("")
        setIsTyping(true) // Bật trạng thái typing ngay khi gửi
    }

    return (
        <>
            {/* ===== FLOAT BUTTON ===== */}
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

            {/* ===== CHATBOX ===== */}
            <div
                className={`
                    fixed bottom-24 right-6 z-40
                    w-80 h-[420px]
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
                <div className="px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-white">
                            AI Assistant
                        </span>
                    </div>

                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                    >
                        <X className="size-4" />
                    </Button>
                </div>

                {/* MESSAGES */}
                <ScrollArea className="flex-1 px-4 py-3">
                    <div className="space-y-3">
                        {aiMessages.map((m) => (
                            <div
                                key={m._id}
                                className={`
                                    max-w-[80%]
                                    px-3 py-2 rounded-lg
                                    text-sm leading-relaxed
                                    ${m.senderId === user?.fireBaseUid
                                        ? "ml-auto bg-green-500 text-black"
                                        : "bg-zinc-800 text-zinc-200"
                                    }
                                `}
                            >
                                <ReactMarkdown
                                    components={{
                                        // Style cho chữ in đậm (**text**)
                                        strong: ({ node, ...props }) => (
                                            <span className="font-bold text-white" {...props} />
                                        ),
                                        // Style cho danh sách (1. 2. 3.)
                                        ol: ({ node, ...props }) => (
                                            <ol className="list-decimal list-inside ml-1 space-y-1" {...props} />
                                        ),
                                        // Style cho gạch đầu dòng (- item)
                                        ul: ({ node, ...props }) => (
                                            <ul className="list-disc list-inside ml-1 space-y-1" {...props} />
                                        ),
                                        // Style cho đoạn văn
                                        p: ({ node, ...props }) => (
                                            <p className="mb-1 last:mb-0" {...props} />
                                        ),
                                    }}
                                >
                                    {m.content}
                                </ReactMarkdown>
                            </div>
                        ))}

                        {/* 3. UI Hiệu ứng Typing */}
                        {isTyping && (
                            <div className="bg-zinc-800 w-fit px-3 py-3 rounded-lg rounded-tl-none">
                                <div className="flex gap-1">
                                    <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}

                        {/* Dummy div để scroll xuống */}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* INPUT */}
                <div className="p-3 border-t border-zinc-700 flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Hỏi gì đó cho AI..."
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="bg-zinc-800 border-none text-white focus-visible:ring-1 focus-visible:ring-green-500"
                    />

                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping} // Disable nút gửi khi đang chờ
                        className="
                            bg-green-500 text-black
                            hover:bg-green-400
                            hover:scale-105
                            transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        <Send className="size-4" />
                    </Button>
                </div>
            </div>
        </>
    )
}

export default FloatingChatbox