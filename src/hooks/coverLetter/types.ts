
export type LoadingState = 
  | "idle" 
  | "initializing" 
  | "generating" 
  | "saving";

export type GenerationPhase = 
  | "job-save"
  | "user-fetch"
  | "generation"
  | "letter-save"
  | "complete"
  | "letter-fetch"
  | "job-fetch"
  | "letter-generation"
  | "error";

export interface GenerationProgress {
  phase: GenerationPhase;
  progress: number;
  message: string;
}

export interface TimeoutConfig {
  handleTimeoutCallback: (error: Error) => void;
  timeoutMs?: number;
}

export interface GenerationResult {
  job: any;
  letter: any;
}

export type ToastMessagesType = {
  letterGenerated: {
    title: string;
    description: string;
    variant?: "default" | "destructive" | "success";
  };
  [key: string]: {
    title: string;
    description: string;
    variant?: "default" | "destructive" | "success";
  };
};
