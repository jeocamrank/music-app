import FeaturedGridSkeleton from '@/components/skeletons/FeaturedGridSkeleton';
import { useMusicStore } from '@/stores/useMusicStore';
import PlayButton from './PlayButton';
import AddToPlaylistButton from './AddToPlayListButton';
import DownloadButton from './DownloadButton';
import { useAuthStore } from '@/stores/useAuthStore'; // 1. Import Auth Store

const FeaturedSection = () => {
    const { isLoading, featuredSongs, error } = useMusicStore();
    const { user } = useAuthStore(); // 2. Lấy thông tin user

    if (isLoading) return <FeaturedGridSkeleton />;

    if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>

    return (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
            {featuredSongs.map((song) => (
                <div
                    key={song._id}
                    className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
                hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
                >
                    <img
                        src={song.imageUrl}
                        alt={song.title}
                        className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
                    />
                    <div className='flex-1 p-4'>
                        <p className='font-medium truncate'>{song.title}</p>
                        <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
                    </div>

                    {user?.isPremium && <DownloadButton song={song} />}
                    <AddToPlaylistButton song={song} />
                    <PlayButton song={song} />
                </div>
            ))}
        </div>
    )
}

export default FeaturedSection