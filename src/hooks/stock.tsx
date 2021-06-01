/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-bitwise */
/* eslint-disable array-callback-return */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { CreateProductDto } from '../dto/create-product';
import { HandleAddProductDto } from '../dto/handle-add-product';
import { TransferFromMachineDto } from '../dto/transfer-from-machine';
import { TransferProductDto } from '../dto/transfer-product';
import { Prize } from '../entiti/prize';
import { StockItem } from '../entiti/stock-item';
import { Supply } from '../entiti/supplies';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useGroup } from './group';
import { useToast } from './toast';
import { useUser } from './user';

interface ToggleModal {
  ownerItemId: string;
  itemId?: string;
}

interface StockContext {
  toggleAddItems(data: ToggleModal | undefined): void;
  toggleRemoveItems(data: ToggleModal | undefined): void;
  toggleTransferProduct(data: ToggleModal | undefined): void;
  toggleCreateProduct(bool: boolean): void;
  getStockItems(type: 'USER' | 'GROUP' | 'MACHINE'): Promise<void>;
  addProduct(data: HandleAddProductDto, id: string): Promise<void>;
  removeProduct(data: HandleAddProductDto, id: string): Promise<void>;
  trasferProduct(data: TransferProductDto, id: string): Promise<void>;
  createProduct(data: CreateProductDto): Promise<Prize | Supply | undefined>;
  transferFromMachine(data: TransferFromMachineDto, id: string): Promise<void>;
  openRemoveItems: ToggleModal | undefined;
  openAddItems: ToggleModal | undefined;
  openTransferProduct: ToggleModal | undefined;
  openCreateProduct: boolean;
  prizes: StockItem[];
  supplies: StockItem[];
  shouldRefresh: boolean;
}

const StockContext = createContext({} as StockContext);

