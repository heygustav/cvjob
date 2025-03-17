
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if the current path is matching the job/id pattern
    const jobMatch = location.pathname.match(/\/job\/([^\/]+)/);
    
    if (jobMatch && jobMatch[1]) {
      const jobId = jobMatch[1];
      console.log("Detected job ID in 404 route, redirecting to proper route:", jobId);
      
      // Redirect to the correct route
      navigate(`/ansoegning?jobId=${jobId}&step=1&direct=true`, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Side ikke fundet</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Tilbage til forsiden
        </a>
      </div>
    </div>
  );
};

export default NotFound;
