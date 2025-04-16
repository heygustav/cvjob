
import React, { memo } from 'react';
import { AuthProvider } from './components/AuthProvider';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const App = memo(() => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
});

App.displayName = 'App';

export default App;
