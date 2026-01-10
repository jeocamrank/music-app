import { usePlayerStore } from "@/stores/usePlayerStore"
import PlayButton from "@/pages/home/components/PlayButton"
import AddToPlaylistButton from "@/pages/home/components/AddToPlayListButton"
import type { Song } from "@/types"

type Props = {
    album: {
        _id: string
        title: string
        artist: string
        imageUrl: string
        songs: Song[]
    }
}

const AlbumSongsSection = ({ album }: Props) => {
    const { setCurrentSong } = usePlayerStore()

    return (
        <div className="mt-10">
            {/* Album info */}
            <div className="flex items-end gap-6 mb-6">
                <img
                    src={album.imageUrl}
                    alt={album.title}
                    className="w-40 h-40 rounded-md shadow-xl object-cover"
                />

                <div>
                    <p className="text-sm uppercase text-zinc-400 mb-1">
                        Album
                    </p>
                    <h2 className="text-3xl font-bold mb-2">
                        {album.title}
                    </h2>
                    <p className="text-zinc-400">
                        {album.artist} • {album.songs.length} bài hát
                    </p>
                </div>
            </div>

            {/* Song list header */}
            <div className="grid grid-cols-[40px_1fr_100px] px-4 py-2 text-sm text-zinc-400 border-b border-white/10">
                <div>#</div>
                <div>Tiêu đề</div>
                <div className="text-right">Thêm</div>
            </div>

            {/* Songs */}
            <div className="mt-2 space-y-1">
                {album.songs.length === 0 && (
                    <p className="text-zinc-400 px-4 py-6">
                        Hiện album này chưa có bài hát nào
                    </p>
                )}

                {album.songs.map((song, index) => (
                    <div
                        key={song._id}
                        onClick={() => setCurrentSong(song)}
                        className="
                            group grid grid-cols-[40px_1fr_100px]
                            items-center px-4 py-2 rounded-md
                            hover:bg-white/5 cursor-pointer
                        "
                    >
                        {/* index / play */}
                        <div className="text-zinc-400 group-hover:hidden">
                            {index + 1}
                        </div>

                        <div className="hidden group-hover:block">
                            <PlayButton song={song} />
                        </div>

                        {/* title */}
                        <div className="flex items-center gap-3">
                            <img
                                src={song.imageUrl}
                                className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                                <p className="font-medium truncate">
                                    {song.title}
                                </p>
                                <p className="text-sm text-zinc-400 truncate">
                                    {song.artist}
                                </p>
                            </div>
                        </div>

                        {/* add */}
                        <div className="flex justify-end">
                            <AddToPlaylistButton song={song} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AlbumSongsSection
