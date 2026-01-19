import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMusicStore } from '@/stores/useMusicStore';
import { Upload } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface EditSongDialogProps {
    song: any; // Replace with Song type
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const EditSongDialog = ({ song, isOpen, onOpenChange }: EditSongDialogProps) => {
    const { albums, updateSong, isLoading } = useMusicStore();

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        albumId: "",
        duration: "0",
    });

    const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
        audio: null,
        image: null,
    });
    const [previewUrl, setPreviewUrl] = useState<string>("");

    useEffect(() => {
        if (song && isOpen) {
            setFormData({
                title: song.title,
                artist: song.artist,
                albumId: song.albumId || "none",
                duration: song.duration.toString(),
            });
            setPreviewUrl(song.imageUrl);
            setFiles({ audio: null, image: null });
        }
    }, [song, isOpen]);

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("artist", formData.artist);
            data.append("duration", formData.duration);
            if (formData.albumId && formData.albumId !== "none") {
                data.append("albumId", formData.albumId);
            } else {
                // If switching to single, send empty or specific flag if backend requires
                data.append("albumId", "");
            }

            if (files.audio) data.append("audioFile", files.audio);
            if (files.image) data.append("imageFile", files.image);

            await updateSong(song._id, data);
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update song:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[85vh] overflow-y-auto max-w-md'>
                <DialogHeader>
                    <DialogTitle className='!text-white'>Edit Song</DialogTitle>
                    <DialogDescription>Update song details.</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    {/* Image Upload */}
                    <div
                        className='flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-500'
                        onClick={() => imageInputRef.current?.click()}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
                        ) : (
                            <Upload className='h-8 w-8 text-zinc-400' />
                        )}
                        <p className='text-xs text-zinc-400 mt-2'>{files.image ? files.image.name : "Change Artwork"}</p>
                    </div>
                    <input type='file' accept='image/*' ref={imageInputRef} hidden onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setFiles(prev => ({ ...prev, image: file }));
                            setPreviewUrl(URL.createObjectURL(file));
                        }
                    }} />

                    {/* Audio Upload */}
                    <div className='space-y-2'>
                        <Label className="text-zinc-300">Audio File</Label>
                        <div className='flex items-center gap-2'>
                            <Button variant={"outline"} onClick={() => audioInputRef.current?.click()} className='w-full !text-white border-zinc-700 bg-zinc-800'>
                                {files.audio ? files.audio.name.slice(0, 20) + "..." : "Change Audio File"}
                            </Button>
                        </div>
                        <input type='file' accept='audio/*' ref={audioInputRef} hidden onChange={(e) => setFiles(prev => ({ ...prev, audio: e.target.files![0] }))} />
                    </div>

                    {/* Text Fields */}
                    <div className='space-y-2'>
                        <Label className="text-zinc-300">Title</Label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className='bg-zinc-800 border-zinc-700 !text-white'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className="text-zinc-300">Artist</Label>
                        <Input
                            value={formData.artist}
                            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                            className='bg-zinc-800 border-zinc-700 !text-white'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className="text-zinc-300">Duration (sec)</Label>
                        <Input
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className='bg-zinc-800 border-zinc-700 !text-white'
                        />
                    </div>
                    <div className='space-y-2'>
                        <Label className="text-zinc-300">Album</Label>
                        <Select
                            value={formData.albumId}
                            onValueChange={(value) => setFormData({ ...formData, albumId: value })}
                        >
                            <SelectTrigger className='bg-zinc-800 border-zinc-700 !text-white'>
                                <SelectValue placeholder="Select album" />
                            </SelectTrigger>
                            <SelectContent className='bg-zinc-800 border-zinc-700 !text-white'>
                                <SelectItem value='none'>No Album (Single)</SelectItem>
                                {albums.map((album) => (
                                    <SelectItem key={album._id} value={album._id}>
                                        {album.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant={"outline"} onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600 text-black">
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditSongDialog;