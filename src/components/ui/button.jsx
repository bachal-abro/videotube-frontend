import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    "youtube-subscribe": "btn-youtube-subscribe", // Use the CSS class
    "secondary-enhanced": "btn-secondary-enhanced", // Enhanced secondary style
};

const buttonSizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-9 w-9 p-0",
};

const Button = forwardRef(
    (
        {
            className,
            variant = "default",
            size = "default",
            asChild = false,
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? "div" : "button";

        return (
            <Comp
                className={cn(
                    // Base button styles
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    // Apply variant styles
                    buttonVariants[variant] || buttonVariants.default,
                    // Apply size styles
                    buttonSizes[size] || buttonSizes.default,
                    // Custom className
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
