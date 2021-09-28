/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  FiWifiOff,
  FiAlertTriangle,
  FiDollarSign,
  FiShoppingBag,
  FiBell,
} from 'react-icons/fi';
import { AiOutlineWifi } from 'react-icons/ai';
import { VscDebugDisconnect } from 'react-icons/vsc';
import ReactSelect from 'react-select';
import { ClipLoader } from 'react-spinners';
import { DatePicker } from 'react-rainbow-components';
import { Link, useLocation } from 'react-router-dom';
import { v4 } from 'uuid';
import Container from '../components/container';
import {
  Cards,
  DashboardContainer,
  Table,
  Tables,
  ManagementInfo,
  NavBar,
  DashboardInfo,
  DashboardAnalitycs,
  Notification,
} from '../styles/pages/dashboard';
import DashboardCard from '../components/dashboard-card';
import MachineWithoutCommunication from '../components/machine-without-communication';
import { Card } from '../styles/pages/machine-info';
import CurrentPath from '../components/current-path';
import { PageTitle } from '../utils/page-title';
import ChartPie from '../components/chart-pie';
import { useUser } from '../hooks/user';
import SingleMachineChart from '../components/single-machine-chart';
import { useGroup } from '../hooks/group';
import { useRoute } from '../hooks/route';
import { usePointOfSale } from '../hooks/point-of-sale';

