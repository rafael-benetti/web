/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-curly-newline */
import React, { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { v4 } from 'uuid';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { InputContainer } from '../styles/components/input';
import {
  CollectionData,
  CollectionInfoContainer,
  CollectionInfoContent,
  ReviewCollection,
  DateInfo,
  Gallery,
  Photo,
  SingleCollectionInfo,
  Table,
  MapCollection,
} from '../styles/pages/collection-info';
import { PageTitle } from '../utils/page-title';
import { useCollection } from '../hooks/collection';
import PhotoDetail from '../components/photo-detail';
import { useUser } from '../hooks/user';
import Map from '../components/Map';

const CollectionInfo: React.FC = () => {
  // location
  const collectionId = useLocation().state as string;

  // hooks
  const {
    togglePhotoInfo,
    photoDetail,
    reviewCollection,
    getSingleCollection,
    collection,
  } = useCollection();
  const { getUser, user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [redirect, setRedirect] = useState(false);
  const [reviwed, setReviwed] = useState(false);

  useEffect(() => {
    setBusy(true);
    if (!collectionId) {
      setRedirect(true);
    }
    (async () => {
      await getUser();
      await getSingleCollection(collectionId);
      setBusy(false);
    })();
  }, []);

  const findValues = useCallback(
    (
      type: 'DIGITAL' | 'MECHANICAL' | 'COUNTER' | 'TELEMETRY',
      counterId: string,
      boxId: string,
    ) => {
      let value;
      if (!collection?.previousCollection) {
        value = '-';
      }
      if (type === 'DIGITAL') {
        collection?.previousCollection?.boxCollections.forEach(box => {
          if (boxId === box.boxId) {
            value = box.counterCollections.find(
              counterCollection => counterCollection.counterId === counterId,
            )?.digitalCount;
          }
        });
      }
      if (type === 'MECHANICAL') {
        collection?.previousCollection?.boxCollections.forEach(box => {
          if (boxId === box.boxId) {
            value = box.counterCollections.find(
              counterCollection => counterCollection.counterId === counterId,
            )?.mechanicalCount;
          }
        });
      }
      if (type === 'COUNTER') {
        collection?.previousCollection?.boxCollections.forEach(box => {
          if (boxId === box.boxId) {
            value = box.counterCollections.find(
              counterCollection => counterCollection.counterId === counterId,
            )?.userCount;
          }
        });
      }
      if (type === 'TELEMETRY') {
        collection?.previousCollection?.boxCollections.forEach(box => {
          if (boxId === box.boxId) {
            value = box.counterCollections.find(
              counterCollection => counterCollection.counterId === counterId,
            )?.telemetryCount;
          }
        });
      }
      return value;
    },
    [collection],
  );

  return (
    <Container active="collections" loading={busy}>
      <CollectionInfoContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">{`Informações da coleta - ${collection?.machine.serialNumber} (${collection?.machine.categoryLabel})`}</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Coletas', url: '/coletas' },
                { name: 'Informações da coleta' },
              ]}
            />
          </div>
          {user?.permissions?.editCollections ||
          user?.role === 'OWNER' ||
          user?.role === 'MANAGER' ? (
            <Link
              to={{
                pathname: '/criar-coleta',
                state: {
                  initialData: collection,
                  machine: collection?.machine,
                },
              }}
            >
              <Button title="Editar coleta" color="primary" />
            </Link>
          ) : null}
        </PageTitle>
        <CollectionInfoContent>
          <ReviewCollection>
            {(collection?.reviewedData || reviwed) && (
              <span>
                {`Coleta revisada por ${
                  collection?.reviewedData?.reviewerName
                } em ${format(
                  new Date(collection?.reviewedData?.date || 0),
                  `dd'/'MM'/'yy 'às' H:mm`,
                  {
                    locale: ptLocale,
                  },
                )}`}
              </span>
            )}
            {!collection?.reviewedData && !reviwed && (
              <Button
                title="Revisar coleta"
                color="secondary"
                callback={async () => {
                  await reviewCollection(collectionId, user!.id);
                }}
              />
            )}
          </ReviewCollection>
          <DateInfo>
            <div className="date-data">
              <h1 className="heading-secondary-font">
                Dados da coleta anterior
              </h1>
              <div className="grid">
                {collection?.previousCollection && (
                  <InputContainer isFocused={false}>
                    <label htmlFor="category-name">
                      <p>Data de início:</p>
                      <div>
                        <input
                          id={v4()}
                          disabled
                          value={`${
                            collection?.previousCollection.startTime
                              ? format(
                                  new Date(
                                    collection?.previousCollection.startTime,
                                  ),
                                  `dd'-'MM'-'yy 'às' H:mm`,
                                  {
                                    locale: ptLocale,
                                  },
                                )
                              : ''
                          }`}
                        />
                      </div>
                    </label>
                  </InputContainer>
                )}
                <InputContainer isFocused={false}>
                  <label htmlFor="category-name">
                    <p>Realizada em:</p>
                    <div>
                      <input
                        id={v4()}
                        disabled
                        value={`${
                          collection?.previousCollection
                            ? format(
                                new Date(collection?.previousCollection.date),
                                `dd'-'MM'-'yy 'às' H:mm`,
                                {
                                  locale: ptLocale,
                                },
                              )
                            : ''
                        }`}
                      />
                    </div>
                  </label>
                </InputContainer>
                <InputContainer isFocused={false}>
                  <label htmlFor="category-name">
                    <p>Operador</p>
                    <div>
                      <input
                        id={v4()}
                        disabled
                        value={
                          collection?.previousCollection
                            ? collection.previousCollection.user.name
                            : ''
                        }
                      />
                    </div>
                  </label>
                </InputContainer>
              </div>
            </div>
            <div className="date-data">
              <h1 className="heading-secondary-font">Dados da coleta atual</h1>
              <div className="grid">
                {collection?.startTime && (
                  <InputContainer isFocused={false}>
                    <label htmlFor="category-name">
                      <p>Data de início:</p>
                      <div>
                        <input
                          id={v4()}
                          disabled
                          value={`${
                            collection?.startTime
                              ? format(
                                  new Date(collection?.startTime),
                                  `dd'-'MM'-'yy 'às' H:mm`,
                                  {
                                    locale: ptLocale,
                                  },
                                )
                              : ''
                          }`}
                        />
                      </div>
                    </label>
                  </InputContainer>
                )}
                <InputContainer isFocused={false}>
                  <label htmlFor={v4()}>
                    <p>Realizada em:</p>
                    <div>
                      <input
                        id={v4()}
                        disabled
                        value={`${
                          collection &&
                          format(
                            new Date(collection.date),
                            `dd'-'MM'-'yy 'às' H:mm`,
                            {
                              locale: ptLocale,
                            },
                          )
                        }`}
                      />
                    </div>
                  </label>
                </InputContainer>
                <InputContainer isFocused={false}>
                  <label htmlFor="category-name">
                    <p>Operador</p>
                    <div>
                      <input id={v4()} disabled value={collection?.user.name} />
                    </div>
                  </label>
                </InputContainer>
              </div>
            </div>
          </DateInfo>
          <CollectionData>
            <Table>
              <div className="primary-row table-title-font">
                <div className="label">Contador</div>
                <div className="contact-name">Relógio</div>
                <div className="phone center">Coleta anterior</div>
                <div className="phone center">Coleta atual</div>
                <div className="phone center">Diferença</div>
              </div>
              {collection?.boxCollections.map((box, index) => {
                return (
                  <div key={v4()}>
                    <div key={v4()} className="table-title">
                      <h1 className="table-title-font partnerships-name">
                        {`${
                          collection.machine.categoryLabel
                            .toLowerCase()
                            .includes('roleta')
                            ? 'Haste'
                            : 'Cabine'
                        } ${index + 1}`}
                      </h1>
                    </div>
                    {box.counterCollections.map(collect => {
                      return (
                        <SingleCollectionInfo key={v4()}>
                          <div className="counter">
                            {collect.counterTypeLabel}
                          </div>
                          <div className="numbers">
                            {collect.digitalCount ? (
                              <div className="row">
                                <div>Dígital</div>
                                <div className="collected center">
                                  {findValues(
                                    'DIGITAL',
                                    collect.counterId,
                                    box.boxId,
                                  )}
                                </div>
                                <div className="collect center">
                                  {collect.digitalCount}
                                </div>
                                <div className="difference center">
                                  {collect.digitalCount -
                                    parseFloat(
                                      findValues(
                                        'DIGITAL',
                                        collect.counterId,
                                        box.boxId,
                                      ) || '0',
                                    ) || '-'}
                                </div>
                              </div>
                            ) : null}
                            {collect.mechanicalCount ? (
                              <div className="row">
                                <div>Mecânico</div>
                                <div className="collected center">
                                  {findValues(
                                    'MECHANICAL',
                                    collect.counterId,
                                    box.boxId,
                                  )}
                                </div>
                                <div className="collect center">
                                  {collect.mechanicalCount}
                                </div>
                                <div className="difference center">
                                  {collect.mechanicalCount -
                                    parseFloat(
                                      findValues(
                                        'MECHANICAL',
                                        collect.counterId,
                                        box.boxId,
                                      ) || '0',
                                    ) || '-'}
                                </div>
                              </div>
                            ) : null}
                            {collect.userCount ? (
                              <div className="row">
                                <div>Recolhido</div>
                                <div className="collected center">
                                  {findValues(
                                    'COUNTER',
                                    collect.counterId,
                                    box.boxId,
                                  )}
                                </div>
                                <div className="collect center">
                                  {collect.userCount}
                                </div>
                                <div className="difference center">
                                  {collect.userCount -
                                    parseFloat(
                                      findValues(
                                        'COUNTER',
                                        collect.counterId,
                                        box.boxId,
                                      ) || '0',
                                    ) || '-'}
                                </div>
                              </div>
                            ) : null}
                            <div className="row">
                              <div>Telemetria</div>
                              <div className="collected center" />
                              <div className="collect center">
                                {collect.telemetryCount}
                              </div>
                              <div className="difference center" />
                            </div>
                          </div>
                        </SingleCollectionInfo>
                      );
                    })}
                  </div>
                );
              })}
            </Table>
          </CollectionData>
          <div className="observation">
            <h1 className="heading-secondary-font">Observações da coleta:</h1>
            <h2>{`- ${collection?.observations}`}</h2>
          </div>
          <div className="photos">
            <h1 className="heading-secondary-font">Fotos</h1>
            <div className="grid">
              {collection?.boxCollections &&
                collection?.boxCollections.map((box, index) => {
                  return box.counterCollections.map((counter, idx) => {
                    return (
                      <Photo key={counter.counterId}>
                        <h1>
                          {`${
                            collection.machine.categoryLabel
                              .toLowerCase()
                              .includes('roleta')
                              ? 'Haste'
                              : 'Cabine'
                          } ${index + 1} - ${counter.counterTypeLabel}  `}
                        </h1>
                        <Gallery>
                          <div className="images">
                            {counter.photos && counter.photos.length > 0 ? (
                              counter.photos?.map(photo => {
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
                                  </div>
                                );
                              })
                            ) : (
                              <p>- Sem foto</p>
                            )}
                          </div>
                        </Gallery>
                      </Photo>
                    );
                  });
                })}
            </div>
          </div>
          {collection?.startLocation && collection.endLocation && (
            <>
              <div
                className="heading-secondary-font"
                style={{ margin: '2rem 0' }}
              >
                Coleta realizada em:
              </div>
              <Map
                initialPoint={{
                  lat: collection.startLocation.latitude,
                  lng: collection.startLocation.longitude,
                }}
                endPoint={{
                  lat: collection.endLocation.latitude + 0.00009,
                  lng: collection.endLocation.longitude + 0.00009,
                }}
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP}`}
                loadingElement={<div style={{ height: `70vh` }} />}
                containerElement={<div style={{ height: `80vh` }} />}
                mapElement={<div style={{ height: `70vh` }} />}
              />
            </>
          )}
        </CollectionInfoContent>
        {photoDetail ? <PhotoDetail photo={photoDetail} /> : null}
      </CollectionInfoContainer>
      {redirect && <Redirect to="coletas" />}
    </Container>
  );
};
export default CollectionInfo;
