'use client'

import { useEffect } from 'react'
import { useRouter } from '../../i18n/navigation'
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import HomePage from './home/HomePage'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard
    // router.push('/dashboard')
    router.push('/')
  }, [router])

  return (
    // <div className='flex items-center justify-center min-h-screen'>
    //   <div className='text-center'>
    //     <h1 className='text-2xl font-bold mb-4'>Đang chuyển hướng...</h1>
    //     <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto'></div>
    //   </div>
    // </div>
    <div className='bg-[#F9F9F9] min-h-screen'>
      <AppHeader activeMenu='home' showNotifications={false} setShowNotifications={() => { }} />
      {/* <HeroSection />
      <WhyDonate />
      <HowItWorks />
      <CallToAction /> */}
      <HomePage />
      <AppFooter />
    </div>
  )
}
