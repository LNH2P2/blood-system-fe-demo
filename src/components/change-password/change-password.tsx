'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthContext } from '@/contexts/auth-context'
import { useChangePassword } from '@/hooks/use-api/use-auth'
import { changePasswordSchema } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

export default function ChangePassword({ userId }: { userId: string }) {
  const { logout } = useAuthContext()
  const router = useRouter()
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      userId,
      oldPassword: '',
      newPassword: ''
    }
  })

  const changePassword = useChangePassword()

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePassword.mutateAsync(data)
      toast.success('Đổi mật khẩu thành công')
      logout()
      form.reset()
      router.push('/vi/login')
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Mật khẩu cũ không đúng, không được trùng với mật khẩu cũ')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <Card className='w-full max-w-md border-l-4 border-[#d62828] shadow-md bg-white rounded-xl'>
        <CardHeader>
          <CardTitle className='text-center text-[#d62828] text-2xl font-bold'>Đổi Mật Khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <Input type='password' placeholder='Mật khẩu cũ' {...form.register('oldPassword')} />
              {form.formState.errors.oldPassword && (
                <p className='text-sm text-red-500 mt-1'>{form.formState.errors.oldPassword.message}</p>
              )}
            </div>

            <div>
              <Input type='password' placeholder='Mật khẩu mới' {...form.register('newPassword')} />
              {form.formState.errors.newPassword && (
                <p className='text-sm text-red-500 mt-1'>{form.formState.errors.newPassword.message}</p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full bg-[#d62828] hover:bg-[#bb1f1f] text-white'
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
