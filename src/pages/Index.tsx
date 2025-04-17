import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './Home';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to Home component
    navigate('/', { replace: true });
  }, [navigate]);
  
  // Render Home as fallback while redirecting
  return <Home />;
};

export default Index;
