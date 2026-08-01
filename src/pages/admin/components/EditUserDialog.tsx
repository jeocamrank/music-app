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
import { Switch } from "@/components/ui/switch"; 
import { useUserStore } from "@/stores/useUserStore";
import { Upload, Crown } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface EditUserDialogProps {
	user: any;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

const EditUserDialog = ({ user, isOpen, onOpenChange }: EditUserDialogProps) => {
	const { updateUser, isLoading } = useUserStore();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [formData, setFormData] = useState({
		fullName: "",
		isPremium: false,
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");

	// Load dữ liệu khi mở dialog
	useEffect(() => {
		if (user && isOpen) {
			setFormData({
				fullName: user.fullName || "",
				isPremium: user.isPremium || false,
			});
			setPreviewUrl(user.imageUrl || "");
			setImageFile(null);
		}
	}, [user, isOpen]);

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
			data.append("fullName", formData.fullName);
			data.append("isPremium", String(formData.isPremium));
			
			if (imageFile) {
				data.append("image", imageFile);
			}

			await updateUser(user._id, data);
			onOpenChange(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='bg-zinc-900 border-zinc-700 max-w-md sm:max-w-lg'>
				<DialogHeader>
					<DialogTitle className="!text-white">Edit User Profile</DialogTitle>
					<DialogDescription>Update user information and permissions.</DialogDescription>
				</DialogHeader>
				
				<div className='space-y-6 py-4'>
					{/* --- Image Upload Section --- */}
					<div className="flex flex-col items-center gap-4">
						<div 
							className="relative group cursor-pointer size-28"
							onClick={() => fileInputRef.current?.click()}
						>
							<div className="size-full rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-violet-500 transition-colors">
								<img 
									src={previewUrl || "/avatar-placeholder.png"} 
									alt="Avatar" 
									className="size-full object-cover"
								/>
							</div>
							
							{/* Overlay */}
							<div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<Upload className="size-8 text-white" />
							</div>
						</div>
						
						<input
							type='file'
							ref={fileInputRef}
							onChange={handleImageSelect}
							accept='image/*'
							className='hidden'
						/>
						<p className="text-xs text-zinc-500">Click to change avatar</p>
					</div>

					{/* --- Full Name --- */}
					<div className='space-y-2'>
						<Label className='text-zinc-200'>Full Name</Label>
						<Input
							value={formData.fullName}
							onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
							className='bg-zinc-800 border-zinc-700 !text-white focus-visible:ring-violet-500'
							placeholder="Enter full name"
						/>
					</div>

					{/* --- Premium Switch --- */}
					<div className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${formData.isPremium ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-zinc-700 bg-zinc-800/50'}`}>
						<div className="flex items-center gap-3">
							<div className={`p-2 rounded-full ${formData.isPremium ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-700 text-zinc-400'}`}>
								<Crown className="size-5" />
							</div>
							<div className="flex flex-col">
								<span className={`font-medium ${formData.isPremium ? 'text-yellow-400' : 'text-white'}`}>Premium Status</span>
								<span className="text-xs text-zinc-400">Grant access to exclusive features</span>
							</div>
						</div>
						<Switch 
							checked={formData.isPremium}
							onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
							className="data-[state=checked]:bg-yellow-500"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button 
						variant='outline' 
						onClick={() => onOpenChange(false)} 
						disabled={isLoading}
						className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className='bg-violet-500 hover:bg-violet-600 text-white'
						disabled={isLoading}
					>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditUserDialog;