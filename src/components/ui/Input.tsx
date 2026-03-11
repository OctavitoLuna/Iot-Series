import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-charcoal/20 bg-white/50 px-4 py-2 text-sm text-charcoal ring-offset-cream file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/30 focus-visible:border-charcoal/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
