import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useCallback,
} from 'react';

// create context objecto be shared to privders children
export const AlertContext = createContext(null);

const initialAlertContext = { isOpen: false, alertType: '', msg: '' };

const AlertContextProvider = (props) => {
  const [aletContext, setAlertContext] = useState(initialAlertContext);

  const closeAlert = useCallback(() => {
    setAlertContext({ ...AlertContext, isOpen: false });
  }, []);

  const openAlert = useCallback((alertType, msg) => {
    setAlertContext({ isOpen: true, alertType: alertType, msg: msg });
  }, []);

  const alertContextValue = useMemo(() => {
    return {
      ...aletContext,
      closeAlert,
      openAlert,
    };
  }, [aletContext, closeAlert, openAlert]);

  return <AlertContext.Provider value={alertContextValue} {...props} />;
};

export const useAlertContext = () => useContext(AlertContext);

export default AlertContextProvider;
