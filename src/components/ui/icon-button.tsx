
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label?: string;
  iconPosition?: "left" | "right";
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  iconPosition = "left",
  className,
  children,
  ...props
}) => {
  const content = label ? (
    <span className="flex items-center gap-2">
      {iconPosition === "left" && icon}
      {label}
      {iconPosition === "right" && icon}
    </span>
  ) : (
    icon
  );

  return (
    <Button
      className={cn(
        "flex items-center justify-center",
        !label && "h-8 w-8 p-0",
        className
      )}
      {...props}
    >
      {content}
    </Button>
  );
};

export default IconButton;
