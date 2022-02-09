import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from 'react';
import axios from 'axios';

import setAuthToken from './util/setAuthToken';

// create context objecto be shared to privders children
export const AuthContext = createContext(null);
const initalAuthContext = { isAuthenticated: false, isLoading: true };

const AuthContextProvider = (props) => {
  const [authContext, setAuthContext] = useState(initalAuthContext);

  const loadUser = async () => {
    if (localStorage.token) {
      try {
        setAuthToken(localStorage.token); // set token as header
        await axios.get('/api/auth'); // authenticate user. Will throw error if not authenticated
        setAuthContext({ isAuthenticated: true, isLoading: false });
      } catch (err) {
        console.error(err.response);
        setAuthContext({ isAuthenticated: false, isLoading: false });
      }
    } else {
      setAuthToken();
      setAuthContext({
        ...initalAuthContext,
        isAuthenticated: false,
        isLoading: false,
      });
    }
    // log user out from all tabs if they log out in one tab
    window.addEventListener('storage', () => {
      if (!localStorage.token)
        setAuthContext({ isAuthenticated: false, isLoading: false });
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken();
    setAuthContext({
      ...authContext,
      isAuthenticated: false,
      isLoading: false,
    });
  }, [authContext]);

  const login = useCallback(() => {
    setAuthContext({ ...authContext, isAuthenticated: true, isLoading: false });
    setAuthToken(localStorage.token);
  }, [authContext]);

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  const authContextValue = useMemo(() => {
    return {
      ...authContext,
      login,
      logout,
    };
  }, [authContext, login, logout]);

  return <AuthContext.Provider value={authContextValue} {...props} />;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContextProvider;
