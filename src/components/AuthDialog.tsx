import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/fire";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "@/schema/auth.schema";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { firebaseAuthErrorMessage } from "@/util/firebaseError";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function AuthDialog({ open, onOpenChange }: Props) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const navigate = useNavigate();

    const schema = mode === "login" ? loginSchema : registerSchema;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<any>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: any) => {
        try {
            if (mode === "login") {
                await signInWithEmailAndPassword(auth, data.email, data.password);
            } else {
                await createUserWithEmailAndPassword(
                    auth,
                    data.email,
                    data.password
                );
            }

            reset();
            onOpenChange(false);
            navigate("/auth-callback");
        } catch (error: any) {
            const message = firebaseAuthErrorMessage(error.code);
            toast.error(message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 text-white border border-zinc-800">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Email */}
                    <div>
                        <Input
                            placeholder="Email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.email.message as string}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <Input
                            type="password"
                            placeholder="Mật khẩu"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.password.message as string}
                            </p>
                        )}
                    </div>

                    {/* Confirm password (register only) */}
                    {mode === "register" && (
                        <div>
                            <Input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.confirmPassword.message as string}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                    </Button>

                    {/* Switch mode */}
                    <div className="text-center text-sm text-zinc-400">
                        {mode === "login" ? (
                            <>
                                Chưa có tài khoản?{" "}
                                <button
                                    type="button"
                                    className="text-white underline"
                                    onClick={() => {
                                        reset();
                                        setMode("register");
                                    }}
                                >
                                    Đăng ký
                                </button>
                            </>
                        ) : (
                            <>
                                Đã có tài khoản?{" "}
                                <button
                                    type="button"
                                    className="text-white underline"
                                    onClick={() => {
                                        reset();
                                        setMode("login");
                                    }}
                                >
                                    Đăng nhập
                                </button>
                            </>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-2 text-zinc-500">
                        <div className="h-px flex-1 bg-zinc-700" />
                        hoặc
                        <div className="h-px flex-1 bg-zinc-700" />
                    </div>

                    {/* OAuth */}
                    <SignInOAuthButtons />
                </form>
            </DialogContent>
        </Dialog>
    );
}
