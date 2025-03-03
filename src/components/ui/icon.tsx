import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

// Import specific icons that we're referencing directly
import { 
  LayoutDashboard, User, FileText, Settings, 
  Plus, Pencil, Trash2, Search, Download,
  CheckCircle, AlertTriangle, XCircle, Info,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  X, Menu, Calendar, Mail, HelpCircle
} from 'lucide-react';

// Loading fallback for dynamic icons
const IconFallback = () => (
  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
);

type IconName = keyof typeof dynamicIconImports;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
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
      const iconName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() as IconName;
      return dynamicIconImports[iconName]().catch(() => {
        console.error(`Icon ${iconName} not found`);
        return { default: HelpCircle };
      });
    });

    return (
      <Suspense fallback={<IconFallback />}>
        <DynamicIcon size={size} {...props} />
      </Suspense>
    );
  }

  // For static imports, we need to manually map the icon name to the imported component
  const staticIcons: Record<string, React.FC<LucideProps>> = {
    LayoutDashboard, User, FileText, Settings, 
    Plus, Pencil, Trash2, Search, Download,
    CheckCircle, AlertTriangle, XCircle, Info,
    ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
    X, Menu, Calendar, Mail, HelpCircle
  };

  const StaticIcon = staticIcons[name] || HelpCircle;
  return <StaticIcon size={size} {...props} />;
};

export default Icon;

// Export commonly used icons for easy access
export const commonIcons = {
  // Dashboard icons
  Dashboard: LayoutDashboard,
  User,
  Document: FileText,
  Settings,
  
  // Action icons
  Plus,
  Edit: Pencil,
  Delete: Trash2,
  Search,
  Download,
  
  // Feedback icons
  Success: CheckCircle,
  Warning: AlertTriangle,
  Error: XCircle,
  Info,
  
  // Navigation icons
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  
  // Other common icons
  Close: X,
  Menu,
  Calendar,
  Mail,
};
