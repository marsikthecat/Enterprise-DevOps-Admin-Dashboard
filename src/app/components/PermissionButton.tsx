import type { ComponentProps } from "react";
import { usePermissions } from "../hooks/usePermissions";
import { Tooltip, TooltipContent, TooltipTrigger } from "../common/ui/tooltip";

interface PermissionButtonProps extends ComponentProps<"button"> {
  permission: string;
}

export function PermissionButton({ permission, disabled, children, ...props }: PermissionButtonProps) {
  const { role, can } = usePermissions();
  const permitted = can(permission);
  const isDisabled = disabled || !permitted;

  const button = (
    <button {...props} disabled={isDisabled}>
      {children}
    </button>
  );

  if (permitted) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-not-allowed">{button}</span>
      </TooltipTrigger>
      <TooltipContent>
        Action not supported for role {role ?? "Unknown"}
      </TooltipContent>
    </Tooltip>
  );
}