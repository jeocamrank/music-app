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

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SettingDialog = ({ open, onOpenChange }: Props) => {
    const { user, updateProfile, isLoading } = useAuthStore();
    console.log("SETTING USER", user)

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
          bg-zinc-900 border-zinc-700 max-w-sm
          [&>button]:text-white
          [&>button]:hover:text-zinc-300
        "
            >
                <DialogHeader>
                    <DialogTitle className="text-white">
                        Cài đặt tài khoản
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <img
                            src={preview || "/avatar-placeholder.png"}
                            alt="avatar"
                            className="size-24 rounded-full object-cover border border-zinc-700"
                        />

                        <label className="text-sm text-emerald-400 cursor-pointer hover:underline">
                            Đổi avatar
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm text-zinc-400">
                            Tên hiển thị
                        </label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="bg-zinc-800"
                        >
                            Hủy
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-emerald-500 hover:bg-emerald-600"
                        >
                            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingDialog;
