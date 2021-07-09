/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { HandleGroupsDto } from '../dto/handle-groups';
import { Group } from '../entiti/group';
import { GroupInfo } from '../entiti/group-info';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';

interface GroupContext {
  getGroups(): Promise<Group[] | undefined>;
  getSingleGroup(
    id: string,
    filter: {
      period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<void>;
  createGroups(data: Omit<HandleGroupsDto, 'id'>): Promise<Group | undefined>;
  editGroups(
    data: Omit<HandleGroupsDto, 'id'>,
    id: string,
  ): Promise<Group | undefined>;
  groups: Group[];
  openEditGroup(id?: string, refresh?: boolean): void;
  showEditGroup?: string;
  openCreateGroup(bool: boolean): void;
  showCreateGroup: boolean;
  groupInfo?: GroupInfo;
  shouldRefresh: boolean;
}

const GroupContext = createContext({} as GroupContext);

const GroupProvider: React.FC = ({ children }) => {
  // hook
  const { token } = useAuth();
  const { addToast } = useToast();
  const { shootError } = useError();
  // state
  const [groups, setGroups] = useState<Group[]>([]);
  const [showEditGroup, setShowEditGroup] = useState<string>();
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);
  const [groupInfo, setGroupInfo] = useState<GroupInfo>();
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const openEditGroup = useCallback(
    (id: string, refresh?: boolean) => {
      if (id) {
        setShowEditGroup(id);
      } else {
        setShowEditGroup(undefined);
        if (refresh) {
          setShouldRefresh(!shouldRefresh);
        }
      }
    },
    [showEditGroup, shouldRefresh],
  );

  const openCreateGroup = useCallback(
    (bool: boolean) => {
      setShowCreateGroup(bool);
    },
    [showCreateGroup],
  );

  const getGroups = useCallback(async () => {
    try {
      const response = await api.get<Group[]>('/groups', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const allGroups = response.data.map(group => {
        if (group.isPersonal) {
          group.label = 'Parceria Pessoal';
        }
        return group;
      });
      setGroups(allGroups);
      return response.data;
    } catch (error) {
      return undefined;
    }
  }, [token]);

  const getSingleGroup = useCallback(
    async (
      id: string,
      filter: {
        period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
        startDate?: string;
        endDate?: string;
      },
    ) => {
      try {
        const response = await api.get<GroupInfo>(`v2/groups/${id}`, {
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
        setGroupInfo(response.data);
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const createGroups = useCallback(
    async (data?: Omit<HandleGroupsDto, 'id'>) => {
      try {
        const response = await api.post<Group>('/groups', data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          setGroups(state => {
            return [response.data, ...state];
          });
        }
        addToast({ title: 'Parceria adicionada', type: 'success' });
        setShowCreateGroup(false);
        return response.data;
      } catch (error) {
        setShowCreateGroup(false);
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  const editGroups = useCallback(
    async (data: Omit<HandleGroupsDto, 'id'>, id: string) => {
      try {
        const response = await api.patch<Group>(`/groups/${id}`, data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response) {
          const index = groups.findIndex(group => group.id === id);
          groups[index] = response.data;
          setGroups([...groups]);
        }
        setShouldRefresh(true);
        addToast({ title: 'Parceria editada', type: 'success' });
        return response.data;
      } catch (error) {
        setShowEditGroup(undefined);
        shootError(error.response.data.errorCode);
        return undefined;
      }
    },
    [token],
  );

  return (
    <GroupContext.Provider
      value={{
        getGroups,
        createGroups,
        editGroups,
        getSingleGroup,
        groups,
        openEditGroup,
        showEditGroup,
        openCreateGroup,
        showCreateGroup,
        shouldRefresh,
        groupInfo,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

function useGroup(): GroupContext {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup must be used within a AuthProvider');
  }
  return context;
}

export { GroupProvider, useGroup };
