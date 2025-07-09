import ChangePassword from '@/components/change-password/change-password'

interface PageProps {
  params: {
    userId: string
  }
}
function page({ params }: PageProps) {
  const { userId } = params
  return (
    <>
      <ChangePassword userId={userId} />
    </>
  )
}

export default page
