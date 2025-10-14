import { Button } from "@/components/ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignInOAuthButtons = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      // Mở popup đăng nhập Google
      const result = await signInWithPopup(auth, provider);

      // Lấy thông tin user
      const user = result.user;
      navigate("/auth-callback");

    } catch (error) {
      console.error("Đăng nhập Google thất bại:", error);
      alert("Đăng nhập Google thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant={"secondary"}
      className="w-full text-white border-zinc-200 h-10"
      disabled={loading}
    >
      Continue with Google
    </Button>
  );
};

export default SignInOAuthButtons;
