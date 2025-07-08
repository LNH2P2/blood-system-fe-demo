'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthContext } from '@/contexts/auth-context'
import { useLogin } from '@/hooks/use-api/use-auth'
import detectDevice from '@/lib/detect-device'
import { loginSchema } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = loginSchema
type FormData = z.infer<typeof schema>

export default function Login() {
  const route = useRouter()
  const { login } = useAuthContext()
  const deviceInfo = detectDevice()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      deviceInfo: deviceInfo
    }
  })

  const loginMutation = useLogin()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginMutation.mutateAsync(data)
      if (res) {
        const { access_token, refresh_token } = res.payload.data
        login(access_token, refresh_token)
        toast.success('Đăng nhập thành công!')
        route.push('/vi/dashboard')
      }
    } catch (error) {
      console.log('Login error:', error)
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.')
    }
  }

  const handleRegister = () => {
    route.push('/vi/register')
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#fef2f2] px-4'>
      <Card className='w-full max-w-md shadow-2xl border-none'>
        <CardHeader className='text-center'>
          <div className='w-14 h-14 mx-auto bg-[#d62828] rounded-full flex items-center justify-center'>
            <Heart className='h-6 w-6 text-white' />
          </div>
          <CardTitle className='text-2xl font-bold text-[#d62828] mt-2'>Đăng nhập vào BloodCare</CardTitle>
          <p className='text-sm text-muted-foreground mt-1'>Quản lý hệ thống hiến máu dễ dàng và nhanh chóng</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Username */}
            <div>
              <Label htmlFor='username' className='mb-1'>
                Tên đăng nhập
              </Label>
              <Input id='username' placeholder='Tên đăng nhập' {...register('username')} />
              {errors.username && <p className='text-sm text-red-500 mt-1'>{errors.username.message}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor='password' className='mb-1'>
                Mật khẩu
              </Label>
              <Input id='password' type='password' placeholder='••••••••' {...register('password')} />
              {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password.message}</p>}
              <div className='text-right mt-1'>
                <button
                  type='button'
                  onClick={() => route.push('/vi/forgot-password')}
                  className='text-[#d62828] cursor-pointer underline transition-transform duration-200 ease-in-out hover:scale-105 hover:text-red-700'
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            <input type='hidden' {...register('deviceInfo')} />

            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-[#d62828] hover:bg-[#bb1e1e] text-white font-semibold'
            >
              Đăng nhập
            </Button>

            <p className='text-center text-sm'>
              Bạn chưa có tài khoản?{' '}
              <button
                type='button'
                onClick={handleRegister}
                className='text-[#d62828] cursor-pointer underline font-medium transition-transform duration-200 ease-in-out hover:scale-105 hover:text-red-700'
              >
                Đăng ký
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
