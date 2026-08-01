import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Home, Music, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import Topbar from "@/components/Topbar";

const PremiumSuccessPage = () => {
    // Lấy hàm fetchMe và state isLoading từ AuthStore
    const { fetchMe, isLoading, user } = useAuthStore();

    useEffect(() => {
        // Gọi API để lấy thông tin User mới nhất (đã được cập nhật Premium từ backend)
        fetchMe();
    }, [fetchMe]);

    return (
        <div className="h-full bg-black rounded-md overflow-hidden flex flex-col">
            <Topbar />
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl text-center relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        {isLoading ? (
                            // Loading state khi đang đồng bộ dữ liệu
                            <div className="flex flex-col items-center py-10">
                                <Loader className="size-10 text-green-500 animate-spin mb-4" />
                                <p className="text-zinc-400">Đang cập nhật hồ sơ...</p>
                            </div>
                        ) : (
                            <>
                                <div className="mx-auto bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="size-10 text-green-500 animate-bounce" />
                                </div>

                                <h1 className="text-3xl font-bold text-white mb-2">Thanh toán thành công!</h1>
                                <p className="text-zinc-400 mb-8">
                                    Chào mừng <span className="text-white font-bold">{user?.fullName || "bạn"}</span> đến với Premium.
                                    <br />Tài khoản của bạn đã được nâng cấp.
                                </p>

                                <div className="flex flex-col gap-3">
                                    <Link to="/">
                                        <Button className="w-full bg-green-500 hover:bg-green-400 text-black font-bold h-12 text-base transition-transform hover:scale-[1.02]">
                                            <Home className="mr-2 size-5" />
                                            Về trang chủ
                                        </Button>
                                    </Link>

                                    <Link to="/music">
                                        <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-white h-12 text-base">
                                            <Music className="mr-2 size-5" />
                                            Khám phá thư viện
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumSuccessPage;