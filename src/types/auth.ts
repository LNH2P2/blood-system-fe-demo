import { accountTypeValues, genderValues, isCreatedByValues, roleValues } from '@/types/enum/auth'
import { z } from 'zod'

export const addressSchema = z.object({
  street: z.string().min(1, { message: 'Vui lòng nhập tên đường' }),
  district: z.string().min(1, { message: 'Vui lòng nhập quận/huyện' }),
  city: z.string().min(1, { message: 'Vui lòng nhập thành phố' }),
  nation: z.string().min(1, { message: 'Vui lòng nhập quốc gia' })
})

export const createdBySchema = z.object({
  _id: z.string().min(1, { message: 'ID người tạo không được để trống' }),
  email: z.string().email({ message: 'Email không hợp lệ' })
})

export const updateBySchema = z.object({
  _id: z.string({ required_error: 'ID người cập nhật không được để trống' }),
  email: z.string({ required_error: 'Email không được để trống' })
})

export const deleteBySchema = z.object({
  _id: z.string({ required_error: 'ID người xóa không được để trống' }),
  email: z.string({ required_error: 'Email không được để trống' })
})

export const createUserSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Họ tên phải có ít nhất 3 ký tự' })
    .max(50, { message: 'Họ tên không được vượt quá 50 ký tự' }),
  username: z.string().min(1, { message: 'Tên đăng nhập không được để trống' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  phoneNumber: z
    .string()
    .regex(/^(0|\+84)(3[2-9]|5[6|8|9]|7[06-9]|8[1-5]|9[0-9])[0-9]{7}$/, 'Số điện thoại không hợp lệ'),
  gender: z.enum(genderValues, { errorMap: () => ({ message: 'Giới tính không hợp lệ' }) }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Định dạng ngày sinh không hợp lệ'
  }),
  image: z.string().url({ message: 'Ảnh đại diện phải là một URL hợp lệ' }).optional(),
  address: addressSchema,
  role: z.enum(roleValues, { errorMap: () => ({ message: 'Vai trò không hợp lệ' }) }).optional(),
  accountType: z.enum(accountTypeValues, { errorMap: () => ({ message: 'Loại tài khoản không hợp lệ' }) }).optional(),
  isCreatedBy: z.enum(isCreatedByValues, { errorMap: () => ({ message: 'Nguồn tạo không hợp lệ' }) }).optional(),
  refreshTokenId: z.string().optional(),
  createdBy: createdBySchema.optional(),
  updatedAtBy: updateBySchema.optional(),
  isDeletedBy: deleteBySchema.optional(),
  codeId: z.number().optional(),
  codeExpired: z.string().optional(),
  verified: z.boolean().optional()
})

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
  access_token: z.string()
})

// ✅ Type Inference
export type LoginDto = z.infer<typeof loginSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type SendOtpDto = z.infer<typeof sendOtpSchema>
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>
export type RefreshResponse = z.infer<typeof refreshResponseSchema>
export type CreateUserDto = z.infer<typeof createUserSchema>
