import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
}

const ConfirmDeleteDialog = ({
    isOpen,
    onOpenChange,
    onConfirm,
    title,
    description,
    isLoading = false,
}: ConfirmDeleteDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='bg-zinc-900 border-zinc-700 max-w-md'>
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-full bg-red-500/10">
                            <AlertTriangle className="size-6 text-red-500" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-white">{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-zinc-400 text-base">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                    <Button
                        variant='ghost'
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                        Hủy bỏ
                    </Button>

                    <Button
                        variant='destructive'
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xóa...
                            </>
                        ) : (
                            "Xóa ngay"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;