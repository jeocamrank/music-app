import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";
import type { ReactNode } from "react";
import { auth } from "@/firebase/fire";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const updateApiToken = (token: string | null) => {
	if (token) {
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete axiosInstance.defaults.headers.common["Authorization"];
	}
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus, setUser } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		/**
		 * Lắng nghe trạng thái người dùng đăng nhập / đăng xuất Firebase
		 */
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			try {
				if (user) {
					// Lấy token từ Firebase
					setUser({
						_id: user.uid,
						fireBaseUid: user.uid,
						fullName: user.displayName || "",
						imageUrl: user.photoURL || "",
					});
					console.log("User: ", user)
					const token = await user.getIdToken();
					updateApiToken(token);

					if (token) {
						await checkAdminStatus();
						// init socket
						if (user.uid) initSocket(user.uid);
					}
				} else {
					// Nếu user bị sign out
					updateApiToken(null);
					disconnectSocket();
				}
			} catch (error) {
				updateApiToken(null);
				console.error("Error in AuthProvider:", error);
			} finally {
				setLoading(false);
			}
		});

		// Cleanup khi component unmount
		return () => {
			unsubscribe();
			disconnectSocket();
		};
	}, [auth, checkAdminStatus, initSocket, disconnectSocket, setUser]);

	if (loading) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<Loader className="size-8 text-emerald-500 animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthProvider;
