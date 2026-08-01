import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMusicStore } from '@/stores/useMusicStore'
import { useAuthStore } from '@/stores/useAuthStore'

const CreatePlaylistDialog = () => {
    // 1. Lấy thêm danh sách playlists từ store để đếm
    const { createPlaylist, playlists } = useMusicStore()
    const { user } = useAuthStore()

    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [creating, setCreating] = useState(false)

    const handleCreate = async () => {
        // 🛑 Chặn cứng nếu chưa đăng nhập
        if (!user) {
            toast.error('Bạn cần đăng nhập để tạo playlist')
            return
        }

        // --- KIỂM TRA GIỚI HẠN PLAYLIST (Logic Mới) ---
        if (!user.isPremium && playlists.length >= 2) {
            toast.error('Tài khoản miễn phí chỉ được tạo tối đa 2 playlist. Hãy nâng cấp Premium!', {
                icon: '🔒',
                duration: 4000,
            })
            return;
        }
        // ----------------------------------------------

        if (!title.trim()) {
            toast.error('Title is required')
            return
        }

        if (imageFile && !imageFile.type.startsWith('image/')) {
            toast.error('File phải là hình ảnh')
            return
        }

        const formData = new FormData()
        formData.append('title', title)
        if (description) formData.append('description', description)
        if (imageFile) formData.append('imageFile', imageFile)

        try {
            setCreating(true)
            await createPlaylist(formData)

            toast.success('Playlist created 🎵')
            setOpen(false)
            setTitle('')
            setDescription('')
            setImageFile(null)
        } catch (error: any) {
            // Hiển thị lỗi từ backend nếu backend cũng chặn
            const message = error.response?.data?.message || 'Failed to create playlist'
            toast.error(message)
        } finally {
            setCreating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger */}
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    disabled={!user}
                    className={`
                        text-white p-1
                        ${user ? 'hover:bg-zinc-800' : 'opacity-50 cursor-not-allowed'}
                    `}
                    onClick={() => {
                        if (!user) {
                            toast('Vui lòng đăng nhập để sử dụng chức năng này 🔒')
                        }
                    }}
                >
                    {user ? <Plus className="size-5" /> : <Lock className="size-5" />}
                </Button>
            </DialogTrigger>

            {/* Dialog Content - Giữ nguyên như cũ */}
            <DialogContent className="border border-zinc-700 bg-zinc-900 text-muted-foreground">
                {!user ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Lock className="size-4" />
                                Yêu cầu đăng nhập
                            </DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-zinc-400">
                            Bạn cần đăng nhập để tạo và quản lý playlist của riêng mình.
                        </p>

                        <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600">
                            Đăng nhập ngay
                        </Button>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Create New Playlist</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Title</Label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-zinc-800 text-white"
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-zinc-800 text-white"
                                />
                            </div>

                            <div>
                                <Label>Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    className="bg-zinc-800 text-muted-foreground cursor-pointer"
                                />
                            </div>

                            <Button
                                onClick={handleCreate}
                                disabled={creating}
                                className="w-full bg-emerald-500 hover:bg-emerald-600"
                            >
                                {creating ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default CreatePlaylistDialog