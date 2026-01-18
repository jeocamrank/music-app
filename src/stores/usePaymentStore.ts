import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

interface PaymentStore {
    isLoading: boolean;
    // Hàm tạo link
    createPaymentUrl: (amount?: string) => Promise<{ payUrl: string; orderId: string } | null>;
    // Hàm check trạng thái (trả về true/false)
    checkStatus: (orderId: string) => Promise<boolean>;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
    isLoading: false,

    createPaymentUrl: async (amount = "50000") => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/payment/create-url", { amount });
            return { 
                payUrl: res.data.payUrl, 
                orderId: res.data.orderId 
            };
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi tạo thanh toán");
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    checkStatus: async (orderId) => {
        try {
            const res = await axiosInstance.post("/payment/check-status", { orderId });
            return res.data.status === "SUCCESS";
        } catch (error) {
            console.error("Lỗi check status:", error);
            return false;
        }
    }
}));