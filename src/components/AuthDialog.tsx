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
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/fire";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "@/schema/auth.schema.ts";
import { z } from "zod";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
};

export default function AuthDialog({ open, onOpenChange }: Props) {
    const [mode, setMode] = useState<"login" | "register">("login");

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
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-zinc-900 text-white">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Email */}
                    <div>
                        <Input placeholder="Email" {...register("email")} />
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

                    <Button className="w-full" type="submit" disabled={isSubmitting}>
                        {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                    </Button>

                    <div className="text-center text-sm text-zinc-400">
                        {mode === "login" ? (
                            <>
                                Chưa có tài khoản?{" "}
                                <button
                                    type="button"
                                    className="text-white underline"
                                    onClick={() => setMode("register")}
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
                                    onClick={() => setMode("login")}
                                >
                                    Đăng nhập
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500">
                        <div className="h-px flex-1 bg-zinc-700" />
                        hoặc
                        <div className="h-px flex-1 bg-zinc-700" />
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={handleGoogle}
                    >
                        {mode === "login"
                            ? "Đăng nhập bằng Google"
                            : "Đăng ký bằng Google"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
