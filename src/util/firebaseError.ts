export const firebaseAuthErrorMessage = (code: string) => {
    switch (code) {
        case "auth/invalid-credential":
            return "Email hoặc mật khẩu không chính xác";

        case "auth/user-not-found":
            return "Tài khoản không tồn tại";

        case "auth/wrong-password":
            return "Mật khẩu không đúng";

        case "auth/email-already-in-use":
            return "Email đã được sử dụng";

        case "auth/weak-password":
            return "Mật khẩu phải có ít nhất 6 ký tự";

        case "auth/too-many-requests":
            return "Bạn thao tác quá nhanh, vui lòng thử lại sau";

        case "auth/popup-closed-by-user":
            return "Bạn đã đóng cửa sổ đăng nhập";

        default:
            return "Đã xảy ra lỗi, vui lòng thử lại";
    }
};
