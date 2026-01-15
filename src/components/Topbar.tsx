import { LayoutDashboardIcon, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "./AuthWrappers";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/fire";
import { Button, buttonVariants } from "./ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AuthDialog from "./AuthDialog";

const handleLogout = async () => {
  await signOut(auth);
};

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const [openAuth, setOpenAuth] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 text-white">
          <img src="/spotify.png" className="size-8" />
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <LayoutDashboardIcon className="size-4 mr-2" />
              Admin
            </Link>
          )}

          <SignedIn>
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </SignedIn>

          <SignedOut>
            <Button onClick={() => setOpenAuth(true)}>
              <LogIn className="size-4" />
              Đăng nhập
            </Button>
          </SignedOut>
        </div>
      </div>

      <AuthDialog open={openAuth} onOpenChange={setOpenAuth} />
    </>
  );
};

export default Topbar;
