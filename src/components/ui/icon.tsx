
import React, { lazy, Suspense, useMemo } from 'react';
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
const IconFallback = React.memo(() => (
  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
));

// Export the IconName type for use in other components
export type IconName = keyof typeof dynamicIconImports;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
  dynamic?: boolean;
}

/**
 * Optimized Icon component that supports both static and dynamic loading
 * - Static loading: imports icons at build time (better for frequently used icons)
 * - Dynamic loading: imports icons at runtime (better for rarely used icons)
 */
const Icon = React.memo(({ name, dynamic = false, size = 24, ...props }: IconProps) => {
  // Use dynamic import for on-demand loading
  if (dynamic) {
    // Memoize the dynamic icon component to prevent unnecessary re-renders
    const DynamicIcon = useMemo(() => {
      return lazy(() => {
        // Handle both kebab case and PascalCase icon names for better developer experience
        const iconName = (typeof name === 'string' ? 
          name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() : 
          name) as IconName;
          
        return dynamicIconImports[iconName]()
          .catch((error) => {
            console.error(`Failed to load icon "${iconName}":`, error);
            return { default: HelpCircle };
          });
      });
    }, [name]);

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

  // Find icon by name (try both the direct name and lowercase version)
  const StaticIcon = staticIcons[name] || staticIcons[name.toLowerCase()] || HelpCircle;
  
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
