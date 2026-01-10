import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand';
import { type Album, type Playlist, type Song, type Stats } from '@/types';
import toast from 'react-hot-toast';

interface MusicStore {
    albums: Album[],
    songs: Song[],
    playlists: Playlist[],
    isLoading: boolean,
    error: string | null,
    currentAlbum: Album | null,
    currentPlaylist: Playlist | null,
    featuredSongs: Song[],
    madeForYouSongs: Song[],
    trendingSongs: Song[],
    stats: Stats,

    fetchAlbums: () => Promise<void>,
    fetchAlbumById: (id: string) => Promise<void>,
    fetchFeaturedSongs: () => Promise<void>,
    fetchMadeForYouSongs: () => Promise<void>,
    fetchTrendingSongs: () => Promise<void>,
    fetchStats: () => Promise<void>,
    fetchSongs: () => Promise<void>,
    deleteSong: (id: string) => Promise<void>,
    deleteAlbum: (id: string) => Promise<void>,
    fetchUserPlaylists: () => Promise<void>,
    fetchPlaylistsById: (id: string) => Promise<void>,
    createPlaylist: (formData: FormData) => Promise<void>,
    addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>,
    removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>,
    deletePlaylist: (playlistId: string) => Promise<void>,
    reset: () => void
}

export const useMusicStore = create<MusicStore>((set, get) => ({
    albums: [],
    playlists: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    currentPlaylist: null,
    featuredSongs: [],
    madeForYouSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalArtists: 0,
        totalUsers: 0,
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/songs');
            set({ songs: response.data.songs });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteSong: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/admin/songs/${id}`);
            set((state) => ({
                songs: state.songs.filter((song) => song._id !== id),
            }));
            toast.success("Song deleted successfully");
        } catch (error: any) {
            toast.error("Error deleting song")
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteAlbum: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`admin/albums/${id}`);
            set((state) => ({
                albums: state.albums.filter((albums) => albums._id !== id),
                songs: state.songs.map((song) =>
                    song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
                ),
            }));
            toast.success("Album deleted successfully");
        } catch (error: any) {
            toast.error("Error deleting album")
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/stats');
            set({ stats: response.data });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbums: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/albums');
            set({ albums: response.data.albums });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAlbumById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const reponse = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: reponse.data.album });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/songs/featured');
            set({ featuredSongs: response.data.songs });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/songs/make-for-you');
            set({ madeForYouSongs: response.data.songs });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/songs/trending');
            set({ trendingSongs: response.data.songs });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUserPlaylists: async () => {
        const token =
            axiosInstance.defaults.headers.common["Authorization"]

        if (!token) {
            // guest → không gọi API
            set({ playlists: [], isLoading: false })
            return
        }

        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/playlist');
            set({ playlists: response.data.playlists });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchPlaylistsById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/playlist/${id}`);
            set({ currentPlaylist: response.data.playlist });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    createPlaylist: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/playlist', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await get().fetchUserPlaylists()
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    removeSongFromPlaylist: async (playlistId, songId) => {
        try {
            await axiosInstance.delete(
                `/playlist/${playlistId}/delete-song`,
                {
                    data: { songId },
                }
            )
            set((state) => ({
                playlists: state.playlists.map((pl) =>
                    pl._id === playlistId
                        ? {
                            ...pl,
                            songs: pl.songs.filter(
                                (s) =>
                                    typeof s === "string"
                                        ? s !== songId
                                        : s._id !== songId
                            ),
                        }
                        : pl
                ),

                currentPlaylist:
                    state.currentPlaylist?._id === playlistId
                        ? {
                            ...state.currentPlaylist,
                            songs: state.currentPlaylist.songs.filter(
                                (s) =>
                                    typeof s === "string"
                                        ? s !== songId
                                        : s._id !== songId
                            ),
                        }
                        : state.currentPlaylist,
            }))
        } catch (error) {
            console.error("removeSongFromPlaylist error:", error)
        }
    },

    deletePlaylist: async (playlistId) => {
        try {
            await axiosInstance.delete(`/playlist/${playlistId}`)

            set((state) => ({
                playlists: state.playlists.filter(
                    (p) => p._id !== playlistId
                ),
                currentPlaylist:
                    state.currentPlaylist?._id === playlistId
                        ? null
                        : state.currentPlaylist,
            }))
        } catch (error) {
            console.error("deletePlaylist error:", error)
        }
    },

    addSongToPlaylist: async (playlistId: string, songId: string) => {
        try {
            const res = await axiosInstance.post(
                `/playlist/${playlistId}/add-song`,
                { songId }
            );
            const addedSong = res.data.playlist.songs.at(-1)

            set((state) => ({
                playlists: state.playlists.map((pl) =>
                    pl._id === playlistId
                        ? { ...pl, songs: [...pl.songs, addedSong] }
                        : pl
                ),

                currentPlaylist:
                    state.currentPlaylist?._id === playlistId
                        ? {
                            ...state.currentPlaylist,
                            songs: [...state.currentPlaylist.songs, addedSong],
                        }
                        : state.currentPlaylist,
            }))
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Không thể thêm bài hát"
            );
        }
    },

    reset: () => set({ playlists: [] }),
}));