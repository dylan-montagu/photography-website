import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useAuthContext } from './AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useAuthContext();

  return (
    <Route
      {...rest}
      render={(props) =>
        authContext.isLoading ? undefined : authContext.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
};

export default PrivateRoute;
