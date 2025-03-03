
import React, { useState, useMemo, useCallback } from 'react';
import Icon, { commonIcons, IconName } from '@/components/ui/icon';

// Predefined icon lists for better organization
const STATIC_ICONS = [
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'document', label: 'Document' },
  { name: 'user', label: 'User' },
  { name: 'settings', label: 'Settings' },
  { name: 'plus', label: 'Plus' },
  { name: 'edit', label: 'Edit' },
  { name: 'delete', label: 'Delete' },
  { name: 'search', label: 'Search' },
];

// Define dynamic icons with properly typed names
const DYNAMIC_ICONS = [
  { name: 'git-branch' as IconName, label: 'Git Branch' },
  { name: 'database' as IconName, label: 'Database' },
  { name: 'wifi' as IconName, label: 'Wifi' },
  { name: 'zap' as IconName, label: 'Zap' },
  { name: 'activity' as IconName, label: 'Activity' },
  { name: 'cloud' as IconName, label: 'Cloud' },
  { name: 'github' as IconName, label: 'GitHub' },
  { name: 'lock' as IconName, label: 'Lock' },
];

// Create optimized card component to avoid repeated JSX
const IconCard = React.memo(({ 
  name, 
  label, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave,
  isDynamic = false
}: {
  name: string;
  label: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isDynamic?: boolean;
}) => (
  <div 
    className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors hover:border-primary cursor-pointer"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <Icon 
      name={name} 
      dynamic={isDynamic} 
      size={32} 
      className={`${isHovered ? 'text-primary' : 'text-gray-700'} transition-colors mb-2`} 
    />
    <span className="mt-2 text-sm font-medium">{label}</span>
    <span className="text-xs text-gray-500 mt-1">{isDynamic ? "Dynamic" : "Static"}</span>
  </div>
));

IconCard.displayName = 'IconCard';

const IconDemo: React.FC = () => {
  // Use lazy initialization to avoid work during render
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'static' | 'dynamic'>('all');
  
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
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-center space-x-4 mb-8">
          <button 
            className={`px-4 py-2 rounded-md ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Icons
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${selectedCategory === 'static' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedCategory('static')}
          >
            Static Icons
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${selectedCategory === 'dynamic' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedCategory('dynamic')}
          >
            Dynamic Icons
          </button>
        </div>
      </div>

      {(selectedCategory === 'all' || selectedCategory === 'static') && (
        <>
          <h2 className="text-xl font-semibold mb-4">Static Icons (Fast Load)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {staticIconItems}
          </div>
        </>
      )}
      
      {(selectedCategory === 'all' || selectedCategory === 'dynamic') && (
        <>
          <h2 className="text-xl font-semibold mb-4">Dynamic Icons (Lazy Loaded)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {dynamicIconItems}
          </div>
        </>
      )}
    </div>
  );
};

// Memoize the entire component for optimal rendering performance
export default React.memo(IconDemo);
