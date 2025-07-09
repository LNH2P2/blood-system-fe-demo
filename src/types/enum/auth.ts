// Tạo const array cho reuse
export const genderValues = ['male', 'female', 'other'] as const;
export type Gender = typeof genderValues[number];

// Tương tự cho các enum khác
export const roleValues = ['member', 'staff', 'admin'] as const;
export type UserRole = typeof roleValues[number];

export const accountTypeValues = ['local', 'google', 'facebook', 'email', 'phone', 'apple', 'other'] as const;
export type AccountType = typeof accountTypeValues[number];

export const isCreatedByValues = ['system', 'self'] as const;
export type IsCreatedBy = typeof isCreatedByValues[number];
