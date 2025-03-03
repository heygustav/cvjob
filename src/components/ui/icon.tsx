import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import { icons } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

// Loading fallback for dynamic icons
const IconFallback = () => (
  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
);

type IconName = keyof typeof icons;
type DynamicIconName = keyof typeof dynamicIconImports;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName | DynamicIconName;
  dynamic?: boolean;
}

/**
 * Optimized Icon component that supports both static and dynamic loading
 * - Static loading: imports icons at build time (better for frequently used icons)
 * - Dynamic loading: imports icons at runtime (better for rarely used icons)
 */
const Icon = ({ name, dynamic = false, size = 24, ...props }: IconProps) => {
  // Use dynamic import for on-demand loading
  if (dynamic) {
    const DynamicIcon = lazy(() => {
      // Type assertion to ensure name is treated as a key of dynamicIconImports
      const iconName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() as DynamicIconName;
      return dynamicIconImports[iconName]().catch(() => {
        console.error(`Icon ${iconName} not found`);
        return { default: icons.HelpCircle };
      });
    });

    return (
      <Suspense fallback={<IconFallback />}>
        <DynamicIcon size={size} {...props} />
      </Suspense>
    );
  }

  // Use static import for common icons (better performance)
  const StaticIcon = icons[name as IconName] || icons.HelpCircle;
  return <StaticIcon size={size} {...props} />;
};

export default Icon;

// Export commonly used icons for easy access
export const commonIcons = {
  // Dashboard icons
  Dashboard: icons.LayoutDashboard,
  User: icons.User,
  Document: icons.FileText,
  Settings: icons.Settings,
  
  // Action icons
  Plus: icons.Plus,
  Edit: icons.Pencil,
  Delete: icons.Trash2,
  Search: icons.Search,
  Download: icons.Download,
  
  // Feedback icons
  Success: icons.CheckCircle,
  Warning: icons.AlertTriangle,
  Error: icons.XCircle,
  Info: icons.Info,
  
  // Navigation icons
  ChevronRight: icons.ChevronRight,
  ChevronLeft: icons.ChevronLeft,
  ChevronUp: icons.ChevronUp,
  ChevronDown: icons.ChevronDown,
  
  // Other common icons
  Close: icons.X,
  Menu: icons.Menu,
  Calendar: icons.Calendar,
  Mail: icons.Mail,
};
