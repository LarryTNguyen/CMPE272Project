// components/ui/button.jsx
import React from "react";

const cx = (...a) => a.filter(Boolean).join(" ");

const base =
  "inline-flex items-center justify-center rounded-2xl text-sm font-medium " +
  "transition focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  default: "bg-black text-white hover:opacity-90",
  outline: "border bg-background hover:bg-muted/40",
  ghost: "hover:bg-muted/40",
  destructive: "bg-red-600 text-white hover:opacity-90",
};

const sizes = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-5 text-base",
};

export function Button({ variant = "default", size = "md", className = "", ...props }) {
  return (
    <button
      className={cx(base, variants[variant] || variants.default, sizes[size] || sizes.md, className)}
      {...props}
    />
  );
}
