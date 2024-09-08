import { Link as RouterLink, LinkProps } from "react-router-dom";

import { cn } from "@/lib/utils";

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn(
        "rounded-2xl text-blue-400 hover:text-blue-500 bg-slate-200 px-2",
        className,
      )}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
