
import React, { useState, useMemo } from 'react';
import Icon, { commonIcons } from '@/components/ui/icon';

// Predefined icon lists for better organization
const STATIC_ICONS = [
  { name: 'dashboard', label: 'Dashboard', component: commonIcons.Dashboard },
  { name: 'document', label: 'Document', component: commonIcons.Document },
  { name: 'user', label: 'User', component: commonIcons.User },
  { name: 'settings', label: 'Settings', component: commonIcons.Settings },
];

const DYNAMIC_ICONS = [
  { name: 'git-branch', label: 'Git Branch' },
  { name: 'database', label: 'Database' },
  { name: 'wifi', label: 'Wifi' },
  { name: 'zap', label: 'Zap' },
];

const IconDemo: React.FC = () => {
  // Use lazy initialization to avoid work during render
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  
  // Memorize static icons to prevent unnecessary rerenders
  const staticIconItems = useMemo(() => {
    return STATIC_ICONS.map(icon => (
      <div 
        key={icon.name}
        className="flex flex-col items-center p-2 border rounded hover:border-primary transition-colors"
        onMouseEnter={() => setHoveredIcon(icon.name)}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <icon.component 
          className={`h-8 w-8 ${hoveredIcon === icon.name ? 'text-primary-foreground' : 'text-primary'} transition-colors`} 
        />
        <span className="mt-2 text-sm">{icon.label}</span>
      </div>
    ));
  }, [hoveredIcon]);

  // Memorize dynamic icons to prevent unnecessary rerenders
  const dynamicIconItems = useMemo(() => {
    return DYNAMIC_ICONS.map(icon => (
      <div 
        key={icon.name}
        className="flex flex-col items-center p-2 border rounded hover:border-primary transition-colors"
        onMouseEnter={() => setHoveredIcon(icon.name)}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <Icon 
          name={icon.name} 
          dynamic 
          size={32} 
          className={`${hoveredIcon === icon.name ? 'text-primary-foreground' : 'text-primary'} transition-colors`} 
        />
        <span className="mt-2 text-sm">{icon.label}</span>
      </div>
    ));
  }, [hoveredIcon]);

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
