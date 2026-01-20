import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserStore } from "@/stores/useUserStore";
import { Calendar, Trash2, Pencil, ChevronLeft, ChevronRight, Check, User as UserIcon, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditUserDialog from "./EditUserDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog"; // 1. Import Dialog xóa
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 6;

const UsersTable = () => {
    const { users, deleteUser, fetchUsers, isLoading } = useUserStore();
    const [currentPage, setCurrentPage] = useState(1);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // 2. State cho Dialog xóa
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setEditDialogOpen(true);
    };

    // 3. Sửa hàm xóa để mở Dialog
    const handleDeleteClick = (id: string) => {
        setUserToDelete(id);
        setDeleteDialogOpen(true);
    };

    // 4. Hàm xác nhận xóa
    const confirmDelete = async () => {
        if (userToDelete) {
            await deleteUser(userToDelete);
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Đã sao chép UID");
    }

    if (isLoading && users.length === 0) {
        return <div className='flex items-center justify-center py-20 text-zinc-400'>Đang tải danh sách...</div>;
    }

    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className='bg-zinc-900 border-zinc-800 hover:bg-zinc-900'>
                            <TableHead className='w-[60px] text-zinc-400'>Avatar</TableHead>
                            <TableHead className="text-zinc-400">Thông tin người dùng</TableHead>
                            <TableHead className="text-zinc-400">Trạng thái</TableHead>
                            <TableHead className="text-zinc-400">Ngày tham gia</TableHead>
                            <TableHead className='text-right text-zinc-400'>Hành động</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <TableRow key={user._id} className='hover:bg-zinc-800/50 border-zinc-800 transition-colors group'>
                                    {/* Avatar */}
                                    <TableCell>
                                        <Avatar className={`size-10 border ${user.isPremium ? 'border-yellow-500' : 'border-zinc-700'}`}>
                                            <AvatarImage src={user.imageUrl} />
                                            <AvatarFallback><UserIcon className="size-4 text-zinc-400" /></AvatarFallback>
                                        </Avatar>
                                    </TableCell>

                                    {/* Info */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className={`font-medium ${user.isPremium ? 'text-yellow-400' : 'text-white'}`}>
                                                {user.fullName || "Người dùng ẩn danh"}
                                            </span>
                                            <div
                                                className="flex items-center gap-1 text-xs text-zinc-500 cursor-pointer hover:text-zinc-300 w-fit"
                                                onClick={() => copyToClipboard(user.fireBaseUid)}
                                                title="Click để sao chép UID"
                                            >
                                                <span className="truncate max-w-[150px]">UID: {user.fireBaseUid}</span>
                                                <Copy className="size-3" />
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        {user.isPremium ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                <Check className="size-3" /> Premium
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                Miễn phí
                                            </span>
                                        )}
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell>
                                        <span className='inline-flex items-center gap-2 text-zinc-400 text-sm'>
                                            <Calendar className='size-4' />
                                            {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                                        </span>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className='text-right'>
                                        <div className='flex gap-2 justify-end opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity'>
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={() => handleEditClick(user)}
                                                className='h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700'
                                            >
                                                <Pencil className='size-4' />
                                            </Button>

                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={() => handleDeleteClick(user._id)} // Gọi hàm mở dialog
                                                className='h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-400/10'
                                            >
                                                <Trash2 className='size-4' />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                                    Không tìm thấy người dùng nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-2">
                    <div className="text-sm text-zinc-500">
                        Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, users.length)} trong {users.length} người dùng
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                        </Button>
                        <div className="text-sm font-medium text-white bg-zinc-800 px-4 py-2 rounded-md border border-zinc-700">
                            {currentPage} / {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50"
                        >
                            Sau <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            <EditUserDialog
                user={selectedUser}
                isOpen={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />

            {/* 5. Render Dialog Xóa */}
            <ConfirmDeleteDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Xóa Người Dùng"
                description="Bạn có chắc chắn muốn xóa người dùng này? Tất cả dữ liệu liên quan (Playlist, Tin nhắn) có thể bị ảnh hưởng."
                isLoading={isLoading}
            />
        </div>
    );
};

export default UsersTable;