import React, { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { Pagination } from '@material-ui/lab';
import ReactSelect from 'react-select';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import HandleRoute from '../components/handle-route';
import SingleRoute from '../components/single-route';
import { usePointOfSale } from '../hooks/point-of-sale';
import { useRoute } from '../hooks/route';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import {
  OperatorRoutesContainer,
  OperatorRoutesContent,
  PaginationContainer,
  Table,
} from '../styles/pages/operator-routes';
import { PageTitle } from '../utils/page-title';
import { RouteFilter } from '../entiti/route-filter';
import { useGroup } from '../hooks/group';

const OperatorRoutesPages: React.FC = () => {
  // hooks
  const {
    getRoutes,
    routes,
    showCreateRoute,
    toggleCreateRoute,
    count,
  } = useRoute();
  const { getOperators, operators } = useUser();
  const { getPointsOfSale, pointsOfSale } = usePointOfSale();
  const { getGroups, groups } = useGroup();
  const { user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [filterRouter, setFilterRouter] = useState<RouteFilter>();
  const [pointSelected, setPointSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'Todas', value: 'none' });
  const [groupSelected, setGroupSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'Todas', value: 'none' });
  const [operatorSelected, setOperatorSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'Todos', value: 'none' });

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getRoutes(pageSelected * 10 - 10, undefined);
      await getPointsOfSale(undefined, undefined);
      await getGroups();
      await getOperators();
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getRoutes(pageSelected * 10 - 10, filterRouter);
      await getPointsOfSale(undefined, {
        groupId:
          groupSelected.value === 'none' ? undefined : groupSelected.value,
      });
    })();
  }, [pageSelected, filterRouter]);

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  return (
    <Container active="routes" loading={busy}>
      <OperatorRoutesContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Rotas</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Rotas' }]}
            />
          </div>
          {user?.permissions?.createRoutes || user?.role === 'OWNER' ? (
            <Button
              title="Nova rota"
              color="primary"
              callback={() => toggleCreateRoute(true)}
            />
          ) : null}
        </PageTitle>
        <OperatorRoutesContent>
          <div className="filter">
            <InputContainer isFocused={isFocused}>
              <label htmlFor="route-name">
                <p>Pesquisar</p>
                <div>
                  <input
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    onChange={e => {
                      setFilterRouter({
                        ...filterRouter,
                        label: e.target.value,
                      });
                    }}
                    id="route-name"
                  />
                </div>
              </label>
            </InputContainer>
            {user?.role !== 'OPERATOR' && (
              <>
                <div className="filters label-filter">
                  <p style={{ marginBottom: '1rem' }}>Parceria</p>
                  <ReactSelect
                    name="groupId"
                    value={groupSelected}
                    options={[
                      {
                        value: 'none',
                        label: 'Todas',
                      },
                      ...(groups &&
                        groups.map(group => {
                          return {
                            value: group.id,
                            label: group.label ? group.label : 'Pessoal',
                          };
                        })),
                    ]}
                    onChange={e => {
                      if (e) {
                        setGroupSelected(e);
                        setFilterRouter({
                          ...filterRouter,
                          operatorId: undefined,
                          pointOfSaleId: undefined,
                          groupId: e.value,
                        });
                        setOperatorSelected({ label: 'Todos', value: 'none' });
                        setPointSelected({ label: 'Todas', value: 'none' });
                        setPageSelected(1);
                      }
                    }}
                  />
                </div>
                <div className="filters label-filter">
                  <p style={{ marginBottom: '1rem' }}>Localização</p>
                  <ReactSelect
                    name="pointOfSaleId"
                    value={pointSelected}
                    options={[
                      { value: 'none', label: 'Todas' },
                      ...pointsOfSale.map(pointOfSale => {
                        return {
                          value: pointOfSale.id,
                          label: pointOfSale.label,
                        };
                      }),
                    ]}
                    onChange={e => {
                      if (e) {
                        setPointSelected(e);
                        setFilterRouter({
                          ...filterRouter,
                          pointOfSaleId: e.value,
                        });
                        setPageSelected(1);
                      }
                    }}
                  />
                </div>
                <div className="filters label-filter">
                  <p style={{ marginBottom: '1rem' }}>Operador</p>
                  <ReactSelect
                    name="pointOfSaleId"
                    value={operatorSelected}
                    options={[
                      { value: 'none', label: 'Todos' },
                      ...operators.map(operator => {
                        return {
                          value: operator.id,
                          label: operator.name,
                        };
                      }),
                    ]}
                    onChange={e => {
                      if (e) {
                        setOperatorSelected(e);
                        setFilterRouter({
                          ...filterRouter,
                          operatorId: e.value,
                        });
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
              <h1 className="table-title-font routes">Rotas</h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="label">Nome</div>
              <div className="operator">Operador</div>
              <div className="locations">Locais</div>
            </div>
            {routes &&
              routes.map(route => {
                return (
                  <SingleRoute
                    key={v4()}
                    user={user}
                    route={route}
                    operator={operators.find(
                      operator => operator.id === route.operatorId,
                    )}
                    operators={operators}
                    locations={pointsOfSale}
                  />
                );
              })}
          </Table>
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
        </OperatorRoutesContent>
      </OperatorRoutesContainer>
      {showCreateRoute ? <HandleRoute operators={operators} /> : null}
    </Container>
  );
};
export default OperatorRoutesPages;