const Dashboard: React.FC = () => {
  const refresh = useLocation().state as string | undefined;

  // hooks
  const {
    getDashboardData,
    dashboardData,
    getUnreadNotifications,
    numberOfUnreadNotifications,
    user,
    getUser,
  } = useUser();
  const { getGroups, groups } = useGroup();
  const { getRoutes, routes } = useRoute();
  const { getPointsOfSale, pointsOfSale } = usePointOfSale();

  // state
  const [busyChart, setBusyChart] = useState(false);
  const [busy, setBusy] = useState(false);
  const [range, setRenge] = useState<Date>();
  const [filter, setFilter] = useState<{
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
    startDate?: string;
    endDate?: string;
    groupId?: string;
    routeId?: string;
    pointOfSaleId?: string;
  }>({ period: 'DAILY', startDate: undefined, endDate: undefined });
  const [groupSelected, setGroupSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'Todas', value: 'none' });
  const [routeSelected, setRouteSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'Todas', value: 'none' });
  const [pointSelected, setPointSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'Todos', value: 'none' });

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getUnreadNotifications();
      await getUser();
      await getGroups();
      await getRoutes(undefined, undefined);
      await getPointsOfSale(undefined, undefined);
      setBusy(false);
    })();
  }, [refresh]);

  useEffect(() => {
    setBusyChart(true);
    (async () => {
      await getDashboardData(filter);
      setBusyChart(false);
    })();
  }, [filter, refresh]);

  useEffect(() => {
    (async () => {
      if (groupSelected.value !== 'none') {
        await getPointsOfSale(undefined, { groupId: groupSelected.value });
        await getRoutes(undefined, { groupId: groupSelected.value });
      }
    })();
  }, [groupSelected.value]);

  const containerStyles = {
    maxWidth: 400,
  };

  return (
    <Container loading={busy} active="dashboard">
      <DashboardContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Dashboard</h1>
            <CurrentPath path={[{ name: 'home', url: '/' }]} />
          </div>
          {user?.role !== 'OWNER' && (
            <Link to="notificacoes">
              <Notification type="button" count={numberOfUnreadNotifications}>
                <p>Notificações</p>
                <FiBell />
                {numberOfUnreadNotifications > 0 ? (
                  <div className="circle">
                    <p>{numberOfUnreadNotifications}</p>
                  </div>
                ) : null}
              </Notification>
            </Link>
          )}
        </PageTitle>
        {user?.role !== 'OPERATOR' && (
          <>
            <div className="filters-container">
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
                      setFilter({
                        ...filter,
                        routeId: undefined,
                        pointOfSaleId: undefined,
                        groupId: e.value,
                      });
                      setRouteSelected({ label: 'Todos', value: 'none' });
                      setPointSelected({ label: 'Todas', value: 'none' });
                    }
                  }}
                />
              </div>
              <div className="filters label-filter">
                <p style={{ marginBottom: '1rem' }}>Rota</p>
                <ReactSelect
                  name="routeId"
                  value={routeSelected}
                  options={[
                    {
                      value: 'none',
                      label: 'Todas',
                    },
                    ...(routes &&
                      routes.map(route => {
                        return {
                          value: route.id,
                          label: route.label,
                        };
                      })),
                  ]}
                  onChange={e => {
                    if (e) {
                      setRouteSelected(e);
                      setFilter({
                        ...filter,
                        routeId: e.value,
                      });
                    }
                  }}
                />
              </div>
              <div className="filters label-filter">
                <p style={{ marginBottom: '1rem' }}>Ponto de venda</p>
                <ReactSelect
                  name="pointOfSaleId"
                  value={pointSelected}
                  options={[
                    {
                      value: 'none',
                      label: 'Todos',
                    },
                    ...(pointsOfSale &&
                      pointsOfSale.map(point => {
                        return {
                          value: point.id,
                          label: point.label,
                        };
                      })),
                  ]}
                  onChange={e => {
                    if (e) {
                      setPointSelected(e);
                      setFilter({
                        ...filter,
                        pointOfSaleId: e.value,
                      });
                    }
                  }}
                />
              </div>
            </div>
            <ManagementInfo>
              <div className="title">
                <h1 className="heading-font">Gerencial</h1>
              </div>
              {!busyChart ? (
                <>
                  <NavBar active={filter.period}>
                    <button
                      type="button"
                      className="daily"
                      onClick={() => {
                        setFilter({
                          ...filter,
                          period: 'DAILY',
                          startDate: undefined,
                          endDate: undefined,
                        });
                        setRenge(undefined);
                      }}
                    >
                      <h1 className="side-bar-secondary-font">Diário</h1>
                    </button>
                    <button
                      type="button"
                      className="weekly"
                      onClick={() => {
                        setFilter({
                          ...filter,
                          period: 'WEEKLY',
                          startDate: undefined,
                          endDate: undefined,
                        });
                        setRenge(undefined);
                      }}
                    >
                      <h1 className="side-bar-secondary-font">Semanal</h1>
                    </button>
                    <button
                      type="button"
                      className="monthly"
                      onClick={() => {
                        setFilter({
                          ...filter,
                          period: 'MONTHLY',
                          startDate: undefined,
                          endDate: undefined,
                        });
                        setRenge(undefined);
                      }}
                    >
                      <h1 className="side-bar-secondary-font">Mensal</h1>
                    </button>
                    <button
                      type="button"
                      className="period"
                      onClick={() => {
                        setFilter({
                          ...filter,
                          period: undefined,
                          startDate: undefined,
                          endDate: undefined,
                        });
                      }}
                    >
                      <h1 className="side-bar-secondary-font">Período</h1>
                    </button>
                    {!filter.period && (
                      <div className="filters label-filter">
                        <div
                          className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
                          style={containerStyles}
                        >
                          <DatePicker
                            id="datePicker-15"
                            placeholder="Selecione a data"
                            selectionType="range"
                            formatStyle="large"
                            variant="single"
                            locale="pt-BR"
                            value={range}
                            onChange={value => {
                              setRenge(value);
                              const [
                                startDate,
                                endDate,
                              ] = value.toString().split(',');

                              if (endDate) {
                                setFilter({
                                  ...filter,
                                  period: undefined,
                                  startDate,
                                  endDate,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </NavBar>
                  {!filter.period && !filter.startDate ? (
                    <div />
                  ) : (
                    <>
                      <div className="cards">
                        <Card>
                          <FiDollarSign color="#28a745" />
                          <div className="description">
                            <h1>Faturamento</h1>
                            <h2>
                              {`R$ ${
                                (dashboardData?.income &&
                                  dashboardData?.income.toLocaleString(
                                    'pt-BR',
                                    {
                                      minimumFractionDigits: 2,
                                    },
                                  )) ||
                                '0,00'
                              }`}
                            </h2>
                          </div>
                        </Card>
                        <Card>
                          <FiShoppingBag color="#dc3545" />
                          <div className="description">
                            <h1>Prêmios Entreges</h1>
                            <h2>{dashboardData?.givenPrizesCount}</h2>
                          </div>
                        </Card>
                      </div>
                      <SingleMachineChart
                        chartData={dashboardData?.chartData1}
                        period={filter.period}
                      />
                    </>
                  )}
                </>
              ) : (
                <div className="is-loading">
                  <ClipLoader size={30} color="#00161d" />
                </div>
              )}
            </ManagementInfo>
          </>
        )}
        <DashboardInfo>
          <div className="title">
            <h1 className="heading-font">Operacional</h1>
          </div>
          <Cards>
            <Link
              to={{
                pathname: '/maquinas',
              }}
            >
              <DashboardCard
                title="Máquinas Online"
                value={dashboardData?.onlineMachines || 0}
                color="#28a745"
                Icon={AiOutlineWifi}
                params={{ value: 'ONLINE', label: 'Online' }}
              />
            </Link>
            <Link
              to={{
                pathname: '/maquinas',
              }}
            >
              <DashboardCard
                title="Máquinas Offline"
                value={dashboardData?.offlineMachines || 0}
                color="#dc3545"
                Icon={FiWifiOff}
                params={{ value: 'OFFLINE', label: 'Offline' }}
              />
            </Link>
            <Link
              to={{
                pathname: '/maquinas',
              }}
            >
              <DashboardCard
                title="Máquinas nunca conectadas"
                value={dashboardData?.machinesNeverConnected || 0}
                color="#00161d "
                Icon={VscDebugDisconnect}
                params={{ value: 'VIRGIN', label: 'Nunca conectada' }}
              />
            </Link>
            <Link
              to={{
                pathname: '/maquinas',
              }}
            >
              <DashboardCard
                title="Máquinas sem telemetria"
                value={dashboardData?.machinesWithoutTelemetryBoard || 0}
                color="#444 "
                Icon={FiAlertTriangle}
                params={{ value: 'NO_TELEMETRY', label: 'Sem telemetria' }}
              />
            </Link>
          </Cards>
          <Tables>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font partnerships-name">
                  Máquinas com maior tempo sem comunicação
                </h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="label">Máquina</div>
                <div className="center">Ponto de venda</div>
                <div className="right">Tempo</div>
              </div>
              {dashboardData?.machinesSortedByLastConnection.map(machine => {
                return (
                  <MachineWithoutCommunication
                    key={v4()}
                    machine={`${machine.serialNumber}`}
                    category={`(${machine.categoryLabel})`}
                    group={machine.pointOfSale ? machine.pointOfSale.label : ''}
                    machineId={machine.id}
                    time={machine.lastConnection}
                  />
                );
              })}
            </Table>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font partnerships-name">
                  Máquinas com maior tempo sem coleta.
                </h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="label">Máquina</div>
                <div className="center">Ponto de venda</div>
                <div className="right">Tempo</div>
              </div>
              {dashboardData?.machinesSortedByLastCollection.map(machine => {
                return (
                  <MachineWithoutCommunication
                    key={v4()}
                    machine={`${machine.serialNumber}`}
                    category={`(${machine.categoryLabel})`}
                    group={machine.pointOfSale ? machine.pointOfSale.label : ''}
                    machineId={machine.id}
                    time={machine.lastCollection}
                  />
                );
              })}
            </Table>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font partnerships-name">
                  Máquinas com pouco estoque de prêmios
                </h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="label">Máquina</div>
                <div className="center">Mínimo</div>
                <div className="right">Atual</div>
              </div>
              {dashboardData?.machinesSortedByStock.map(machine => {
                return (
                  <MachineWithoutCommunication
                    key={v4()}
                    machine={`${machine.serialNumber}`}
                    category={`(${machine.categoryLabel})`}
                    group={machine.minimumPrizeCount}
                    machineId={machine.id}
                    time={machine.total}
                  />
                );
              })}
            </Table>
          </Tables>
        </DashboardInfo>
        {/* {user?.role !== 'OPERATOR' && (
          <DashboardAnalitycs>
            <div className="title">
              <h1 className="heading-font">Analítico</h1>
            </div>
            {dashboardData && (
              <ChartPie
                data={dashboardData.chartData2.map(chart => {
                  return {
                    label: chart.counterLabel,
                    value: chart.total,
                    isPricing: true,
                  };
                })}
              />
            )}
          </DashboardAnalitycs>
        )} */}
      </DashboardContainer>
    </Container>
  );
};
export default Dashboard;
