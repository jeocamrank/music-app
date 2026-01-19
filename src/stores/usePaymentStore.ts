import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

// Định nghĩa kiểu dữ liệu Payment từ Backend trả về
export interface Payment {
    _id: string;
    userId: {
        _id: string;
        fullName: string;
        imageUrl: string;
        email: string;
    };
    amount: number;
    status: "SUCCESS" | "PENDING" | "FAILED";
    createdAt: string;
    orderId: string;
}

interface PaymentStore {
    isLoading: boolean;
    payments: Payment[]; // Danh sách lịch sử
    createPaymentUrl: (amount?: string) => Promise<{ payUrl: string; orderId: string } | null>;
    checkStatus: (orderId: string) => Promise<boolean>;
    fetchPayments: () => Promise<void>; // Hàm mới lấy tất cả giao dịch
}

export const usePaymentStore = create<PaymentStore>((set) => ({
    isLoading: false,
    payments: [],

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
    },

    fetchPayments: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/payment/all");
            set({ payments: res.data.payments });
        } catch (error: any) {
            console.error("Lỗi lấy lịch sử thanh toán:", error);
            toast.error("Không thể tải lịch sử giao dịch");
        } finally {
            set({ isLoading: false });
        }
    }
}));