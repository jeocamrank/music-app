import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";
import type { User } from "@/types";

// Đảm bảo Type User khớp với backend
interface UserStore {
    users: User[];
    isLoading: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    updateUser: (id: string, formData: FormData) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get("/users");
            set({ users: res.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Lỗi tải danh sách người dùng" });
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            set({ isLoading: false });
        }
    },

    updateUser: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.patch(`/users/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Cập nhật lại user đó trong danh sách local để không cần fetch lại
            set((state) => ({
                users: state.users.map((user) =>
                    user._id === id ? res.data.user : user
                ),
            }));
            
            toast.success("Cập nhật người dùng thành công");
        } catch (error: any) {
            const message = error.response?.data?.message || "Lỗi cập nhật người dùng";
            toast.error(message);
            throw error; // Ném lỗi để Dialog biết mà không đóng
        } finally {
            set({ isLoading: false });
        }
    },

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/users/${id}`);
            
            // Xóa user khỏi danh sách local
            set((state) => ({
                users: state.users.filter((user) => user._id !== id),
            }));
            
            toast.success("Đã xóa người dùng");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi xóa người dùng");
        } finally {
            set({ isLoading: false });
        }
    },
}));