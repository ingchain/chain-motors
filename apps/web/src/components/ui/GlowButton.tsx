import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export default function GlowButton({ label, className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-md border border-chain-500 bg-chain-500 px-4 py-2 font-medium text-white shadow-neon transition hover:bg-blue-700 ${className}`}
    >
      {label}
    </button>
  );
}
