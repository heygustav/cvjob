
import React from 'react';
import { ToastAction } from '@/components/ui/toast';
import type { ToastActionElement } from '@/components/ui/toast';

interface ToastActionConfig {
  label: string;
  handler: () => void;
}

export const createToastAction = (config?: ToastActionConfig): ToastActionElement | undefined => {
  if (!config) return undefined;
  
  return (
    <ToastAction onClick={config.handler}>
      {config.label}
    </ToastAction>
  );
};
