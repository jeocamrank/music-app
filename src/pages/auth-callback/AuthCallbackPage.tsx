import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hook/useAuth'
import { axiosInstance } from '@/lib/axios';
import { Loader } from 'lucide-react'
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallbackPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const syncAttempted = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (loading || !user || syncAttempted.current) return;
      try {
        syncAttempted.current = true;

        await axiosInstance.post("/auth/callback", {
          id: user.uid, // Firebase UID
          fullName: user.displayName,
          imageUrl: user.photoURL,
        })
      } catch (error) {
        console.error("Error in auth callback", error);
      } finally {
        navigate("/");
      }
    }

    syncUser();
  }, [user, loading, navigate]);

  return (
    <div className='h-screen w-full bg-black flex items-center justify-center'>
      <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
        <CardContent className='flex flex-col items-center gap-4 pt-6'>
          <Loader className='size-6 text-emerald-500 animate-spin' />
          <h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
          <p className='text-zinc-400 text-sm'>Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthCallbackPage
