import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const PlaylistPageSkeleton = () => {
    return (
        <div className="h-full bg-zinc-900 rounded-lg overflow-hidden">
            <ScrollArea className="h-full">
                <div className="relative min-h-full pb-24">
                    {/* 1. Header Section (Giống ảnh Coastal Dreaming) */}
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8">
                        {/* Ảnh bìa lớn */}
                        <div className="flex-shrink-0 shadow-2xl">
                            <Skeleton className="w-[240px] h-[240px] rounded-md bg-zinc-800" />
                        </div>

                        {/* Thông tin Playlist bên phải */}
                        <div className="flex flex-col justify-end gap-2 w-full">
                            <Skeleton className="h-4 w-20 bg-zinc-800" /> {/* Label: Playlist/Album */}
                            <Skeleton className="h-12 md:h-16 w-3/4 bg-zinc-800 my-2" /> {/* Tên to */}
                            
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-32 bg-zinc-800" />
                                <Skeleton className="h-4 w-4 bg-zinc-800" />
                                <Skeleton className="h-4 w-24 bg-zinc-800" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Action Button (Nút Play tròn xanh) */}
                    <div className="relative z-10 px-8 py-4">
                        <Skeleton className="w-14 h-14 rounded-full bg-zinc-800" />
                    </div>

                    {/* 3. Songs List Header & Body */}
                    {/* Container danh sách */}
                    <div className="bg-black/20 backdrop-blur-sm"> 
                        {/* Header Row - Khớp grid với trang thật */}
                        <div className="grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-10 py-2 mb-4 border-b border-white/5">
                            <Skeleton className="h-4 w-4 bg-zinc-800" />   {/* # */}
                            <Skeleton className="h-4 w-20 bg-zinc-800" />  {/* Title */}
                            <Skeleton className="h-4 w-20 bg-zinc-800" />  {/* Artist/Date */}
                            <Skeleton className="h-4 w-10 bg-zinc-800 ml-auto" /> {/* Clock */}
                            <div />
                        </div>

                        {/* Song Items - Render 8 dòng */}
                        <div className="px-6 space-y-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className="grid grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-4 py-2 rounded-md items-center"
                                >
                                    {/* Cột 1: Index */}
                                    <Skeleton className="h-4 w-4 bg-zinc-800" />

                                    {/* Cột 2: Ảnh + Tên bài hát */}
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded bg-zinc-800" />
                                        <div className="flex flex-col gap-1 w-full">
                                            <Skeleton className="h-4 w-3/4 bg-zinc-800" /> {/* Tên bài */}
                                            <Skeleton className="h-3 w-1/2 bg-zinc-800" /> {/* Tên ca sĩ (mobile) */}
                                        </div>
                                    </div>

                                    {/* Cột 3: Artist / Date */}
                                    <Skeleton className="h-4 w-1/2 bg-zinc-800" />

                                    {/* Cột 4: Duration */}
                                    <Skeleton className="h-4 w-10 bg-zinc-800 ml-auto" />
                                    
                                    {/* Cột 5: Action (ẩn) */}
                                    <div />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default PlaylistPageSkeleton;