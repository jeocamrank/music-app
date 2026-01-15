import { axiosInstance } from "@/lib/axios";
import type { User } from "@/types";
import { create } from "zustand";

interface AuthStore {
    user: User | null;
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    fetchMe: () => Promise<void>;
    updateProfile: (formData: FormData) => Promise<void>;
    reset: () => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/admin/check");
            set({ isAdmin: response.data.admin });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMe: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/users/me");
            set({ user: res.data.user });
        } finally {
            set({ isLoading: false });
        }
    },


    updateProfile: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.patch("/users/me", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            set({ user: res.data.user });
        } catch (error: any) {
            set({
                error:
                    error.response?.data?.message ||
                    "Cập nhật thông tin thất bại",
            });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },


    reset: () => {
        set({ isAdmin: false, isLoading: false, error: null });
    },

    setUser: (user) => set({ user }),
}));