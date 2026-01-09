import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useMusicStore } from "@/stores/useMusicStore"
import type { Song } from "@/types"
import { Bookmark, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import CreatePlaylistInlineDialog from "./CreatePlaylistInlineDialog"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    song: Song
}

const PlaylistPickerDialog = ({ open, onOpenChange, song }: Props) => {
    const {
        playlists,
        addSongToPlaylist,
        removeSongFromPlaylist,
    } = useMusicStore()

    const [openCreate, setOpenCreate] = useState(false)
    const [processingId, setProcessingId] = useState<string | null>(null)

    const handleToggleSong = async (
        playlistId: string,
        hasSong: boolean
    ) => {
        try {
            setProcessingId(playlistId)

            if (hasSong) {
                await removeSongFromPlaylist(playlistId, song._id)
                toast.success("Đã xóa khỏi playlist")
            } else {
                await addSongToPlaylist(playlistId, song._id)
                toast.success("Đã thêm vào playlist")
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra")
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>Lưu vào…</DialogTitle>
                    </DialogHeader>

                    {/* playlists */}
                    <div className="space-y-1">
                        {playlists.map((playlist) => {
                            const hasSong = playlist.songs.some(
                                (s) => s._id === song._id
                            )

                            const isLoading =
                                processingId === playlist._id

                            return (
                                <div
                                    key={playlist._id}
                                    onClick={() =>
                                        !isLoading &&
                                        handleToggleSong(
                                            playlist._id,
                                            hasSong
                                        )
                                    }
                                    className={`
                                        flex items-center gap-3 p-2 rounded-md
                                        transition cursor-pointer
                                        ${
                                            isLoading
                                                ? "opacity-50 pointer-events-none"
                                                : "hover:bg-white/5"
                                        }
                                    `}
                                >
                                    {/* image */}
                                    <img
                                        src={playlist.imageUrl}
                                        className="w-10 h-10 rounded object-cover"
                                    />

                                    {/* info */}
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">
                                            {playlist.title}
                                        </div>
                                        <div className="text-xs text-zinc-400">
                                            {playlist.songs.length} bài hát
                                        </div>
                                    </div>

                                    {/* icon */}
                                    <Bookmark
                                        className={`w-5 h-5 transition ${
                                            hasSong
                                                ? "text-green-500"
                                                : "text-zinc-400"
                                        }`}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {/* create new */}
                    <button
                        onClick={() => setOpenCreate(true)}
                        className="flex items-center gap-2 mt-4 p-2 rounded-md
                                   hover:bg-white/5 transition"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="text-sm">
                            Danh sách phát mới
                        </span>
                    </button>
                </DialogContent>
            </Dialog>

            {/* create playlist inline */}
            <CreatePlaylistInlineDialog
                open={openCreate}
                onOpenChange={setOpenCreate}
                songId={song._id}
            />
        </>
    )
}

export default PlaylistPickerDialog
