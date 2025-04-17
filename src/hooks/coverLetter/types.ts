
import { ReactNode } from 'react';

export type LoadingState = "idle" | "initializing" | "loading" | "generating" | "saving";

export interface GenerationProgress {
  phase: string;
  progress: number;
  message: string;
}

export interface ToastMessagesType {
  letterGenerated: {
    title: string;
    description: string;
  };
  letterEdited: {
    title: string;
    description: string;
  };
  letterError: {
    title: string;
    description: string;
    variant: "destructive";
  };
  [key: string]: {
    title: string;
    description: string;
    variant?: string;
  };
}

export type ToastVariant = "default" | "destructive" | "success";

export type ToastMessage = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  action?: React.ReactElement;
}
