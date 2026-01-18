import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePaymentStore } from "@/stores/usePaymentStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
    open: boolean;
    setOpen: (val: boolean) => void;
    payUrl: string;
    orderId: string;
}

const PaymentDialog = ({ open, setOpen, payUrl, orderId }: Props) => {
    const { checkStatus } = usePaymentStore();
    const navigate = useNavigate();
    
    // Tự động hết hạn sau 10 phút (600s)
    const [timeLeft, setTimeLeft] = useState(600); 
    const [isExpired, setIsExpired] = useState(false);

    // 1. Đếm ngược thời gian
    useEffect(() => {
        if (!open || isExpired) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [open, isExpired]);

    // 2. POLLING: Hỏi Server mỗi 2 giây
    useEffect(() => {
        if (!open || !orderId || isExpired) return;

        const intervalId = setInterval(async () => {
            console.log("Checking payment status...", orderId);
            const isSuccess = await checkStatus(orderId);
            
            if (isSuccess) {
                console.log("✅ Thanh toán thành công!");
                clearInterval(intervalId);
                setOpen(false);
                navigate("/premium-success");
            }
        }, 2000); // 2000ms = 2 giây

        return () => clearInterval(intervalId);
    }, [open, orderId, isExpired, checkStatus, navigate, setOpen]);

    // Format thời gian hiển thị
    const formatTime = (s: number) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleClose = () => {
        setOpen(false);
        setIsExpired(false);
        setTimeLeft(600);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md flex flex-col items-center py-8">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-center text-xl text-green-500 font-bold">Thanh toán MoMo</DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        {isExpired ? "Mã QR đã hết hạn" : `Quét mã trong ${formatTime(timeLeft)}`}
                    </DialogDescription>
                </DialogHeader>
                
                <div className={`bg-white p-4 rounded-xl mb-6 relative ${isExpired ? "opacity-20 blur-sm" : ""}`}>
                    {payUrl ? <QRCode value={payUrl} size={200} /> : <Loader2 className="animate-spin text-black" />}
                    
                    {isExpired && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button variant="destructive" onClick={handleClose}>Đóng</Button>
                        </div>
                    )}
                </div>

                {!isExpired && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm animate-pulse">
                        <Loader2 className="size-4 animate-spin text-green-500" />
                        Đang chờ xác nhận...
                    </div>
                )}

                <div className="mt-4 text-xs text-zinc-500 text-center">
                    Lưu ý: Không tắt tab này khi đang thanh toán.
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentDialog;