import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export default function GlowButton({ label, className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-md border border-chain-500 bg-chain-500/20 px-4 py-2 font-medium text-chain-50 shadow-neon transition hover:bg-chain-500/35 ${className}`}
    >
      {label}
    </button>
  );
}
