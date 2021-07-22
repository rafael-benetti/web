/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useCallback, useContext, useState } from 'react';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import FileDownload from 'js-file-download';
import { GroupReport } from '../entiti/group-report';
import { MachineReport } from '../entiti/machine-report';
import { PointOfSaleReport } from '../entiti/point-of-sale-report';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { Inventory } from '../entiti/inventory';

interface ReportContext {
  getGroupReport(
    date: { startDate: Date; endDate: Date },
    filter: {
      groupIds?: string[];
    },
    download?: boolean,
  ): Promise<void>;
  getInventory(groupId?: string): Promise<void>;
  getMachineReport(
    date: { startDate: Date; endDate: Date },
    filter: { groupId?: string; machineIds?: string[] },
    download?: boolean,
  ): Promise<void>;
  getPointsOfSaleReport(
    date: {
      startDate: Date;
      endDate: Date;
    },
    filter: {
      groupId?: string;
      pointsOfSaleIds?: string[];
    },
    download?: boolean,
  ): Promise<void>;
  getUserStockReport(): Promise<void>;
  getCollectionReport(
    date: { startDate: Date; endDate: Date },
    pointOfSaleId: string,
  ): Promise<void>;
  clearReport(): void;
  inventory?: Inventory;
  groupReportData?: GroupReport[];
  machineReportData?: MachineReport[];
  pointsOfSaleReportData?: PointOfSaleReport[];
}

const ReportContext = createContext({} as ReportContext);

const ReportProvider: React.FC = ({ children }) => {
  // hook
  const { shootError } = useError();
  const { token } = useAuth();

  // state
  const [groupReportData, setGroupReportData] = useState<GroupReport[]>();
  const [machineReportData, setMachineReportData] = useState<MachineReport[]>();
  const [inventory, setInventory] = useState<Inventory>();
  const [pointsOfSaleReportData, setPointsOfSaleReportData] = useState<
    PointOfSaleReport[]
  >();

  const getGroupReport = useCallback(
    async (
      date: { startDate: Date; endDate: Date },
      filter: {
        groupIds?: string[];
      },
      download?: boolean,
    ) => {
      try {
        const response = await api.get<{
          date: { startDate: Date; endDate: Date };
          groupsAnalytics: GroupReport[];
        }>('reports/groups', {
          params: {
            startDate: date.startDate,
            endDate: date.endDate,
            download: download || undefined,
            groupIds: filter?.groupIds || undefined,
          },
          headers: {
            authorization: `Bearer ${token}`,
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          ...(download && { responseType: 'arraybuffer' }),
        });
        if (download) {
          FileDownload(
            new Blob([response.data as any], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            `Relatório de parcerias - ${format(new Date(), `dd'-'MM'`, {
              locale: ptLocale,
            })}.xlsx`,
          );
          return;
        }
        setGroupReportData(response.data.groupsAnalytics);
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const getInventory = useCallback(
    async (groupId?: string) => {
      try {
        const response = await api.get<Inventory>('/users/inventory', {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: {
            groupId: groupId === 'none' || !groupId ? undefined : groupId,
          },
        });
        setInventory(response.data);
      } catch (error) {}
    },
    [token],
  );

  const getMachineReport = useCallback(
    async (
      date: { startDate: Date; endDate: Date },
      filter: { groupId?: string; machineIds?: string[] },
      download?: boolean,
    ) => {
      try {
        const response = await api.get<{
          date: { startDate: Date; endDate: Date };
          machineAnalytics: MachineReport[];
        }>('reports/machines', {
          params: {
            startDate: date.startDate,
            endDate: date.endDate,
            download: download || undefined,
            groupId: filter?.groupId === 'none' ? undefined : filter?.groupId,
            machineIds: filter?.machineIds || undefined,
          },
          headers: {
            authorization: `Bearer ${token}`,
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          ...(download && { responseType: 'arraybuffer' }),
        });
        if (download) {
          FileDownload(
            new Blob([response.data as any], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            `Relatório de máquinas - ${format(new Date(), `dd'-'MM'`, {
              locale: ptLocale,
            })}.xlsx`,
          );
          return;
        }
        setMachineReportData(response.data.machineAnalytics);
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const getPointsOfSaleReport = useCallback(
    async (
      date: { startDate: Date; endDate: Date },
      filter: {
        groupId?: string;
        pointsOfSaleIds?: string[];
      },
      download?: boolean,
    ) => {
      try {
        const response = await api.get<{
          date: { startDate: Date; endDate: Date };
          pointsOfSaleAnalytics: PointOfSaleReport[];
        }>('reports/points-of-sale', {
          params: {
            startDate: date.startDate,
            endDate: date.endDate,
            download: download || undefined,
            groupId: filter?.groupId === 'none' ? undefined : filter?.groupId,
            pointsOfSaleIds: filter?.pointsOfSaleIds || undefined,
          },
          headers: {
            authorization: `Bearer ${token}`,
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          ...(download && { responseType: 'arraybuffer' }),
        });
        if (download) {
          FileDownload(
            new Blob([response.data as any], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            `Relatório de PDV - ${format(new Date(), `dd'-'MM'`, {
              locale: ptLocale,
            })}.xlsx`,
          );
          return;
        }
        setPointsOfSaleReportData(response.data.pointsOfSaleAnalytics);
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const getCollectionReport = useCallback(
    async (date: { startDate: Date; endDate: Date }, pointOfSaleId: string) => {
      try {
        const response = await api.get('reports/collections', {
          params: {
            startDate: date.startDate,
            endDate: date.endDate,
            pointOfSaleId,
            download: true,
          },
          headers: {
            authorization: `Bearer ${token}`,
            contentType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          responseType: 'arraybuffer',
        });
        FileDownload(
          new Blob([response.data as any], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          `Relatório de coletas - ${format(new Date(), `dd'-'MM'`, {
            locale: ptLocale,
          })}.xlsx`,
        );
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const getUserStockReport = useCallback(async () => {
    try {
      const response = await api.get('reports/stocks', {
        params: {
          download: true,
        },
        headers: {
          authorization: `Bearer ${token}`,
          contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        responseType: 'arraybuffer',
      });
      FileDownload(
        new Blob([response.data as any], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        `Relatório de estoque - ${format(new Date(), `dd'-'MM'`, {
          locale: ptLocale,
        })}.xlsx`,
      );
    } catch (error) {
      shootError(error.response.data.errorCode);
    }
  }, [token]);

  const clearReport = useCallback(() => {
    setGroupReportData(undefined);
    setMachineReportData(undefined);
    setPointsOfSaleReportData(undefined);
  }, []);

  return (
    <ReportContext.Provider
      value={{
        getGroupReport,
        clearReport,
        getMachineReport,
        getPointsOfSaleReport,
        getInventory,
        getUserStockReport,
        getCollectionReport,
        pointsOfSaleReportData,
        machineReportData,
        inventory,
        groupReportData,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

function useReport(): ReportContext {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport must be used within a ToastPrivder');
  }
  return context;
}

export { ReportProvider, useReport };
