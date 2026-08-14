import { z } from 'zod'

export const checkoutSchema = z.object({
  email: z.string().email('Enter a valid email'),
  fullName: z.string().min(2, 'Enter your full name'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  address1: z.string().min(3, 'Enter your street address'),
  address2: z.string().optional(),
  city: z.string().min(2, 'Enter your city'),
  region: z.string().min(2, 'Enter your state/region'),
  postalCode: z.string().min(3, 'Enter a valid postal code'),
  country: z.string().min(2, 'Enter your country'),
})
export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export const authSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type AuthFormValues = z.infer<typeof authSchema>
