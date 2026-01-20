import type { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import PlayButton from "./PlayButton";
import AddToPlaylistButton from "./AddToPlayListButton";
import { Link } from "react-router-dom";
import DownloadButton from "./DownloadButton";
import { useAuthStore } from "@/stores/useAuthStore"; // 1. Import Auth Store

type SectionGridProps = {
    title: string;
    songs: Song[];
    isLoading: boolean;
}

const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
    const { user } = useAuthStore(); // 2. Lấy thông tin user

    if (isLoading) return <SectionGridSkeleton />

    return (
        <div className="mb-8 px-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>

                <Link
                    to="/music"
                    className="text-sm text-zinc-400 hover:text-white"
                >
                    Show all
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {songs.map((song) => (
                    <div
                        key={song._id}
                        className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group group cursor-pointer"
                    >
                        <div className="relative mb-4">
                            <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                                <img
                                    src={song.imageUrl}
                                    alt={song.title}
                                    className="w-full h-full object-cover transition-transform duration-300
                                    group-hover:scale-105"
                                />
                            </div>


                            {user?.isPremium && <DownloadButton song={song} />}
                            <AddToPlaylistButton song={song} />
                            <PlayButton song={song} />
                        </div>
                        <h3 className="font-medium mb-2 truncate">{song.title}</h3>
                        <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SectionGrid