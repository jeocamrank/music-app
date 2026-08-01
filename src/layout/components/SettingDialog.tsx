import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Crown, Camera } from "lucide-react"; // Import thêm Camera icon

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SettingDialog = ({ open, onOpenChange }: Props) => {
    const { user, updateProfile, isLoading } = useAuthStore();

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.fullName || "");
            setPreview(user.imageUrl || "");
            setAvatar(null);
        }
    }, [user]);

    const handleAvatarChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatar(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("fullName", name);
        if (avatar) {
            formData.append("image", avatar);
        }

        try {
            await updateProfile(formData);
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 border-zinc-700 max-w-sm [&>button]:text-white [&>button]:hover:text-zinc-300">
                <DialogHeader>
                    <DialogTitle className="text-white text-center text-lg">
                        Hồ sơ của bạn
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* --- AVATAR SECTION VỚI HIỆU ỨNG PREMIUM --- */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            {/* 1. Lớp nền phát sáng (Glow effect) - Chỉ hiện khi Premium */}
                            {user?.isPremium && (
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                            )}

                            {/* 2. Khung viền (Border) - Gradient khi Premium, thường khi Free */}
                            <div className={`relative p-[3px] rounded-full ${user?.isPremium ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" : "bg-zinc-700"}`}>
                                <div className="bg-zinc-900 rounded-full p-[2px]"> {/* Lớp đệm để tách ảnh khỏi viền màu */}
                                    <img
                                        src={preview || "/avatar-placeholder.png"}
                                        alt="avatar"
                                        className="size-28 rounded-full object-cover"
                                    />
                                </div>

                                {/* Overlay icon Camera khi hover */}
                                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 m-[5px]"> {/* m-[5px] để overlay không che mất viền */}
                                    <Camera className="text-white size-8" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            </div>

                            {/* 3. Huy hiệu Vương miện (Badge) */}
                            {user?.isPremium && (
                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-full border-[3px] border-zinc-900 shadow-lg z-20">
                                    <Crown className="size-4 text-black fill-black" />
                                </div>
                            )}
                        </div>

                        {/* Text hướng dẫn */}
                        <div className="text-center">
                            <p className="text-sm font-medium text-white">Ảnh đại diện</p>
                            <p className="text-xs text-zinc-400 mt-1">Nhấn vào ảnh để thay đổi</p>
                        </div>
                    </div>
                    {/* ------------------------------------------ */}

                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Tên hiển thị
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-800/50 border-zinc-700 text-white focus:border-purple-500 h-11"
                            placeholder="Nhập tên của bạn"
                        />
                    </div>

                    {/* Premium Status Banner */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Trạng thái gói
                        </label>
                        <div className={`w-full rounded-lg px-4 py-3 flex items-center justify-between border ${user?.isPremium ? "bg-gradient-to-r from-zinc-800 to-zinc-900 border-purple-500/30" : "bg-zinc-800 border-zinc-700"}`}>
                            <div className="flex items-center gap-3">
                                {user?.isPremium ? (
                                    <div className="p-2 bg-purple-500/10 rounded-full">
                                        <Crown className="size-5 text-purple-500 fill-purple-500" />
                                    </div>
                                ) : (
                                    <div className="p-2 bg-zinc-700/50 rounded-full">
                                        <Crown className="size-5 text-zinc-500" />
                                    </div>
                                )}

                                <div>
                                    <p className={`font-semibold ${user?.isPremium ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400" : "text-zinc-400"}`}>
                                        {user?.isPremium ? "Premium Member" : "Gói miễn phí"}
                                    </p>
                                    {user?.isPremium && user?.premiumExpiry && (
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            Hết hạn: {formatDate(user.premiumExpiry)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                        >
                            Hủy
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold min-w-[100px]"
                        >
                            {isLoading ? "Đang lưu..." : "Lưu"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingDialog;