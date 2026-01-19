import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2, ChevronLeft, ChevronRight, Pencil } from "lucide-react"; // Import Pencil
import { useEffect, useState } from "react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import EditAlbumDialog from "./EditAlbumDialog"; // Import Edit Dialog

const ITEMS_PER_PAGE = 5;

const AlbumsTable = () => {
    const { albums, deleteAlbum, fetchAlbums, isLoading } = useMusicStore();
    const [currentPage, setCurrentPage] = useState(1);

    // State cho Delete Dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);

    // State cho Edit Dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

    useEffect(() => {
        fetchAlbums();
    }, [fetchAlbums]);

    // --- Handlers Xóa ---
    const handleDeleteClick = (id: string) => {
        setAlbumToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (albumToDelete) {
            await deleteAlbum(albumToDelete);
            setDeleteDialogOpen(false);
            setAlbumToDelete(null);
        }
    };

    // --- Handlers Sửa ---
    const handleEditClick = (album: any) => {
        setSelectedAlbum(album);
        setEditDialogOpen(true);
    };

    if (isLoading && albums.length === 0) {
        return <div className='flex justify-center py-8 text-zinc-400'>Loading albums...</div>;
    }

    // Pagination Logic
    const totalPages = Math.ceil(albums.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentAlbums = albums.slice(startIndex, startIndex + ITEMS_PER_PAGE);
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
                            <TableHead>Release Year</TableHead>
                            <TableHead>Songs</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {currentAlbums.length > 0 ? (
                            currentAlbums.map((album) => (
                                <TableRow key={album._id} className='hover:bg-zinc-800/50 border-zinc-800 transition-colors'>
                                    <TableCell>
                                        <img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded object-cover shadow-sm' />
                                    </TableCell>
                                    <TableCell className='font-medium text-white'>{album.title}</TableCell>
                                    <TableCell className="text-zinc-400">{album.artist}</TableCell>
                                    <TableCell>
                                        <span className='inline-flex items-center gap-1 text-zinc-400'>
                                            <Calendar className='h-4 w-4' />
                                            {album.releaseYear}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className='inline-flex items-center gap-1 text-zinc-400'>
                                            <Music className='h-4 w-4' />
                                            {album.songs.length} songs
                                        </span>
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <div className='flex gap-2 justify-end'>
                                            {/* Nút Sửa */}
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleEditClick(album)}
                                                className='text-blue-400 hover:text-blue-300 hover:bg-blue-400/10'
                                            >
                                                <Pencil className='h-4 w-4' />
                                            </Button>

                                            {/* Nút Xóa */}
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleDeleteClick(album._id)}
                                                className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                            >
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-400">No albums found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-2 ml-auto">
                        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></Button>
                        <div className="text-sm font-medium text-white bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-700">{currentPage} / {totalPages}</div>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}

            {/* Dialog Xóa */}
            <ConfirmDeleteDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Xóa Album"
                description={`Bạn có chắc muốn xóa album này? Tất cả các bài hát trong album cũng sẽ bị ảnh hưởng.`}
                isLoading={isLoading}
            />

            {/* Dialog Sửa */}
            <EditAlbumDialog
                album={selectedAlbum}
                isOpen={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </div>
    );
};

export default AlbumsTable;