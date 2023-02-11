import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
  primary:
    "border-transparent bg-indigo-600 text-white enabled:hover:bg-indigo-700",
  secondary: "border-gray-300 bg-white text-gray-700 enabled:hover:bg-gray-50",
  danger:
    "border-transparent bg-red-600 text-white enabled:hover:bg-red-700 focus:ring-red-500",
};

export const Button = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & {
    variant?: keyof typeof variants;
  }
>(({ variant = "primary", children, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className={twMerge(
        "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50",
        variants[variant],
        props.className,
      )}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
