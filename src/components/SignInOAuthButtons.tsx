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

      // 🔥 BẮT BUỘC HIỆN MÀN HÌNH CHỌN TÀI KHOẢN
      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(auth, provider);

      // 👉 đi qua callback để sync backend
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
      variant="secondary"
      className="w-full h-10 text-white"
      disabled={loading}
    >
      {loading ? "Đang đăng nhập..." : "Continue with Google"}
    </Button>
  );
};

export default SignInOAuthButtons;
