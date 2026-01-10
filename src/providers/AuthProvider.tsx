import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";
import type { ReactNode } from "react";
import { auth } from "@/firebase/fire";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useMusicStore } from "@/stores/useMusicStore";

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
	const { reset: resetMusicStore } = useMusicStore();

	// useEffect(() => {
	// 	const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
	// 		try {
	// 			if (firebaseUser) {
	// 				// 1. Set user vào store
	// 				setUser({
	// 					_id: firebaseUser.uid,
	// 					fireBaseUid: firebaseUser.uid,
	// 					fullName: firebaseUser.displayName || "",
	// 					imageUrl: firebaseUser.photoURL || "",
	// 				});

	// 				// Lấy token
	// 				const token = await firebaseUser.getIdToken();
	// 				updateApiToken(token);
	// 				// Check admin
	// 				await checkAdminStatus();
	// 				// Init socket
	// 				initSocket(firebaseUser.uid);
	// 				// fetch playlists
	// 				await useMusicStore.getState().fetchUserPlaylists()
	// 			} else {
	// 				// === LOGOUT / GUEST ===
	// 				updateApiToken(null);
	// 				disconnectSocket();
	// 				setUser(null);
	// 				resetMusicStore();
	// 				reset(); // reset isAdmin
	// 			}
	// 		} catch (error) {
	// 			console.error("AuthProvider error:", error);
	// 			updateApiToken(null);
	// 			disconnectSocket();
	// 			setUser(null);
	// 			reset();
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	});

	// 	return () => {
	// 		unsubscribe();
	// 		disconnectSocket();
	// 	};
	// }, [checkAdminStatus, initSocket, disconnectSocket, setUser, reset]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			try {
				if (firebaseUser) {
					setLoading(true);

					setUser({
						_id: firebaseUser.uid,
						fireBaseUid: firebaseUser.uid,
						fullName: firebaseUser.displayName || "",
						imageUrl: firebaseUser.photoURL || "",
					});

					const token = await firebaseUser.getIdToken(true);
					updateApiToken(token);
					await Promise.resolve(); // đảm bảo axios nhận token

					await checkAdminStatus();
					initSocket(firebaseUser.uid);

					await Promise.all([
						useMusicStore.getState().fetchUserPlaylists(),
						useChatStore.getState().fetchUsers(),
					]);
				} else {
					updateApiToken(null);
					disconnectSocket();
					setUser(null);
					useMusicStore.getState().reset();
					reset();
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
	}, []);


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
