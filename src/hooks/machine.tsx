/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { DeleteMachineDto } from '../dto/delete-machine';
import { FixMachineStockDto } from '../dto/fix-machine-stock';
import { HandleMachineDto } from '../dto/handle-machine';
import { RemoteCreditDto } from '../dto/remote-credit-dto';
import { TransferMachineDto } from '../dto/transfer-machine';
import { TransferProductDto } from '../dto/transfer-product';
import { FilterMachineDto } from '../entiti/filter-machine';
import { Machine } from '../entiti/machine';
import { MachineInfo } from '../entiti/machine-info';
import { ResponseGetMachine } from '../entiti/response-get-machines';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';

interface MachineContext {
  getMachines(
    offset: number | undefined,
    filter: FilterMachineDto | undefined,
  ): Promise<ResponseGetMachine | undefined>;
  getSingleMachine(
    id: string,
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY',
  ): Promise<void>;
  createMachine(data: HandleMachineDto): Promise<Machine | undefined>;
  editMachine(data: HandleMachineDto, id: string): Promise<Machine | undefined>;
  transferMachine(
    data: TransferMachineDto,
    id: string,
  ): Promise<Machine | undefined>;
  deleteMachine(
    data: DeleteMachineDto,
    id: string,
  ): Promise<Machine | undefined>;
  toggleTransferMachine(bool: boolean, refresh?: boolean): void;
  toggleDeleteMachine(bool: boolean): void;
  toggleTransferProductToBox(id: string | undefined, refresh?: boolean): void;
  transferProductToMachine(data: TransferProductDto, id: string): Promise<void>;
  toggleChangeTypeOfPrize(bool: boolean, refresh?: boolean): void;
  editProductTypeInMachine(data: string, id: string): Promise<void>;
  toggleEditMinimumStock(bool: boolean, refresh?: boolean): void;
  toggleMaintenanceMode(bool: boolean, refresh?: boolean): void;
  toggleGoals(bool: boolean, refresh?: boolean): void;
  togglePrizeRecover(id: string | undefined, refresh?: boolean): void;
  minimumPrizeCount(data: string, id: string): Promise<void>;
  fixMachineStock(data: FixMachineStockDto, id: string): Promise<void>;
  toggleFixMachineStock(id: string | undefined, refresh?: boolean): void;
  setMaintenanceMode(bool: boolean, id: string): Promise<void>;
  editGoals(
    id: string,
    data?: {
      incomePerPrizeGoal?: string;
      incomePerMonthGoal?: string;
    },
  ): Promise<void>;
  toggleRemoteCredit(bool: boolean, refresh?: boolean): void;
  sendRemoteCredit(data: RemoteCreditDto, machineId: string): Promise<boolean>;
  showFixMachineStock: string | undefined;
  showPrizeRecover: string | undefined;
  showEditMinimumStock: boolean;
  showChangeTypeOfPrize: boolean;
  showTransferProductToBox: string | undefined;
  showDeleteMachine: boolean;
  showTransferMachine: boolean;
  showMaintenanceMode: boolean;
  showMachineGoals: boolean;
  shouldRefresh?: boolean;
  machines: Machine[];
  machineInfo?: MachineInfo;
  count: number | undefined;
  showRemoteCredit: boolean;
}

const MachineContext = createContext({} as MachineContext);

