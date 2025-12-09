import { Button } from "@/components/ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const SignInOAuthButtons = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const auth = getAuth();
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("User đăng nhập thành công từ redirect:", result.user);
          navigate("/auth-callback");
        }
      } catch (error) {
        if (error && (error as any).code !== 'auth/popup-closed-by-user') {
          console.error("Lỗi khi xử lý redirect result:", error);
        }
      }
    };

    checkRedirectResult();
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User đăng nhập thành công:", user);
        navigate("/auth-callback");
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.message?.includes('not be secure')) {
          console.log("Popup bị chặn, thử redirect...");
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error("Đăng nhập Google thất bại:", error);
      const errorMessage = error.message || "Đăng nhập Google thất bại, vui lòng thử lại!";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant={"secondary"}
      className="w-full h-10 text-white border-zinc-200"
      disabled={loading}
    >
      Continue with Google
    </Button>
  );
};

export default SignInOAuthButtons;
