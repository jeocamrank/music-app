import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { Crown } from "lucide-react";

const UsersList = () => {
    const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();

    return (
        <div className='border-r border-zinc-800'>
            <div className='flex flex-col h-full'>
                <ScrollArea className='h-[calc(100vh-280px)]'>
                    <div className='space-y-2 p-4'>
                        {/* 👇 FIX: Chỉ hiện Skeleton khi đang tải VÀ chưa có danh sách user */}
                        {isLoading && users.length === 0 ? (
                            <UsersListSkeleton />
                        ) : (
                            users.map((user) => {
                                const isPremium = user.isPremium;
                                const isOnline = onlineUsers.has(user.fireBaseUid);
                                const isSelected = selectedUser?.fireBaseUid === user.fireBaseUid;

                                return (
                                    <div
                                        key={user._id}
                                        onClick={() => setSelectedUser(user)}
                                        className={`flex items-center justify-center lg:justify-start gap-3 p-3
                                            rounded-lg cursor-pointer transition-colors group
                                            ${isSelected ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
                                    >
                                        {/* --- AVATAR SECTION --- */}
                                        <div className='relative group/avatar'>
                                            {/* 1. Glow Effect (Premium only) */}
                                            {isPremium && (
                                                <div className={`absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-0 group-hover/avatar:opacity-75 transition duration-500 ${isSelected ? "opacity-50" : ""}`}></div>
                                            )}

                                            {/* 2. Border Gradient (Premium only) */}
                                            <div className={`relative ${isPremium ? "p-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full" : ""}`}>
                                                <Avatar className={`size-8 md:size-12 border ${isPremium ? "border-zinc-900" : "border-zinc-800"}`}>
                                                    <AvatarImage src={user.imageUrl} className="object-cover" />
                                                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                                </Avatar>
                                            </div>

                                            {/* 3. Online Indicator */}
                                            <div
                                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
                                                    ${isOnline ? "bg-green-500" : "bg-zinc-500"}`}
                                            />
                                        </div>

                                        {/* --- NAME SECTION --- */}
                                        <div className='flex-1 min-w-0 lg:block hidden'>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium truncate ${isPremium ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold" : "text-white"}`}>
                                                    {user.fullName}
                                                </span>
                                                {isPremium && <Crown className="size-3 text-yellow-500 fill-yellow-500 shrink-0" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default UsersList;