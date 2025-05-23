import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-savi-yellow opacity-10 rounded-b-full"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-savi-pink opacity-10 rounded-t-full"></div>
      
      <div className="text-center z-10 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border-2 border-savi-blue/20">
        <h1 className="text-5xl font-bold mb-4 text-savi-blue">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
      </div>
    </div>
  );
};

export default NotFound;
