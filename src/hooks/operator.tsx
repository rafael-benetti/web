import React, { createContext, useCallback, useContext, useState } from 'react';
import { HandleOperatorDto } from '../dto/handle-operator';
import { User } from '../entiti/user';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';

interface OperatorContext {
  getOperators(): Promise<User[] | undefined>;
  createOperator(
    data: Omit<HandleOperatorDto, 'id'>,
  ): Promise<User | undefined>;
  editOperator(
    data: Omit<HandleOperatorDto, 'id'>,
    id: string,
  ): Promise<User | undefined>;
  operators: User[];
}

const OperatorContext = createContext({} as OperatorContext);

const OperatorProvider: React.FC = ({ children }) => {
  // hook
  const { addToast } = useToast();
  const { token } = useAuth();
  const { shootError } = useError();

  // state
  const [operators, setOperators] = useState<User[]>([]);

  const getOperators = useCallback(async () => {
    try {
      const response = await api.get<User[]>('/users/operators', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setOperators(response.data);
      return response.data;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  const createOperator = useCallback(
    async (data: Omit<HandleOperatorDto, 'id'>) => {
      try {
        const response = await api.post<User>('/users/operators', data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setOperators(state => {
          state.push(response.data);
          return state;
        });
        addToast({ title: 'Operador criado com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);

        return undefined;
      }
    },
    [token],
  );

  const editOperator = useCallback(
    async (data: Omit<HandleOperatorDto, 'id'>, id: string) => {
      try {
        const response = await api.patch<User>(`/users/operators/${id}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setOperators(state => {
          const index = state.findIndex(operator => operator.id === id);
          state[index] = response.data;
          return state;
        });
        addToast({ title: 'Operador editado com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);

        return undefined;
      }
    },
    [token],
  );

  return (
    <OperatorContext.Provider
      value={{ getOperators, createOperator, editOperator, operators }}
    >
      {children}
    </OperatorContext.Provider>
  );
};

function useOperator(): OperatorContext {
  const context = useContext(OperatorContext);
  return context;
}

export { OperatorProvider, useOperator };
