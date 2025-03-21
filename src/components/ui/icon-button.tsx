
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
        "flex items-center gap-2 transition-colors",
        className,
        child.props.className
      ),
      title,
      "aria-label": title || typeof children === 'string' ? children : undefined,
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
        "flex items-center justify-center gap-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none",
        !children && "h-9 w-9 p-0",
        className
      )}
      title={title}
      aria-label={title || typeof children === 'string' ? children : undefined}
      {...props}
    >
      {/* If it's an icon-only button, add aria-hidden to the icon */}
      {!children ? React.cloneElement(icon as React.ReactElement, { "aria-hidden": "true" }) : icon}
      {children}
    </Button>
  );
};

export default IconButton;
