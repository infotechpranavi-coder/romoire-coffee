import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-sm border border-espresso/15 bg-cream px-4 py-2 font-body text-base text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-mocha focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mocha/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        suppressHydrationWarning
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
