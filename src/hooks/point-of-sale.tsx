/* eslint-disable no-param-reassign */
/* eslint-disable no-empty */
import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  EditPointOfSaleDto,
  EditRentDto,
  HandlePointOfSaleDto,
} from '../dto/handle-point-os-sale-dto';
import { FilterPointsOfSaleDto } from '../entiti/filter-point-of-sale';
import { PointOfSaleInfo } from '../entiti/point-of-sale-info';
import { PointOfSale } from '../entiti/point-of-sales';
import { ResponseGetPointsOfSale } from '../entiti/response-get-points-of-sale';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';
import { useUtils } from './utils';

interface PointOfSaleContext {
  getPointsOfSale(
    offset: number | undefined,
    filter: FilterPointsOfSaleDto | undefined,
  ): Promise<ResponseGetPointsOfSale | undefined>;
  createPointOfSale(
    data: Omit<HandlePointOfSaleDto, 'id'>,
  ): Promise<PointOfSale | undefined>;
  editPointOfSale(
    data: Omit<HandlePointOfSaleDto, 'id'>,
    id: string,
  ): Promise<PointOfSale | undefined>;
  getSinglePointOfSale(
    id: string,
    filter: {
      period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<void>;
  editRent(rent: EditRentDto, id: string): Promise<void>;
  toggleActions(
    type:
      | 'RENT'
      | 'MACHINE'
      | 'ROUTE'
      | 'REMOVE_ROUTE'
      | 'WARNING_ROUTE'
      | undefined,
    refresh?: boolean,
  ): void;
  showAction:
    | 'RENT'
    | 'MACHINE'
    | 'ROUTE'
    | 'REMOVE_ROUTE'
    | 'WARNING_ROUTE'
    | undefined;
  shouldRefreshPoint: boolean;
  pointOfSaleInfo: PointOfSaleInfo | undefined;
  pointsOfSale: PointOfSale[];
  count: number | undefined;
}

const PointOfSaleContext = createContext({} as PointOfSaleContext);

const PointOfSaleProvider: React.FC = ({ children }) => {
  // hook
  const { addToast } = useToast();
  const { token } = useAuth();
  const { unformatPhone, unformatCep } = useUtils();
  const { shootError } = useError();

  // state
  const [pointsOfSale, setPointsOfSale] = useState<PointOfSale[]>([]);
  const [count, setCount] = useState<number>();
  const [pointOfSaleInfo, setPointOfSaleInfo] = useState<PointOfSaleInfo>();
  const [showAction, setShowAction] = useState<
    'RENT' | 'MACHINE' | 'ROUTE' | 'REMOVE_ROUTE' | 'WARNING_ROUTE' | undefined
  >();
  const [shouldRefreshPoint, setShouldRefreshPoint] = useState<boolean>(false);

  const getPointsOfSale = useCallback(
    async (
      offset: number | undefined,
      filter: FilterPointsOfSaleDto | undefined,
    ) => {
      const params = [
        offset !== undefined ? `limit=${10}` : '',
        offset !== undefined ? `offset=${offset}` : '',
        filter?.groupId ? `groupId=${filter.groupId}` : '',

        filter?.label ? `label=${filter.label}` : '',
      ]
        .filter(value => value !== '')
        .join('&');
      try {
        const response = await api.get<ResponseGetPointsOfSale>(
          `/pointsOfSale?${params}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        setPointsOfSale(response.data.pointsOfSale);
        setCount(response.data.count);
        return response.data;
      } catch (error) {
        return undefined;
      }
    },
    [token],
  );

  const getSinglePointOfSale = useCallback(
    async (
      id: string,
      filter: {
        period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
        startDate?: string;
        endDate?: string;
      },
    ) => {
      try {
        const response = await api.get<PointOfSaleInfo>(`/pointsOfSale/${id}`, {
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
        setPointOfSaleInfo(response.data);
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const createPointOfSale = useCallback(
    async (data: Omit<HandlePointOfSaleDto, 'id'>) => {
      if (data.address.extraInfo === '') {
        delete data.address.extraInfo;
      }
      if (data.secondaryPhoneNumber === '') {
        delete data.secondaryPhoneNumber;
      }
      const createPointData: HandlePointOfSaleDto = {
        ...data,
        primaryPhoneNumber: unformatPhone(data.primaryPhoneNumber),
        secondaryPhoneNumber: data.secondaryPhoneNumber
          ? unformatPhone(data.secondaryPhoneNumber)
          : undefined,
        rent:
          data.rent
            .toString()
            .replaceAll(',', '.')
            .replaceAll('R$', '')
            .replaceAll('%', '') === ''
            ? '0'
            : data.rent
                .toString()
                .replaceAll(',', '.')
                .replaceAll('R$', '')
                .replaceAll('%', ''),
        address: {
          ...data.address,
          zipCode: unformatCep(data.address.zipCode),
        },
      };
      try {
        const response = await api.post<PointOfSale>(
          '/pointsOfSale',
          createPointData,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        setPointsOfSale(state => {
          state.push(response.data);
          return state;
        });
        addToast({ title: 'Ponto de venda adicionado', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  const editPointOfSale = useCallback(
    async (data: Omit<HandlePointOfSaleDto, 'id'>, id: string) => {
      const editPointOfSaleData: EditPointOfSaleDto = {
        contactName: data.contactName,
        label: data.label,
        rent:
          data.rent
            .toString()
            .replaceAll(',', '.')
            .replaceAll('R$', '')
            .replaceAll('%', '') === ''
            ? '0'
            : data.rent
                .toString()
                .replaceAll(',', '.')
                .replaceAll('R$', '')
                .replaceAll('%', ''),
        primaryPhoneNumber: unformatPhone(data.primaryPhoneNumber),
        secondaryPhoneNumber: data.secondaryPhoneNumber
          ? unformatPhone(data.secondaryPhoneNumber)
          : undefined,
        address: {
          extraInfo: data.address.extraInfo,
        },
      };
      if (!editPointOfSaleData.address?.extraInfo) {
        delete editPointOfSaleData.address;
      }
      try {
        const response = await api.patch<PointOfSale>(
          `/pointsOfSale/${id}`,
          editPointOfSaleData,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        setPointsOfSale(state => {
          const index = pointsOfSale.findIndex(point => point.id === id);
          state[index] = response.data;
          return state;
        });
        addToast({ title: 'Ponto de editado com sucesso', type: 'success' });
        return response.data;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token, pointsOfSale],
  );

  const editRent = useCallback(
    async (rent: EditRentDto, id: string) => {
      try {
        await api.patch<PointOfSale>(`/pointsOfSale/${id}`, rent, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        addToast({ title: 'Aluguel modificado com sucesso', type: 'success' });
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const toggleActions = useCallback(
    (
      type:
        | 'RENT'
        | 'MACHINE'
        | 'ROUTE'
        | 'REMOVE_ROUTE'
        | 'WARNING_ROUTE'
        | undefined,
      refresh?: boolean,
    ) => {
      setShowAction(type);
      if (refresh) {
        setShouldRefreshPoint(!shouldRefreshPoint);
      }
    },
    [shouldRefreshPoint],
  );

  return (
    <PointOfSaleContext.Provider
      value={{
        getPointsOfSale,
        createPointOfSale,
        editPointOfSale,
        getSinglePointOfSale,
        editRent,
        toggleActions,
        shouldRefreshPoint,
        showAction,
        pointOfSaleInfo,
        pointsOfSale,
        count,
      }}
    >
      {children}
    </PointOfSaleContext.Provider>
  );
};

function usePointOfSale(): PointOfSaleContext {
  const context = useContext(PointOfSaleContext);
  if (!context) {
    throw new Error('usePointOfSale must be used within a group');
  }
  return context;
}

export { PointOfSaleProvider, usePointOfSale };
