'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRegister } from '@/hooks/use-api/use-auth'
import { accountTypeValues, isCreatedByValues, roleValues } from '@/types/enum/auth'
import { registerUserSchema } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heart } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useRouter } from '../../../../i18n/navigation'

const schema = registerUserSchema.pick({
  fullName: true,
  username: true,
  email: true,
  password: true,
  phoneNumber: true,
  gender: true,
  dateOfBirth: true,
  address: true
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  const registerMutation = useRegister()

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        role: roleValues[0],
        accountType: accountTypeValues[0],
        isCreatedBy: isCreatedByValues[1]
      }
      const res = await registerMutation.mutateAsync(formattedData)
      if (res) {
        toast.success('Đăng ký thành công! Vui lòng xác thực OTP.')
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`)
      }
    } catch (error) {
      console.error('Error during registration:', error)
      toast.error('Đăng ký không thành công. email hoặc tên đăng nhập và số điện thoại đã được sử dụng.')
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#fef2f2] px-4'>
      <Card className='w-full max-w-3xl shadow-2xl border-none'>
        <CardHeader className='text-center'>
          <div className='w-14 h-14 mx-auto bg-[#d62828] rounded-full flex items-center justify-center'>
            <Heart className='h-6 w-6 text-white' />
          </div>
          <CardTitle className='text-2xl font-bold text-[#d62828] mt-2'>Đăng ký tài khoản</CardTitle>
          <p className='text-sm text-muted-foreground mt-1'>Tham gia cộng đồng hiến máu cứu người ngay hôm nay!</p>
        </CardHeader>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Full Name */}
            <div>
              <Label htmlFor='fullName' className='mb-1'>
                Họ và tên
              </Label>
              <Input id='fullName' {...register('fullName')} placeholder='Nguyễn Văn A' />
              {errors.fullName && <p className='text-sm text-red-500 mt-1'>{errors.fullName.message}</p>}
            </div>

            {/* Username & Email */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='username' className='mb-1'>
                  Tên đăng nhập
                </Label>
                <Input id='username' {...register('username')} placeholder='nguyenvana' />
                {errors.username && <p className='text-sm text-red-500 mt-1'>{errors.username.message}</p>}
              </div>
              <div>
                <Label htmlFor='email' className='mb-1'>
                  Email
                </Label>
                <Input id='email' type='email' {...register('email')} placeholder='abc@gmail.com' />
                {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
              </div>
            </div>

            {/* Password & Phone */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='password' className='mb-1'>
                  Mật khẩu
                </Label>
                <Input id='password' type='password' {...register('password')} placeholder='••••••••' />
                {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor='phoneNumber' className='mb-1'>
                  Số điện thoại
                </Label>
                <Input id='phoneNumber' {...register('phoneNumber')} placeholder='0123456789' />
                {errors.phoneNumber && <p className='text-sm text-red-500 mt-1'>{errors.phoneNumber.message}</p>}
              </div>
            </div>

            {/* Gender & Date of Birth */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='gender' className='mb-1'>
                  Giới tính
                </Label>
                <Select onValueChange={(value) => setValue('gender', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn giới tính' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='male'>Nam</SelectItem>
                    <SelectItem value='female'>Nữ</SelectItem>
                    <SelectItem value='other'>Khác</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className='text-sm text-red-500 mt-1'>{errors.gender.message}</p>}
              </div>
              <div>
                <Label htmlFor='dateOfBirth' className='mb-1'>
                  Ngày sinh
                </Label>
                <Input id='dateOfBirth' type='date' {...register('dateOfBirth')} />
                {errors.dateOfBirth && <p className='text-sm text-red-500 mt-1'>{errors.dateOfBirth.message}</p>}
              </div>
            </div>

            {/* Address */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='street' className='mb-1'>
                  Địa chỉ
                </Label>
                <Input id='street' {...register('address.street')} placeholder='123 Đường ABC' />
                {errors.address?.street && <p className='text-sm text-red-500 mt-1'>{errors.address.street.message}</p>}
              </div>
              <div>
                <Label htmlFor='district' className='mb-1'>
                  Quận/Huyện
                </Label>
                <Input id='district' {...register('address.district')} placeholder='Quận 1' />
                {errors.address?.district && (
                  <p className='text-sm text-red-500 mt-1'>{errors.address?.district.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor='city' className='mb-1'>
                  Thành phố
                </Label>
                <Input id='city' {...register('address.city')} placeholder='TP. Hồ Chí Minh' />
                {errors.address?.city && <p className='text-sm text-red-500 mt-1'>{errors.address?.city.message}</p>}
              </div>
              <div>
                <Label htmlFor='nation' className='mb-1'>
                  Quốc gia
                </Label>
                <Input id='nation' {...register('address.nation')} placeholder='Việt Nam' />
                {errors.address?.nation && (
                  <p className='text-sm text-red-500 mt-1'>{errors.address?.nation.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              disabled={isSubmitting}
              type='submit'
              className='w-full bg-[#d62828] cursor-pointer hover:bg-[#bb1e1e]'
            >
              Đăng ký
            </Button>

            {/* Back to login */}
            <p className='text-center text-sm mt-2'>
              Bạn đã có tài khoản?{' '}
              <button
                type='button'
                onClick={handleLogin}
                className='text-[#d62828] cursor-pointer underline font-medium transition-transform duration-200 ease-in-out hover:scale-105 hover:text-red-700'
              >
                Đăng nhập
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
