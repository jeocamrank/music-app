import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMusicStore } from '@/stores/useMusicStore';
import { Calendar, Trash2, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { useState } from 'react';
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import EditSongDialog from "./EditSongDialog";

const ITEMS_PER_PAGE = 6;

const SongsTable = () => {
    // 👇 Store sẽ tự động báo cho component này khi songs thay đổi
    const { songs, isLoading, error, deleteSong } = useMusicStore();
    const [currentPage, setCurrentPage] = useState(1);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [songToDelete, setSongToDelete] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState<any>(null);

    const handleDeleteClick = (id: string) => {
        setSongToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (songToDelete) {
            await deleteSong(songToDelete);
            setDeleteDialogOpen(false);
            setSongToDelete(null);
        }
    };

    const handleEditClick = (song: any) => {
        setSelectedSong(song);
        setEditDialogOpen(true);
    };

    if (isLoading) {
        return <div className='flex justify-center py-8 text-zinc-400'>Loading songs...</div>;
    }
    if (error) {
        return <div className='flex justify-center py-8 text-red-400'>{error}</div>;
    }

    const totalPages = Math.ceil(songs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentSongs = songs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-zinc-800/50 border-zinc-800'>
                            <TableHead className='w-[50px]'></TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Artist</TableHead>
                            <TableHead>Release Date</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {currentSongs.length > 0 ? (
                            currentSongs.map((song) => (
                                <TableRow key={song._id} className='hover:bg-zinc-800/50 border-zinc-800 transition-colors'>
                                    <TableCell>
                                        <img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover shadow-sm' />
                                    </TableCell>
                                    <TableCell className='font-medium text-white'>{song.title}</TableCell>
                                    <TableCell className="text-zinc-400">{song.artist}</TableCell>
                                    <TableCell>
                                        <span className='inline-flex items-center gap-1 text-zinc-400'>
                                            <Calendar className='h-4 w-4' />
                                            {song.createdAt.split("T")[0]}
                                        </span>
                                    </TableCell>

                                    <TableCell className='text-right'>
                                        <div className='flex gap-2 justify-end'>
                                            <Button
                                                variant={"ghost"}
                                                size={"sm"}
                                                className='text-blue-400 hover:text-blue-300 hover:bg-blue-400/10'
                                                onClick={() => handleEditClick(song)}
                                            >
                                                <Pencil className='size-4' />
                                            </Button>

                                            <Button
                                                variant={"ghost"}
                                                size={"sm"}
                                                className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                                onClick={() => handleDeleteClick(song._id)}
                                            >
                                                <Trash2 className='size-4' />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-400">
                                    No songs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-2 ml-auto">
                        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></Button>
                        <div className="text-sm font-medium text-white bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-700">{currentPage} / {totalPages}</div>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}

            <ConfirmDeleteDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Xóa bài hát"
                description="Bạn có chắc chắn muốn xóa bài hát này? Hành động này không thể hoàn tác."
                isLoading={isLoading}
            />

            <EditSongDialog
                song={selectedSong}
                isOpen={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </div>
    );
};

export default SongsTable;