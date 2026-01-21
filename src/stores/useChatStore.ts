import { axiosInstance } from '@/lib/axios';
import type { Message, User } from '@/types';
import { create } from 'zustand'
import { io } from "socket.io-client"

interface ChatState {
    users: User[];
    isLoading: boolean;
    error: string | null;
    socket: any;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    messages: Message[];
    selectedUser: User | null;
    messagesCache: Map<string, Message[]>; // Cache

    fetchUsers: () => Promise<void>;
    initSocket: (userId: string) => void;
    disconnectSocket: () => void;
    sendMessage: (receiverId: string, senderId: string, content: string) => void;
    fetchMessages: (userId: string) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

const baseURL = "http://localhost:5000";

const socket = io(baseURL, {
    autoConnect: false,
    withCredentials: true,
})

export const useChatStore = create<ChatState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],
    selectedUser: null,
    messagesCache: new Map(),

    setSelectedUser: (user) => set({ selectedUser: user }),

    fetchUsers: async () => {
        // Cache: Nếu có user rồi thì không load lại
        if (get().users.length > 0) return;

        const token = axiosInstance.defaults.headers.common["Authorization"]
        if (!token) {
            set({ users: [], isLoading: false })
            return
        }

        set({ isLoading: true, error: null });
        try {
            const reponse = await axiosInstance.get('/users');
            set({ users: reponse.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    initSocket: (userId: string) => {
        if (!get().isConnected) {
            socket.connect();
            socket.emit("user_connected", userId);

            socket.on("users_online", (users: string[]) => {
                set({ onlineUsers: new Set(users) });
            })

            socket.on("activities", (activites: [string, string][]) => {
                set({ userActivities: new Map(activites) });
            });

            socket.on("user_connected", (userId: string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId])
                }));
            });

            socket.on("user_disconnected", (userId: string) => {
                set((state) => {
                    const newOnlineUsers = new Set(state.onlineUsers);
                    newOnlineUsers.delete(userId);
                    return { onlineUsers: newOnlineUsers }
                });
            });

            // --- SỬA ĐOẠN NÀY: receive_message ---
            socket.on("receive_message", (message: Message) => {
                set((state) => {
                    const senderId = message.senderId;
                    const newCache = new Map(state.messagesCache);
                    const senderMessages = newCache.get(senderId) || [];
                    newCache.set(senderId, [...senderMessages, message]);

                    // ⚠️ QUAN TRỌNG: So sánh bằng fireBaseUid thay vì _id
                    const isChattingWithSender = state.selectedUser?.fireBaseUid === senderId;

                    return {
                        messagesCache: newCache,
                        messages: isChattingWithSender ? [...state.messages, message] : state.messages
                    };
                })
            })

            // --- SỬA ĐOẠN NÀY: message_sent ---
            socket.on("message_sent", (message: Message) => {
                set((state) => {
                    const receiverId = message.receiverId;
                    const newCache = new Map(state.messagesCache);
                    const receiverMessages = newCache.get(receiverId) || [];
                    newCache.set(receiverId, [...receiverMessages, message]);

                    // ⚠️ QUAN TRỌNG: So sánh bằng fireBaseUid thay vì _id
                    const isChattingWithReceiver = state.selectedUser?.fireBaseUid === receiverId;

                    return {
                        messagesCache: newCache,
                        messages: isChattingWithReceiver ? [...state.messages, message] : state.messages
                    };
                })
            })

            socket.on("activity_updated", ({ userId, activity }) => {
                set((state) => {
                    const newActivities = new Map(state.userActivities);
                    newActivities.set(userId, activity);
                    return { userActivities: newActivities }
                })
            })

            set({ isConnected: true })
        }
    },

    disconnectSocket: () => {
        if (get().isConnected) {
            socket.disconnect();
            set({ isConnected: false });
        }
    },

    sendMessage: async (receiverId, senderId, content) => {
        const socket = get().socket;
        if (!socket) return;
        socket.emit("send_message", { receiverId, senderId, content });
    },

    fetchMessages: async (userId: string) => {
        // Kiểm tra Cache
        const { messagesCache } = get();
        const cachedMessages = messagesCache.get(userId);

        if (cachedMessages) {
            set({ messages: cachedMessages, isLoading: false, error: null });
        } else {
            set({ isLoading: true, error: null });
            try {
                const response = await axiosInstance.get(`/users/messages/${userId}`)
                set((state) => {
                    const newCache = new Map(state.messagesCache);
                    newCache.set(userId, response.data);

                    return {
                        messages: response.data,
                        messagesCache: newCache
                    };
                })
            } catch (error: any) {
                set({ error: error.response?.data?.message });
            } finally {
                set({ isLoading: false })
            }
        }
    }
}));