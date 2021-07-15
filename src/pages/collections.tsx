/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Pagination } from '@material-ui/lab';
import ReactSelect from 'react-select';
import Button from '../components/button';
import ChooseMachineToCollect from '../components/choose-machine-to-collect';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SingleCollection from '../components/single-colletion';
import { useCategory } from '../hooks/category';
import { useCollection } from '../hooks/collection';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import {
  CollectionsContainer,
  CollectionsContent,
  Table,
} from '../styles/pages/collections';
import { PaginationContainer } from '../styles/pages/points-of-sale';
import { PageTitle } from '../utils/page-title';
import { useRoute } from '../hooks/route';
import { useOperator } from '../hooks/operator';
import { useManager } from '../hooks/manager';

const CollectionsPage: React.FC = () => {
  // hooks
  const {
    getCollections,
    collections,
    toggleNewCollection,
    showNewCollection,
    count,
  } = useCollection();
  const { getCounterType, counterTypes } = useCategory();
  const { getUser, user } = useUser();
  const { getRoutes, routes } = useRoute();
  const { getOperators, operators } = useOperator();
  const { getManagers, managers } = useManager();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [tableBusy, setTableBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    label?: string;
    operatorId?: string;
    routeId?: string;
  }>();
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [operatorSelected, setOperatorSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'Todos', value: 'none' });
  const [routeSelected, setRouteSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'Todas', value: 'none' });

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  useEffect(() => {
    setBusy(true);
    toggleNewCollection(false);

    (async () => {
      await getCollections(pageSelected * 10 - 10, filter);
      await getUser();
      await getCounterType();
      await getRoutes(undefined, undefined);
      await getOperators();
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    setTableBusy(true);
    (async () => {
      await getCollections(pageSelected * 10 - 10, filter);
      setTableBusy(false);
    })();
  }, [filter, pageSelected]);

  return (
    <Container active="collections" loading={busy}>
      <CollectionsContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Coletas</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Coletas' }]}
            />
          </div>
          <Button
            title="Nova coleta"
            color="primary"
            callback={() => toggleNewCollection(true)}
          />
        </PageTitle>
        <CollectionsContent>
          <div className="filters-container">
            <InputContainer isFocused={isFocused}>
              <label htmlFor="group-name">
                <p>Pesquisar</p>
                <div>
                  <input
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    id="group-name"
                    onChange={e => {
                      if (e) {
                        setFilter({ ...filter, label: e.target.value });
                        setPageSelected(1);
                      }
                    }}
                  />
                </div>
              </label>
            </InputContainer>
            {user?.role !== 'OPERATOR' && (
              <>
                <div className="filters label-filter">
                  <p style={{ marginBottom: '1rem' }}>Rota</p>
                  <ReactSelect
                    name="routeId"
                    id="routeId"
                    value={routeSelected}
                    options={[
                      {
                        value: 'none',
                        label: 'Todas',
                      },
                      ...(routes &&
                        routes.map(operator => {
                          return {
                            value: operator.id,
                            label: operator.label,
                          };
                        })),
                    ]}
                    onChange={e => {
                      if (e) {
                        setRouteSelected(e);
                        setFilter({ ...filter, routeId: e.value });
                        setPageSelected(1);
                      }
                    }}
                  />
                </div>
                <div className="filters label-filter">
                  <p style={{ marginBottom: '1rem' }}>Usuário</p>
                  <ReactSelect
                    name="operatorId"
                    id="operatorId"
                    value={operatorSelected}
                    options={[
                      {
                        value: 'none',
                        label: 'Todos',
                      },
                      ...(operators &&
                        operators.map(operator => {
                          return {
                            value: operator.id,
                            label: operator.name,
                          };
                        })),
                      ...(managers &&
                        managers.map(manager => {
                          return {
                            value: manager.id,
                            label: manager.name,
                          };
                        })),
                    ]}
                    onChange={e => {
                      if (e) {
                        setOperatorSelected(e);
                        setFilter({ ...filter, operatorId: e.value });
                        setPageSelected(1);
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">Coletas</h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="data">Realizada em:</div>
              <div className="code">Núm. Série</div>
              <div className="machine">Localização</div>
              <div className="last-conection center">Usuário</div>
            </div>
            {collections &&
              collections.map(collection => {
                return (
                  <SingleCollection
                    key={collection.id}
                    collection={collection}
                    user={user}
                  />
                );
              })}
          </Table>
        </CollectionsContent>
        <PaginationContainer>
          <Pagination
            count={numberOfPages(count || 0)}
            color="primary"
            variant="outlined"
            page={pageSelected}
            onChange={(event, page) => {
              setPageSelected(page);
            }}
          />
        </PaginationContainer>
      </CollectionsContainer>
      {showNewCollection ? <ChooseMachineToCollect /> : null}
    </Container>
  );
};
export default CollectionsPage;
