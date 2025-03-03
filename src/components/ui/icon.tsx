import React, { lazy, Suspense, useMemo, memo } from 'react';
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

// Create a more performant loading fallback with memo
const IconFallback = memo(() => (
  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
));

// Export the IconName type for use in other components
export type IconName = keyof typeof dynamicIconImports;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName | string;
  dynamic?: boolean;
}

// Pre-define static icons for immediate use without dynamic imports
const staticIconsMap = {
  LayoutDashboard, User, FileText, Settings, 
  Plus, Pencil, Trash2, Search, Download,
  CheckCircle, AlertTriangle, XCircle, Info,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  X, Menu, Calendar, Mail, HelpCircle,
  // Add aliases for common icons to support both pascal case and kebab case
  dashboard: LayoutDashboard,
  user: User,
  document: FileText,
  settings: Settings,
  plus: Plus,
  edit: Pencil,
  delete: Trash2,
  search: Search,
  download: Download,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  close: X,
  menu: Menu,
  calendar: Calendar,
  mail: Mail,
  help: HelpCircle
};

/**
 * Optimized Icon component that supports both static and dynamic loading
 * - Static loading: imports icons at build time (better for frequently used icons)
 * - Dynamic loading: imports icons at runtime (better for rarely used icons)
 */
const Icon = memo(({ name, dynamic = false, size = 24, ...props }: IconProps) => {
  // Convert PascalCase to kebab-case for consistent name handling
  const normalizedName = useMemo(() => {
    return typeof name === 'string' 
      ? name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() 
      : name;
  }, [name]);

  // Use dynamic import for on-demand loading
  if (dynamic) {
    // Memoize the dynamic icon component to prevent unnecessary re-renders
    const DynamicIcon = useMemo(() => {
      return lazy(() => {
        const iconName = normalizedName as IconName;
          
        return dynamicIconImports[iconName]()
          .catch((error) => {
            console.error(`Failed to load icon "${iconName}":`, error);
            return { default: HelpCircle };
          });
      });
    }, [normalizedName]);

    return (
      <Suspense fallback={<IconFallback />}>
        <DynamicIcon size={size} {...props} />
      </Suspense>
    );
  }

  // For static imports, use the pre-defined icon map
  const StaticIcon = staticIconsMap[name] || staticIconsMap[normalizedName] || HelpCircle;
  
  return <StaticIcon size={size} {...props} />;
});

// DisplayName for better debugging
Icon.displayName = 'Icon';

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
