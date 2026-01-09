import { SignedIn } from '@/components/AuthWrappers'
import PlaylistSkeleton from '@/components/skeletons/PlaylistSkeleton'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { useMusicStore } from '@/stores/useMusicStore'
import { HomeIcon, Library, MessageCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CreatePlaylistDialog from './CreatePlaylistDialog'
import { useAuthStore } from '@/stores/useAuthStore'

const LeftSidebar = () => {
    const {
        playlists,
        fetchUserPlaylists,
        isLoading,
        deletePlaylist,
        currentPlaylist,
    } = useMusicStore()

    const { user } = useAuthStore()

    const navigate = useNavigate()

    const [openAlert, setOpenAlert] = useState(false)
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
        null
    )

    useEffect(() => {
        if (user) {
            fetchUserPlaylists()
        }
    }, [user, fetchUserPlaylists])

    const handleOpenDelete = (
        e: React.MouseEvent,
        playlistId: string
    ) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedPlaylistId(playlistId)
        setOpenAlert(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedPlaylistId) return

        const isCurrent =
            currentPlaylist?._id === selectedPlaylistId

        await deletePlaylist(selectedPlaylistId)

        if (isCurrent) {
            navigate('/')
        }

        setOpenAlert(false)
        setSelectedPlaylistId(null)
    }

    console.log('playlist: ', playlists)

    return (
        <div className="h-full flex flex-col gap-2">
            {/* Navigation */}
            <div className="rounded-lg bg-zinc-900 p-4">
                <div className="space-y-2">
                    <Link
                        to="/"
                        className={cn(
                            buttonVariants({
                                variant: 'ghost',
                                className:
                                    'w-full justify-start text-white hover:bg-zinc-800',
                            })
                        )}
                    >
                        <HomeIcon className="mr-2 size-5" />
                        <span className="hidden md:inline">Home</span>
                    </Link>

                    <SignedIn>
                        <Link
                            to="/chat"
                            className={cn(
                                buttonVariants({
                                    variant: 'ghost',
                                    className:
                                        'w-full justify-start text-white hover:bg-zinc-800',
                                })
                            )}
                        >
                            <MessageCircle className="mr-2 size-5" />
                            <span className="hidden md:inline">Messages</span>
                        </Link>
                    </SignedIn>
                </div>
            </div>

            {/* Playlist */}
            <div className="flex-1 rounded-lg bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-white px-2">
                        <Library className="mr-2 size-5" />
                        <span className="hidden md:inline">Playlist</span>
                    </div>

                    <CreatePlaylistDialog />
                </div>

                <ScrollArea className="h-[calc(100vh-300px)]">
                    {isLoading ? (
                        <PlaylistSkeleton />
                    ) : playlists.length === 0 ? (
                        <p className="text-sm text-zinc-400 px-2">
                            Chưa có playlist nào
                        </p>
                    ) : (
                        <div className="space-y-1">
                            {playlists.map((playlist) => (
                                <Link
                                    key={playlist._id}
                                    to={`/playlists/${playlist._id}`}
                                    className="group p-2 rounded-md flex items-center gap-3
                                    hover:bg-zinc-800 relative"
                                >
                                    <img
                                        src={playlist.imageUrl}
                                        alt={playlist.title}
                                        className="size-12 rounded-md object-cover"
                                    />

                                    <div className="flex-1 min-w-0 hidden md:block">
                                        <p className="font-medium truncate text-white">
                                            {playlist.title}
                                        </p>
                                        <p className="text-sm text-zinc-400 truncate">
                                            {playlist.songs.length} songs
                                        </p>
                                    </div>

                                    {/* delete */}
                                    <button
                                        onClick={(e) =>
                                            handleOpenDelete(e, playlist._id)
                                        }
                                        className="opacity-0 group-hover:opacity-100
                                        text-zinc-400 hover:text-red-500 transition"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </Link>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* AlertDialog confirm delete */}
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent className='border border-zinc-700 bg-zinc-900'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-muted-foreground'>
                            Xóa playlist này?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Playlist sẽ bị xóa vĩnh viễn và không thể khôi
                            phục. Bạn có chắc chắn không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className='text-white'>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default LeftSidebar
