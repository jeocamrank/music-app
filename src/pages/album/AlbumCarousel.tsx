import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

type Album = {
    _id: string
    title: string
    artist: string
    imageUrl: string
}

type Props = {
    albums: Album[]
    selectedAlbumId?: string
    onSelect: (album: Album) => void
}

const AlbumCarousel = ({ albums, selectedAlbumId, onSelect }: Props) => {
    return (
        <div className="relative mb-10">
            <Carousel
                opts={{ align: "start", loop: false }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {albums.map((album) => {
                        const active = album._id === selectedAlbumId

                        return (
                            <CarouselItem
                                key={album._id}
                                className="pl-4 basis-[160px]"
                            >
                                <button
                                    onClick={() => onSelect(album)}
                                    className={`
                                    group w-full text-left
                                    ${active ? "scale-105" : ""}
                                    transition
                                `}
                                >
                                    <div
                                        className={`
                                        relative rounded-md overflow-hidden
                                        shadow-lg
                                        ${active
                                            ? "ring-2 ring-green-500"
                                            : "hover:ring-2 hover:ring-white/20"}
                                    `}
                                    >
                                        <img
                                            src={album.imageUrl}
                                            alt={album.title}
                                            className="aspect-square object-cover
                                            group-hover:scale-105 transition-transform"
                                        />
                                    </div>

                                    <p className="mt-2 font-medium truncate">
                                        {album.title}
                                    </p>
                                    <p className="text-sm text-zinc-400 truncate">
                                        {album.artist}
                                    </p>
                                </button>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default AlbumCarousel
