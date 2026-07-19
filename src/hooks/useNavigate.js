import { useCallback } from 'react';

export function useNavigate() {
  const navigate = useCallback((path) => {
    window.location.href = path;
  }, []);

  return navigate;
}
