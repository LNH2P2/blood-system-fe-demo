'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResendOtp, useVerifyOtp } from '@/hooks/use-api/use-auth'
import { verifyOtpSchema } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = verifyOtpSchema
type FormData = z.infer<typeof schema>

export default function VerifyOtp() {
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get('email') ?? ''
  const router = useRouter()
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown === 0) return

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldown])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailFromQuery
    }
  })
  const verifyOtpMutation = useVerifyOtp()
  const resendOtpMutation = useResendOtp()
  const onSubmit = async (data: FormData) => {
    try {
      await verifyOtpMutation.mutateAsync(data)
      toast.success('Xác minh thành công! Bạn có thể đăng nhập.')
      // Có thể chuyển sang trang đăng nhập tại đây nếu muốn
      router.push('/v1/login')
    } catch (error) {
      console.log('Error during OTP verification:', error)
      toast.error('Xác minh thất bại. Vui lòng kiểm tra mã OTP.')
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return

    try {
      await resendOtpMutation.mutateAsync(emailFromQuery)
      toast.success('Mã OTP mới đã được gửi lại.')
      setCooldown(30)
    } catch {
      toast.error('Không thể gửi lại OTP.')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#fef2f2] px-4'>
      <Card className='w-full max-w-md shadow-2xl border-none'>
        <CardHeader className='text-center'>
          <div className='w-14 h-14 mx-auto bg-[#d62828] rounded-full flex items-center justify-center'>
            <span className='text-white text-2xl font-bold'>🔐</span>
          </div>
          <CardTitle className='text-2xl font-bold text-[#d62828] mt-2'>Xác minh OTP</CardTitle>
          <p className='text-sm text-muted-foreground mt-1'>Vui lòng nhập mã OTP được gửi qua email của bạn.</p>
        </CardHeader>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Label htmlFor='email' className='mb-1'>
                Email
              </Label>
              <Input id='email' {...register('email')} disabled className='bg-gray-100 text-gray-600' />
            </div>

            <div>
              <Label htmlFor='otp' className='mb-1'>
                Mã OTP
              </Label>
              <Input id='otp' type='number' placeholder='Nhập mã OTP' {...register('otp', { valueAsNumber: true })} />
              {errors.otp && <p className='text-sm text-red-500 mt-1'>{errors.otp.message}</p>}
            </div>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-[#d62828] hover:bg-[#bb1e1e] transition-colors duration-200'
            >
              Xác minh
            </Button>

            <p className='text-center text-sm mt-2'>
              Không nhận được mã?{' '}
              <button
                type='button'
                onClick={handleResend}
                disabled={cooldown > 0}
                className={`${
                  cooldown > 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[#d62828] cursor-pointer hover:scale-105 hover:text-red-700'
                } underline font-medium transition duration-200`}
              >
                {cooldown > 0 ? `Gửi lại (${cooldown}s)` : 'Gửi lại'}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
