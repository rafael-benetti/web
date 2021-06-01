/* eslint-disable array-callback-return */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FiThumbsUp,
  FiDollarSign,
  FiMap,
  FiMapPin,
  FiPhoneCall,
  FiShoppingBag,
} from 'react-icons/fi';
import { FaRoute } from 'react-icons/fa';
import { BsPerson } from 'react-icons/bs';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { v4 } from 'uuid';
import { ClipLoader } from 'react-spinners';
import { DatePicker } from 'react-rainbow-components';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { usePointOfSale } from '../hooks/point-of-sale';
import {
  MachinesInPointOfSale,
  PointOfSaleInfoContainer,
  PointOfSaleInfoContent,
  Table,
  NavBar,
  ManagementInfo,
  MachinesRate,
} from '../styles/pages/point-of-sale-info';
import { PageTitle } from '../utils/page-title';
import SingleMachineInPoint from '../components/single-machine-in-point';
import { Card } from '../styles/pages/machine-info';
import SingleMachineChart from '../components/single-machine-chart';
import ChartPie from '../components/chart-pie';
import { useUser } from '../hooks/user';
import AddMachineInPoint from '../components/add-machine-in-point';
import EditRentInPoint from '../components/edit-rendt-in-point';
import RemovePointInRoute from '../components/remove-point-in-route';
import AddPointInRoute from '../components/add-point-in-route';
import { MachineInfo } from '../entiti/machine-info';

