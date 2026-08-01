import type { Song } from "@/types"
import AddToPlaylistButton from "../home/components/AddToPlayListButton"
import PlayButton from "../home/components/PlayButton"
import { usePlayerStore } from "@/stores/usePlayerStore"
import DownloadButton from "../home/components/DownloadButton"
import { useAuthStore } from "@/stores/useAuthStore" // 1. Import Auth Store

interface Props {
    song: Song
    variant?: "grid" | "row"
}

const SongCard = ({ song, variant = "grid" }: Props) => {
    const { currentSong } = usePlayerStore()
    const { user } = useAuthStore() // 2. Lấy thông tin user
    const isActive = currentSong?._id === song._id

    // ================= GRID (Album / SectionGrid) =================
    if (variant === "grid") {
        return (
            <div
                className={`
                    relative
                    p-4
                    rounded-md
                    transition-all
                    cursor-pointer
                    group
                    ${isActive
                        ? "bg-zinc-700/50"
                        : "bg-zinc-800/40 hover:bg-zinc-700/40"
                    }
                `}
            >
                <div className="relative mb-4">
                    <div className="aspect-square rounded-md overflow-hidden">
                        <img
                            src={song.imageUrl}
                            alt={song.title}
                            className={`
                                w-full
                                h-full
                                object-cover
                                transition-transform
                                duration-300
                                ${isActive
                                    ? "scale-105"
                                    : "group-hover:scale-105"
                                }
                            `}
                        />
                    </div>

                    {/* Buttons overlay */}
                    {user?.isPremium && <DownloadButton song={song} />} 
                    <AddToPlaylistButton song={song} />
                    <PlayButton song={song} />
                </div>

                <h3 className="font-medium truncate">{song.title}</h3>
                <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
            </div>
        )
    }

    // ================= ROW (Show All Songs) =================
    return (
        <div
            className={`
                relative
                flex
                items-center
                gap-4
                px-4
                py-2
                rounded-md
                transition
                cursor-pointer
                group
                ${isActive
                    ? "bg-zinc-800"
                    : "hover:bg-zinc-800"
                }
            `}
        >
            {/* Image */}
            <div className="relative size-12 shrink-0 overflow-hidden rounded">
                <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{song.title}</p>
                <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
            </div>

            {/* Action */}
             {/* 3. Chỉ hiện nút Download nếu là Premium */}
            {user?.isPremium && <DownloadButton song={song} />}
            
            <PlayButton song={song} />
            <AddToPlaylistButton song={song} />
        </div>
    )
}

export default SongCard