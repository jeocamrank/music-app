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
    fetchUserPlaylists: () => Promise<void>,
    fetchPlaylistsById: (id: string) => Promise<void>,
    fetchShowAll: () => Promise<void>,
    addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>,
    createPlaylist: (formData: FormData) => Promise<void>,
    deleteSong: (id: string) => Promise<void>,
    deleteAlbum: (id: string) => Promise<void>,
    updateSong: (id: string, formData: FormData) => Promise<void>;
    updateAlbum: (id: string, formData: FormData) => Promise<void>;
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
        // Tối ưu: Nếu đã có songs rồi thì không fetch lại (tránh loading khi chuyển trang)
        if (get().songs.length > 0) return;

        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/songs');
            set({ songs: response.data.songs });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
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
            set({ error: error.response?.data?.message });
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
            set({ error: error.response?.data?.message });
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
        // Tối ưu: Cache album
        if (get().albums.length > 0) return;

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
        // Nếu album đang xem đúng là album này rồi thì không load lại
        if (get().currentAlbum?._id === id) return;

        set({ isLoading: true, error: null });
        try {
            const reponse = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: reponse.data.album });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        // Tối ưu: Cache Featured Songs
        if (get().featuredSongs.length > 0) return;

        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/songs/featured');
            set({ featuredSongs: response.data.songs });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        // Tối ưu: Cache Made For You
        if (get().madeForYouSongs.length > 0) return;

        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/songs/make-for-you');
            set({ madeForYouSongs: response.data.songs });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTrendingSongs: async () => {
        // Tối ưu: Cache Trending
        if (get().trendingSongs.length > 0) return;

        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/songs/trending');
            set({ trendingSongs: response.data.songs });
        } catch (error: any) {
            set({ error: error.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUserPlaylists: async () => {
        const token = axiosInstance.defaults.headers.common["Authorization"];
        if (!token) {
            set({ playlists: [], isLoading: false });
            return;
        }

        // Tối ưu: Chỉ hiện loading spinner nếu chưa có playlist nào
        // Nếu đã có, chỉ fetch ngầm để cập nhật
        if (get().playlists.length === 0) {
            set({ isLoading: true, error: null });
        }

        try {
            const response = await axiosInstance.get('/playlist');
            set({ playlists: response.data.playlists });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            // Luôn tắt loading dù là fetch ngầm hay fetch thường
            set({ isLoading: false });
        }
    },

    fetchPlaylistsById: async (id: string) => {
        // Tối ưu: Ưu tiên lấy từ state local (Sidebar) trước
        const { playlists } = get();
        const localPlaylist = playlists.find(p => p._id === id);

        if (localPlaylist) {
            // Nếu có rồi, set luôn, không hiện loading
            set({ currentPlaylist: localPlaylist });
        } else {
            // Nếu chưa có (link trực tiếp hoặc F5), mới hiện loading và gọi API
            set({ isLoading: true, error: null });
            try {
                const response = await axiosInstance.get(`/playlist/${id}`);
                set({ currentPlaylist: response.data.playlist });
            } catch (error: any) {
                set({ error: error.response?.data?.message });
            } finally {
                set({ isLoading: false });
            }
        }
    },

    createPlaylist: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post('/playlist', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await get().fetchUserPlaylists();
        } catch (error: any) {
            set({ error: error.response?.data?.message });
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
            );

            // Cập nhật Optimistic UI (Cập nhật ngay lập tức không cần đợi fetch lại)
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
            }));
        } catch (error) {
            console.error("removeSongFromPlaylist error:", error);
            toast.error("Failed to remove song");
        }
    },

    deletePlaylist: async (playlistId) => {
        try {
            await axiosInstance.delete(`/playlist/${playlistId}`);

            set((state) => ({
                playlists: state.playlists.filter(
                    (p) => p._id !== playlistId
                ),
                currentPlaylist:
                    state.currentPlaylist?._id === playlistId
                        ? null
                        : state.currentPlaylist,
            }));
        } catch (error) {
            console.error("deletePlaylist error:", error);
            toast.error("Failed to delete playlist");
        }
    },

    addSongToPlaylist: async (playlistId: string, songId: string) => {
        try {
            const res = await axiosInstance.post(
                `/playlist/${playlistId}/add-song`,
                { songId }
            );
            const addedSong = res.data.playlist.songs.at(-1);

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
            }));

            toast.success("Added to playlist");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Không thể thêm bài hát"
            );
        }
    },

    fetchShowAll: async () => {
        // Tối ưu: Nếu đã có dữ liệu đủ, không load lại
        if (get().albums.length > 0 && get().songs.length > 0) return;

        set({ isLoading: true, error: null });
        try {
            const [albumRes, songRes] = await Promise.all([
                axiosInstance.get("/albums"),
                axiosInstance.get("/songs"),
            ]);

            set({
                albums: albumRes.data.albums,
                songs: songRes.data.songs,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
            });
        } finally {
            set({ isLoading: false });
        }
    },

    updateSong: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/admin/songs/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const updatedSong = response.data.song;

            set((state) => ({
                songs: state.songs.map((song) =>
                    song._id === id ? updatedSong : song
                ),
            }));

            toast.success("Song updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error updating song");
            set({ error: error.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateAlbum: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/admin/albums/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const updatedAlbum = response.data.album;

            set((state) => ({
                albums: state.albums.map((album) =>
                    album._id === id ? updatedAlbum : album
                ),
                currentAlbum: state.currentAlbum?._id === id ? updatedAlbum : state.currentAlbum
            }));

            toast.success("Album updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error updating album");
            set({ error: error.response?.data?.message });
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => set({ playlists: [], songs: [], albums: [] }),
}));