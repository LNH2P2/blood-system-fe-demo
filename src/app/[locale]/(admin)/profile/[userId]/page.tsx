import UserProfile from '@/components/profile/profile'
import React from 'react'

interface PageProps {
  params: {
    userId: string
  }
}

function page({ params }: PageProps) {
  const { userId } = params

  return (
    <>
      <UserProfile userId={userId} />
    </>
  )
}

export default page
