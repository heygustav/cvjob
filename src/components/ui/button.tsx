import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-border",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary-800 active:scale-[0.98] active:shadow-inner focus:ring-2 focus-visible:ring-offset-2",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive-900 active:scale-[0.98] active:shadow-inner focus:ring-2 focus-visible:ring-offset-2",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-[0.98] active:shadow-inner focus:ring-2 focus-visible:ring-offset-2",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 active:scale-[0.98] active:shadow-inner focus:ring-2 focus-visible:ring-offset-2",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-[0.98] focus:ring-2 focus-visible:ring-offset-2",
        link: "text-primary underline-offset-4 hover:underline focus:ring-2 focus-visible:ring-offset-2 border-transparent",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 active:scale-[0.98] active:shadow-inner focus:ring-2 focus-visible:ring-offset-2",
        warning: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 active:scale-[0.98] active:shadow-inner focus:ring-2 focus-visible:ring-offset-2",
        info: "bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 active:scale-[0.98] active:shadow-inner focus:ring-2 focus-visible:ring-offset-2",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[40px]",
        sm: "h-9 rounded-md px-3 min-h-[36px]",
        lg: "h-11 rounded-md px-8 min-h-[44px]",
        icon: "h-10 w-10 min-h-[40px] min-w-[40px]",
      },
      mobileFriendly: {
        true: "sm:h-10 h-11 sm:py-2 py-3 sm:px-4 px-5 min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  mobileFriendly?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, loadingText, mobileFriendly, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const isDisabled = disabled || isLoading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, mobileFriendly, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
