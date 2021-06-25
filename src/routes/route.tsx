/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useState } from 'react';

import {
  Redirect,
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouterProps,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { useUser } from '../hooks/user';

interface IProps extends ReactDOMRouterProps {
  isPrivate: boolean;
  except?: 'OWNER' | 'OPERATOR' | 'MANAGER';
  permission?: string[];
  component: React.ComponentType;
}

const Route: React.FC<IProps> = ({
  component: Component,
  isPrivate,
  except,
  permission,
  ...rest
}) => {
  // hooks
  const { token } = useAuth();
  const { getUser, user } = useUser();
  // state
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getUser();
      setBusy(false);
    })();
  }, [token]);

  return (
    <>
      {!busy ? (
        <ReactDOMRoute
          {...rest}
          render={() => {
            if (isPrivate) {
              if (!token) {
                return <Redirect to={{ pathname: '/' }} />;
              }
              if (except && user?.role === except) {
                return <Redirect to={{ pathname: '/dashboard' }} />;
              }
              if (permission?.includes('OWNER') && user?.role === 'OWNER') {
                return <Component />;
              }
              if (
                permission?.includes('LIST_OPERATORS') &&
                user?.permissions?.listOperators === false
              ) {
                return <Redirect to={{ pathname: '/dashboard' }} />;
              }
              if (
                permission?.includes('LIST_MANAGERS') &&
                user?.permissions?.listManagers === false
              ) {
                return <Redirect to={{ pathname: '/dashboard' }} />;
              }
              if (
                permission?.includes('GENERATE_REPORTS') &&
                user?.permissions?.generateReports === false
              ) {
                return <Redirect to={{ pathname: '/dashboard' }} />;
              }
            }
            if (!isPrivate) {
              if (token) {
                return <Redirect to={{ pathname: '/dashboard' }} />;
              }
            }
            return <Component />;
          }}
        />
      ) : (
        // TODO => WE NEED TO DO A CIRCULAR PROGRESSIVE COMPONENT
        <div
          style={{
            background: '#E6E9EF',
            height: '100vh',
            width: '100%',
          }}
        />
        // -----------------------------------------------------<
      )}
    </>
  );
};

export default Route;
