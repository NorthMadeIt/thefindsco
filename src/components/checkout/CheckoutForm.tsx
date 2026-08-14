import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutFormValues } from '@/lib/validation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface Props {
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>
  loading?: boolean
}

export default function CheckoutForm({ onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'US',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Full name" {...register('fullName')} error={errors.fullName?.message} />
      <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
      <Input label="Address" {...register('address1')} error={errors.address1?.message} />
      <Input label="Apartment, suite, etc. (optional)" {...register('address2')} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="City" {...register('city')} error={errors.city?.message} />
        <Input label="State / Region" {...register('region')} error={errors.region?.message} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Postal code" {...register('postalCode')} error={errors.postalCode?.message} />
        <Input label="Country" {...register('country')} error={errors.country?.message} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Placing order…' : 'Place order'}
      </Button>
    </form>
  )
}
