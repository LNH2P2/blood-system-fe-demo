import { z } from 'zod'
import { accountTypeValues, genderValues, isCreatedByValues, roleValues } from './enum/auth'

export const addressSchema = z.object({
  street: z.string().min(1, { message: 'Vui lòng nhập tên đường' }),
  district: z.string().min(1, { message: 'Vui lòng nhập quận/huyện' }),
  city: z.string().min(1, { message: 'Vui lòng nhập thành phố' }),
  nation: z.string().min(1, { message: 'Vui lòng nhập quốc gia' })
})

export const updateAddressSchema = z.object({
  street: z.string().min(1, { message: 'Tên đường không được để trống' }).optional(),
  district: z.string().min(1, { message: 'Quận/huyện không được để trống' }).optional(),
  city: z.string().min(1, { message: 'Thành phố không được để trống' }).optional(),
  nation: z.string().min(1, { message: 'Quốc gia không được để trống' }).optional()
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

export const updateUserSchema = createUserSchema.partial()

export const userResponseSchema = createUserSchema.omit({ password: true }).extend({
  _id: z.string()
})

export const userListResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    meta: z.object({
      current: z.number(),
      limit: z.number(),
      pages: z.number(),
      total: z.number()
    }),
    result: z.array(userResponseSchema)
  })
})

export type AddressDto = z.infer<typeof addressSchema>
export type CreateAddressDto = z.infer<typeof addressSchema>
export type UpdateAddressDto = z.infer<typeof updateAddressSchema>
export type CreateUserDto = z.infer<typeof createUserSchema>
export type UpdateUserDto = z.infer<typeof updateUserSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
export type UsersListResponse = z.infer<typeof userListResponseSchema>
