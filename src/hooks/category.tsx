/* eslint-disable array-callback-return */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { handleCategoryDto } from '../dto/handle-category';
import { Category } from '../entiti/category';
import { CounterType } from '../entiti/counter-type';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';

interface CategoryContext {
  getCategories(): Promise<Category[] | undefined>;
  createCategory(data: handleCategoryDto): Promise<Category | undefined>;
  editCategory(
    data: handleCategoryDto,
    id: string,
  ): Promise<Category | undefined>;
  getCounterType(): Promise<CounterType[] | undefined>;
  createCounterType(
    data: Omit<CounterType, 'id'>,
  ): Promise<CounterType | undefined>;
  toggleCreateCounterType(bool: boolean): void;
  toggleEditCounterType(id: string | undefined): void;
  editCounterType(
    data: Omit<CounterType, 'type'>,
  ): Promise<CounterType | undefined>;
  counterTypes: CounterType[];
  categories: Category[];
  showCreateCounterType: boolean;
  showEditCounterType: string | undefined;
}

const CategoryContext = createContext({} as CategoryContext);

const CategoryProvider: React.FC = ({ children }) => {
  // hook
  const { addToast } = useToast();
  const { token } = useAuth();
  const { shootError } = useError();
  // state
  const [categories, setCategories] = useState<Category[]>([]);
  const [counterTypes, setCounterTypes] = useState<CounterType[]>([]);
  const [showCreateCounterType, setShowCreateCounterType] = useState<boolean>(
    false,
  );
  const [showEditCounterType, setShowEditCounterType] = useState<
    string | undefined
  >();

  const getCategories = useCallback(async () => {
    try {
      const response = await api.get<Category[]>('/categories', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setCategories(response.data);
      }
      return response.data;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  const createCategory = useCallback(
    async (data: handleCategoryDto) => {
      try {
        const response = await api.post<Category>('/categories', data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          setCategories([...categories, response.data]);
        }
        addToast({
          title: 'Categoria adicionada com sucesso',
          type: 'success',
        });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  const editCategory = useCallback(
    async (data: handleCategoryDto, id: string) => {
      const editData: handleCategoryDto = {
        ...data,
        boxes: data.boxes.map(box => {
          return {
            counters: box.counters,
            id: box.id,
          };
        }),
      };
      try {
        const response = await api.put(`/categories/${id}`, editData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setCategories(state => {
          const index = state.findIndex(category => category.id === id);
          state[index] = response.data;
          return state;
        });
        addToast({ title: 'Categoria editada com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  const getCounterType = useCallback(async () => {
    try {
      const response = await api.get<CounterType[]>('/counterTypes', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setCounterTypes(response.data);
      }
      return response.data;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  const createCounterType = useCallback(
    async (data: Omit<CounterType, 'id'>) => {
      try {
        const response = await api.post<CounterType>('/counterTypes', data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          setCounterTypes([response.data, ...counterTypes]);
          addToast({
            title: 'Contador adicionado com sucesso',
            type: 'success',
          });
        }
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);

        return undefined;
      }
    },
    [token, counterTypes],
  );

  const editCounterType = useCallback(
    async (data: Omit<CounterType, 'type'>) => {
      const editCounterTypeData: Omit<CounterType, 'type'> = {
        label: data.label,
      };
      try {
        const response = await api.patch<CounterType>(
          `/counterTypes/${data.id}`,
          editCounterTypeData,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data) {
          const index = counterTypes.findIndex(
            counterType => counterType.id === data.id,
          );
          counterTypes[index] = response.data;
          setCounterTypes([...counterTypes]);
          addToast({
            title: 'Contador editado com sucesso',
            type: 'success',
          });
        }
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);

        return undefined;
      }
    },
    [token, counterTypes],
  );

  const toggleCreateCounterType = useCallback(
    (bool: boolean) => {
      setShowCreateCounterType(bool);
    },
    [showCreateCounterType],
  );

  const toggleEditCounterType = useCallback(
    (id: string | undefined) => {
      setShowEditCounterType(id);
    },
    [showEditCounterType],
  );

  return (
    <CategoryContext.Provider
      value={{
        getCategories,
        createCategory,
        editCategory,
        getCounterType,
        createCounterType,
        editCounterType,
        toggleCreateCounterType,
        toggleEditCounterType,
        showEditCounterType,
        showCreateCounterType,
        counterTypes,
        categories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

function useCategory(): CategoryContext {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a GroupProvider');
  }
  return context;
}

export { CategoryProvider, useCategory };
