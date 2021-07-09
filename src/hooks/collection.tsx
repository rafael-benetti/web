/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useCallback, useContext, useState } from 'react';
import { EditCollecionDto, BaseData } from '../dto/handle-collection';
import { Collection } from '../entiti/collection';
import { GetCollections } from '../entiti/get-collections';
import api from '../service/api';
import { useAuth } from './auth';
import { useError } from './error';
import { useToast } from './toast';

interface CollectionContext {
  getCollections(
    offset: number | undefined,
    filter:
      | { label?: string; operatorId?: string; routeId?: string }
      | undefined,
  ): Promise<GetCollections | undefined>;
  createCollection(
    data: BaseData,
    photos: { key: string; files: File[] }[],
  ): Promise<boolean>;
  editCollection(
    data: EditCollecionDto,
    id: string,
    photos?: { key: string; files: File[] }[],
  ): Promise<boolean>;
  toggleNewCollection(bool: boolean): void;
  togglePhotoInfo(photo?: File | string): void;
  reviewCollection(id: string, userId: string): Promise<boolean>;
  getSingleCollection(id: string): Promise<void>;
  collection?: Collection;
  photoDetail?: File | string;
  collections: Collection[];
  showNewCollection: boolean;
  count?: number;
}

const CollectionContext = createContext({} as CollectionContext);

const CollectionProvider: React.FC = ({ children }) => {
  // hooks
  const { token } = useAuth();
  const { addToast } = useToast();
  const { shootError } = useError();

  // state
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showNewCollection, setShowNewCollection] = useState<boolean>(false);
  const [photoDetail, setPhotoDetail] = useState<File | string>();
  const [count, setCount] = useState<number>();
  const [collection, setCollection] = useState<Collection>();

  const getCollections = useCallback(
    async (
      offset?: number | undefined,
      filter?: { label?: string; operatorId?: string; routeId?: string },
    ) => {
      try {
        const response = await api.get<GetCollections>(`/collections`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: {
            limit: offset === undefined ? undefined : 10,
            offset: offset === undefined ? undefined : offset,
            machineSerialNumber: filter?.label || undefined,
            operatorId:
              filter?.operatorId === 'none' ? undefined : filter?.operatorId,
            routeId: filter?.routeId === 'none' ? undefined : filter?.routeId,
          },
        });
        setCollections(response.data.collections);
        setCount(response.data.count);
        return response.data;
      } catch (error) {
        return undefined;
      }
    },
    [token],
  );

  const getSingleCollection = useCallback(
    async (id: string) => {
      try {
        const response = await api.get<Collection>(`collections/${id}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setCollection(response.data);
      } catch (error) {
        shootError(error.response.data.errorCode);
      }
    },
    [token],
  );

  const buildFormData = useCallback((formData, data, parentKey) => {
    if (
      data &&
      typeof data === 'object' &&
      !(data instanceof Date) &&
      !(data instanceof File)
    ) {
      Object.keys(data).forEach(key => {
        buildFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}[${key}]` : key,
        );
      });
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }
  }, []);

  const createCollection = useCallback(
    async (data: BaseData, photos: { key: string; files: File[] }[]) => {
      try {
        data.boxCollections.forEach(box => {
          if (!box.prizeCount) {
            delete box.prizeCount;
          }
        });
        const formData = new FormData();
        buildFormData(formData, data, undefined);
        photos.forEach(photo => {
          photo.files.forEach(file => {
            formData.append(photo.key, file);
          });
        });
        const response = await api.post('collections', formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        addToast({ title: 'Coleta realizada com sucesso', type: 'success' });
        return true;
      } catch (error) {
        if (error.response.data.errorCode === 'VALIDATION_ERROR') {
          addToast({
            title: 'Atenção!',
            description: 'Algum campo não está preenchido',
            type: 'error',
          });
          return false;
        }
        shootError(error.response.data.errorCode);
        return false;
      }
    },
    [token],
  );

  const editCollection = useCallback(
    async (
      data: EditCollecionDto,
      id: string,
      photos?: { key: string; files: File[] }[],
    ) => {
      try {
        const formData = new FormData();
        buildFormData(formData, data, undefined);
        if (photos) {
          photos.forEach(photo => {
            photo.files.forEach(file => {
              formData.append(photo.key, file);
            });
          });
        }
        const response = await api.put(`collections/${id}`, formData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        addToast({ title: 'Coleta editada com sucesso', type: 'success' });
        return true;
      } catch (error) {
        if (error.response.data.errorCode === 'VALIDATION_ERROR') {
          addToast({
            title: 'Atenção!',
            description: 'Algum campo não está preenchido',
            type: 'error',
          });
          return false;
        }
        shootError(error.response.data.errorCode);
        return false;
      }
    },
    [token],
  );

  const reviewCollection = useCallback(
    async (id: string, userId: string) => {
      try {
        const response = await api.put(
          `collections/review/${id}`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        addToast({
          title: 'Coleta revisada com sucesso',
          type: 'success',
        });
        if (collection) {
          setCollection({
            ...collection,
            reviewedData: {
              reviewerName: response.data.reviewerName,
              date: response.data.date,
            },
          });
        }
        return true;
      } catch (error) {
        shootError(error.response.data.errorCode);
        return false;
      }
    },
    [token, collection],
  );

  const toggleNewCollection = useCallback(
    (bool: boolean) => {
      setShowNewCollection(bool);
    },
    [showNewCollection],
  );

  const togglePhotoInfo = useCallback((photo: File | string | undefined) => {
    if (photo) {
      setPhotoDetail(photo);
    } else {
      setPhotoDetail(undefined);
    }
  }, []);

  return (
    <CollectionContext.Provider
      value={{
        getCollections,
        createCollection,
        toggleNewCollection,
        togglePhotoInfo,
        editCollection,
        reviewCollection,
        getSingleCollection,
        collection,
        photoDetail,
        showNewCollection,
        collections,
        count,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

function useCollection(): CollectionContext {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a AuthProvider');
  }
  return context;
}

export { CollectionProvider, useCollection };
