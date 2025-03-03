
import React from 'react';
import Icon, { commonIcons } from '@/components/ui/icon';

const IconDemo: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      <h2 className="col-span-full text-xl font-semibold mb-4">Static Icons (Fast Load)</h2>
      <div className="flex flex-col items-center p-2 border rounded">
        <commonIcons.Dashboard className="text-primary h-8 w-8" />
        <span className="mt-2 text-sm">Dashboard</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <commonIcons.Document className="text-primary h-8 w-8" />
        <span className="mt-2 text-sm">Document</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <commonIcons.User className="text-primary h-8 w-8" />
        <span className="mt-2 text-sm">User</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <commonIcons.Settings className="text-primary h-8 w-8" />
        <span className="mt-2 text-sm">Settings</span>
      </div>
      
      <h2 className="col-span-full text-xl font-semibold mb-4 mt-6">Dynamic Icons (Lazy Loaded)</h2>
      <div className="flex flex-col items-center p-2 border rounded">
        <Icon name="git-branch" dynamic size={32} className="text-primary" />
        <span className="mt-2 text-sm">Git Branch</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <Icon name="database" dynamic size={32} className="text-primary" />
        <span className="mt-2 text-sm">Database</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <Icon name="wifi" dynamic size={32} className="text-primary" />
        <span className="mt-2 text-sm">Wifi</span>
      </div>
      <div className="flex flex-col items-center p-2 border rounded">
        <Icon name="zap" dynamic size={32} className="text-primary" />
        <span className="mt-2 text-sm">Zap</span>
      </div>
    </div>
  );
};

export default IconDemo;
