import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosInstance } from "@/lib/axios";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Song } from "@/types";

const DownloadButton = ({ song }: { song: Song }) => {
    const { user } = useAuthStore();
    const [isDownloading, setIsDownloading] = useState(false);

    // Hàm hỗ trợ lưu Blob thành file
    const saveFile = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. Check quyền
        if (!user) {
            return toast.error("Vui lòng đăng nhập để tải nhạc");
        }
        if (!user.isPremium) {
            return toast.error("Chức năng tải nhạc chỉ dành cho thành viên Premium");
        }

        setIsDownloading(true);
        const toastId = toast.loading(`Đang chuẩn bị tải: ${song.title}...`);

        try {
            // Tên file chuẩn: "Nghệ sĩ - Tên bài.mp3"
            const filename = `${song.artist} - ${song.title}.mp3`;

            // 2. KIỂM TRA LOẠI URL
            if (song.audioUrl.startsWith("/")) {
                // Tải file nội bộ
                const response = await fetch(song.audioUrl);
                if (!response.ok) throw new Error("Không tìm thấy file nội bộ");
                const blob = await response.blob();
                saveFile(blob, filename);
            } else {
                // Tải file Cloudinary qua Backend
                const response = await axiosInstance.get(`/songs/download/${song._id}`, {
                    responseType: 'blob',
                });
                const blob = new Blob([response.data], { type: 'audio/mpeg' });
                saveFile(blob, filename);
            }

            toast.success("Tải xuống thành công!", { id: toastId });

        } catch (error: any) {
            console.error("Lỗi tải nhạc:", error);
            if (error.response?.status === 403) {
                toast.error("Vui lòng nâng cấp Premium", { id: toastId });
            } else if (error.response?.status === 404) {
                toast.error("File nhạc không tồn tại", { id: toastId });
            } else {
                toast.error("Lỗi kết nối. Thử lại sau.", { id: toastId });
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Button
            size="icon"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`
                absolute bottom-3 right-[88px] 
                bg-green-500 hover:bg-green-400 text-black
                hover:scale-105
                transition-all duration-200
                opacity-0 translate-y-2
                group-hover:opacity-100
                group-hover:translate-y-0
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={user?.isPremium ? "Tải bài hát này" : "Yêu cầu Premium"}
        >
            {isDownloading ? (
                <Loader2 className="size-5 animate-spin text-black" />
            ) : (
                <Download className="size-5" />
            )}
        </Button>
    );
};

export default DownloadButton;