
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Preload critical routes
const preloadRoutes = () => {
  const routes = [
    () => import('./routes/auth/AuthRoutes'),
    () => import('./routes/dashboard/DashboardRoutes'),
    () => import('./pages/Index')
  ];
  
  // Preload after initial render
  requestIdleCallback(() => {
    routes.forEach(route => route());
  });
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Start preloading after hydration
preloadRoutes();
