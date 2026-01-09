import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useMusicStore } from "@/stores/useMusicStore"
import toast from "react-hot-toast"
import { Label } from "@radix-ui/react-label"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    songId?: string
}

const CreatePlaylistInlineDialog = ({ open, onOpenChange, songId }: Props) => {
    const { createPlaylist, addSongToPlaylist } = useMusicStore()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [creating, setCreating] = useState(false)

    const handleCreate = async () => {
        if (!title.trim()) {
            toast.error("Vui lòng nhập tên playlist")
            return
        }

        if (imageFile && !imageFile.type.startsWith("image/")) {
            toast.error("File phải là hình ảnh")
            return
        }

        const formData = new FormData()
        formData.append("title", title)
        if (description) formData.append("description", description)
        if (imageFile) formData.append("imageFile", imageFile)

        try {
            setCreating(true)

            await createPlaylist(formData)

            // 🔥 LUÔN lấy state mới nhất
            const newPlaylist =
                useMusicStore.getState().playlists.at(-1)

            if (newPlaylist && songId) {
                await addSongToPlaylist(newPlaylist._id, songId)
            }

            toast.success("Đã tạo playlist mới 🎵")

            // reset form
            setTitle("")
            setDescription("")
            setImageFile(null)
            onOpenChange(false)
        } catch (error) {
            toast.error("Tạo playlist thất bại")
        } finally {
            setCreating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={!creating ? onOpenChange : () => {}}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Danh sách phát mới</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Tên playlist</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tên playlist"
                            className="bg-zinc-800 border-zinc-700"
                        />
                    </div>

                    <div>
                        <Label>Mô tả (tuỳ chọn)</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-zinc-800 text-white"
                        />
                    </div>

                    <div>
                        <Label>Ảnh (tuỳ chọn)</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImageFile(e.target.files?.[0] || null)
                            }
                            className="bg-zinc-800 text-muted-foreground cursor-pointer"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={creating}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={creating}
                        className="bg-green-500 text-black"
                    >
                        {creating ? "Đang tạo..." : "Tạo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePlaylistInlineDialog
