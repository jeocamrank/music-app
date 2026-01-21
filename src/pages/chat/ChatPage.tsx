import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useRef } from "react"; // 1. Import useRef
import UsersList from "./components/UsersList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { user } = useAuthStore();
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

	// 2. Tạo ref để tham chiếu đến điểm cuối của danh sách tin nhắn
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// 3. Hàm cuộn xuống cuối
	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	// 4. Gọi scrollToBottom mỗi khi messages thay đổi hoặc chọn user mới
	useEffect(() => {
		scrollToBottom();
	}, [messages, selectedUser]);

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.fireBaseUid);
	}, [selectedUser, fetchMessages]);

	return (
		<main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
			<Topbar />

			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]'>
				<UsersList />

				<div className='flex flex-col h-full'>
					{selectedUser ? (
						<>
							<ChatHeader />

							<ScrollArea className='h-[calc(100vh-340px)]'>
								<div className='p-4 space-y-4'>
									{messages.map((message) => {
										const isSender = message.senderId === user?.fireBaseUid;
										const messageUser = isSender ? user : selectedUser;
										const isPremium = messageUser?.isPremium;

										return (
											<div
												key={message._id}
												className={`flex items-start gap-3 ${isSender ? "flex-row-reverse" : ""}`}
											>
												{/* --- AVATAR SECTION --- */}
												<div className="relative group/avatar shrink-0">
													{isPremium && (
														<div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-50"></div>
													)}
													<div className={`relative ${isPremium ? "p-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full" : ""}`}>
														<Avatar className={`size-8 border ${isPremium ? "border-zinc-900" : "border-transparent"}`}>
															<AvatarImage
																src={messageUser?.imageUrl || "/default-avatar.png"}
																className="object-cover"
															/>
															<AvatarFallback>{messageUser?.fullName?.[0]}</AvatarFallback>
														</Avatar>
													</div>
												</div>

												{/* --- MESSAGE BUBBLE --- */}
												<div
													className={`rounded-lg p-3 max-w-[70%]
                                                        ${isSender ? "bg-green-500" : "bg-zinc-800"}
                                                    `}
												>
													<p className='text-sm'>{message.content}</p>
													<span className='text-xs text-zinc-300 mt-1 block text-right opacity-70'>
														{formatTime(message.createdAt)}
													</span>
												</div>
											</div>
										);
									})}

									{/* 5. Đặt thẻ div tàng hình này ở cuối danh sách để làm mốc cuộn */}
									<div ref={messagesEndRef} />
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};

export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<img src='/spotify.png' alt='Spotify' className='size-16 animate-bounce' />
		<div className='text-center'>
			<h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
			<p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
		</div>
	</div>
);