import { useAuthStore } from '@/stores/useAuthStore';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Album, Music, DollarSign, User } from 'lucide-react'; // Thêm icon User và DollarSign
import { useEffect } from 'react';

// Stores
import { useMusicStore } from '@/stores/useMusicStore';
import { useUserStore } from '@/stores/useUserStore';       // Store User mới
import { usePaymentStore } from '@/stores/usePaymentStore'; // Store Payment mới

// Components
import SongsTabContent from './components/SongsTabContent';
import AlbumsTabContent from './components/AlbumsTabContent';
import UsersTable from './components/UsersTable';           // Bảng User mới
import PaymentsTable from './components/PaymentsTable';     // Bảng Payment mới
import StatsChart from './components/StatsChart';           // Chart cũ
import RevenueChart from './components/RevenueChart';       // Chart doanh thu mới

const AdminPage = () => {
    const { isAdmin, isLoading } = useAuthStore();

    // Lấy các hàm fetch từ các store
    const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();
    const { fetchUsers } = useUserStore();
    const { fetchPayments } = usePaymentStore();

    useEffect(() => {
        // Gọi tất cả API cần thiết khi load trang Admin
        fetchAlbums();
        fetchSongs();
        fetchStats();
        fetchUsers();
        fetchPayments();
    }, [fetchAlbums, fetchSongs, fetchStats, fetchUsers, fetchPayments]);

    if (!isAdmin && !isLoading) return <div className="text-center text-zinc-400 mt-20">Unauthorized Access</div>

    return (
        <div className='min-h-screen bg-zinc-900 text-zinc-100 p-4 md:p-8'>
            <Header />

            {/* 1. Thống kê số liệu tổng quan (Cards) */}
            <DashboardStats />

            {/* 2. Khu vực Biểu đồ (Grid Layout) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                {/* Biểu đồ phân bố nội dung (Songs/Albums) */}
                <div className="col-span-1">
                    <StatsChart />
                </div>

                {/* Biểu đồ doanh thu theo ngày */}
                <div className="col-span-1">
                    <RevenueChart />
                </div>
            </div>

            {/* 3. Khu vực Quản lý chi tiết (Tabs) */}
            <Tabs defaultValue='songs' className='space-y-6'>
                <TabsList className='p-1 bg-zinc-800/50 border border-zinc-700/50 h-auto flex-wrap justify-start'>
                    <TabsTrigger
                        value='songs'
                        className='data-[state=active]:bg-zinc-700 data-[state=active]:text-emerald-400 px-4 py-2'
                    >
                        <Music className='mr-2 size-4' /> Songs
                    </TabsTrigger>

                    <TabsTrigger
                        value='albums'
                        className='data-[state=active]:bg-zinc-700 data-[state=active]:text-violet-400 px-4 py-2'
                    >
                        <Album className='mr-2 size-4' /> Albums
                    </TabsTrigger>

                    {/* Tab Users Mới */}
                    <TabsTrigger
                        value='users'
                        className='data-[state=active]:bg-zinc-700 data-[state=active]:text-blue-400 px-4 py-2'
                    >
                        <User className='mr-2 size-4' /> Users
                    </TabsTrigger>

                    {/* Tab Finance Mới */}
                    <TabsTrigger
                        value='finance'
                        className='data-[state=active]:bg-zinc-700 data-[state=active]:text-yellow-400 px-4 py-2'
                    >
                        <DollarSign className='mr-2 size-4' /> Finance
                    </TabsTrigger>
                </TabsList>

                {/* --- Nội dung các Tab --- */}

                <TabsContent value='songs'>
                    <SongsTabContent />
                </TabsContent>

                <TabsContent value='albums'>
                    <AlbumsTabContent />
                </TabsContent>

                <TabsContent value='users'>
                    <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <User className="size-6 text-blue-500" />
                                    Quản lý Người dùng
                                </h2>
                                <p className="text-sm text-zinc-400 mt-1">Xem, sửa hoặc xóa người dùng trong hệ thống.</p>
                            </div>
                        </div>
                        <UsersTable />
                    </div>
                </TabsContent>

                <TabsContent value='finance'>
                    <div className="bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <DollarSign className="size-6 text-yellow-500" />
                                    Lịch sử Giao dịch
                                </h2>
                                <p className="text-sm text-zinc-400 mt-1">Theo dõi tất cả các khoản thanh toán qua MoMo.</p>
                            </div>
                        </div>
                        <PaymentsTable />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AdminPage