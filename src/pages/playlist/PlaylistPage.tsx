import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMusicStore } from "@/stores/useMusicStore"
import { usePlayerStore } from "@/stores/usePlayerStore"
import { Clock, Pause, Play } from "lucide-react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

const PlaylistPage = () => {
    const { playlistId } = useParams()
    const {
        fetchPlaylistsById,
        currentPlaylist,
        isLoading,
        removeSongFromPlaylist,
    } = useMusicStore()

    const { currentSong, isPlaying, playAlbum, togglePlay } =
        usePlayerStore()

    useEffect(() => {
        if (playlistId) fetchPlaylistsById(playlistId)
    }, [playlistId])

    console.log("playlistId:", playlistId)
    console.log("currentPlaylist:", currentPlaylist)

    if (isLoading || !currentPlaylist) return null

    const handlePlayPlaylist = () => {
        const isCurrentPlaying = currentPlaylist.songs.some(
            (song) => song._id === currentSong?._id
        )

        if (isCurrentPlaying) togglePlay()
        else playAlbum(currentPlaylist.songs, 0)
    }

    const handlePlaySong = (index: number) => {
        playAlbum(currentPlaylist.songs, index)
    }

    const handleRemoveSong = (songId: string) => {
        if (!currentPlaylist) return
        removeSongFromPlaylist(currentPlaylist._id, songId)
    }

    return (
        <div className="h-full">
            <ScrollArea className="h-full">
                <div className="relative min-h-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80" />

                    <div className="relative z-10">
                        <div className="flex p-6 gap-6 pb-8">
                            <img
                                src={currentPlaylist.imageUrl}
                                className="w-[240px] h-[240px] shadow-xl rounded"
                            />

                            <div className="flex flex-col justify-end">
                                <p className="text-sm font-semibold">Playlist</p>
                                <h1 className="text-7xl font-bold my-4">
                                    {currentPlaylist.title}
                                </h1>
                                <span className="text-sm text-zinc-100">
                                    {currentPlaylist.songs.length} songs
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* play */}
                    <div className="relative z-10 px-6 pb-4">
                        <Button
                            onClick={handlePlayPlaylist}
                            size="icon"
                            className="w-14 h-14 rounded-full bg-green-500"
                        >
                            {isPlaying &&
                                currentPlaylist.songs.some(
                                    (song) => song._id === currentSong?._id
                                ) ? (
                                <Pause className="h-7 w-7 text-black" />
                            ) : (
                                <Play className="h-7 w-7 text-black" />
                            )}
                        </Button>
                    </div>

                    {/* table */}
                    <div className="bg-black/20">
                        <div className="grid grid-cols-[16px_4fr_2fr_1fr_40px] px-10 py-2 text-sm text-zinc-400">
                            <div>#</div>
                            <div>Title</div>
                            <div>Artist</div>
                            <div>
                                <Clock className="h-4 w-4" />
                            </div>
                            <div />
                        </div>

                        <div className="px-6 relative z-10">
                            {currentPlaylist.songs.length === 0 ? (
                                /* EMPTY STATE */
                                <div className="flex flex-col items-center justify-center py-24 text-center text-zinc-400">
                                    <div className="text-5xl mb-4">🎵</div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Playlist này chưa có bài hát nào
                                    </h3>
                                    <p className="text-sm max-w-sm">
                                        Hãy thêm nhạc vào playlist để bắt đầu nghe và tận hưởng âm nhạc 🎧
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 py-4">
                                    {currentPlaylist.songs.map((song, index) => {
                                        const isCurrentSong =
                                            currentSong?._id === song._id

                                        return (
                                            <div
                                                key={song._id}
                                                onClick={() => handlePlaySong(index)}
                                                className="grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-4 py-2 text-sm
                        text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                                            >
                                                {/* index / play icon */}
                                                <div className="flex items-center justify-center">
                                                    {isCurrentSong && isPlaying ? (
                                                        <div className="size-4 text-green-500">♫</div>
                                                    ) : (
                                                        <span className="group-hover:hidden">
                                                            {index + 1}
                                                        </span>
                                                    )}
                                                    {!isCurrentSong && (
                                                        <Play className="h-4 w-4 hidden group-hover:block" />
                                                    )}
                                                </div>

                                                {/* song info */}
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={song.imageUrl}
                                                        alt={song.title}
                                                        className="size-10 rounded"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-white">
                                                            {song.title}
                                                        </div>
                                                        <div>{song.artist}</div>
                                                    </div>
                                                </div>

                                                {/* created date */}
                                                <div className="flex items-center">
                                                    {song.createdAt?.split("T")[0]}
                                                </div>

                                                {/* duration */}
                                                <div className="flex items-center">
                                                    {formatDuration(song.duration)}
                                                </div>

                                                {/* delete */}
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleRemoveSong(song._id)
                                                            toast.success(
                                                                "Song removed from playlist"
                                                            )
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100
                                text-zinc-400 hover:text-red-500 transition"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

export default PlaylistPage
