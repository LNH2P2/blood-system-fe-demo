// File: src/apis/user.api.ts
import http from '@/lib/http'
import { ResponseDto } from '@/types/common'
import {
  CreateAddressDto,
  CreateUserDto,
  UpdateAddressDto,
  UpdateUserDto,
  UserApiResponse,
  UserResponse,
  UsersListResponse
} from '@/types/user'

// ---------------------------- USERS ----------------------------
const BASE_PATH = '/users'
const BASE_ADDRESS_PATH = `addresses`
// Create a new user
export const createUser = (data: CreateUserDto) => {
  return http.post<{ message: string }>(`${BASE_PATH}`, data)
}

// Get all users with pagination and optional search (qs)
export const getAllUsers = (params: { current?: number; limit?: number; qs?: string }) => {
  const query = new URLSearchParams(params as any).toString()
  return http.get<UsersListResponse>(`${BASE_PATH}?${query}`)
}

// Get user by ID
export const getUserById = (id: string) => {
  return http.get<UserApiResponse>(`${BASE_PATH}/${id}`)
}

// Update user (not password)
export const updateUser = (id: string, data: UpdateUserDto) => {
  return http.patch<ResponseDto>(`${BASE_PATH}/${id}`, data)
}

// Delete user (soft delete)
export const deleteUser = (id: string) => {
  return http.delete<ResponseDto>(`${BASE_PATH}/${id}`)
}

// -------------------------- ADDRESSES --------------------------

// Add address to user
export const createUserAddress = (userId: string, data: CreateAddressDto) => {
  return http.post(`${BASE_PATH}/${userId}/${BASE_ADDRESS_PATH}`, data)
}

// Update address of a user
export const updateUserAddress = (userId: string, addressId: string, data: UpdateAddressDto) => {
  return http.patch<ResponseDto>(`${BASE_PATH}/${userId}/${BASE_ADDRESS_PATH}/${addressId}`, data)
}

// Delete address from user
export const deleteUserAddress = (userId: string, addressId: string) => {
  return http.delete<ResponseDto>(`${BASE_PATH}/${userId}/${BASE_ADDRESS_PATH}/${addressId}`)
}
