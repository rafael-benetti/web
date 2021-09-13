import React, { useEffect, useState } from 'react';
import { BsPerson } from 'react-icons/bs';
import { FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { Redirect, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { v4 } from 'uuid';
import Button from '../components/button';
import ChartPie from '../components/chart-pie';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import HandleRoute from '../components/handle-route';
import ModalDeleteRoute from '../components/modal-delete-route';
import SingleMachineChart from '../components/single-machine-chart';
import SingleMachineInRoute from '../components/single-machine-in-route';
import SinglePointInRoute from '../components/single-point-in-route';
import { useOperator } from '../hooks/operator';
import { useRoute } from '../hooks/route';
import { useUser } from '../hooks/user';
import { Card } from '../styles/pages/machine-info';
import { ManagementInfo, NavBar } from '../styles/pages/point-of-sale-info';
import {
  RouteInfoContainer,
  RouteInfoContent,
  PointInRoute,
  Table,
  PointOfSaleRate,
  MachinesLastCollection,
} from '../styles/pages/route-info';
import { PageTitle } from '../utils/page-title';

const RouteInfo: React.FC = () => {
  // location
  const routeId = useLocation().state as string;

  // hooks
  const { getUser, user } = useUser();
  const { getOperators, operators } = useOperator();

  const {
    getSingleRoute,
    routeInfo,
    showEditRoute,
    toggleEditRoute,
    shouldRefreshRoute,
    toggleDeleteRoute,
    showDeleteRoute,
  } = useRoute();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyChart, setBusyChart] = useState<boolean>(false);
  const [filter, setFilter] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!routeId) {
      setRedirect(true);
    }
    if (showEditRoute) {
      toggleEditRoute(false);
    }
    setBusy(true);
    toggleDeleteRoute(false);
    (async () => {
      await getSingleRoute(routeId, filter);
      await getUser();
      await getOperators();
      setBusy(false);
    })();
  }, [shouldRefreshRoute]);

  useEffect(() => {
    setBusyChart(true);
    (async () => {
      await getSingleRoute(routeId, filter);
      setBusyChart(false);
    })();
  }, [filter]);

  return (
    <Container active="routes" loading={busy}>
      <RouteInfoContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">{`Detalhes da rota - ${routeInfo?.route.label}`}</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Rotas', url: '/rotas' },
                { name: 'Detalhes' },
              ]}
            />
          </div>
        </PageTitle>
        <RouteInfoContent>
          <div className="first-row">
            <div className="general">
              <h1 className="heading-secondary-font">Informações gerais</h1>
              <div className="general-info">
                <div className="title">
                  <BsPerson color="#00161d" size={15} />
                  <h2>Operador</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {operators.find(
                    operator => operator.id === routeInfo?.route.operatorId,
                  )?.name || 'Sem operador'}
                </h2>
              </div>
            </div>
            {user?.permissions?.editRoutes || user?.role === 'OWNER' ? (
              <div className="actions">
                <h1 className="heading-secondary-font">Ações</h1>
                <div className="buttons">
                  <Button
                    title="Editar rota"
                    color="secondary"
                    callback={() => toggleEditRoute(true)}
                  />
                </div>
              </div>
            ) : null}
          </div>
          <PointInRoute>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font history-title">
                  Pontos de venda
                </h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="serial-number">Nome</div>
                <div className="phone">Parceria</div>
                <div className="phone">Cidade/Estado</div>
                <div className="phone">Endereço</div>
              </div>
              {routeInfo &&
                routeInfo.pointsOfSale.map(pointOfSale => {
                  return (
                    <SinglePointInRoute key={v4()} pointOfSale={pointOfSale} />
                  );
                })}
            </Table>
          </PointInRoute>
          <MachinesLastCollection>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font history-title">
                  Máquinas - última coleta
                </h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="serial-number">Número de série</div>
                <div className="phone">Categoria</div>
                <div className="phone">Ponto de venda</div>
                <div className="phone">Última coleta</div>
              </div>
              {routeInfo &&
                routeInfo.machines.map(machine => {
                  return <SingleMachineInRoute key={v4()} machine={machine} />;
                })}
            </Table>
          </MachinesLastCollection>
          {user?.role !== 'OPERATOR' ? (
            <>
              <ManagementInfo>
                {!busyChart ? (
                  <>
                    <h1 className="heading-secondary-font">Gerencial</h1>
                    <NavBar active={filter}>
                      <button
                        type="button"
                        className="daily"
                        onClick={() => {
                          setFilter('DAILY');
                        }}
                      >
                        <h1 className="side-bar-secondary-font">Diário</h1>
                      </button>
                      <button
                        type="button"
                        className="weekly"
                        onClick={() => {
                          setFilter('WEEKLY');
                        }}
                      >
                        <h1 className="side-bar-secondary-font">Semanal</h1>
                      </button>
                      <button
                        type="button"
                        className="monthly"
                        onClick={() => {
                          setFilter('MONTHLY');
                        }}
                      >
                        <h1 className="side-bar-secondary-font">Mensal</h1>
                      </button>
                    </NavBar>
                    <div className="cards">
                      <Card>
                        <FiDollarSign color="#28a745" />
                        <div className="description">
                          <h1>Faturamento</h1>
                          <h2>
                            R$
                            {` ${routeInfo?.income.toFixed(2)}`}
                          </h2>
                        </div>
                      </Card>
                      <Card>
                        <FiShoppingBag color="#dc3545" />
                        <div className="description">
                          <h1>Prêmios Entreges</h1>
                          <h2>{routeInfo?.givenPrizesCount}</h2>
                        </div>
                      </Card>
                    </div>
                    <SingleMachineChart
                      chartData={routeInfo?.chartData1}
                      period={filter}
                    />
                  </>
                ) : (
                  <div className="is-loading">
                    <ClipLoader size={30} color="#00161d" />
                  </div>
                )}
              </ManagementInfo>
              <PointOfSaleRate>
                <div>
                  <h1 className="heading-secondary-font">
                    Resultado por ponto de venda
                  </h1>
                  <ChartPie
                    data={routeInfo?.chartData2.map(data => {
                      return {
                        label: data.label,
                        value: data.income,
                        isPricing: true,
                      };
                    })}
                  />
                </div>
                <div className="div">
                  <h1 className="heading-secondary-font">
                    Prêmios entregues por ponto de venda
                  </h1>
                  <ChartPie
                    data={routeInfo?.chartData2.map(data => {
                      return {
                        label: data.label,
                        value: data.givenPrizesCount,
                        isPricing: false,
                      };
                    })}
                  />
                </div>
              </PointOfSaleRate>
            </>
          ) : null}
          {user?.role === 'OWNER' || user?.permissions?.deleteRoutes ? (
            <div className="delete-route">
              <Button
                title="Deletar rota"
                color="tertiary"
                callback={() => toggleDeleteRoute(true)}
              />
            </div>
          ) : null}
        </RouteInfoContent>
      </RouteInfoContainer>
      {showEditRoute ? (
        <HandleRoute initialData={routeInfo?.route} operators={operators} />
      ) : null}
      {showDeleteRoute && <ModalDeleteRoute route={routeInfo?.route} />}
      {redirect && <Redirect to="rotas" />}
    </Container>
  );
};
export default RouteInfo;
