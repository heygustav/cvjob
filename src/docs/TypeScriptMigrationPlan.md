
# TypeScript Migration Plan

Dette dokument beskriver en trinvis plan for at forbedre type-sikkerheden i vores projekt ved at eliminere `any` typer og implementere stærkere typesikkerhed.

## Prioriteret rækkefølge af moduler

1. Cover Letter Generator komponenter og hooks
2. API og Service lag
3. State management
4. UI komponenter
5. Utilities

## Fase 1: Identificere og eliminere `any` typer i kritiske moduler

### Cover Letter Generator

Eksempel på problemer:

```typescript
// Før:
const selectedJob: any = { ... };
const handleJobFormSubmit = async (jobData: any) => { ... };

// Efter:
import { JobPosting } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";

const selectedJob: JobPosting | null = { ... };
const handleJobFormSubmit = async (jobData: JobFormData) => { ... };
```

### Specifikke files med `any` type problemer

1. `src/hooks/coverLetter/useJobFormSubmit.ts`:
   - `selectedJob: any` -> `selectedJob: JobPosting | null`
   - `generationTracking: any` -> Definer en specifik interface

2. `src/hooks/coverLetter/generation/hooks/useGenerationState.ts`:
   - Erstat `any` med specifikke typer for state variabler

3. `src/components/cover-letter/GeneratorContent.tsx`:
   - Tilføj specifikke typer for props

## Fase 2: Introducer stærke type interfaces

### Eksempel på nye eller forbedrede interfaces

```typescript
// src/hooks/coverLetter/generation-tracking/types.ts
export interface GenerationTrackingConfig {
  abortGeneration: () => AbortController;
  incrementAttempt: (ref: React.MutableRefObject<number>) => number;
  updatePhase: (phase: GenerationPhase, progress: number, message: string) => void;
}

// src/hooks/coverLetter/generation-error-handling/types.ts
export interface ErrorHandlingConfig {
  handleGenerationError: (error: Error) => void;
  resetError: () => void;
}
```

## Fase 3: Implementer TypeGuards

For at sikre type-sikkerhed på runtime:

```typescript
// src/utils/typeGuards.ts
export function isJobPosting(value: any): value is JobPosting {
  return (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    'title' in value &&
    'company' in value &&
    'description' in value
  );
}

export function isCoverLetter(value: any): value is CoverLetter {
  return (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    'content' in value &&
    'job_posting_id' in value
  );
}
```

## Fase 4: Implementer Generic Types for fælles mønstre

```typescript
// Generisk AsyncState type for data fetching
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// Anvendelse:
const jobState: AsyncState<JobPosting> = { 
  data: null, 
  isLoading: true, 
  error: null 
};
```

## Fase 5: Løbende Type-Checking

1. Aktiver strengere TypeScript compiler options i `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "noImplicitThis": true
     }
   }
   ```

2. Indfør gradvist disse ændringer på per-fil basis for at undgå at bryde eksisterende funktionalitet.

## Implementeringseksempler

### Eksempel 1: Forbedring af useJobFormSubmit.ts

```typescript
// Før:
const handleJobFormSubmit = useCallback(async (jobData: any) => {
  // ...
}, [/* dependencies */]);

// Efter:
import { JobFormData } from "@/services/coverLetter/types";

interface JobFormSubmitResult {
  success: boolean;
  letterId?: string;
  error?: string;
}

const handleJobFormSubmit = useCallback(async (jobData: JobFormData): Promise<JobFormSubmitResult> => {
  // ...
  return { success: true, letterId: result.id };
}, [/* dependencies */]);
```

### Eksempel 2: Typedefining af useGeneratorState

```typescript
// Før:
const [generationProgress, setGenerationProgress] = useState<any>({
  phase: 'job-save',
  progress: 0,
  message: 'Forbereder...'
});

// Efter:
import { GenerationProgress, GenerationPhase } from "@/hooks/coverLetter/types";

const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
  phase: 'job-save' as GenerationPhase,
  progress: 0,
  message: 'Forbereder...'
});
```

## Tidslinje

1. **Uge 1-2**: Analyse og dokumentation af eksisterende kodebasis
2. **Uge 3-4**: Implementer type forbedringer i Cover Letter modulet
3. **Uge 5-6**: Implementer type forbedringer i API og Service lag
4. **Uge 7-8**: Implementer type forbedringer i State management
5. **Uge 9-10**: Implementer forbedringer i UI komponenter og utilities
6. **Uge 11-12**: Omfattende testning og fejlrettelser

## Konklusion

Ved at følge denne plan kan vi systematisk forbedre type-sikkerheden i vores projekt, hvilket vil resultere i færre runtime fejl, bedre udviklerværktøjer og mere vedligeholdbar kode på lang sigt.
