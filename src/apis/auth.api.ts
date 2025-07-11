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
import { BASE_AUTH_PATH } from '@/constants/api_url'

export const authApi = {
  register(body: CreateUserDto) {
    return http.post<{ message: string }>(`${BASE_AUTH_PATH}/register`, body)
  },

  login(body: LoginDto) {
    return http.post<LoginResponse>(`${BASE_AUTH_PATH}/login`, body)
  },

  logout(userId: string) {
    return http.post<{ message: string }>(`${BASE_AUTH_PATH}/logout/${userId}`, null)
  },

  changePassword(body: ChangePasswordDto) {
    return http.post<{ message: string }>(`${BASE_AUTH_PATH}/change-password`, body)
  },

  resetPassword(body: ResetPasswordDto) {
    return http.post<{ message: string }>(`${BASE_AUTH_PATH}/reset-password`, body)
  },

  refreshToken(refreshToken: string) {
    return http.post<RefreshResponse>(`${BASE_AUTH_PATH}/refresh-token`, { refreshToken })
  },

  verifyOtp(body: VerifyOtpDto) {
    return http.post<{ message: string }>(`${BASE_AUTH_PATH}/verify-otp`, body)
  },

  resendOtp(email: string) {
    return http.post<{ message: string }>(`${BASE_AUTH_PATH}/resend-otp/${email}`, null)
  },

  sendOtpResetPassword(email: string) {
    return http.post<{ message: string }>(`${BASE_AUTH_PATH}/send-otp-reset-password/${email}`, null)
  }
}
