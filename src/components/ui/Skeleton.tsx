import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
  style?: CSSProperties;
}

export default function Skeleton({ className = "", variant = "rect", style }: SkeletonProps) {
  const base = "shimmer";
  const variants = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4",
  };
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}
