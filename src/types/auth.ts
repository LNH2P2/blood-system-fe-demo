import { z } from 'zod'

// Schema đăng nhập
export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Vui lòng nhập tên đăng nhập' }),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
  deviceInfo: z.string().min(1, { message: 'Thông tin thiết bị là bắt buộc' })
})

export const loginResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string()
  })
})

export const changePasswordSchema = z.object({
  userId: z.string().min(1, { message: 'ID người dùng không được để trống' }),
  oldPassword: z.string().min(1, { message: 'Vui lòng nhập mật khẩu cũ' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
})

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  newPassword: z.string().min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
  otp: z.number({ invalid_type_error: 'OTP phải là số' })
})

export const verifyOtpSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
  otp: z.number({ invalid_type_error: 'OTP phải là số' })
})

export const sendOtpSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' })
})

export const refreshResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.object({
    access_token: z.string()
  })
})

// ✅ Type Inference
export type LoginDto = z.infer<typeof loginSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type SendOtpDto = z.infer<typeof sendOtpSchema>
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>
export type RefreshResponse = z.infer<typeof refreshResponseSchema>
