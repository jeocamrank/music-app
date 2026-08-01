import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus } from "lucide-react"
import PlaylistPickerDialog from "./PlaylistPickerDialog"
import type { Song } from "@/types"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "react-hot-toast"

const AddToPlaylistButton = ({ song }: { song: Song }) => {
    const [open, setOpen] = useState(false)
    const { user } = useAuthStore()

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!user) {
            toast.error("Vui lòng đăng nhập để sử dụng tính năng này")
            return
        }

        setOpen(true)
    }

    return (
        <>
            <Button
                size="icon"
                onClick={handleClick}
                className={`
                    absolute bottom-3 right-12
                    bg-green-500 hover:bg-green-400 text-black
                    hover:scale-105
                    transition-all duration-200
                    opacity-0 translate-y-2
                    group-hover:opacity-100
                    group-hover:translate-y-0
                `}
            >
                <Plus className="size-5" />
            </Button>

            {user && (
                <PlaylistPickerDialog
                    open={open}
                    onOpenChange={setOpen}
                    song={song}
                />
            )}
        </>
    )
}

export default AddToPlaylistButton
