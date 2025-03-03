
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  title?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  title,
  className,
  children,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "flex items-center justify-center",
        !children && "h-8 w-8 p-0",
        className
      )}
      title={title}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
};

export default IconButton;
