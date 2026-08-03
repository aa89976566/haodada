import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Adapted from ekmas/neobrutalism-components (MIT) — same source published on
 * 21st.dev as @ekmas/components/button. Themed for haodada night-market palette.
 */
const brutalButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-sm font-bold uppercase tracking-wide transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-[3px] border-black",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--yellow)] text-[var(--red)] shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        coral:
          "bg-[var(--red)] text-white shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        ink: "bg-black text-[var(--yellow)] shadow-[4px_4px_0_0_var(--red)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        reverse:
          "bg-[var(--yellow)] text-[var(--red)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#000]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-6 text-lg w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type BrutalButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof brutalButtonVariants> & {
    asChild?: boolean;
  };

export function BrutalButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: BrutalButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="brutal-button"
      className={cn(brutalButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { brutalButtonVariants };
