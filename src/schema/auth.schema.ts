import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email không được để trống")
        .email("Email không hợp lệ"),
    password: z
        .string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, "Email không được để trống")
            .email("Email không hợp lệ"),
        password: z
            .string()
            .min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z
            .string()
            .min(6, "Vui lòng xác nhận mật khẩu"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Mật khẩu xác nhận không khớp",
    });
