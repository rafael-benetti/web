import React, { createContext, useCallback, useContext, useState } from 'react';
import { Route } from '../entiti/route';
import { RouteInfo } from '../entiti/route-info';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';

interface RouteContext {
  getRoutes(): Promise<Route[] | undefined>;
  getSingleRoute(
    id: string,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY',
  ): Promise<void>;
  toggleCreateRoute(bool: boolean): void;
  toggleEditRoute(id: boolean): void;
  createRoute(data: Omit<Route, 'id'>): Promise<Route | undefined>;
  editRoute(data: Omit<Route, 'id'>, id: string): Promise<Route | undefined>;
  toggleActions(refresh?: boolean): void;
  deleteRoute(id: string): Promise<void>;
  toggleDeleteRoute(bool: boolean): void;
  showDeleteRoute: boolean;
  shouldRefreshRoute: boolean;
  routes: Route[];
  routeInfo: RouteInfo | undefined;
  showCreateRoute: boolean;
  showEditRoute: boolean;
}

const RouteContext = createContext({} as RouteContext);

const RouteProvider: React.FC = ({ children }) => {
  // hook
  const { token } = useAuth();
  const { addToast } = useToast();
  const { shootError } = useError();

  // state
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showCreateRoute, setShowCreateRoute] = useState(false);
  const [showEditRoute, setShowEditRoute] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo>();
  const [shouldRefreshRoute, setShouldRefreshRoute] = useState<boolean>(false);
  const [showDeleteRoute, setShowDeleteRoute] = useState<boolean>(false);

  const getRoutes = useCallback(async () => {
    try {
      const response = await api.get<Route[]>('/routes', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        setRoutes(response.data);
      }
      return response.data;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  const getSingleRoute = useCallback(
    async (id: string, period: 'DAILY' | 'WEEKLY' | 'MONTHLY') => {
      try {
        const response = await api.get<RouteInfo>(
          `/routes/${id}?period=${period}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        setRouteInfo(response.data);
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const toggleCreateRoute = useCallback(
    (bool: boolean) => {
      setShowCreateRoute(bool);
    },
    [showCreateRoute],
  );

  const toggleEditRoute = useCallback(
    (id: boolean) => {
      setShowEditRoute(id);
    },
    [showCreateRoute],
  );

  const createRoute = useCallback(
    async (data: Omit<Route, 'id'>) => {
      if (!data.operatorId || data.operatorId === 'none') {
        delete data.operatorId;
      }
      try {
        const response = await api.post<Route>('/routes', data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setRoutes(state => {
          return [response.data, ...state];
        });
        addToast({ title: 'Rota criada com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  const editRoute = useCallback(
    async (data: Omit<Route, 'id'>, id: string) => {
      if (!data.operatorId || data.operatorId === 'none') {
        delete data.operatorId;
      }
      try {
        const response = await api.put<Route>(`/routes/${id}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          const index = routes.findIndex(route => route.id === id);
          routes[index] = response.data;
          setRoutes([...routes]);
        }
        addToast({ title: 'Rota editada com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token, routes],
  );

  const deleteRoute = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/routes/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        addToast({ title: 'Rota deletada com sucesso', type: 'success' });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const toggleDeleteRoute = useCallback((bool: boolean) => {
    setShowDeleteRoute(bool);
  }, []);

  const toggleActions = useCallback(
    (refresh?: boolean) => {
      if (refresh) {
        setShouldRefreshRoute(!shouldRefreshRoute);
      }
    },
    [shouldRefreshRoute],
  );

  return (
    <RouteContext.Provider
      value={{
        getRoutes,
        getSingleRoute,
        toggleCreateRoute,
        toggleEditRoute,
        createRoute,
        editRoute,
        toggleActions,
        deleteRoute,
        toggleDeleteRoute,
        showDeleteRoute,
        shouldRefreshRoute,
        showCreateRoute,
        showEditRoute,
        routes,
        routeInfo,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

function useRoute(): RouteContext {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a AuthProvider');
  }
  return context;
}

export { RouteProvider, useRoute };
