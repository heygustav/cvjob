
import React, { useState, useMemo, useCallback } from 'react';
import Icon, { commonIcons, IconName } from '@/components/ui/icon';

// Predefined icon lists for better organization
const STATIC_ICONS = [
  { name: 'dashboard', label: 'Dashboard', component: commonIcons.Dashboard },
  { name: 'document', label: 'Document', component: commonIcons.Document },
  { name: 'user', label: 'User', component: commonIcons.User },
  { name: 'settings', label: 'Settings', component: commonIcons.Settings },
];

// Define dynamic icons with properly typed names
const DYNAMIC_ICONS = [
  { name: 'git-branch' as IconName, label: 'Git Branch' },
  { name: 'database' as IconName, label: 'Database' },
  { name: 'wifi' as IconName, label: 'Wifi' },
  { name: 'zap' as IconName, label: 'Zap' },
];

// Create optimized card component to avoid repeated JSX
const IconCard = React.memo(({ 
  name, 
  label, 
  component: IconComponent, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave,
  isDynamic = false
}: {
  name: string;
  label: string;
  component?: React.FC<any>;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isDynamic?: boolean;
}) => (
  <div 
    className="flex flex-col items-center p-2 border rounded hover:bg-gray-50 transition-colors hover:border-primary"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {isDynamic ? (
      <Icon 
        name={name as IconName} 
        dynamic 
        size={32} 
        className={`${isHovered ? 'text-primary' : 'text-gray-700'} transition-colors`} 
      />
    ) : IconComponent && (
      <IconComponent 
        className={`h-8 w-8 ${isHovered ? 'text-primary' : 'text-gray-700'} transition-colors`} 
      />
    )}
    <span className="mt-2 text-sm font-medium">{label}</span>
  </div>
));

IconCard.displayName = 'IconCard';

const IconDemo: React.FC = () => {
  // Use lazy initialization to avoid work during render
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  
  // Create callback handlers to reduce function creation on renders
  const handleMouseEnter = useCallback((name: string) => {
    setHoveredIcon(name);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setHoveredIcon(null);
  }, []);
  
  // Memoize static icons to prevent unnecessary re-renders
  const staticIconItems = useMemo(() => {
    return STATIC_ICONS.map(icon => (
      <IconCard
        key={icon.name}
        name={icon.name}
        label={icon.label}
        component={icon.component}
        isHovered={hoveredIcon === icon.name}
        onMouseEnter={() => handleMouseEnter(icon.name)}
        onMouseLeave={handleMouseLeave}
      />
    ));
  }, [hoveredIcon, handleMouseEnter, handleMouseLeave]);

  // Memoize dynamic icons to prevent unnecessary re-renders
  const dynamicIconItems = useMemo(() => {
    return DYNAMIC_ICONS.map(icon => (
      <IconCard
        key={icon.name}
        name={icon.name}
        label={icon.label}
        isHovered={hoveredIcon === icon.name}
        onMouseEnter={() => handleMouseEnter(icon.name)}
        onMouseLeave={handleMouseLeave}
        isDynamic
      />
    ));
  }, [hoveredIcon, handleMouseEnter, handleMouseLeave]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      <h2 className="col-span-full text-xl font-semibold mb-4">Static Icons (Fast Load)</h2>
      {staticIconItems}
      
      <h2 className="col-span-full text-xl font-semibold mb-4 mt-6">Dynamic Icons (Lazy Loaded)</h2>
      {dynamicIconItems}
    </div>
  );
};

// Memoize the entire component for optimal rendering performance
export default React.memo(IconDemo);
