
import React from 'react';
import { ToastAction } from '@/components/ui/toast';
import type { ToastActionElement } from '@/components/ui/toast';
import { ErrorAction } from '@/utils/errorHandler/types';

export const createToastAction = (config?: ErrorAction): ToastActionElement | undefined => {
  if (!config) return undefined;
  
  return (
    <ToastAction 
      altText={config.label} 
      onClick={config.handler}
    >
      {config.label}
    </ToastAction>
  );
};
