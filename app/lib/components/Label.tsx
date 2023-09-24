import { cn } from "@lib/utils";
import { type LabelProps, Label as AriaLabel } from "react-aria-components";

const baseClass = "text-sm text-neutral-700";

export default function Label({ className, children, ...props }: LabelProps) {
  return (
    <AriaLabel {...props} className={cn(baseClass, className)}>
      {children}
    </AriaLabel>
  );
}
