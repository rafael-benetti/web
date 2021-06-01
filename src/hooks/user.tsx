/* eslint-disable no-console */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { EditProfileDto } from '../dto/edit-profile';
import { DashboardData } from '../entiti/dashboard-data';
import { User } from '../entiti/user';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';
import { Notification } from '../entiti/notification';

interface UserContext {
  getUser(): Promise<User | undefined>;
  getOperators(): Promise<User[] | undefined>;
  getManagers(): Promise<User[] | undefined>;
  getDashboardData(filter: {
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
    startDate?: string;
    endDate?: string;
  }): Promise<void>;
  editProfile(data: EditProfileDto, file?: File): Promise<void>;
  getUnreadNotifications(): Promise<void>;
  getNotifications(offset: number): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  numberOfUnreadNotifications: number;
  notifications: Notification[];
  count?: number;
  dashboardData?: DashboardData;
  operators: User[];
  managers: User[];
  user?: User;
}

const UserContext = createContext({} as UserContext);

const UserProvider: React.FC = ({ children }) => {
  // hook
  const { token } = useAuth();
  const { addToast } = useToast();
  const { shootError } = useError();

  // state
  const [user, setUser] = useState<User>();
  const [operators, setOperators] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [
    numberOfUnreadNotifications,
    setNumberOfUnreadNotifications,
  ] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [count, setCount] = useState<number>();

  const forgotPassword = useCallback(async (email: string) => {
    try {
      await api.post('users/forgot-password', { email });
      addToast({
        title: 'E-mail enviado com sucesso!',
        type: 'success',
      });
    } catch (error) {
      shootError(error.response.data.errorCode);
    }
  }, []);

  const getDashboardData = useCallback(
    async (filter: {
      period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
      startDate?: string;
      endDate?: string;
    }) => {
      try {
        const response = await api.get<DashboardData>(`users/dashboard`, {
          params: {
            period: filter.period,
            startDate: filter.startDate
              ? new Date(filter.startDate)
              : undefined,
            endDate: filter.endDate ? new Date(filter.endDate) : undefined,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    [token],
  );

  const getUnreadNotifications = useCallback(async () => {
    try {
      const response = await api.get<{ numberOfUnreadNotifications: number }>(
        'notifications/count',
        { headers: { authorization: `Bearer ${token}` } },
      );
      setNumberOfUnreadNotifications(response.data.numberOfUnreadNotifications);
    } catch (error) {
      shootError(error.response.data.errorCode);
    }
  }, [token]);

  const getNotifications = useCallback(
    async (offset: number) => {
      try {
        const response = await api.get<{
          count: number;
          notifications: Notification[];
        }>(`notifications`, {
          params: {
            limit: 10,
            offset,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data.notifications);
        setCount(response.data.count);
      } catch (error) {
        console.log(error);
      }
    },
    [token],
  );

  const getUser = useCallback(async () => {
    try {
      const response = await api.get<User>('users/me', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  const editProfile = useCallback(
    async (data: EditProfileDto, file?: File) => {
      if (data.phoneNumber === '') {
        delete data.phoneNumber;
      }
      try {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          Object.keys(data).forEach(key => {
            formData.append(key, (data as never)[key]);
          });

          const response = await api.patch('users/me', formData, {
            headers: {
              authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          setUser(response.data);
          addToast({ title: 'Perfil atualizado', type: 'success' });

          return;
        }

        const response = await api.patch('users/me', data, {
          headers: { authorization: `Bearer ${token}` },
        });

        setUser(response.data);

        addToast({ title: 'Perfil atualizado', type: 'success' });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const getOperators = useCallback(async () => {
    try {
      const response = await api.get<User[]>('users/operators', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setOperators(response.data);
      return undefined;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  const getManagers = useCallback(async () => {
    try {
      const response = await api.get<User[]>('users/managers', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setManagers(response.data);
      return undefined;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        getUser,
        getOperators,
        getManagers,
        editProfile,
        getDashboardData,
        getUnreadNotifications,
        getNotifications,
        forgotPassword,
        notifications,
        count,
        numberOfUnreadNotifications,
        managers,
        dashboardData,
        operators,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

function useUser(): UserContext {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a AuthProvider');
  }
  return context;
}

export { UserProvider, useUser };
