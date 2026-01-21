import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play, Trash2 } from "lucide-react"; // Đã thêm Trash2 cho đẹp hơn nút X
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import PlaylistPageSkeleton from "./PlaylistPageSkeleton";

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaylistPage = () => {
    const { playlistId } = useParams();
    const { fetchPlaylistsById, currentPlaylist, isLoading, removeSongFromPlaylist } = useMusicStore();
    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

    useEffect(() => {
        if (playlistId) fetchPlaylistsById(playlistId);
    }, [playlistId, fetchPlaylistsById]);

    // 2. Thay thế return null bằng Skeleton
    if (isLoading) return <PlaylistPageSkeleton />;

    // 3. Xử lý trường hợp không tìm thấy playlist sau khi load xong
    if (!currentPlaylist) {
        return (
            <div className='h-full flex items-center justify-center text-zinc-400'>
                Playlist not found
            </div>
        );
    }

    const handlePlayPlaylist = () => {
        const isCurrentPlaying = currentPlaylist.songs.some((song) => song._id === currentSong?._id);
        if (isCurrentPlaying) togglePlay();
        else playAlbum(currentPlaylist.songs, 0);
    };

    const handlePlaySong = (index: number) => {
        playAlbum(currentPlaylist.songs, index);
    };

    const handleRemoveSong = (songId: string) => {
        if (!currentPlaylist) return;
        removeSongFromPlaylist(currentPlaylist._id, songId);
    };

    return (
        <div className='h-full'>
            <ScrollArea className='h-full'>
                <div className='relative min-h-full'>
                    {/* Background Gradient */}
                    <div className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80' />

                    <div className='relative z-10'>
                        <div className='flex flex-col md:flex-row p-6 gap-6 pb-8'>
                            <img
                                src={currentPlaylist.imageUrl}
                                alt={currentPlaylist.title}
                                className='w-[240px] h-[240px] shadow-xl rounded object-cover'
                            />

                            <div className='flex flex-col justify-end'>
                                <p className='text-sm font-semibold'>Playlist</p>
                                <h1 className='text-4xl md:text-7xl font-bold my-4'>{currentPlaylist.title}</h1>
                                <div className='flex items-center gap-2 text-sm text-zinc-100'>
                                    <span>{currentPlaylist.songs.length} songs</span>
                                    <span className="text-zinc-400">•</span>
                                    <span className="text-zinc-400">{currentPlaylist.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Play Button */}
                    <div className='relative z-10 px-6 pb-4'>
                        <Button
                            onClick={handlePlayPlaylist}
                            size='icon'
                            className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 transition-all hover:scale-105'
                        >
                            {isPlaying && currentPlaylist.songs.some((song) => song._id === currentSong?._id) ? (
                                <Pause className='h-7 w-7 text-black' />
                            ) : (
                                <Play className='h-7 w-7 text-black ml-1' />
                            )}
                        </Button>
                    </div>

                    {/* Song List */}
                    <div className='bg-black/20 backdrop-blur-sm'>
                        {/* Table Header */}
                        <div className='grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
                            <div>#</div>
                            <div>Title</div>
                            <div>Artist</div>
                            <div>
                                <Clock className='h-4 w-4' />
                            </div>
                            <div />
                        </div>

                        <div className='px-6 py-2 relative z-10'>
                            {currentPlaylist.songs.length === 0 ? (
                                <div className='flex flex-col items-center justify-center py-24 text-center text-zinc-400'>
                                    <div className='text-5xl mb-4'>🎵</div>
                                    <h3 className='text-lg font-semibold text-white mb-2'>
                                        Playlist này chưa có bài hát nào
                                    </h3>
                                    <p className='text-sm max-w-sm'>
                                        Hãy thêm nhạc vào playlist để bắt đầu nghe và tận hưởng âm nhạc 🎧
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-2'>
                                    {currentPlaylist.songs.map((song, index) => {
                                        const isCurrentSong = currentSong?._id === song._id;

                                        return (
                                            <div
                                                key={song._id}
                                                onClick={() => handlePlaySong(index)}
                                                className='grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer transition-colors'
                                            >
                                                {/* Index / Play Icon */}
                                                <div className='flex items-center justify-center'>
                                                    {isCurrentSong && isPlaying ? (
                                                        <div className='size-4 text-green-500 animate-pulse'>♫</div>
                                                    ) : (
                                                        <>
                                                            <span className='group-hover:hidden'>{index + 1}</span>
                                                            <Play className='h-4 w-4 hidden group-hover:block text-white' />
                                                        </>
                                                    )}
                                                </div>

                                                {/* Song Info */}
                                                <div className='flex items-center gap-3'>
                                                    <img
                                                        src={song.imageUrl}
                                                        alt={song.title}
                                                        className='size-10 rounded object-cover'
                                                    />
                                                    <div>
                                                        <div className={`font-medium ${isCurrentSong ? "text-green-500" : "text-white"}`}>
                                                            {song.title}
                                                        </div>
                                                        <div className="truncate">{song.artist}</div>
                                                    </div>
                                                </div>

                                                {/* Created Date (Artist Column in Header but data is artist) */}
                                                <div className='flex items-center truncate'>
                                                    {song.artist}
                                                </div>

                                                {/* Duration */}
                                                <div className='flex items-center font-variant-numeric tabular-nums'>
                                                    {formatDuration(song.duration)}
                                                </div>

                                                {/* Delete Button */}
                                                <div className='flex items-center justify-end'>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveSong(song._id);
                                                            toast.success("Song removed from playlist");
                                                        }}
                                                        className='opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-red-500 transition-all'
                                                        title="Remove from playlist"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default PlaylistPage;