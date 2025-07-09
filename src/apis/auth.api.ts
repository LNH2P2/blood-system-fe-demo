import http from '@/lib/http'
import {
  ChangePasswordDto,
  LoginDto,
  LoginResponse,
  RefreshResponse,
  ResetPasswordDto,
  VerifyOtpDto
} from '@/types/auth'
import { CreateUserDto } from '@/types/user'

const BASE_PATH = '/auth'

export const authApi = {
  register(body: CreateUserDto) {
    return http.post<{ message: string }>(`${BASE_PATH}/register`, body)
  },

  login(body: LoginDto) {
    return http.post<LoginResponse>(`${BASE_PATH}/login`, body)
  },

  logout(userId: string) {
    return http.post<{ message: string }>(`${BASE_PATH}/logout/${userId}`, null)
  },

  changePassword(body: ChangePasswordDto) {
    return http.post<{ message: string }>(`${BASE_PATH}/change-password`, body)
  },

  resetPassword(body: ResetPasswordDto) {
    return http.post<{ message: string }>(`${BASE_PATH}/reset-password`, body)
  },

  refreshToken(refreshToken: string) {
    return http.post<RefreshResponse>(`${BASE_PATH}/refresh-token`, { refreshToken })
  },

  verifyOtp(body: VerifyOtpDto) {
    return http.post<{ message: string }>(`${BASE_PATH}/verify-otp`, body)
  },

  resendOtp(email: string) {
    return http.post<{ message: string }>(`${BASE_PATH}/resend-otp/${email}`, null)
  },

  sendOtpResetPassword(email: string) {
    return http.post<{ message: string }>(`${BASE_PATH}/send-otp-reset-password/${email}`, null)
  }
}
