import { useEffect } from "react"
import { useMusicStore } from "@/stores/useMusicStore"
import { Loader } from "lucide-react"
import { Link } from "react-router-dom"
import SongCard from "./SongCard"
import Topbar from "@/components/Topbar"
import { ScrollArea } from "@/components/ui/scroll-area"

const ShowAllPage = () => {
    const {
        albums,
        songs,
        isLoading,
        fetchShowAll,
    } = useMusicStore()

    useEffect(() => {
        fetchShowAll()
    }, [])

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-8 animate-spin text-green-500" />
            </div>
        )
    }

    return (
        <div className="rounded-md overflow-hidden">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 sm:p-6">
                    {/* ===== ALBUM SECTION ===== */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">
                            Tất cả Album
                        </h2>

                        {albums.length === 0 ? (
                            <p className="text-zinc-400">
                                Chưa có album nào
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                {albums.map((album) => (
                                    <Link
                                        key={album._id}
                                        to={`/albums/${album._id}`}
                                        className="group"
                                    >
                                        <div className="bg-zinc-900 p-3 rounded-xl hover:bg-zinc-800 transition">
                                            <img
                                                src={album.imageUrl}
                                                alt={album.title}
                                                className="aspect-square rounded-lg object-cover"
                                            />

                                            <p className="mt-3 text-white font-medium truncate">
                                                {album.title}
                                            </p>

                                            <p className="text-sm text-zinc-400 truncate">
                                                {album.artist}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ===== SONG SECTION ===== */}
                    <section className="space-y-4 pt-5">
                        <h2 className="text-2xl font-bold text-white">
                            Tất cả bài hát
                        </h2>

                        {songs.length === 0 ? (
                            <p className="text-zinc-400">
                                Chưa có bài hát nào
                            </p>
                        ) : (
                            <div className="flex-1 overflow-hidden px-4 space-y-1">
                                {songs.map((song) => (
                                    <SongCard
                                        key={song._id}
                                        song={song}
                                        variant="row"
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </ScrollArea>
        </div>
    )
}

export default ShowAllPage
