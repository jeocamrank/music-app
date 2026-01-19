import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMusicStore } from "@/stores/useMusicStore";
import { Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface EditAlbumDialogProps {
    album: any; // Replace with Album type
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const EditAlbumDialog = ({ album, isOpen, onOpenChange }: EditAlbumDialogProps) => {
    const { updateAlbum, isLoading } = useMusicStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    useEffect(() => {
        if (album && isOpen) {
            setFormData({
                title: album.title,
                artist: album.artist,
                releaseYear: album.releaseYear,
            });
            setPreviewUrl(album.imageUrl);
            setImageFile(null);
        }
    }, [album, isOpen]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("artist", formData.artist);
            data.append("releaseYear", formData.releaseYear.toString());
            if (imageFile) {
                data.append("imageFile", imageFile);
            }

            await updateAlbum(album._id, data);
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update album:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='bg-zinc-900 border-zinc-700 max-w-md'>
                <DialogHeader>
                    <DialogTitle className="!text-white">Edit Album</DialogTitle>
                    <DialogDescription>Modify album details.</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    {/* Image Upload */}
                    <div
                        className='flex flex-col items-center justify-center p-4 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-500 transition-colors'
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-md shadow-md" />
                        ) : (
                            <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                                <Upload className='h-6 w-6 text-zinc-400' />
                            </div>
                        )}
                        <div className='text-sm text-zinc-400 mt-2 text-center'>
                            {imageFile ? imageFile.name : "Click to change artwork"}
                        </div>
                    </div>
                    <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept='image/*'
                        className='hidden'
                    />

                    <div className='space-y-2'>
                        <Label className="text-zinc-300">Album Title</Label>
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
                        <Label className="text-zinc-300">Release Year</Label>
                        <Input
                            type='number'
                            value={formData.releaseYear}
                            onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                            className='bg-zinc-800 border-zinc-700 !text-white'
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className='bg-violet-500 hover:bg-violet-600'>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditAlbumDialog;