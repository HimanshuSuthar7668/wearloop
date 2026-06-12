import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-body font-medium rounded transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Variants
            "bg-rose text-charcoal hover:bg-rose-dark active:scale-[0.98]":
              variant === "primary",
            "bg-parchment/10 text-parchment hover:bg-parchment/20 border border-parchment/20 hover:border-parchment/40":
              variant === "secondary",
            "text-parchment/70 hover:text-parchment hover:bg-parchment/5":
              variant === "ghost",
            "border border-parchment/30 text-parchment hover:border-parchment hover:bg-parchment/5":
              variant === "outline",
            // Sizes
            "text-xs px-3 py-1.5": size === "sm",
            "text-sm px-5 py-2.5": size === "md",
            "text-base px-7 py-3.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