const StockProvider: React.FC = ({ children }) => {
  // hooks
  const { getGroups, groups } = useGroup();
  const { getUser } = useUser();
  const { token } = useAuth();
  const { addToast } = useToast();
  const { shootError } = useError();

  // state
  const [openAddItems, setOpenAddItems] = useState<ToggleModal>();
  const [openRemoveItems, setOpenRemoveItems] = useState<
    ToggleModal | undefined
  >();
  const [openTransferProduct, setOpenTransferProduct] = useState<ToggleModal>();
  const [prizes, setPrizes] = useState<StockItem[]>([]);
  const [supplies, setSupplies] = useState<StockItem[]>([]);
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [shouldRefresh, setShoulRefresh] = useState(false);

  const getStockItems = useCallback(
    async (type: 'USER' | 'GROUP' | 'MACHINE') => {
      if (type === 'GROUP') {
        const response = await getGroups();
        if (response) {
          const prizesData: StockItem[] = [];
          response.map(group => {
            group.stock.prizes.map(prize => {
              prizesData.push({
                label: prize.label,
                quantity: prize.quantity,
                id: prize.id,
                ownerId: group.id,
                ownerLabel: group.isPersonal ? 'Parceria pessoal' : group.label,
              });
            });
          });
          const suppliesData: StockItem[] = [];
          response.map(group => {
            group.stock.supplies.map(prize => {
              suppliesData.push({
                label: prize.label,
                quantity: prize.quantity,
                id: prize.id,
                ownerId: group.id,
                ownerLabel: group.isPersonal ? 'Parceria pessoal' : group.label,
              });
            });
          });
          setPrizes([...prizesData]);
          setSupplies([...suppliesData]);
        }
      }
      if (type === 'USER') {
        const response = await getUser();
        if (response) {
          const prizesData: StockItem[] = [];
          response.stock?.prizes.map(prize => {
            prizesData.push({
              label: prize.label,
              quantity: prize.quantity,
              id: prize.id,
              ownerId: response.id,
              ownerLabel: '',
            });
          });
          const suppliesData: StockItem[] = [];
          response.stock?.supplies.map(supply => {
            suppliesData.push({
              label: supply.label,
              quantity: supply.quantity,
              id: supply.id,
              ownerId: response.id,
              ownerLabel: '',
            });
          });
          setPrizes([...prizesData]);
          setSupplies([...suppliesData]);
        }
      }
    },
    [supplies, prizes, groups, token],
  );

  const toggleAddItems = useCallback(
    (data: ToggleModal) => {
      if (data) {
        setOpenAddItems(data);
      } else {
        setOpenAddItems(undefined);
      }
    },
    [openAddItems],
  );

  const toggleRemoveItems = useCallback(
    (data: ToggleModal) => {
      if (data) {
        setOpenRemoveItems(data);
      } else {
        setOpenRemoveItems(undefined);
      }
    },
    [openRemoveItems],
  );

  const toggleTransferProduct = useCallback(
    (data: ToggleModal) => {
      if (data) {
        setOpenTransferProduct(data);
      } else {
        setOpenTransferProduct(undefined);
      }
    },
    [openTransferProduct],
  );

  const toggleCreateProduct = useCallback(
    (bool: boolean) => {
      setOpenCreateProduct(bool);
    },
    [openCreateProduct],
  );

  const addProduct = useCallback(
    async (data: HandleAddProductDto, id: string) => {
      try {
        await api.post(`/products/${id}/add-to-stock`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (data.type === 'PRIZE') {
          const index = prizes.findIndex(
            prize => prize.id === id && prize.ownerId === data.groupId,
          );
          prizes[index] = {
            ...prizes[index],
            quantity:
              (prizes[index].quantity || 0) +
              parseFloat(data.quantity.toString()),
          };
          setPrizes([...prizes]);
          addToast({ title: 'Prêmio adicionado com sucesso', type: 'success' });
        } else {
          const index = supplies.findIndex(
            supply => supply.id === id && supply.ownerId === data.groupId,
          );
          supplies[index] = {
            ...supplies[index],
            quantity:
              (supplies[index].quantity || 0) +
              parseFloat(data.quantity.toString()),
          };
          setSupplies([...supplies]);
          addToast({
            title: 'Suprimento adicionado com sucesso',
            type: 'success',
          });
        }
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token, supplies, prizes],
  );

  const removeProduct = useCallback(
    async (data: HandleAddProductDto, id: string) => {
      const removeData: HandleAddProductDto = {
        ...data,
        quantity: parseFloat(data.quantity.toString()) * -1,
      };
      try {
        await api.post(`/products/${id}/add-to-stock`, removeData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (data.type === 'PRIZE') {
          const index = prizes.findIndex(
            prize => prize.id === id && prize.ownerId === data.groupId,
          );
          prizes[index] = {
            ...prizes[index],
            quantity:
              (prizes[index].quantity || 0) -
              parseFloat(data.quantity.toString()),
          };
          setPrizes([...prizes]);
          addToast({ title: 'Prêmio removido com sucesso', type: 'success' });
        } else {
          const index = supplies.findIndex(
            supply => supply.id === id && supply.ownerId === data.groupId,
          );
          supplies[index] = {
            ...supplies[index],
            quantity:
              (supplies[index].quantity || 0) -
              parseFloat(data.quantity.toString()),
          };
          setSupplies([...supplies]);
          addToast({
            title: 'Suprimento removido com sucesso',
            type: 'success',
          });
        }
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token, supplies, prizes],
  );

  const trasferProduct = useCallback(
    async (data: TransferProductDto, id: string) => {
      try {
        await api.post(`/products/${id}/transfer`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setShoulRefresh(!shouldRefresh);
        addToast({
          title: 'Transferência efetuada com sucesso',
          type: 'success',
        });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [shouldRefresh, token],
  );

  const createProduct = useCallback(
    async (data: CreateProductDto) => {
      try {
        const response = await api.post<Prize | Supply>('/products', data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          if (data.type === 'PRIZE') {
            const prizeData: StockItem = {
              id: response.data.id,
              label: response.data.label,
              quantity: response.data.quantity,
              ownerId: data.groupId,
              ownerLabel:
                (groups.find(group => group.id === data.groupId)?.isPersonal
                  ? 'Parceria pessoal'
                  : groups.find(group => group.id === data.groupId)?.label) ||
                '',
            };
            setPrizes([prizeData, ...prizes]);
          }
          if (data.type === 'SUPPLY') {
            const supplyData: StockItem = {
              id: response.data.id,
              label: response.data.label,
              quantity: response.data.quantity,
              ownerId: data.groupId,
              ownerLabel:
                (groups.find(group => group.id === data.groupId)?.isPersonal
                  ? 'Parceria pessoal'
                  : groups.find(group => group.id === data.groupId)?.label) ||
                '',
            };
            setSupplies([supplyData, ...supplies]);
          }
        }
        addToast({
          title: 'Produto adicionado com sucesso',
          type: 'success',
        });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);

        return undefined;
      }
    },
    [groups, supplies, prizes, token],
  );

  const transferFromMachine = useCallback(
    async (data: TransferFromMachineDto, id: string) => {
      try {
        await api.patch(`/products/${id}/remove-from-machine`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        addToast({
          title: 'Produto transferido com sucesso',
          type: 'success',
        });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  return (
    <StockContext.Provider
      value={{
        toggleAddItems,
        toggleRemoveItems,
        toggleTransferProduct,
        toggleCreateProduct,
        getStockItems,
        addProduct,
        removeProduct,
        trasferProduct,
        createProduct,
        transferFromMachine,
        shouldRefresh,
        openRemoveItems,
        openAddItems,
        openCreateProduct,
        openTransferProduct,
        prizes,
        supplies,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

function useStock(): StockContext {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a MachineProvider');
  }
  return context;
}

export { StockProvider, useStock };
