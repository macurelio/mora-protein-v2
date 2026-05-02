import React from 'react'

const VARIANTS = {
  primary:
    'bg-charcoal text-white hover:bg-cocoa active:bg-cocoa/90 shadow-md hover:shadow-lg',
  secondary:
    'bg-mora text-white hover:bg-mora-dark active:bg-mora-dark/90 shadow-md hover:shadow-lg',
  outline:
    'border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white',
  ghost: 'text-charcoal hover:bg-cream-warm active:bg-cream-border',
  whatsapp:
    'bg-[#25D366] text-white hover:bg-[#1da851] active:bg-[#189a4a] shadow-md hover:shadow-lg',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
}

/**
 * Reusable button component.
 *
 * @param {'primary'|'secondary'|'outline'|'ghost'|'whatsapp'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Tag = 'button',
  ...props
}) {
  return (
    <Tag
      className={[
        'inline-flex items-center justify-center font-heading font-700 rounded-xl',
        'transition-all duration-200 ease-out cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </Tag>
  )
}
