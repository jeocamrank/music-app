import { useState } from "react";
import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, Zap, Headphones, Download, CreditCard, Loader2, UserCheck } from "lucide-react";
import { usePaymentStore } from "@/stores/usePaymentStore";
import { useAuthStore } from "@/stores/useAuthStore"; // 1. Import AuthStore
import PaymentDialog from "./PaymentDialog";

// Danh sách quyền lợi
const features = [
    {
        icon: <Zap className="size-6 text-green-500" />,
        title: "Nghe nhạc không quảng cáo",
        desc: "Tận hưởng âm nhạc không gián đoạn, mượt mà.",
    },
    {
        icon: <Download className="size-6 text-green-500" />,
        title: "Tải nhạc ngoại tuyến",
        desc: "Nghe nhạc mọi lúc mọi nơi, kể cả khi không có mạng.",
    },
    {
        icon: <Headphones className="size-6 text-green-500" />,
        title: "Chất lượng âm thanh cao",
        desc: "Cảm nhận từng chi tiết âm thanh sống động nhất.",
    },
];

const PremiumPage = () => {
    const { createPaymentUrl, isLoading } = usePaymentStore();
    const { user } = useAuthStore(); // 2. Lấy user từ store

    // State quản lý việc hiển thị Dialog QR Code
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [paymentData, setPaymentData] = useState<{ payUrl: string; orderId: string } | null>(null);

    const handleSubscribe = async () => {
        // Nếu đã là premium thì không cho click (dự phòng)
        if (user?.isPremium) return;

        // 1. Gọi API tạo link thanh toán (50k)
        const data = await createPaymentUrl("50000");

        // 2. Nếu thành công, lưu dữ liệu và mở Dialog
        if (data) {
            setPaymentData(data);
            setIsDialogOpen(true);
        }
    };

    // Hàm format ngày hết hạn (DD/MM/YYYY)
    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return "Không xác định";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    // Hàm tính số ngày còn lại
    const getDaysRemaining = (dateString: string | Date | undefined) => {
        if (!dateString) return 0;
        const expiry = new Date(dateString).getTime();
        const now = new Date().getTime();
        const diff = expiry - now;
        return Math.ceil(diff / (1000 * 3600 * 24)); // Chuyển đổi mili-giây sang ngày
    };

    return (
        <div className="rounded-md overflow-hidden h-full bg-zinc-900 relative">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                {/* === HERO SECTION (Gradient Background) === */}
                <div className="relative bg-gradient-to-b from-emerald-800 to-zinc-900 p-8 sm:p-12 text-center sm:text-left overflow-hidden min-h-[500px] flex items-center">

                    <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 w-full">
                        {/* Bên trái: Text giới thiệu */}
                        <div className="space-y-6 flex-1 text-center md:text-left">
                            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                                Get Premium. <br />
                                Be Happy.
                            </h1>
                            <p className="text-zinc-200 text-lg max-w-md mx-auto md:mx-0">
                                Trải nghiệm âm nhạc không giới hạn chỉ với 50.000đ/tháng. Hủy bất kỳ lúc nào.
                            </p>

                            <div className="hidden md:flex gap-4">
                                <Button className="bg-black text-white hover:bg-zinc-800 rounded-full font-bold px-8 py-6 text-lg transition-transform hover:scale-105">
                                    Tìm hiểu thêm
                                </Button>
                            </div>
                        </div>

                        {/* Bên phải: Thẻ Giá Nổi Bật (Card) */}
                        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 p-6 rounded-2xl shadow-2xl w-full max-w-sm hover:scale-105 transition-transform duration-300 relative group">
                            {/* Tag giảm giá (Chỉ hiện khi chưa mua) */}
                            <div className="absolute -top-3 -right-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
                                Best Value
                            </div>

                            <div className="flex justify-between items-center mb-4 border-b border-zinc-700 pb-4">
                                <span className="text-zinc-100 font-semibold">Gói Cá Nhân</span>
                                <div className="text-right">
                                    <span className="text-zinc-500 line-through text-xs block">99.000đ</span>
                                    <span className="text-green-400 font-bold text-sm">Tiết kiệm 50%</span>
                                </div>
                            </div>

                            <div className="mb-6 text-center">
                                <span className="text-4xl font-bold text-white">50.000đ</span>
                                <span className="text-zinc-400 text-sm"> / tháng</span>
                            </div>

                            <ul className="space-y-3 mb-8 text-left">
                                {[
                                    "Nghe nhạc không quảng cáo",
                                    "Tải xuống không giới hạn",
                                    "Chất lượng âm thanh Lossless",
                                    "Phát bất kỳ bài hát nào"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="bg-green-500/20 p-1 rounded-full shrink-0">
                                            <Check className="size-3 text-green-500" />
                                        </div>
                                        <span className="text-sm text-zinc-300">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* --- XỬ LÝ LOGIC HIỂN THỊ NÚT BẤM --- */}
                            {user?.isPremium ? (
                                // 3. Nếu đã là Premium
                                <div className="space-y-3">
                                    <Button
                                        disabled
                                        className="w-full bg-zinc-700 text-zinc-300 font-bold py-6 rounded-full text-lg cursor-not-allowed border border-zinc-600 flex items-center justify-center gap-2"
                                    >
                                        <UserCheck className="h-5 w-5 text-green-500" />
                                        Đang sử dụng Premium
                                    </Button>

                                    <div className="bg-green-500/10 rounded-lg p-3 text-center border border-green-500/20">
                                        <p className="text-xs text-zinc-400 mb-1">Thời hạn còn lại</p>
                                        <p className="text-lg font-bold text-green-400">
                                            {getDaysRemaining(user.premiumExpiry)} ngày
                                        </p>
                                        <p className="text-[10px] text-zinc-500">
                                            Hết hạn: {formatDate(user.premiumExpiry)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // 4. Nếu chưa là Premium (Hiện nút thanh toán)
                                <div>
                                    <Button
                                        onClick={handleSubscribe}
                                        disabled={isLoading}
                                        className="w-full bg-[#A50064] hover:bg-[#8C0054] text-white font-bold py-6 rounded-full text-lg transition-all shadow-lg hover:shadow-[#A50064]/40 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Đang tạo đơn...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="h-5 w-5" />
                                                Thanh toán MoMo
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-[10px] text-zinc-500 text-center mt-3">
                                        Thanh toán an toàn & bảo mật 100% qua MoMo
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 size-96 rounded-full bg-green-500/20 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
                </div>

                {/* === FEATURES GRID === */}
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
                        Tại sao nên nâng cấp Premium?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-zinc-800/40 p-8 rounded-xl border border-zinc-700/30 hover:bg-zinc-800/60 transition-all hover:-translate-y-1 group">
                                <div className="bg-zinc-900 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 group-hover:bg-green-500/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 text-center md:text-left">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed text-center md:text-left">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>

            {/* === DIALOG QR CODE === */}
            {paymentData && (
                <PaymentDialog
                    open={isDialogOpen}
                    setOpen={setIsDialogOpen}
                    payUrl={paymentData.payUrl}
                    orderId={paymentData.orderId}
                />
            )}
        </div>
    );
};

export default PremiumPage;