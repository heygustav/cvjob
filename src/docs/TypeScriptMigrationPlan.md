
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

### Refaktorering af Cover Letter Generator modulet

Vores gennemgang har afsløret betydelig kode-duplikation mellem `generation` og `letter-generation` mapperne. Vi har konsolideret disse under en enkelt `letterGeneration` mappe med følgende struktur:

```
src/hooks/coverLetter/letterGeneration/
  ├── index.ts          // Eksporterer alle hooks og hjælpefunktioner
  ├── types.ts          // Delte typer for letter generation
  ├── utils.ts          // Funktioner til letter generation
  └── useJobFormSubmit.ts // Hook til job form submission
```

## Fase 2: Introducer stærke type interfaces

### Eksempel på nye eller forbedrede interfaces

```typescript
// src/hooks/coverLetter/letterGeneration/types.ts
export interface GenerationTrackingTools {
  abortGeneration: () => AbortController;
  incrementAttempt: (ref: React.MutableRefObject<number>) => number;
  updatePhase: (phase: GenerationPhase, progress: number, message: string) => void;
}

export interface ErrorHandlingTools {
  handleGenerationError: (error: Error) => void;
  resetError: () => void;
}

export type GenerationPhase = 'job-save' | 'user-fetch' | 'generation' | 'letter-save';
```

## Fase 3: Implementer TypeGuards

For at sikre type-sikkerhed på runtime:

```typescript
// src/utils/typeGuards.ts
export function isJobPosting(value: unknown): value is JobPosting {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    'title' in value &&
    'company' in value &&
    'description' in value &&
    'user_id' in value
  );
}

export function isCoverLetter(value: unknown): value is CoverLetter {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    'content' in value &&
    'job_posting_id' in value &&
    'user_id' in value
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

## Eksempel på refaktorering: useJobFormSubmit

```typescript
// Før:
const handleJobFormSubmit = useCallback(async (jobData: any) => {
  // ...
}, [/* dependencies */]);

// Efter:
import { JobFormData } from "@/services/coverLetter/types";

const handleJobFormSubmit = useCallback(async (jobData: JobFormData): Promise<void> => {
  // Type-sikker implementering
}, [/* dependencies */]);
```

## Konklusion

Ved at følge denne plan og den nye konsoliderede struktur for Cover Letter Generator modulet, kan vi systematisk forbedre type-sikkerheden i vores projekt, hvilket vil resultere i færre runtime fejl, bedre udviklerværktøjer og mere vedligeholdbar kode på lang sigt.

Vores nye struktur eliminerer duplikeret kode, gør kodebasen mere vedligeholdbar og skaber et enkelt "source of truth" for hver funktionalitet.
