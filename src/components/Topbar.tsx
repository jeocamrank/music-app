import { LayoutDashboardIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from './AuthWrappers';
import SignInOAuthButtons from './SignInOAuthButtons';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/fire';
import { Button } from './ui/button';

const handleLogout = async () => {
    try {
        await signOut(auth); // ← Firebase logout: Clear session, token, và update hook realtime
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
    }
};

const Topbar = () => {
    const isAdmin = false;

    return (
        <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10'>
            <div className='flex gap-2 items-center text-white'>
                Spotify
            </div>
            <div className='flex items-center gap-4'>
                {isAdmin && (
                    <Link to={"/admin"}>
                        <LayoutDashboardIcon className='size-4 mr-2' />
                        Admin Dashboard
                    </Link>
                )}

                <SignedIn>
                    <Button
                        onClick={handleLogout}
                        variant="secondary"
                        className="text-zinc-400 hover:text-white"
                    >
                        Log Out
                    </Button>
                </SignedIn>

                <SignedOut>
                    <SignInOAuthButtons />
                </SignedOut>
            </div>
        </div>
    )
}

export default Topbar
