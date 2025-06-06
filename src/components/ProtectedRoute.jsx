import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [navigate, location]);
  
  return localStorage.getItem('authToken') ? children : null;
};

export default ProtectedRoute;