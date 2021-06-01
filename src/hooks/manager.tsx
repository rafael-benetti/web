import React, { createContext, useCallback, useContext, useState } from 'react';
import { HandleManagerDto } from '../dto/handle-manager';
import { User } from '../entiti/user';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';

interface ManagerContext {
  getManagers(): Promise<User[] | undefined>;
  createManager(data: Omit<HandleManagerDto, 'id'>): Promise<User | undefined>;
  editManager(
    data: Omit<HandleManagerDto, 'id'>,
    id: string,
  ): Promise<User | undefined>;
  managers: User[];
}

const ManagerContext = createContext({} as ManagerContext);

const ManagerProvider: React.FC = ({ children }) => {
  // hooks
  const { token } = useAuth();
  const { addToast } = useToast();
  const { shootError } = useError();
  // state
  const [managers, setManagers] = useState<User[]>([]);

  const getManagers = useCallback(async () => {
    try {
      const response = await api.get<User[]>('/users/managers', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setManagers(response.data);
      return response.data;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  const createManager = useCallback(
    async (data: Omit<HandleManagerDto, 'id'>) => {
      try {
        const response = await api.post<User>('/users/managers', data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setManagers(state => {
          state.push(response.data);
          return state;
        });
        addToast({ title: 'Colaborador criado com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);

        return undefined;
      }
    },
    [token],
  );

  const editManager = useCallback(
    async (data: Omit<HandleManagerDto, 'id'>, id: string) => {
      try {
        const response = await api.patch<User>(`/users/managers/${id}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setManagers(state => {
          const index = state.findIndex(manager => manager.id === id);
          state[index] = response.data;
          return state;
        });
        addToast({ title: 'Colaborador editado com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);

        return undefined;
      }
    },
    [token],
  );

  return (
    <ManagerContext.Provider
      value={{ getManagers, createManager, editManager, managers }}
    >
      {children}
    </ManagerContext.Provider>
  );
};

function useManager(): ManagerContext {
  const context = useContext(ManagerContext);
  if (!context) {
    throw new Error('useManager must be used within a userProvider');
  }
  return context;
}

export { ManagerProvider, useManager };
