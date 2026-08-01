import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ITEMS_PER_PAGE = 8; // Hiển thị 8 giao dịch/trang

const PaymentsTable = () => {
    const { payments, fetchPayments, isLoading } = usePaymentStore();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    if (isLoading && payments.length === 0) {
        return <div className='text-center py-8 text-zinc-400'>Loading payments...</div>;
    }

    // Phân trang
    const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentPayments = payments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className='hover:bg-zinc-800/50 border-zinc-800'>
                            <TableHead className="w-[250px]">Người dùng</TableHead>
                            <TableHead>Số tiền</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Mã đơn</TableHead>
                            <TableHead className='text-right'>Ngày</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {currentPayments.length > 0 ? (
                            currentPayments.map((payment) => (
                                <TableRow key={payment._id} className='hover:bg-zinc-800/50 border-zinc-800 transition-colors'>
                                    {/* Cột User */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className='size-8 border border-zinc-700'>
                                                <AvatarImage src={payment.userId?.imageUrl} />
                                                <AvatarFallback><User className='size-4' /></AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col'>
                                                <span className='font-medium text-white text-sm'>{payment.userId?.fullName || "Unknown"}</span>
                                                <span className='text-xs text-zinc-500 truncate max-w-[150px]'>{payment.userId?.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Cột Số tiền */}
                                    <TableCell className="font-bold text-emerald-400">
                                        {payment.amount.toLocaleString('vi-VN')} đ
                                    </TableCell>

                                    {/* Cột Trạng thái */}
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border
                                            ${payment.status === 'SUCCESS'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                                        `}>
                                            {payment.status}
                                        </span>
                                    </TableCell>

                                    {/* Cột Mã đơn */}
                                    <TableCell className="text-zinc-400 text-xs font-mono">
                                        {payment.orderId.slice(-8)}...
                                    </TableCell>

                                    {/* Cột Ngày */}
                                    <TableCell className='text-right'>
                                        <div className='inline-flex items-center gap-1 text-zinc-400 text-sm'>
                                            <Calendar className='h-3 w-3' />
                                            {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-400">
                                    Chưa có giao dịch nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-zinc-400">
                        Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, payments.length)} trong {payments.length} giao dịch
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-medium text-white bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-700">
                            {currentPage} / {totalPages}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 disabled:opacity-50">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsTable;