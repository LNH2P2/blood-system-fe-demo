// hooks/use-user.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress
} from '@/apis/user.api'
import { CreateUserDto, UpdateUserDto, CreateAddressDto, UpdateAddressDto } from '@/types/user'

// API search user
const searchUsers = async (qs: string) => {
  const res = await fetch(`http://localhost:3000/api/users?current=1&limit=10&qs=${encodeURIComponent(qs)}`)
  const data = await res.json()
  return data?.data?.data?.result || []
}

export const useSearchUsers = () => {
  return useMutation({
    mutationFn: (qs: string) => searchUsers(qs)
  })
}

// // ------------- USERS -------------

export const useGetAllUsers = (params: { current?: number; limit?: number; qs?: string }) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getAllUsers(params)
  })
}

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserDto) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserDto) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

// ------------- ADDRESSES -------------

export const useCreateUserAddress = (userId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAddressDto) => createUserAddress(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    }
  })
}

export const useUpdateUserAddress = (userId: string, addressId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAddressDto) => updateUserAddress(userId, addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    }
  })
}

export const useDeleteUserAddress = (userId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (addressId: string) => deleteUserAddress(userId, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    }
  })
}
