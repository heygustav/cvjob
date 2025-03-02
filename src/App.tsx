
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { AuthProvider, useAuth } from './components/AuthProvider';
import Dashboard from './pages/Dashboard';
import Home from './pages/Index'; 
import CoverLetter from './pages/CoverLetterGenerator';
import Profile from './pages/Profile';
import JobForm from './pages/JobForm';
import Contact from './pages/Contact';
import About from './pages/AboutUs';
import Terms from './pages/TermsAndConditions';
import Privacy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import JobEdit from './pages/JobEdit';

// Separate the routes configuration from the router setup
const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/cover-letter",
    element: <CoverLetter />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/job/new",
    element: <JobForm />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/job/edit/:jobId",
    element: <JobEdit />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// Create the router without any auth logic initially
const router = createBrowserRouter(routes);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
