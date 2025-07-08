// hooks/useAuth.ts
import { authApi } from '@/lib/apis/auth.api'
import { ChangePasswordDto, CreateUserDto, LoginDto, ResetPasswordDto, VerifyOtpDto } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'

// Đăng ký
export const useRegister = () => {
  return useMutation({
    mutationFn: (body: CreateUserDto) => authApi.register(body)
  })
}

// Đăng nhập
export const useLogin = () => {
  return useMutation({
    mutationFn: (body: LoginDto) => authApi.login(body)
  })
}

// Đăng xuất
export const useLogout = () => {
  return useMutation({
    mutationFn: (userId: string) => authApi.logout(userId)
  })
}

// Đổi mật khẩu
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (body: ChangePasswordDto) => authApi.changePassword(body)
  })
}

// Refresh token
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken)
  })
}

// Xác minh OTP
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (body: VerifyOtpDto) => authApi.verifyOtp(body)
  })
}

// Gửi lại OTP
export const useResendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.resendOtp(email)
  })
}

// Reset mật khẩu
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (body: ResetPasswordDto) => authApi.resetPassword(body)
  })
}

// Gửi OTP để reset mật khẩu
export const useSendOtpResetPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.sendOtpResetPassword(email)
  })
}
