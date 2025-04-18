
import React, { memo } from 'react';
import { AuthProvider } from './components/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes/AppRoutes';
import { CoverLetterProvider } from './state/cover-letter/CoverLetterProvider';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

const App = memo(() => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CoverLetterProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
            <AppRoutes />
          </div>
        </CoverLetterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
});

App.displayName = 'App';

export default App;
