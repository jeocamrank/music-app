import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { Crown } from "lucide-react"; // Import thêm icon Crown

const ChatHeader = () => {
    const { selectedUser, onlineUsers } = useChatStore();

    if (!selectedUser) return null;

    // Giả sử selectedUser có thuộc tính isPremium
    const isPremium = selectedUser.isPremium;

    return (
        <div className='p-4 border-b border-zinc-800'>
            <div className='flex items-center gap-3'>
                {/* --- AVATAR SECTION --- */}
                <div className="relative group/avatar">
                    {/* 1. Glow Effect (Chỉ hiện khi Premium) */}
                    {isPremium && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-40"></div>
                    )}

                    {/* 2. Border Gradient (Chỉ hiện khi Premium) */}
                    <div className={`relative ${isPremium ? "p-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full" : ""}`}>
                        <Avatar className={isPremium ? "border-2 border-zinc-900" : ""}>
                            <AvatarImage src={selectedUser.imageUrl} className="object-cover" />
                            <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* --- INFO SECTION --- */}
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className={`font-medium ${isPremium ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold" : "text-white"}`}>
                            {selectedUser.fullName}
                        </h2>
                        {/* Icon Vương miện nếu là Premium */}
                        {isPremium && <Crown className="size-4 text-yellow-500 fill-yellow-500" />}
                    </div>

                    <p className='text-sm text-zinc-400'>
                        {onlineUsers.has(selectedUser.fireBaseUid) ? (
                            <span className="text-green-500">Online</span>
                        ) : (
                            "Offline"
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
export default ChatHeader;