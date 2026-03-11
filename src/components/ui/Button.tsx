import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "moss" | "terracotta" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-charcoal text-cream hover:bg-charcoal/90 shadow-sm":
              variant === "default",
            "bg-moss text-white hover:bg-moss/90 shadow-sm": variant === "moss",
            "bg-terracotta text-white hover:bg-terracotta/90 shadow-sm":
              variant === "terracotta",
            "border border-charcoal/20 bg-transparent hover:bg-charcoal/5 text-charcoal":
              variant === "outline",
            "hover:bg-charcoal/5 text-charcoal": variant === "ghost",
            "text-charcoal underline-offset-4 hover:underline":
              variant === "link",
            "h-12 px-6 py-2": size === "default",
            "h-9 px-4": size === "sm",
            "h-14 px-8 text-base": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
