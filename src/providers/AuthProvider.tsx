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
		axiosInstance.defaults.headers.common[
			"Authorization"
		] = `Bearer ${token}`;
	} else {
		delete axiosInstance.defaults.headers.common["Authorization"];
	}
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [loading, setLoading] = useState(true);

	const { checkAdminStatus, setUser, reset } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			try {
				if (firebaseUser) {
					// 1. Set user vào store
					setUser({
						_id: firebaseUser.uid,
						fireBaseUid: firebaseUser.uid,
						fullName: firebaseUser.displayName || "",
						imageUrl: firebaseUser.photoURL || "",
					});

					// 2. Lấy token
					const token = await firebaseUser.getIdToken();
					updateApiToken(token);

					// 3. Check admin
					await checkAdminStatus();

					// 4. Init socket
					initSocket(firebaseUser.uid);
				} else {
					// === LOGOUT / GUEST ===
					updateApiToken(null);
					disconnectSocket();
					setUser(null);
					reset(); // reset isAdmin
				}
			} catch (error) {
				console.error("AuthProvider error:", error);
				updateApiToken(null);
				disconnectSocket();
				setUser(null);
				reset();
			} finally {
				setLoading(false);
			}
		});

		return () => {
			unsubscribe();
			disconnectSocket();
		};
	}, [checkAdminStatus, initSocket, disconnectSocket, setUser, reset]);

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