const MachineProvider: React.FC = ({ children }) => {
  // hook
  const { addToast } = useToast();
  const { token } = useAuth();
  const { shootError } = useError();

  // state
  const [machines, setMachines] = useState<Machine[]>([]);
  const [count, setCount] = useState<number>();
  const [machineInfo, setMachineInfo] = useState<MachineInfo>();
  const [showTransferMachine, setShowTransferMachine] = useState<boolean>(
    false,
  );
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [showDeleteMachine, setShowDeleteMachine] = useState<boolean>(false);
  const [
    showTransferProductToBox,
    setShowTransferProductToBox,
  ] = useState<string>();
  const [showFixMachineStock, setShowFixMachineStock] = useState<string>();
  const [showPrizeRecover, setShowPrizeRecover] = useState<string>();
  const [showChangeTypeOfPrize, setShowChangeTypeOfPrize] = useState(false);
  const [showEditMinimumStock, setShowEditMinimumStock] = useState(false);
  const [showMaintenanceMode, setShowMaintenanceMode] = useState(false);
  const [showMachineGoals, setShowMachineGoals] = useState(false);
  const [showRemoteCredit, setShowRemoteCredit] = useState(false);

  const getMachines = useCallback(
    async (
      offset: number | undefined,
      filter: FilterMachineDto | undefined,
    ) => {
      const params = [
        `limit=${10}`,
        offset ? `offset=${offset}` : '',
        filter?.isActive ? `isActive=${filter.isActive}` : '',
        filter?.groupId ? `groupId=${filter.groupId}` : '',
        filter?.categoryId ? `categoryId=${filter.categoryId}` : '',
        filter?.telemetryStatus
          ? `telemetryStatus=${filter.telemetryStatus}`
          : '',
        filter?.pointOfSaleId
          ? `pointOfSaleId=${filter.pointOfSaleId}`
          : filter?.pointOfSaleId === null
          ? `pointOfSaleId=null`
          : '',
        filter?.serialNumber ? `serialNumber=${filter.serialNumber}` : '',
        filter?.routeId ? `routeId=${filter.routeId}` : '',
        filter?.lean ? true : undefined,
      ]
        .filter(value => value !== '')
        .join('&');
      try {
        const response = await api.get<ResponseGetMachine>(
          `/machines?${params}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        setCount(response.data.count);
        setMachines(response.data.machines);
        return response.data;
      } catch (error) {
        return undefined;
      }
    },
    [token, count],
  );

  const getSingleMachine = useCallback(
    async (id: string, period: 'DAILY' | 'WEEKLY' | 'MONTHLY') => {
      try {
        const response = await api.get<MachineInfo>(
          `machines/${id}?period=${period}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        setMachineInfo(response.data);
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const createMachine = useCallback(
    async (data: HandleMachineDto) => {
      const createData: HandleMachineDto = {
        ...data,
        boxes: data.boxes.map(box => {
          return {
            counters: box.counters.map(counter => {
              return {
                counterTypeId: counter.counterTypeId || undefined,
                hasMechanical: counter.hasDigital || false,
                hasDigital: counter.hasDigital || false,
                pin: counter.pin || undefined,
              };
            }),
          };
        }),
      };
      if (data.locationId === 'stock') {
        delete createData.locationId;
      }
      if (data.operatorId === 'none') {
        delete createData.operatorId;
      }
      if (data.telemetryBoardId === 'none') {
        delete createData.telemetryBoardId;
      }
      if (data.typeOfPrizeId === '') {
        delete createData.typeOfPrizeId;
      }
      if (!data.minimumPrizeCount) {
        delete createData.minimumPrizeCount;
      }
      try {
        const response = await api.post<Machine>('/machines', createData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setMachines(state => {
          return [...state, response.data];
        });
        addToast({ title: 'Máquina criada com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  const editMachine = useCallback(
    async (data: HandleMachineDto, id: string) => {
      const editData: HandleMachineDto = {
        ...data,
        boxes: data.boxes.map(box => {
          return {
            counters: box.counters,
            id: box.id,
          };
        }),
      };
      if (data.locationId === 'stock') {
        delete editData.locationId;
      }
      if (data.operatorId === 'none') {
        editData.operatorId = null;
      }
      if (data.telemetryBoardId === 'none') {
        editData.telemetryBoardId = null;
      }
      if (data.typeOfPrizeId === '') {
        delete editData.typeOfPrizeId;
      }
      if (!data.minimumPrizeCount) {
        delete editData.minimumPrizeCount;
      }

      try {
        const response = await api.put<Machine>(`/machines/${id}`, editData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setMachines(state => {
          const index = state.findIndex(machine => machine.id === id);
          state[index] = response.data;
          return state;
        });
        addToast({ title: 'Máquina editada com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  const transferMachine = useCallback(
    async (data: TransferMachineDto, id: string) => {
      try {
        const response = await api.put<Machine>(`/machines/${id}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setMachines(state => {
          const index = state.findIndex(machine => machine.id === id);
          state[index] = response.data;
          return state;
        });
        addToast({ title: 'Máquina transferida com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  const editProductTypeInMachine = useCallback(
    async (data: string, id: string) => {
      try {
        await api.put<Machine>(
          `/machines/${id}`,
          { typeOfPrizeId: data === '' ? null : data },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        addToast({ title: 'Produto alterado com seucesso', type: 'success' });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const setMaintenanceMode = useCallback(
    async (bool: boolean, id: string) => {
      try {
        await api.put<Machine>(
          `/machines/${id}`,
          { maintenance: bool },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        addToast({
          title: 'Máquina alterada para modo manutenção',
          type: 'success',
        });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const minimumPrizeCount = useCallback(
    async (data: string, id: string) => {
      try {
        await api.put<Machine>(
          `/machines/${id}`,
          { minimumPrizeCount: data },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        addToast({
          title: 'Quantidade alterada com seucesso',
          type: 'success',
        });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const editGoals = useCallback(
    async (
      id: string,
      data?: {
        incomePerPrizeGoal?: string;
        incomePerMonthGoal?: string;
      },
    ) => {
      try {
        if (data) {
          if (!data.incomePerMonthGoal) {
            delete data.incomePerMonthGoal;
          }
          if (!data.incomePerPrizeGoal) {
            delete data.incomePerPrizeGoal;
          }
          await api.put<Machine>(
            `/machines/${id}`,
            {
              incomePerPrizeGoal: data.incomePerPrizeGoal,
              incomePerMonthGoal: data.incomePerMonthGoal,
            },
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          );
          addToast({
            title: 'Meta alterada com sucesso',
            type: 'success',
          });
        }
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const sendRemoteCredit = useCallback(
    async (data: RemoteCreditDto, machineId: string) => {
      try {
        await api.post(`machine-logs/${machineId}`, data, {
          headers: { authorization: `Bearer ${token}` },
        });
        addToast({
          title: 'Crédito remoto enviado com sucesso',
          type: 'success',
        });
        return true;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return false;
      }
    },
    [token],
  );

  const fixMachineStock = useCallback(
    async (data: FixMachineStockDto, id: string) => {
      try {
        await api.patch<Machine>(`/machines/${id}/fix-stock`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        addToast({
          title: 'Estoque alterado com sucesso',
          type: 'success',
        });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const deleteMachine = useCallback(
    async (data: DeleteMachineDto, id: string) => {
      try {
        const response = await api.put<Machine>(`/machines/${id}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        addToast({ title: 'Máquina deletada com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [],
  );

  const toggleTransferMachine = useCallback(
    (bool: boolean, refresh?: boolean) => {
      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
      setShowTransferMachine(bool);
    },
    [shouldRefresh],
  );

  const toggleDeleteMachine = useCallback(
    (bool: boolean) => {
      setShowDeleteMachine(bool);
    },
    [shouldRefresh],
  );

  const toggleTransferProductToBox = useCallback(
    (id: string | undefined, refresh?: boolean) => {
      if (id) {
        setShowTransferProductToBox(id);
      } else {
        setShowTransferProductToBox(undefined);
      }
      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
    },
    [shouldRefresh],
  );

  const togglePrizeRecover = useCallback(
    (id: string | undefined, refresh?: boolean) => {
      if (id) {
        setShowPrizeRecover(id);
      } else {
        setShowPrizeRecover(undefined);
      }
      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
    },
    [shouldRefresh],
  );
  const toggleFixMachineStock = useCallback(
    (id: string | undefined, refresh?: boolean) => {
      if (id) {
        setShowFixMachineStock(id);
      } else {
        setShowFixMachineStock(undefined);
      }
      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
    },
    [shouldRefresh],
  );

  const toggleChangeTypeOfPrize = useCallback(
    (bool: boolean, refresh?: boolean) => {
      setShowChangeTypeOfPrize(bool);

      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
    },
    [shouldRefresh],
  );

  const toggleRemoteCredit = useCallback(
    (bool: boolean, refresh?: boolean) => {
      setShowRemoteCredit(bool);

      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
    },
    [shouldRefresh],
  );

  const toggleEditMinimumStock = useCallback(
    (bool: boolean, refresh?: boolean) => {
      setShowEditMinimumStock(bool);

      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
    },
    [shouldRefresh],
  );

  const toggleMaintenanceMode = useCallback(
    (bool: boolean, refresh?: boolean) => {
      setShowMaintenanceMode(bool);

      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
    },
    [shouldRefresh],
  );

  const transferProductToMachine = useCallback(
    async (data: TransferProductDto, id: string) => {
      try {
        await api.post(`products/${id}/transfer`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        addToast({ title: 'Produto transferido com sucesso', type: 'success' });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const toggleGoals = useCallback(
    (bool: boolean, refresh?: boolean) => {
      setShowMachineGoals(bool);

      if (refresh) {
        setShouldRefresh(!shouldRefresh);
      }
    },
    [shouldRefresh],
  );

  return (
    <MachineContext.Provider
      value={{
        getMachines,
        getSingleMachine,
        createMachine,
        editMachine,
        toggleTransferMachine,
        transferMachine,
        deleteMachine,
        toggleDeleteMachine,
        toggleTransferProductToBox,
        transferProductToMachine,
        toggleChangeTypeOfPrize,
        editProductTypeInMachine,
        toggleEditMinimumStock,
        togglePrizeRecover,
        minimumPrizeCount,
        fixMachineStock,
        toggleFixMachineStock,
        toggleMaintenanceMode,
        setMaintenanceMode,
        toggleGoals,
        editGoals,
        toggleRemoteCredit,
        sendRemoteCredit,
        showRemoteCredit,
        showMachineGoals,
        showMaintenanceMode,
        showFixMachineStock,
        showPrizeRecover,
        showEditMinimumStock,
        showChangeTypeOfPrize,
        showTransferProductToBox,
        showDeleteMachine,
        shouldRefresh,
        showTransferMachine,
        count,
        machines,
        machineInfo,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

function useMachine(): MachineContext {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error('useMachine must be used within a CategoryProvider');
  }
  return context;
}

export { MachineProvider, useMachine };
