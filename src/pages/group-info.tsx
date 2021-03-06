import React, { useEffect, useState } from 'react';
import {
  FiAlertTriangle,
  FiDollarSign,
  FiShoppingBag,
  FiWifiOff,
} from 'react-icons/fi';
import { DatePicker } from 'react-rainbow-components';
import { ClipLoader } from 'react-spinners';
import { useLocation } from 'react-router-dom';
import { AiOutlineWifi } from 'react-icons/ai';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { v4 } from 'uuid';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SingleMachineChart from '../components/single-machine-chart';
import { Card } from '../styles/pages/machine-info';
import {
  GroupInfoContainer,
  Cards,
  GroupInfo,
  ManagementInfo,
  NavBar,
  Tables,
  Table,
  PointsOfSaleRank,
  TablePoint,
} from '../styles/pages/group-info';
import { PageTitle } from '../utils/page-title';
import { useGroup } from '../hooks/group';
import { useUser } from '../hooks/user';
import DashboardCard from '../components/dashboard-card';
import MachineWithoutCommunication from '../components/machine-without-communication';
import HandleGroup from '../components/handle-group';

const GroupInfoPage: React.FC = () => {
  // location
  const groupId = useLocation().state as string;

  // hooks
  const {
    getSingleGroup,
    groupInfo,
    showEditGroup,
    openEditGroup,
    shouldRefresh,
  } = useGroup();
  const { getUser, user } = useUser();

  // state
  const [busyChart, setBusyChart] = useState(false);
  const [busy, setBusy] = useState(false);
  const [range, setRenge] = useState<Date>();
  const [filter, setFilter] = useState<{
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
    startDate?: string;
    endDate?: string;
  }>({ period: 'DAILY', startDate: undefined, endDate: undefined });

  const containerStyles = {
    maxWidth: 400,
  };

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getUser();
      await getSingleGroup(groupId, filter);
      setBusy(false);
    })();
  }, [shouldRefresh]);

  useEffect(() => {
    setBusyChart(true);
    (async () => {
      if (filter.endDate || filter.startDate || filter.period) {
        await getSingleGroup(groupId, filter);
      }
      setBusyChart(false);
    })();
  }, [filter]);

  return (
    <Container loading={busy} active="groups">
      <GroupInfoContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">
              {`Detalhes da parceria ${
                groupInfo?.group.isPersonal ? '' : groupInfo?.group.label
              }`}
            </h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: '/ Parcerias', url: '/parcerias' },
                { name: 'Detalhe da parceria' },
              ]}
            />
          </div>
          {(user?.permissions?.editGroups || user?.role === 'OWNER') &&
            !groupInfo?.group.isPersonal && (
              <Button
                color="primary"
                title="Editar parceria"
                callback={() => openEditGroup(groupInfo?.group.id)}
              />
            )}
        </PageTitle>
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
                  <h1 className="side-bar-secondary-font">Di??rio</h1>
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
                  <h1 className="side-bar-secondary-font">Per??odo</h1>
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
                            groupInfo?.income.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                          }`}
                        </h2>
                      </div>
                    </Card>
                    <Card>
                      <FiShoppingBag color="#dc3545" />
                      <div className="description">
                        <h1>Pr??mios Entreges</h1>
                        <h2>{groupInfo?.givenPrizesCount}</h2>
                      </div>
                    </Card>
                  </div>
                  <SingleMachineChart
                    chartData={groupInfo?.chartData1}
                    period={filter.period}
                  />
                </>
              )}
              <PointsOfSaleRank>
                <TablePoint>
                  <div className="table-title">
                    <h1 className="table-title-font partnerships-name">
                      Pontos de venda por faturamento.
                    </h1>
                  </div>
                  <div className="primary-row table-title-font">
                    <div className="label">Ponto de venda</div>
                    <div className="center">N??mero de m??quinas</div>
                    <div className="right">Total (R$)</div>
                  </div>
                  {groupInfo?.pointsOfSaleSortedByIncome.map(point => {
                    return (
                      <MachineWithoutCommunication
                        key={v4()}
                        machine={
                          point.pointOfSale ? point.pointOfSale.label : '-'
                        }
                        group={point.numberOfMachines || 0}
                        machineId={point.pointOfSale.id}
                        time={point.income}
                        isPoint
                      />
                    );
                  })}
                </TablePoint>
              </PointsOfSaleRank>
            </>
          ) : (
            <div className="is-loading">
              <ClipLoader size={30} color="#00161d" />
            </div>
          )}
        </ManagementInfo>

        <GroupInfo>
          <div className="title">
            <h1 className="heading-font">Operacional</h1>
          </div>
          <Cards>
            <DashboardCard
              title="M??quinas Online"
              value={groupInfo?.onlineMachines || 0}
              color="#28a745"
              Icon={AiOutlineWifi}
            />
            <DashboardCard
              title="M??quinas Offline"
              value={groupInfo?.offlineMachines || 0}
              color="#dc3545"
              Icon={FiWifiOff}
            />
            <DashboardCard
              title="M??quinas nunca conectadas"
              value={groupInfo?.machinesNeverConnected || 0}
              color="#00161d "
              Icon={VscDebugDisconnect}
            />
            <DashboardCard
              title="M??quinas sem telemetria"
              value={groupInfo?.machinesWithoutTelemetryBoard || 0}
              color="#444 "
              Icon={FiAlertTriangle}
            />
          </Cards>
          <Tables>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font partnerships-name">
                  M??quinas com maior tempo sem comunica????o
                </h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="label">M??quinas</div>
                <div className="center">Ponto de venda</div>
                <div className="right">Tempo</div>
              </div>
              {groupInfo?.machinesSortedByLastConnection.map(machine => {
                return (
                  <MachineWithoutCommunication
                    key={v4()}
                    machine={machine.serialNumber}
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
                  M??quinas com maior tempo sem coleta.
                </h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="label">M??quinas</div>
                <div className="center">Ponto de venda</div>
                <div className="right">Tempo</div>
              </div>
              {groupInfo?.machinesSortedByLastCollection.map(machine => {
                return (
                  <MachineWithoutCommunication
                    key={v4()}
                    machine={machine.serialNumber}
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
                  M??quinas com pouco estoque de pr??mios
                </h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="label">M??quinas</div>
                <div className="center">M??nimo</div>
                <div className="right">Atual</div>
              </div>
              {groupInfo?.machinesSortedByStock.map(machine => {
                return (
                  <MachineWithoutCommunication
                    key={v4()}
                    machine={machine.serialNumber}
                    category={`(${machine.categoryLabel})`}
                    group={machine.minimumPrizeCount}
                    machineId={machine.id}
                    time={machine.total}
                  />
                );
              })}
            </Table>
          </Tables>
        </GroupInfo>
        {/* <GroupAnalitycs>
          <div className="title">
            <h1 className="heading-font">Anal??tico</h1>
          </div>
          <ChartPie
            data={groupInfo?.chartData2.map(chart => {
              return {
                label: chart.counterLabel,
                value: chart.total,
                isPricing: true,
              };
            })}
          />
        </GroupAnalitycs> */}
      </GroupInfoContainer>
      {showEditGroup === groupInfo?.group.id ? (
        <HandleGroup initialData={groupInfo?.group} />
      ) : null}
    </Container>
  );
};
export default GroupInfoPage;
