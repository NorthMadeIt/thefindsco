import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-11 rounded-lg border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-muted',
            'focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors',
            error && 'border-ember focus:border-ember focus:ring-ember',
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-ember">{error}</span>}
      </div>
    )
  },
)
Input.displayName = 'Input'
