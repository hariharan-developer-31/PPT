import type { HTMLAttributes, PropsWithChildren } from 'react'

type LiquidGlassProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function LiquidGlass({ className = '', children, ...props }: LiquidGlassProps) {
  return (
    <div className={`liquid-glass ${className}`} {...props}>
      {children}
    </div>
  )
}
