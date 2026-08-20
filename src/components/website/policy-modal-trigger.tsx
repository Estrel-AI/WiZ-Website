"use client";

import { ButtonHTMLAttributes } from "react";
import { PolicyKey } from "@/src/components/website/policy-content";
import { usePolicyModal } from "@/src/components/website/policy-modal-provider";

type PolicyModalTriggerProps = {
  policy: PolicyKey;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export default function PolicyModalTrigger({
  policy,
  children,
  className,
  onClick,
  ...props
}: PolicyModalTriggerProps) {
  const { openPolicy } = usePolicyModal();

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          openPolicy(policy);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}
