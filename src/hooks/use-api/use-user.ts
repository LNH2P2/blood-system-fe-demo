// hooks/use-user.ts
import { useMutation } from '@tanstack/react-query'

// API tìm kiếm user
const searchUsers = async (qs: string) => {
  const res = await fetch(`http://localhost:3000/api/users?current=1&limit=10&qs=${encodeURIComponent(qs)}`)
  const data = await res.json()
  // Trả về mảng user, fallback [] nếu không có
  return data?.data?.data?.result || []
}

export const useSearchUsers = () => {
  return useMutation({
    mutationFn: (qs: string) => searchUsers(qs)
  })
}
