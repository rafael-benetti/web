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

import { ClipLoader } from 'react-spinners';
import { DatePicker } from 'react-rainbow-components';
import { Link } from 'react-router-dom';
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

const Dashboard: React.FC = () => {
  // hooks
  const {
    getDashboardData,
    dashboardData,
    getUnreadNotifications,
    numberOfUnreadNotifications,
    user,
    getUser,
  } = useUser();

  // state
  const [busyChart, setBusyChart] = useState(false);
  const [busy, setBusy] = useState(false);
  const [range, setRenge] = useState<Date>();

  const [filter, setFilter] = useState<{
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
    startDate?: string;
    endDate?: string;
  }>({ period: 'DAILY', startDate: undefined, endDate: undefined });

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getUnreadNotifications();
      await getUser();
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    setBusyChart(true);
    (async () => {
      await getDashboardData(filter);
      setBusyChart(false);
    })();
  }, [filter]);

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
                            const [startDate, endDate] = value
                              .toString()
                              .split(',');

                            if (endDate) {
                              setFilter({
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
                              dashboardData?.income.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
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
                <ClipLoader size={30} color="#7366ff" />
              </div>
            )}
          </ManagementInfo>
        )}
        <DashboardInfo>
          <div className="title">
            <h1 className="heading-font">Operacional</h1>
          </div>
          <Cards>
            <Link
              to={{
                pathname: '/maquinas',
                state: 'ONLINE',
              }}
            >
              <DashboardCard
                title="Máquinas Online"
                value={dashboardData?.onlineMachines || 0}
                color="#28a745"
                Icon={AiOutlineWifi}
              />
            </Link>
            <Link
              to={{
                pathname: '/maquinas',
                state: 'OFFLINE',
              }}
            >
              <DashboardCard
                title="Máquinas Offline"
                value={dashboardData?.offlineMachines || 0}
                color="#dc3545"
                Icon={FiWifiOff}
              />
            </Link>
            <Link
              to={{
                pathname: '/maquinas',
                state: 'VIRGIN',
              }}
            >
              <DashboardCard
                title="Máquinas nunca conectadas"
                value={dashboardData?.machinesNeverConnected || 0}
                color="#7366ff "
                Icon={VscDebugDisconnect}
              />
            </Link>
            <Link
              to={{
                pathname: '/maquinas',
                state: 'NO_TELEMETRY',
              }}
            >
              <DashboardCard
                title="Máquinas sem telemetria"
                value={dashboardData?.machinesWithoutTelemetryBoard || 0}
                color="#444 "
                Icon={FiAlertTriangle}
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
                    machine={`${machine.serialNumber} (${machine.categoryLabel})`}
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
                    machine={`${machine.serialNumber} (${machine.categoryLabel})`}
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
                    machine={`${machine.serialNumber} (${machine.categoryLabel})`}
                    group={machine.minimumPrizeCount}
                    machineId={machine.id}
                    time={machine.total}
                  />
                );
              })}
            </Table>
          </Tables>
        </DashboardInfo>
        {user?.role !== 'OPERATOR' && (
          <DashboardAnalitycs>
            <div className="title">
              <h1 className="heading-font">Analítico</h1>
            </div>
            <ChartPie
              data={[
                {
                  label: 'Dinheiro',
                  value: dashboardData?.chartData2.cashIncome || 0,
                },
                {
                  label: 'Cartão',
                  value: dashboardData?.chartData2.creditCardIncome || 0,
                },
                {
                  label: 'Moeda',
                  value: dashboardData?.chartData2.coinIncome || 0,
                },
                {
                  label: 'Outros',
                  value: dashboardData?.chartData2.others || 0,
                },
              ]}
            />
          </DashboardAnalitycs>
        )}
      </DashboardContainer>
    </Container>
  );
};
export default Dashboard;
