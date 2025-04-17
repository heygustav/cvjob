
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress, LoadingState } from "@/hooks/coverLetter/types";

// Define the state shape
export interface GeneratorState {
  step: 1 | 2;
  jobData: JobFormData;
  generatedLetter: CoverLetter | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
  generationPhase: string | null;
  loadingState: LoadingState;
  selectedJob: JobPosting | null;
  generationProgress: GenerationProgress;
  completeUser: User | null;
  subscriptionStatus: any;
}

// Define the available actions
type GeneratorAction =
  | { type: 'SET_STEP'; payload: 1 | 2 }
  | { type: 'SET_JOB_DATA'; payload: JobFormData }
  | { type: 'SET_GENERATED_LETTER'; payload: CoverLetter | null }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_IS_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATION_PHASE'; payload: string | null }
  | { type: 'SET_LOADING_STATE'; payload: LoadingState }
  | { type: 'SET_SELECTED_JOB'; payload: JobPosting | null }
  | { type: 'SET_GENERATION_PROGRESS'; payload: GenerationProgress }
  | { type: 'SET_COMPLETE_USER'; payload: User | null }
  | { type: 'SET_SUBSCRIPTION_STATUS'; payload: any }
  | { type: 'RESET_ERROR' };

// Define the initial state
const initialState: GeneratorState = {
  step: 1,
  jobData: {
    title: '',
    company: '',
    description: '',
  },
  generatedLetter: null,
  isLoading: false,
  error: null,
  isGenerating: false,
  generationPhase: null,
  loadingState: 'idle',
  selectedJob: null,
  generationProgress: {
    phase: 'job-save',
    progress: 0,
    message: 'Forbereder...'
  },
  completeUser: null,
  subscriptionStatus: null
};

// Create the reducer function
const generatorReducer = (state: GeneratorState, action: GeneratorAction): GeneratorState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_JOB_DATA':
      return { ...state, jobData: action.payload };
    case 'SET_GENERATED_LETTER':
      return { ...state, generatedLetter: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_IS_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_GENERATION_PHASE':
      return { ...state, generationPhase: action.payload };
    case 'SET_LOADING_STATE':
      return { ...state, loadingState: action.payload };
    case 'SET_SELECTED_JOB':
      return { ...state, selectedJob: action.payload };
    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.payload };
    case 'SET_COMPLETE_USER':
      return { ...state, completeUser: action.payload };
    case 'SET_SUBSCRIPTION_STATUS':
      return { ...state, subscriptionStatus: action.payload };
    case 'RESET_ERROR':
      return { ...state, error: null, isGenerating: false, loadingState: 'idle' };
    default:
      return state;
  }
};

// Define the context
interface GeneratorContextType {
  state: GeneratorState;
  dispatch: React.Dispatch<GeneratorAction>;
}

const GeneratorContext = createContext<GeneratorContextType | undefined>(undefined);

// Create the provider component
export const GeneratorProvider: React.FC<{
  children: ReactNode;
  initialLetterId?: string;
  initialStep?: 1 | 2;
  initialIsGenerating?: boolean;
  initialIsLoading?: boolean;
  initialLoadingState?: LoadingState;
  initialGenerationPhase?: string | null;
  initialGenerationProgress?: GenerationProgress;
  initialSelectedJob?: JobPosting | null;
  initialGeneratedLetter?: CoverLetter | null;
  initialGenerationError?: string | null;
}> = ({
  children,
  initialLetterId,
  initialStep,
  initialIsGenerating,
  initialIsLoading,
  initialLoadingState,
  initialGenerationPhase,
  initialGenerationProgress,
  initialSelectedJob,
  initialGeneratedLetter,
  initialGenerationError,
}) => {
  // Initialize state with provided values or defaults
  const [state, dispatch] = useReducer(generatorReducer, {
    ...initialState,
    step: initialStep ?? initialState.step,
    isGenerating: initialIsGenerating ?? initialState.isGenerating,
    isLoading: initialIsLoading ?? initialState.isLoading,
    loadingState: initialLoadingState ?? initialState.loadingState,
    generationPhase: initialGenerationPhase ?? initialState.generationPhase,
    generationProgress: initialGenerationProgress ?? initialState.generationProgress,
    selectedJob: initialSelectedJob ?? initialState.selectedJob,
    generatedLetter: initialGeneratedLetter ?? initialState.generatedLetter,
    error: initialGenerationError ?? initialState.error,
  });

  return (
    <GeneratorContext.Provider value={{ state, dispatch }}>
      {children}
    </GeneratorContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGeneratorContext = () => {
  const context = useContext(GeneratorContext);
  if (context === undefined) {
    throw new Error('useGeneratorContext must be used within a GeneratorProvider');
  }
  return context;
};
