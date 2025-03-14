
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
  // When using asChild, we need to make sure we're passing the icon as a prop to the child
  if (props.asChild && children) {
    // Clone the child element and add the icon
    const child = React.Children.only(children as React.ReactElement);
    return React.cloneElement(child, {
      ...props,
      className: cn(
        "flex items-center gap-2",
        className,
        child.props.className
      ),
      title,
      children: (
        <>
          {icon}
          {child.props.children}
        </>
      ),
    });
  }

  // Regular button with icon
  return (
    <Button
      className={cn(
        "flex items-center justify-center gap-2",
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
