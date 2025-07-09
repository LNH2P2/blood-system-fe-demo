'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPassword, useSendOtpResetPassword } from '@/hooks/use-api/use-auth'
import { resetPasswordSchema, sendOtpSchema } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type StepOneDto = z.infer<typeof sendOtpSchema>
type StepTwoDto = z.infer<typeof resetPasswordSchema>

export default function ForgotPassword() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const emailFromUrl = searchParams.get('email') || ''
  const isStepTwo = !!emailFromUrl

  const sendOtpMutation = useSendOtpResetPassword()
  const resetPasswordMutation = useResetPassword()

  useEffect(() => {
    if (resendCooldown === 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Step 1: Gửi OTP
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<StepOneDto>({
    resolver: zodResolver(sendOtpSchema)
  })

  // Step 2: Đặt lại mật khẩu
  const {
    register: registerStep2,
    watch,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2, isSubmitting: isSubmittingStep2 }
  } = useForm<StepTwoDto>({
    resolver: zodResolver(resetPasswordSchema)
  })

  useEffect(() => {
    if (emailFromUrl) {
      reset({ email: emailFromUrl })
    }
  }, [emailFromUrl, reset])

  const handleSendOtp = async (data: StepOneDto) => {
    try {
      await sendOtpMutation.mutateAsync(data.email)
      toast.success('Đã gửi mã OTP đến email của bạn.')
      router.push(`/vi/forgot-password?email=${encodeURIComponent(data.email)}`)
    } catch {
      toast.error('Không thể gửi OTP. Vui lòng thử lại.')
    }
  }

  const handleResetPassword = async (data: StepTwoDto) => {
    try {
      await resetPasswordMutation.mutateAsync({ ...data, email: emailFromUrl })
      toast.success('Đặt lại mật khẩu thành công!')
      router.push('/vi/login')
    } catch {
      toast.error('Đặt lại mật khẩu thất bại.')
    }
  }

  const handleLogin = () => {
    router.push('/vi/login')
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#fef2f2] px-4'>
      <Card className='w-full max-w-md shadow-2xl border-none'>
        <CardHeader className='text-center'>
          <div className='w-14 h-14 mx-auto bg-[#d62828] rounded-full flex items-center justify-center'>
            <span className='text-white text-2xl font-bold'>{!isStepTwo ? '🛡️' : '🗝️ '} </span>
          </div>
          <CardTitle className='text-2xl font-bold text-[#d62828] mt-2'>
            {!isStepTwo ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
          </CardTitle>
          <p className='text-sm text-muted-foreground mt-1'>
            {!isStepTwo ? 'Vui lòng nhập Email để xác thực' : 'Vui lòng nhập mã OTP và mật khẩu mới của bạn.'}
          </p>
        </CardHeader>
        <CardContent>
          {!isStepTwo ? (
            <form onSubmit={handleSubmit(handleSendOtp)} className='space-y-5'>
              <div>
                <Label htmlFor='email' className='mb-1'>
                  Email
                </Label>
                <Input id='email' type='email' {...register('email')} placeholder='email@example.com' />
                {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
              </div>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-[#d62828] cursor-pointer hover:bg-[#bb1e1e] text-white font-semibold'
              >
                Gửi OTP
              </Button>
              <p className='text-center text-sm'>
                Chuyển về đăng nhập?{' '}
                <button
                  type='button'
                  onClick={handleLogin}
                  className='text-[#d62828] cursor-pointer underline font-medium transition-transform duration-200 ease-in-out hover:scale-105 hover:text-red-700'
                >
                  Đăng Nhập
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmitStep2(handleResetPassword)} className='space-y-5'>
              <input type='hidden' value={emailFromUrl as string} {...registerStep2('email')} />
              <div>
                <Label htmlFor='otp' className='mb-1'>
                  Mã OTP
                </Label>
                <Input
                  id='otp'
                  type='number'
                  {...registerStep2('otp', { valueAsNumber: true })}
                  placeholder='Nhập mã OTP'
                />
                {errorsStep2.otp && <p className='text-sm text-red-500 mt-1'>{errorsStep2.otp.message}</p>}
              </div>
              <div className='flex justify-end m-0'>
                {isSendingOtp || resendCooldown > 0 ? (
                  <span className='text-sm text-gray-500'>Gửi lại sau {resendCooldown}s</span>
                ) : (
                  <button
                    type='button'
                    onClick={async () => {
                      setIsSendingOtp(true)
                      try {
                        await sendOtpMutation.mutateAsync(emailFromUrl)
                        toast.success('OTP mới đã được gửi!')
                        setResendCooldown(15) // Bắt đầu đếm ngược 15s
                      } catch {
                        toast.error('Gửi lại OTP thất bại!')
                      } finally {
                        setIsSendingOtp(false)
                      }
                    }}
                    className='text-sm text-[#d62828] cursor-pointer hover:underline'
                  >
                    Gửi lại mã
                  </button>
                )}
              </div>

              <div>
                <Label htmlFor='newPassword' className='mb-1'>
                  Mật khẩu mới
                </Label>
                <Input id='newPassword' type='password' {...registerStep2('newPassword')} placeholder='••••••••' />
                {errorsStep2.newPassword && (
                  <p className='text-sm text-red-500 mt-1'>{errorsStep2.newPassword.message}</p>
                )}
              </div>

              <Button
                type='submit'
                disabled={isSubmittingStep2}
                className='w-full bg-[#d62828] cursor-pointer hover:bg-[#bb1e1e] text-white font-semibold'
              >
                Xác nhận
              </Button>
              <p className='text-center text-sm'>
                Chuyển về đăng nhập?{' '}
                <button
                  type='button'
                  onClick={handleLogin}
                  className='text-[#d62828] cursor-pointer underline font-medium transition-transform duration-200 ease-in-out hover:scale-105 hover:text-red-700'
                >
                  Đăng Nhập
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
