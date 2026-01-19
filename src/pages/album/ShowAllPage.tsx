import { useEffect, useState } from "react"
import { useMusicStore } from "@/stores/useMusicStore"
import { Loader, ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import SongCard from "./SongCard"
import Topbar from "@/components/Topbar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

const SONGS_PER_PAGE = 6;

const ShowAllPage = () => {
    const {
        albums,
        songs,
        isLoading,
        fetchShowAll,
    } = useMusicStore()

    // State for current page
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchShowAll()
    }, [fetchShowAll])

    // Reset to page 1 when song list changes
    useEffect(() => {
        setCurrentPage(1);
    }, [songs]);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-8 animate-spin text-green-500" />
            </div>
        )
    }

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(songs.length / SONGS_PER_PAGE);
    const startIndex = (currentPage - 1) * SONGS_PER_PAGE;
    const currentSongs = songs.slice(startIndex, startIndex + SONGS_PER_PAGE);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <div className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
            <Topbar />
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-4 sm:p-6 pb-20">
                    {/* ===== ALBUM SECTION ===== */}
                    <section className="space-y-4 mb-8">
                        <h2 className="text-2xl font-bold text-white">
                            All Albums
                        </h2>

                        {albums.length === 0 ? (
                            <p className="text-zinc-400">No albums available</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                {albums.map((album) => (
                                    <Link
                                        key={album._id}
                                        to={`/albums/${album._id}`}
                                        className="group"
                                    >
                                        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl hover:bg-zinc-800 transition shadow-lg">
                                            <img
                                                src={album.imageUrl}
                                                alt={album.title}
                                                className="aspect-square rounded-lg object-cover shadow-md"
                                            />
                                            <p className="mt-3 text-white font-medium truncate">{album.title}</p>
                                            <p className="text-sm text-zinc-400 truncate">{album.artist}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    <div className="h-px bg-zinc-800 my-8" />

                    {/* ===== SONG SECTION (With Pagination) ===== */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">
                                All Songs
                            </h2>
                            <span className="text-sm text-zinc-400">
                                {songs.length} songs
                            </span>
                        </div>

                        {songs.length === 0 ? (
                            <p className="text-zinc-400">No songs available</p>
                        ) : (
                            <div className="space-y-2">
                                {/* Current page songs list */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {currentSongs.map((song) => (
                                        <SongCard
                                            key={song._id}
                                            song={song}
                                            variant="row"
                                        />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-zinc-800/50">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>

                                        <span className="text-sm text-zinc-400 font-medium">
                                            Page <span className="text-white">{currentPage}</span> of {totalPages}
                                        </span>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </ScrollArea>
        </div>
    )
}

export default ShowAllPage