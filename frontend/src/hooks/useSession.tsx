import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Role = 'citizen' | 'officer' | 'admin';

export const useSession = (role: Role) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = process.env.base_URL;
  useEffect(() => {  
    const endpointMap: Record<Role, string> = {
      citizen: '/api/checkUserSession',
      officer: '/api/checkOfficerSession',
      admin: '/api/checkAdminSession',
    };

    const checkSession = async () => {
      try {
        const res = await fetch(`${BASE_URL}${endpointMap[role]}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Session invalid');

        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        localStorage.clear();
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [role, navigate]);

  return { isAuthenticated, loading };
};
