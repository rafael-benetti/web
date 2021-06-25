/* eslint-disable no-console */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { MachineLog } from '../entiti/machine-log';
import { Telemetry } from '../entiti/telemetry';
import { TelemetryLog } from '../entiti/telemetry-log';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';

interface TelemetryContext {
  getTelemetries(
    offset?: number,
    filter?: { groupId?: string; telemetryBoardId?: string },
  ): Promise<
    | {
        count: number;
        telemetryBoards: Telemetry[];
      }
    | undefined
  >;
  transferTelemetry(groupId: string, id: string): Promise<void>;
  toggleTransferTelemetry(id: string | undefined): void;
  toggleTelemetryModal(id: string | undefined): void;
  getTelemetryLogs(
    offset: number | undefined,
    machineId: string,
    filter?: {
      startDate?: string;
      endDate?: string;
      type: 'IN' | 'OUT' | 'none';
    },
  ): Promise<void>;
  getMachineLogs(
    offset: number | undefined,
    machineId: string,
    filter?: {
      startDate?: string;
      endDate?: string;
      type: 'FIX_STOCK' | 'REMOTE_CREDIT' | 'none';
    },
  ): Promise<void>;
  machineLogs: MachineLog[];
  showTelemetryModal: string | undefined;
  showTransferTelemetry: string | undefined;
  telemetries: Telemetry[];
  count?: number;
  telemetryLogs: TelemetryLog[];
  telemetryCount?: number;
}

const TelemetryContext = createContext({} as TelemetryContext);

const TelemetryProvider: React.FC = ({ children }) => {
  // hook
  const { token } = useAuth();
  const { addToast } = useToast();
  const { shootError } = useError();

  // state
  const [telemetries, setTelemetries] = useState<Telemetry[]>([]);
  const [showTelemetryModal, setShowTelemetryModal] = useState<
    string | undefined
  >();
  const [showTransferTelemetry, setShowTransferTelemetry] = useState<
    string | undefined
  >();
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);
  const [machineLogs, setMachineLogs] = useState<MachineLog[]>([]);
  const [telemetryCount, setTelemetryCount] = useState<number>();
  const [count, setCount] = useState<number>();

  const getTelemetryLogs = useCallback(
    async (
      offset: number | undefined,
      machineId: string,
      filter?: {
        startDate?: string;
        endDate?: string;
        type: 'IN' | 'OUT' | 'none';
      },
    ) => {
      try {
        const response = await api.get<{
          count: number;
          telemetryLogs: TelemetryLog[];
        }>(`telemetry-logs`, {
          params: {
            limit: 10,
            offset,
            machineId,
            startDate: filter?.startDate
              ? new Date(filter.startDate)
              : undefined,
            endDate: filter?.endDate ? new Date(filter.endDate) : undefined,
            type: filter?.type === 'none' ? undefined : filter?.type,
          },
          headers: { authorization: `Bearer ${token}` },
        });
        setCount(response.data.count);
        setTelemetryLogs(response.data.telemetryLogs);
      } catch (error) {
        console.log(error);
      }
    },
    [token],
  );

  const getMachineLogs = useCallback(
    async (
      offset: number | undefined,
      machineId: string,
      filter?: {
        startDate?: string;
        endDate?: string;
        type: 'FIX_STOCK' | 'REMOTE_CREDIT' | 'none';
      },
    ) => {
      try {
        const response = await api.get<{
          count: number;
          machineLogs: MachineLog[];
        }>(`machine-logs`, {
          params: {
            limit: 10,
            offset,
            machineId,
            startDate: filter?.startDate
              ? new Date(filter.startDate)
              : undefined,
            endDate: filter?.endDate ? new Date(filter.endDate) : undefined,
            type: filter?.type === 'none' ? undefined : filter?.type,
          },
          headers: { authorization: `Bearer ${token}` },
        });
        setCount(response.data.count);
        setMachineLogs(response.data.machineLogs);
      } catch (error) {
        console.log(error);
      }
    },
    [token],
  );

  const toggleTransferTelemetry = useCallback((id: string | undefined) => {
    if (id) {
      setShowTransferTelemetry(id);
    } else {
      setShowTransferTelemetry(undefined);
    }
  }, []);

  const toggleTelemetryModal = useCallback((id: string | undefined) => {
    setShowTelemetryModal(id);
  }, []);

  const getTelemetries = useCallback(
    async (
      offset?: number,
      filter?: { groupId?: string; telemetryBoardId?: string },
    ) => {
      try {
        const response = await api.get<{
          count: number;
          telemetryBoards: Telemetry[];
        }>('/telemetry-boards', {
          params: {
            limit: offset === undefined ? undefined : '10',
            offset: offset === undefined ? undefined : offset,
            groupId:
              filter?.groupId && filter?.groupId !== 'none'
                ? filter.groupId
                : undefined,
            telemetryBoardId: filter?.telemetryBoardId
              ? filter.telemetryBoardId
              : undefined,
          },
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          setTelemetries(response.data.telemetryBoards);
          setTelemetryCount(response.data.count);
        }
        return response.data;
      } catch (error) {
        return undefined;
      }
    },
    [token],
  );

  const transferTelemetry = useCallback(
    async (groupId: string, id: string) => {
      try {
        const response = await api.patch(
          `/telemetry-boards/${id}`,
          { groupId },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 200) {
          if (groupId) {
            const index = telemetries.findIndex(
              telemetry => telemetry.id === id,
            );

            telemetries[index].groupId = groupId;
            setTelemetries([...telemetries]);
            addToast({
              title: 'Telemetria transferida com sucesso',
              type: 'success',
            });
            toggleTransferTelemetry(undefined);
          }
          return;
        }
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token, telemetries],
  );

  return (
    <TelemetryContext.Provider
      value={{
        getTelemetries,
        transferTelemetry,
        toggleTransferTelemetry,
        getMachineLogs,
        machineLogs,
        showTelemetryModal,
        toggleTelemetryModal,
        getTelemetryLogs,
        telemetryLogs,
        count,
        showTransferTelemetry,
        telemetries,
        telemetryCount,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

function useTelemetry(): TelemetryContext {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a AuthProvider');
  }
  return context;
}

export { TelemetryProvider, useTelemetry };
