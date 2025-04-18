
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CoverLetterState, CoverLetterAction, LoadingState } from './types';
import { GenerationProgress } from '@/hooks/coverLetter/types';

// Initial state
const initialState: CoverLetterState = {
  step: 1,
  isLoading: false,
  isGenerating: false,
  loadingState: 'idle',
  error: null,
  generationPhase: null,
  generationProgress: {
    phase: 'job-save',
    progress: 0,
    message: 'Forbereder...'
  },
  jobData: {
    title: '',
    company: '',
    description: '',
    contact_person: '',
    url: '',
    deadline: ''
  },
  selectedJob: null,
  generatedLetter: null,
  user: null,
  subscriptionStatus: null
};

// Reducer function
const coverLetterReducer = (state: CoverLetterState, action: CoverLetterAction): CoverLetterState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_LOADING_STATE':
      return { 
        ...state, 
        loadingState: action.payload,
        isLoading: action.payload !== 'idle',
        isGenerating: action.payload === 'generating'
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_ERROR':
      return { 
        ...state, 
        error: null, 
        isGenerating: false, 
        loadingState: 'idle' 
      };
    case 'SET_GENERATION_PHASE':
      return { ...state, generationPhase: action.payload };
    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.payload };
    case 'SET_JOB_DATA':
      return { ...state, jobData: action.payload };
    case 'SET_SELECTED_JOB':
      return { ...state, selectedJob: action.payload };
    case 'SET_GENERATED_LETTER':
      return { ...state, generatedLetter: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SUBSCRIPTION_STATUS':
      return { ...state, subscriptionStatus: action.payload };
    default:
      return state;
  }
};

// Create context
interface CoverLetterContextType {
  state: CoverLetterState;
  dispatch: React.Dispatch<CoverLetterAction>;
}

const CoverLetterContext = createContext<CoverLetterContextType | undefined>(undefined);

// Provider component
interface CoverLetterProviderProps {
  children: ReactNode;
  initialState?: Partial<CoverLetterState>;
}

export const CoverLetterProvider: React.FC<CoverLetterProviderProps> = ({ 
  children, 
  initialState: customInitialState 
}) => {
  const [state, dispatch] = useReducer(
    coverLetterReducer, 
    { ...initialState, ...customInitialState }
  );

  return (
    <CoverLetterContext.Provider value={{ state, dispatch }}>
      {children}
    </CoverLetterContext.Provider>
  );
};

// Custom hook for using the context
export const useCoverLetterContext = () => {
  const context = useContext(CoverLetterContext);
  if (context === undefined) {
    throw new Error('useCoverLetterContext must be used within a CoverLetterProvider');
  }
  return context;
};

// Action creator hooks
export const useCoverLetterActions = () => {
  const { dispatch } = useCoverLetterContext();
  
  return {
    setStep: (step: 1 | 2) => 
      dispatch({ type: 'SET_STEP', payload: step }),
    
    setLoading: (isLoading: boolean) => 
      dispatch({ type: 'SET_LOADING', payload: isLoading }),
    
    setGenerating: (isGenerating: boolean) => 
      dispatch({ type: 'SET_GENERATING', payload: isGenerating }),
    
    setLoadingState: (loadingState: LoadingState) => 
      dispatch({ type: 'SET_LOADING_STATE', payload: loadingState }),
    
    setError: (error: string | null) => 
      dispatch({ type: 'SET_ERROR', payload: error }),
    
    resetError: () => 
      dispatch({ type: 'RESET_ERROR' }),
    
    setGenerationPhase: (phase: string | null) => 
      dispatch({ type: 'SET_GENERATION_PHASE', payload: phase }),
    
    setGenerationProgress: (progress: GenerationProgress) => 
      dispatch({ type: 'SET_GENERATION_PROGRESS', payload: progress }),
    
    setJobData: (jobData: Partial<typeof initialState.jobData>) => 
      dispatch({ type: 'SET_JOB_DATA', payload: { ...initialState.jobData, ...jobData } }),
    
    setSelectedJob: (job: typeof initialState.selectedJob) => 
      dispatch({ type: 'SET_SELECTED_JOB', payload: job }),
    
    setGeneratedLetter: (letter: typeof initialState.generatedLetter) => 
      dispatch({ type: 'SET_GENERATED_LETTER', payload: letter }),
    
    setUser: (user: typeof initialState.user) => 
      dispatch({ type: 'SET_USER', payload: user }),
    
    setSubscriptionStatus: (status: typeof initialState.subscriptionStatus) => 
      dispatch({ type: 'SET_SUBSCRIPTION_STATUS', payload: status })
  };
};

// Hook for accessing state only
export const useCoverLetterState = () => {
  const { state } = useCoverLetterContext();
  return state;
};