const PointOfSaleInfo: React.FC = () => {
  // location
  const pointOfSaleId = useLocation().state as string;

  // hooks
  const {
    getSinglePointOfSale,
    pointOfSaleInfo,
    toggleActions,
    showAction,
    shouldRefreshPoint,
  } = usePointOfSale();
  const { getUser, user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
    startDate?: string;
    endDate?: string;
  }>({ period: 'DAILY' });
  const [busyChart, setBusyChart] = useState<boolean>(false);
  const [redirect, setRedirect] = useState(false);
  const [range, setRenge] = useState<Date>();

  const containerStyles = {
    maxWidth: 400,
  };

  const formatPhone = useCallback((value: string, fromApi: boolean) => {
    if (!fromApi) {
      const formattedString = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})(-)(\d)(\d{3})(\d)/, '$1$3-$4$5')
        .replace(/(-\d{4})\d+?$/, '$1');

      return formattedString;
    }
    const formattedString = value
      .substring(3)
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})(-)(\d)(\d{3})(\d)/, '$1$3-$4$5')
      .replace(/(-\d{4})\d+?$/, '$1');
    return formattedString;
  }, []);

  useEffect(() => {
    if (!pointOfSaleId) {
      setRedirect(true);
    }
    setBusy(true);
    setFilter({ period: 'DAILY' });
    (async () => {
      await getSinglePointOfSale(pointOfSaleId, filter);
      await getUser();
      setBusy(false);
    })();
  }, [shouldRefreshPoint]);

  useEffect(() => {
    setBusyChart(true);
    (async () => {
      if (filter.endDate || filter.startDate || filter.period) {
        await getSinglePointOfSale(pointOfSaleId, filter);
      }
      setBusyChart(false);
    })();
  }, [filter]);

  const total = useCallback((machinesInfo?: MachineInfo[]) => {
    let money = 0;
    if (machinesInfo) {
      machinesInfo.forEach(machineInfo => {
        machineInfo.machine.boxes?.forEach(box => {
          if (box.currentMoney) {
            money += box.currentMoney;
          }
        });
      });
    }
    return money;
  }, []);

  return (
    <Container active="points-of-sale" loading={busy}>
      <PointOfSaleInfoContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">{`Detalhes do ponto de venda - ${pointOfSaleInfo?.pointOfSale.label}`}</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Pontos de venda', url: '/points-of-sale' },
                { name: 'Detalhes' },
              ]}
            />
          </div>
          {user?.role === 'OWNER' || user?.permissions?.editPointsOfSale ? (
            <Link
              to={{
                pathname: '/handle-point-of-sale',
                state: {
                  initialData: {
                    pointOfSale: pointOfSaleInfo?.pointOfSale,
                    group: pointOfSaleInfo?.pointOfSale.group,
                  },
                },
              }}
            >
              <Button title="Editar ponto de venda" color="primary" />
            </Link>
          ) : null}
        </PageTitle>
        <PointOfSaleInfoContent>
          <div className="first-row">
            <div className="general">
              <h1 className="heading-secondary-font">Informações gerais</h1>
              <div className="general-info">
                <div className="title">
                  <FiThumbsUp color="#7366ff" size={15} />
                  <h2>Parceria</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {pointOfSaleInfo?.pointOfSale.group.label ||
                    'Parceria pessoal'}
                </h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FaRoute color="#7366ff" size={15} />
                  <h2>Rota</h2>
                </div>
                <div className="spacer" />
                <Link
                  to={{
                    pathname: 'single-route',
                    state: pointOfSaleInfo?.route?.id,
                  }}
                >
                  <button type="button">
                    <h2>
                      {pointOfSaleInfo?.route
                        ? pointOfSaleInfo?.route.label
                        : 'Sem rota'}
                    </h2>
                  </button>
                </Link>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiDollarSign color="#7366ff" size={15} />
                  <h2>Aluguel</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {`${
                    pointOfSaleInfo?.pointOfSale.isPercentage ? '%' : 'R$'
                  }  ${
                    Number(pointOfSaleInfo?.pointOfSale.rent).toLocaleString(
                      'pt-BR',
                      {
                        minimumFractionDigits: 2,
                      },
                    ) || '0,00'
                  }`}
                </h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiMap color="#7366ff" size={15} />
                  <h2>Cidade/Estado</h2>
                </div>
                <div className="spacer" />
                <h2>{`${pointOfSaleInfo?.pointOfSale.address.city}, ${pointOfSaleInfo?.pointOfSale.address.state}`}</h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiMapPin color="#7366ff" size={15} />
                  <h2>Endereço</h2>
                </div>
                <div className="spacer" />
                <h2>{`${pointOfSaleInfo?.pointOfSale.address.street}, ${pointOfSaleInfo?.pointOfSale.address.number}`}</h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <BsPerson color="#7366ff" size={15} />
                  <h2>Gerente</h2>
                </div>
                <div className="spacer" />
                <h2>{pointOfSaleInfo?.pointOfSale.contactName}</h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiPhoneCall color="#7366ff" size={15} />
                  <h2>Telefone</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {pointOfSaleInfo?.pointOfSale.primaryPhoneNumber
                    ? formatPhone(
                        pointOfSaleInfo?.pointOfSale.primaryPhoneNumber,
                        true,
                      )
                    : formatPhone(
                        pointOfSaleInfo?.pointOfSale.secondaryPhoneNumber || '',
                        true,
                      )}
                </h2>
              </div>
            </div>
            {user?.role !== 'OWNER' &&
            !user?.permissions?.editPointsOfSale &&
            !user?.permissions?.editMachines &&
            !user?.permissions?.editRoutes ? null : (
              <div className="actions">
                <h1 className="heading-secondary-font">Ações</h1>
                <div className="buttons">
                  {user?.role === 'OWNER' || user?.permissions?.editMachines ? (
                    <Button
                      title="Incluir em uma máquina"
                      color="secondary"
                      callback={() => {
                        toggleActions('MACHINE');
                      }}
                    />
                  ) : null}
                  {user?.role === 'OWNER' ||
                  user?.permissions?.editPointsOfSale ? (
                    <Button
                      title="Editar aluguel"
                      color="quartiary"
                      callback={() => toggleActions('RENT')}
                    />
                  ) : null}
                  {user?.role === 'OWNER' || user?.permissions?.editRoutes ? (
                    <>
                      {pointOfSaleInfo?.route ? (
                        <Button
                          title="Remover desta rota"
                          color="tertiary"
                          callback={() => {
                            toggleActions('REMOVE_ROUTE');
                          }}
                        />
                      ) : (
                        <Button
                          title="Incluir em uma rota"
                          color="primary"
                          callback={() => toggleActions('ROUTE')}
                        />
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
          <MachinesInPointOfSale>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font history-title">Máquinas</h1>
              </div>
              <div className="primary-row table-title-font">
                <div className="serial-number">Núm. de série</div>
                <div className="phone">Telemetria</div>
                <div className="phone">Categoria</div>
                <div className="phone">Última coleta</div>
                <div className="phone">Valor na máquina</div>
              </div>
              {pointOfSaleInfo &&
                pointOfSaleInfo.machinesInfo.map(machineInfo => {
                  return (
                    <SingleMachineInPoint
                      key={v4()}
                      machineInfo={machineInfo}
                    />
                  );
                })}
              <div className="table-title total">
                <div />
                {`Total: R$ ${total(pointOfSaleInfo?.machinesInfo)}`}
              </div>
            </Table>
          </MachinesInPointOfSale>
          {user?.role !== 'OPERATOR' ? (
            <>
              <ManagementInfo>
                {!busyChart ? (
                  <>
                    <h1 className="heading-secondary-font">Gerencial</h1>
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
                                const [
                                  startDate,
                                  endDate,
                                ] = value.toString().split(',');

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
                                R$
                                {` ${pointOfSaleInfo?.income.toFixed(2)}`}
                              </h2>
                            </div>
                          </Card>
                          <Card>
                            <FiShoppingBag color="#dc3545" />
                            <div className="description">
                              <h1>Prêmios Entreges</h1>
                              <h2>{pointOfSaleInfo?.givenPrizesCount}</h2>
                            </div>
                          </Card>
                        </div>
                        <SingleMachineChart
                          chartData={pointOfSaleInfo?.chartData}
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
              <MachinesRate>
                <div className="row">
                  <div>
                    <h1 className="heading-secondary-font">
                      Resultado por máquina
                    </h1>
                    <ChartPie
                      data={pointOfSaleInfo?.machinesInfo.map(machineInfo => {
                        return {
                          label: machineInfo.machine.serialNumber,
                          value: machineInfo.income,
                        };
                      })}
                    />
                  </div>
                  <div className="div">
                    <h1 className="heading-secondary-font">
                      Prêmios entregues por máquina
                    </h1>
                    <ChartPie
                      data={pointOfSaleInfo?.machinesInfo.map(machineInfo => {
                        return {
                          label: machineInfo.machine.serialNumber,
                          value: machineInfo.givenPrizes,
                        };
                      })}
                    />
                  </div>
                </div>
              </MachinesRate>
            </>
          ) : null}
        </PointOfSaleInfoContent>
      </PointOfSaleInfoContainer>
      {showAction === 'MACHINE' && (
        <AddMachineInPoint pointOfSaleInfo={pointOfSaleInfo} />
      )}
      {showAction === 'RENT' && (
        <EditRentInPoint pointOfSaleInfo={pointOfSaleInfo} />
      )}
      {showAction === 'REMOVE_ROUTE' && (
        <RemovePointInRoute
          route={pointOfSaleInfo?.route}
          pointOfSaleId={pointOfSaleInfo?.pointOfSale.id}
        />
      )}
      {showAction === 'ROUTE' && (
        <AddPointInRoute pointOfSaleId={pointOfSaleInfo?.pointOfSale.id} />
      )}
      {redirect && <Redirect to="points-of-sale" />}
    </Container>
  );
};
export default PointOfSaleInfo;
