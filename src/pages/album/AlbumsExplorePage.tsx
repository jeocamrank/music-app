import { useEffect, useState } from "react"
import { useMusicStore } from "@/stores/useMusicStore"
import AlbumCarousel from "./AlbumCarousel"
import AlbumSongsSection from "./AlbumSongsSection"
import { ScrollArea } from "@/components/ui/scroll-area"

const AlbumsExplorePage = () => {
    const { albums, fetchAlbums, isLoading } = useMusicStore()
    const [selectedAlbum, setSelectedAlbum] = useState<any>(null)

    useEffect(() => {
        fetchAlbums()
    }, [fetchAlbums])

    useEffect(() => {
        if (!selectedAlbum && albums.length > 0) {
            setSelectedAlbum(albums[0])
        }
    }, [albums, selectedAlbum])

    return (
        <div className="rounded-md overflow-hidden">
            <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-6">
                    {/* Header */}
                    <h1 className="text-3xl font-bold mb-1">Albums</h1>
                    <p className="text-zinc-400 mb-6">
                        Chọn album để khám phá bài hát
                    </p>

                    {/* Album Carousel */}
                    {!isLoading && albums.length > 0 && (
                        <AlbumCarousel
                            albums={albums}
                            selectedAlbumId={selectedAlbum?._id}
                            onSelect={setSelectedAlbum}
                        />
                    )}

                    {/* Songs */}
                    {selectedAlbum && (
                        <AlbumSongsSection album={selectedAlbum} />
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

export default AlbumsExplorePage
