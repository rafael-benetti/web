/* eslint-disable react/jsx-curly-newline */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { FormHandles, Scope } from '@unform/core';
import { Form } from '@unform/web';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { v4 } from 'uuid';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import Input from '../components/input';
import {
  EditCollecionDto,
  HandleCollectionDto,
  BaseData,
} from '../dto/handle-collection';
import { Machine } from '../entiti/machine';
import { useCategory } from '../hooks/category';
import { useCollection } from '../hooks/collection';
import {
  CreateCollectionContainer,
  CreateCollectionContent,
  CollectType,
  Photo,
  Gallery,
} from '../styles/pages/create-collection';
import { PageTitle } from '../utils/page-title';
import getValidationErrors from '../utils/getValidationErrors';
import PhotoDetail from '../components/photo-detail';
import { Collection } from '../entiti/collection';
import { useToast } from '../hooks/toast';
import { useUser } from '../hooks/user';

interface StateProps {
  initialData?: Collection;
  machine: Machine;
}

const CreateCollectionPage: React.FC = () => {
  // location
  const { machine, initialData } = useLocation().state as StateProps;

  // refs
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { getCounterType, counterTypes } = useCategory();
  const { user, getUser } = useUser();
  const {
    createCollection,
    togglePhotoInfo,
    photoDetail,
    editCollection,
  } = useCollection();
  const { addToast } = useToast();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [photos, setPhotos] = useState<{ key: string; files: File[] }[]>([]);
  const [redirect, setRedirect] = useState(false);
  const [editRedirect, setEditRedirect] = useState(false);
  const [startTimeData, setStartTimeData] = useState<Date>();

  const handleAddPhoto = useCallback(
    (key: string, file: File) => {
      setPhotos(state => {
        const idx = photos.findIndex(c => c.key === key);
        if (idx === -1) {
          state.push({
            key,
            files: [file],
          });

          return [...state];
        }
        state[idx].files.push(file);

        return [...state];
      });
    },
    [photos],
  );

  const handleCollection = useCallback(
    async (data: HandleCollectionDto) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          observations: Yup.string().required('Insira uma observação'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        if (initialData) {
          const editCollectionData: EditCollecionDto = {
            machineId: initialData.machineId,
            boxCollections: data.boxCollections,
            observations: data.observations,
            photosToDelete,
          };
          await editCollection(editCollectionData, initialData.id, photos);
          setBusyBtn(false);
          setEditRedirect(true);
          return;
        }

        const crateData: BaseData = {
          boxCollections: data.boxCollections,
          machineId: data.machineId,
          observations: data.observations,
          startTime: startTimeData,
        };

        const response = await createCollection(crateData, photos);
        if (response) {
          setBusyBtn(false);
          setRedirect(true);
        }
        setBusyBtn(false);
      } catch (error) {
        setBusyBtn(false);
        if (error instanceof Yup.ValidationError) {
          setBusyBtn(false);
          addToast({
            title: 'Atenção!',
            description: 'Algum campo não está preenchido',
            type: 'error',
          });
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [photos, photosToDelete, busyBtn, startTimeData],
  );

  useEffect(() => {
    setStartTimeData(new Date(Date.now()));
    setBusy(true);
    (async () => {
      await getCounterType();
      await getUser();
    })();
    setBusy(false);
  }, []);

  useEffect(() => {
    if (initialData) {
      formRef.current?.setData({
        boxCollections: initialData.boxCollections,
        observations: initialData.observations,
      });
    }
  }, []);

  return (
    <Container active="collections" loading={busy}>
      <CreateCollectionContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">{`Criar coleta - ${machine.serialNumber}`}</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Coletas', url: '/coletas' },
                { name: 'Criar coleta' },
              ]}
            />
          </div>
        </PageTitle>
        <CreateCollectionContent>
          <Form ref={formRef} onSubmit={handleCollection}>
            <CollectType>
              <div className="title">
                <h1>Contadores digitais</h1>
              </div>
              <div className="inputs">
                {machine.boxes &&
                  machine.boxes.map((box, index) => {
                    return (
                      <Scope
                        path={`boxCollections[${index}]`}
                        key={`${box.id}DIGITAL`}
                      >
                        <div className="box-id-hidden">
                          <Input
                            id={`digitalCount${index}`}
                            type="hidden"
                            hidden
                            name="boxId"
                            value={box.id}
                          />
                        </div>
                        {box.counters.map((counter, idx) => {
                          if (counter.hasDigital) {
                            return (
                              <Scope
                                path={`counterCollections[${idx}]`}
                                key={`${counter.id}DIGITAL`}
                              >
                                <Input
                                  id={`digitalCount${idx}-${index}`}
                                  name="digitalCount"
                                  label={`${
                                    machine.categoryLabel
                                      .toLowerCase()
                                      .includes('roleta')
                                      ? 'Haste'
                                      : 'Cabine'
                                  } ${index + 1} - ${
                                    counterTypes.find(
                                      counterType =>
                                        counterType.id ===
                                        counter.counterTypeId,
                                    )?.label
                                  }`}
                                />
                                <div className="counter-id-hidden">
                                  <Input
                                    id={v4()}
                                    type="hidden"
                                    hidden
                                    name="counterTypeLabel"
                                    value={
                                      counterTypes.find(
                                        counterType =>
                                          counterType.id ===
                                          counter.counterTypeId,
                                      )?.label
                                    }
                                  />
                                </div>
                                <div className="counter-id-hidden">
                                  <Input
                                    id={v4()}
                                    type="hidden"
                                    hidden
                                    name="counterId"
                                    value={counter.id}
                                  />
                                </div>
                              </Scope>
                            );
                          }
                        })}
                      </Scope>
                    );
                  })}
              </div>
            </CollectType>
            <CollectType>
              <div className="title">
                <h1>Contadores mecânicos</h1>
              </div>
              <div className="inputs">
                {machine.boxes &&
                  machine.boxes.map((box, index) => {
                    return (
                      <Scope
                        path={`boxCollections[${index}]`}
                        key={`${box.id}MECHANICAL`}
                      >
                        <div className="box-id-hidden">
                          <Input
                            id={`mechanicalCount${index}`}
                            type="hidden"
                            hidden
                            name="boxId"
                            value={box.id}
                          />
                        </div>

                        {box.counters.map((counter, idx) => {
                          if (counter.hasMechanical) {
                            return (
                              <Scope
                                path={`counterCollections[${idx}]`}
                                key={`${counter.id}MECHANICAL`}
                              >
                                <Input
                                  id={`mechanicalCount${idx}-${index}`}
                                  name="mechanicalCount"
                                  label={`${
                                    machine.categoryLabel
                                      .toLowerCase()
                                      .includes('roleta')
                                      ? 'Haste'
                                      : 'Cabine'
                                  } ${index + 1} - ${
                                    counterTypes.find(
                                      counterType =>
                                        counterType.id ===
                                        counter.counterTypeId,
                                    )?.label
                                  }`}
                                />
                                <div className="counter-id-hidden">
                                  <Input
                                    id={v4()}
                                    type="hidden"
                                    hidden
                                    name="counterId"
                                    value={counter.id}
                                  />
                                </div>
                              </Scope>
                            );
                          }
                        })}
                      </Scope>
                    );
                  })}
              </div>
            </CollectType>
            <CollectType>
              <div className="title">
                <h1>Recolhido</h1>
              </div>
              <div className="inputs">
                {machine.boxes &&
                  machine.boxes.map((box, index) => {
                    return (
                      <Scope
                        path={`boxCollections[${index}]`}
                        key={`${box.id}USER`}
                      >
                        <div className="box-id-hidden">
                          <Input
                            id={`userCount${index}`}
                            type="hidden"
                            hidden
                            name="boxId"
                            value={box.id}
                          />
                        </div>
                        {box.counters.map((counter, idx) => {
                          if (
                            counterTypes.find(
                              counterType =>
                                counterType.id === counter.counterTypeId,
                            )?.label === 'Moedeiro' ||
                            counterTypes.find(
                              counterType =>
                                counterType.id === counter.counterTypeId,
                            )?.label === 'Noteiro'
                          ) {
                            return (
                              <Scope
                                path={`counterCollections[${idx}]`}
                                key={`${counter.id}USER`}
                              >
                                <Input
                                  id={`userCount${idx}-${index}`}
                                  name="userCount"
                                  label={`${
                                    machine.categoryLabel
                                      .toLowerCase()
                                      .includes('roleta')
                                      ? 'Haste'
                                      : 'Cabine'
                                  } ${index + 1} - ${
                                    counterTypes.find(
                                      counterType =>
                                        counterType.id ===
                                        counter.counterTypeId,
                                    )?.label
                                  }`}
                                />
                                <div className="counter-id-hidden">
                                  <Input
                                    id={v4()}
                                    type="hidden"
                                    hidden
                                    name="counterId"
                                    value={counter.id}
                                  />
                                </div>
                              </Scope>
                            );
                          }
                        })}
                      </Scope>
                    );
                  })}
              </div>
            </CollectType>
            <div className="observation">
              <Input name="observations" label="Observações" />
            </div>
            <div className="machine-id-hidden">
              <Input type="hidden" hidden name="machineId" value={machine.id} />
            </div>
            <div className="photos">
              {machine?.boxes &&
                machine?.boxes.map((box, index) => {
                  return box.counters.map((counter, idx) => {
                    return (
                      <Photo key={counter.id}>
                        <h1>
                          {`${
                            machine.categoryLabel
                              .toLowerCase()
                              .includes('roleta')
                              ? 'Haste'
                              : 'Cabine'
                          } ${index + 1} - ${
                            counterTypes.find(
                              counterType =>
                                counterType.id === counter.counterTypeId,
                            )?.label
                          }  `}
                        </h1>
                        <Gallery>
                          <label htmlFor={`${counter.id}`}>
                            <div className="addPhotos">
                              <FiPlus />
                            </div>
                            <input
                              id={`${counter.id}`}
                              type="file"
                              onChange={e => {
                                handleAddPhoto(
                                  `${box.id}:${counter.id}`,
                                  e.target.files![0],
                                );
                              }}
                            />
                          </label>
                          <div className="images">
                            {initialData?.boxCollections[index] &&
                            initialData?.boxCollections[index]
                              .counterCollections[idx]
                              ? initialData?.boxCollections[index]
                                  .counterCollections[idx].photos &&
                                initialData?.boxCollections[
                                  index
                                ].counterCollections[idx].photos.map(photo => {
                                  if (photosToDelete.includes(photo.key)) {
                                    return null;
                                  }
                                  return (
                                    <div className="photo" key={v4()}>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          togglePhotoInfo(photo.downloadUrl)
                                        }
                                      >
                                        <img src={photo.downloadUrl} alt="" />
                                      </button>
                                      <button
                                        className="delete-btn"
                                        type="button"
                                        onClick={() => {
                                          setPhotosToDelete(state => {
                                            state.push(photo.key);
                                            return [...state];
                                          });
                                        }}
                                      >
                                        <FiTrash />
                                      </button>
                                    </div>
                                  );
                                })
                              : null}

                            {photos &&
                              photos.map((photo, photoIndex) => {
                                if (photo.key === `${box.id}:${counter.id}`) {
                                  return photo.files.map((file, fileIndex) => {
                                    return (
                                      <div className="photo" key={v4()}>
                                        <button
                                          type="button"
                                          onClick={() => togglePhotoInfo(file)}
                                        >
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt=""
                                          />
                                        </button>
                                        <button
                                          className="delete-btn"
                                          type="button"
                                          onClick={() => {
                                            setPhotos(state => {
                                              state[photoIndex].files.splice(
                                                fileIndex,
                                                1,
                                              );
                                              return [...state];
                                            });
                                          }}
                                        >
                                          <FiTrash />
                                        </button>
                                      </div>
                                    );
                                  });
                                }
                              })}
                          </div>
                        </Gallery>
                      </Photo>
                    );
                  });
                })}
            </div>
            {!initialData &&
              (user?.role === 'OWNER' ||
                user?.permissions?.fixMachineStock === true) && (
                <div className="stock">
                  <h1>Correção de estoque (opcional)</h1>
                  {machine.boxes?.map((box, index) => {
                    return (
                      <Scope key={v4()} path={`boxCollections[${index}]`}>
                        <div className="count-prize">
                          <p>
                            {`${
                              machine.categoryLabel
                                .toLowerCase()
                                .includes('roleta')
                                ? 'Haste'
                                : 'Cabine'
                            }
                         ${index + 1}`}
                          </p>
                          <Input name="prizeCount" id={`${box.id}${index}`} />
                        </div>
                      </Scope>
                    );
                  })}
                </div>
              )}
            <div className="submit-button">
              <Link to="coletas">
                <Button color="tertiary" title="Cancelar" />
              </Link>
              <Button
                color="primary"
                title={initialData ? 'Editar' : 'Criar'}
                isSubmit
                busy={busyBtn}
              />
            </div>
          </Form>
        </CreateCollectionContent>
      </CreateCollectionContainer>
      {photoDetail ? <PhotoDetail photo={photoDetail} /> : null}
      {redirect && <Redirect to="/coletas" />}
      {editRedirect && (
        <Redirect
          to={{ pathname: '/detalhes-da-coleta', state: initialData?.id }}
        />
      )}
      /
    </Container>
  );
};
export default CreateCollectionPage;
