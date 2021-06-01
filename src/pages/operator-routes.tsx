import React, { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { Pagination } from '@material-ui/lab';
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
import { Route } from '../entiti/route';

const OperatorRoutesPages: React.FC = () => {
  // hooks
  const { getRoutes, routes, showCreateRoute, toggleCreateRoute } = useRoute();
  const { getOperators, operators } = useUser();
  const { getPointsOfSale, pointsOfSale } = usePointOfSale();
  const { user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [routersFiltered, setRoutesFiltered] = useState<Route[]>([]);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getRoutes();
      await getPointsOfSale(undefined, undefined);
      await getOperators();
      setBusy(false);
    })();
  }, []);

  const filterRoutes = useCallback(
    (data: string) => {
      const routesData: Route[] = [];
      routes.forEach(route => {
        if (route.label.toString().toLowerCase().includes(data)) {
          routesData.push(route);
        }
      });
      setRoutesFiltered(routesData);
    },
    [routersFiltered],
  );

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
                    id="route-name"
                    onChange={e => {
                      filterRoutes(e.target.value);
                    }}
                  />
                </div>
              </label>
            </InputContainer>
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
            {routes && routersFiltered.length === 0
              ? routes.map((route, index) => {
                  if (
                    (pageSelected - 1) * 10 <= index &&
                    index < pageSelected * 10
                  ) {
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
                  }
                  return null;
                })
              : routersFiltered.map((route, index) => {
                  if (
                    (pageSelected - 1) * 10 <= index &&
                    index < pageSelected * 10
                  ) {
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
                  }
                  return null;
                })}
          </Table>
          <PaginationContainer>
            <Pagination
              count={
                routersFiltered.length === 0
                  ? Math.ceil(routes.length / 10)
                  : Math.ceil(routersFiltered.length / 10)
              }
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
