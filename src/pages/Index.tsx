
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Redirect to the vanilla HTML version
    window.location.href = '/index.html';
  }, []);
  
  return null;
};

export default Index;
