/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FiPocket,
  FiHardDrive,
  FiRadio,
  FiHome,
  FiThumbsUp,
  FiUsers,
  FiDollarSign,
  FiShoppingBag,
  FiGift,
  FiPackage,
  FiDatabase,
} from 'react-icons/fi';

import { FaTools } from 'react-icons/fa';
// eslint-disable-next-line import/no-duplicates
import { differenceInMinutes, format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { v4 } from 'uuid';
import { AiOutlineWifi } from 'react-icons/ai';
import { RiDivideFill, RiWifiOffLine } from 'react-icons/ri';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { ClipLoader } from 'react-spinners';
import Button from '../components/button';
import Container from '../components/container';
import BoxCard from '../components/box-card';
import CurrentPath from '../components/current-path';
import ModalDeleteMachine from '../components/modal-delete-machine';
import SingleMachineChart from '../components/single-machine-chart';
import TransferMachine from '../components/transfer-machine';
import { useMachine } from '../hooks/machine';
import {
  SingleMachineContainer,
  SingleMachineContent,
  Card,
  NavBar,
  History,
  HistoryCard,
  RemoteCard,
} from '../styles/pages/machine-info';
import { PageTitle } from '../utils/page-title';
import { useUser } from '../hooks/user';
import ChangeProductTypeInMachine from '../components/change-product-type-in-machine';
import EditMinimumStockInMachine from '../components/edit-minimum-stcok-in-machine';
import { useToast } from '../hooks/toast';
import SetMaintenanceMode from '../components/set-maintenance-mode';
import EditMachineGoals from '../components/edit-machie-goals';
import RemoteCredit from '../components/remote-credit';

const MachineInfoPage: React.FC = () => {
  // location
  const machineId = useLocation().state as string;

  // hooks
  const {
    getSingleMachine,
    machineInfo,
    toggleTransferMachine,
    showTransferMachine,
    shouldRefresh,
    toggleDeleteMachine,
    showDeleteMachine,
    toggleChangeTypeOfPrize,
    showChangeTypeOfPrize,
    toggleEditMinimumStock,
    showEditMinimumStock,
    togglePrizeRecover,
    toggleTransferProductToBox,
    toggleMaintenanceMode,
    toggleGoals,
    showMachineGoals,
    showMaintenanceMode,
    setMaintenanceMode,
    toggleRemoteCredit,
    showRemoteCredit,
  } = useMachine();
  const { getUser, user } = useUser();
  const { addToast } = useToast();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyChart, setBusyChart] = useState<boolean>(false);
  const [filter, setFilter] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [redirect, setRedirect] = useState(false);

  const boardStatus = useCallback(() => {
    if (!machineInfo?.machine.lastConnection) {
      return <VscDebugDisconnect color="#333" />;
    }
    if (
      differenceInMinutes(
        new Date(),
        new Date(machineInfo.machine.lastConnection),
      ) > 10
    ) {
      return <RiWifiOffLine color="#f73164" />;
    }
    return <AiOutlineWifi color="#228b22" />;
  }, [machineInfo]);

  const canCollect = useCallback(() => {
    if (machineInfo?.machine.lastConnection) {
      if (
        machineInfo?.machine.locationId !== null &&
        machineInfo.machine.locationId !== undefined &&
        differenceInMinutes(
          new Date(),
          new Date(machineInfo.machine.lastConnection),
        ) < 10
      ) {
        return true;
      }
      return false;
    }
    return false;
  }, [machineInfo]);

  useEffect(() => {
    if (!machineId) {
      setRedirect(true);
    }
    setBusy(true);
    (async () => {
      await getSingleMachine(machineId, filter);
      await getUser();
      toggleDeleteMachine(false);
      toggleTransferMachine(false);
      toggleChangeTypeOfPrize(false);
      togglePrizeRecover(undefined);
      toggleTransferProductToBox(undefined);
      toggleRemoteCredit(false);
      setBusy(false);
    })();
  }, [shouldRefresh]);

  useEffect(() => {
    setBusyChart(true);
    (async () => {
      if (filter) {
        await getSingleMachine(machineId, filter);
      }
      setBusyChart(false);
    })();
  }, [filter]);

  return (
    <Container active="machines" loading={busy}>
      <SingleMachineContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">{`Detalhes da máquina - ${machineInfo?.machine.serialNumber}`}</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Máquinas', url: '/maquinas' },
                { name: 'Detalhes' },
              ]}
            />
          </div>
          {user?.role === 'OWNER' || user?.permissions?.editMachines ? (
            <Link
              to={{ pathname: '/editar-maquina', state: machineInfo?.machine }}
            >
              <Button title="Editar máquina" color="primary" />
            </Link>
          ) : null}
        </PageTitle>
        <SingleMachineContent maintenance={machineInfo?.machine.maintenance}>
          <div className="first-row">
            <div className="column-info">
              <div className="info">
                <Card>
                  {boardStatus()}
                  <div className="description">
                    {machineInfo?.machine.telemetryBoardId ? (
                      <h1>{`Última Comunicação (STG-${machineInfo?.machine.telemetryBoardId})`}</h1>
                    ) : null}
                    <h2>
                      {machineInfo && machineInfo.machine.lastConnection
                        ? format(
                            new Date(machineInfo.machine.lastConnection),
                            `dd'-'MM'-'yy 'às' H:mm`,
                            {
                              locale: ptLocale,
                            },
                          )
                        : 'Sem conexão'}
                    </h2>
                  </div>
                </Card>
                <Card>
                  <FiPocket color="#17a2b8" />
                  <div className="description">
                    <h1>Última Coleta</h1>
                    <h2>
                      {machineInfo && machineInfo.lastCollection
                        ? format(
                            new Date(machineInfo.lastCollection),
                            `dd'-'MM'-'yy 'às' H:mm`,
                            {
                              locale: ptLocale,
                            },
                          )
                        : 'Nunca coletada'}
                    </h2>
                    {machineInfo?.collectedBy && (
                      <p>{`${machineInfo.collectedBy}`}</p>
                    )}
                  </div>
                </Card>
              </div>
              <div className="actions">
                <h1 className="heading-secondary-font">Ações</h1>
                <div className="buttons">
                  {canCollect() ? (
                    <Link
                      to={{
                        pathname: '/criar-coleta',
                        state: { machine: machineInfo?.machine },
                      }}
                    >
                      <Button title="Realizar coleta" color="quartiary" />
                    </Link>
                  ) : (
                    <Button
                      title="Realizar coleta"
                      color="quartiary"
                      callback={() => {
                        addToast({
                          title: 'Aviso!',
                          description:
                            'Esta máquina está em estoque ou offline. Para poder fazer coleta ela necessita estar online e em um ponto de venda',
                          duration: 10000,
                        });
                      }}
                    />
                  )}
                  {user?.role === 'OWNER' ||
                  user?.permissions?.addRemoteCredit ? (
                    <Button
                      title="Crédito remoto"
                      color="primary"
                      callback={() => toggleRemoteCredit(true)}
                    />
                  ) : null}
                  {user?.role === 'OWNER' || user?.permissions?.editMachines ? (
                    <Button
                      title="Mover máquina"
                      color="secondary"
                      callback={() => toggleTransferMachine(true)}
                    />
                  ) : null}
                  {user?.role === 'OWNER' ||
                  user?.permissions?.toggleMaintenanceMode ? (
                    <>
                      {machineInfo?.machine.maintenance ? (
                        <Button
                          title="Desativar manutenção"
                          color="septenary"
                          callback={async () => {
                            await setMaintenanceMode(
                              false,
                              machineInfo.machine.id,
                            );
                            toggleMaintenanceMode(false, true);
                          }}
                        />
                      ) : (
                        <Button
                          title="Ativar modo manutenção"
                          color="sexternary"
                          callback={() => toggleMaintenanceMode(true)}
                        />
                      )}
                    </>
                  ) : null}
                  {(user?.role === 'OWNER' ||
                    user?.permissions?.editMachines) &&
                  user.role !== 'OPERATOR' ? (
                    <Button
                      title="Tipo de prêmio"
                      color="tertiary"
                      callback={() => toggleChangeTypeOfPrize(true)}
                    />
                  ) : null}
                  {(user?.role === 'OWNER' ||
                    user?.permissions?.editMachines) &&
                  user?.role !== 'OPERATOR' ? (
                    <Button
                      title="Estoque mínimo"
                      color="quinary"
                      callback={() => toggleEditMinimumStock(true)}
                    />
                  ) : null}
                  {(user?.role === 'OWNER' ||
                    user?.permissions?.editMachines) &&
                  user?.role !== 'OPERATOR' ? (
                    <Button
                      title="Metas"
                      color="primary"
                      callback={() => toggleGoals(true)}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="general">
              <h1 className="heading-secondary-font">Informações gerais</h1>
              <div className="general-info">
                <div className="title">
                  <FiThumbsUp color="#7366ff" size={15} />
                  <h2>Parceria</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {machineInfo?.machine.group?.label || 'Parceria pessoal'}
                </h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiHome color="#7366ff" size={15} />
                  <h2>Ponto de venda</h2>
                </div>
                <div className="spacer" />
                {machineInfo?.machine.pointOfSale?.label ? (
                  <button type="button">
                    {user?.role !== 'OPERATOR' ? (
                      <Link
                        to={{
                          pathname: 'detalhes-do-ponto-de-venda',
                          state: machineInfo?.machine.locationId,
                        }}
                      >
                        <h2>{machineInfo?.machine.pointOfSale?.label}</h2>
                      </Link>
                    ) : (
                      machineInfo?.machine.pointOfSale?.label
                    )}
                  </button>
                ) : (
                  <h2>Estoque</h2>
                )}
              </div>
              <div className="general-info">
                <div className="title">
                  <FiHardDrive color="#7366ff" size={15} />
                  <h2>Categoria</h2>
                </div>
                <div className="spacer" />
                <h2>{machineInfo?.machine.categoryLabel}</h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiRadio color="#7366ff" size={15} />
                  <h2>Telemetria</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {machineInfo?.machine.telemetryBoardId
                    ? `STG-${machineInfo?.machine.telemetryBoardId}`
                    : 'Sem telemetria'}
                </h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiUsers color="#7366ff" size={15} />
                  <h2>Operador responsável</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {machineInfo?.machine.operator
                    ? machineInfo?.machine.operator.name
                    : 'Sem operador'}
                </h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiDollarSign color="#7366ff" size={15} />
                  <h2>Valor da jogada</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {machineInfo?.machine.gameValue
                    ? `R$ ${
                        Number(machineInfo?.machine.gameValue).toLocaleString(
                          'pt-BR',
                          {
                            minimumFractionDigits: 2,
                          },
                        ) || '0,00'
                      }`
                    : '-'}
                </h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiGift color="#7366ff" size={15} />
                  <h2>Tipo de prêmio</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {`${
                    machineInfo?.machine.typeOfPrize
                      ? machineInfo?.machine.typeOfPrize.label
                      : 'Indefinido'
                  }`}
                </h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiPackage color="#7366ff" size={15} />
                  <h2>Estoque mínimo</h2>
                </div>
                <div className="spacer" />
                <h2>{`${machineInfo?.machine.minimumPrizeCount || '-'}`}</h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <RiDivideFill color="#7366ff" size={15} />
                  <h2>Meta de faturamento por prêmio</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {machineInfo?.machine.incomePerPrizeGoal
                    ? `R$ ${machineInfo?.machine.incomePerPrizeGoal}`
                    : '-'}
                </h2>
              </div>
              <div className="general-info">
                <div className="title">
                  <FiDatabase color="#7366ff" size={15} />
                  <h2>Meta faturamento mensal</h2>
                </div>
                <div className="spacer" />
                <h2>
                  {machineInfo?.machine.incomePerMonthGoal
                    ? `R$ ${machineInfo?.machine.incomePerMonthGoal}`
                    : '-'}
                </h2>
              </div>
            </div>
          </div>
          {user?.role !== 'OPERATOR' ? (
            <div className="operational">
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
                          {` ${machineInfo?.income.toFixed(2)}`}
                        </h2>
                      </div>
                    </Card>
                    <Card>
                      <FiShoppingBag color="#dc3545" />
                      <div className="description">
                        <h1>Prêmios Entregues</h1>
                        <h2>{machineInfo?.givenPrizes}</h2>
                      </div>
                    </Card>
                  </div>
                  <SingleMachineChart
                    chartData={machineInfo?.chartData}
                    period={filter}
                  />
                </>
              ) : (
                <div className="is-loading">
                  <ClipLoader size={30} color="#7366ff" />
                </div>
              )}
            </div>
          ) : null}
          <div className="last-collection">
            <h1 className="heading-secondary-font">
              Acumulado desde a última coleta
            </h1>
            {machineInfo && machineInfo.boxesInfo.length > 1 && (
              <div className="all-cabins">
                <h1 className="heading-secondary-font">
                  {machineInfo.machine.categoryLabel
                    .toLowerCase()
                    .includes('roleta')
                    ? 'Resumo das Hastes'
                    : 'Resumo das cabines'}
                </h1>
                <div className="row">
                  <div className="line">
                    <h2>Faturamento</h2>
                    <h3 style={{ color: 'green' }}>
                      R$
                      {` ${machineInfo?.boxesInfo
                        .map(box => box.currentMoney)
                        .reduce((acc, cur) => cur + acc, 0)}`}
                    </h3>
                  </div>
                  <div className="line">
                    <h2>Prêmios entregues</h2>
                    <h3 style={{ color: 'red' }}>
                      {machineInfo?.boxesInfo
                        .map(box => box.givenPrizes)
                        .reduce((acc, cur) => cur + acc, 0)}
                    </h3>
                  </div>
                  {user?.role !== 'OPERATOR' ? (
                    <>
                      <div className="line">
                        <h2>Fat. médio p/ prêmio</h2>
                        <h3 style={{ color: '#7366ff' }}>
                          R$
                          {` ${(machineInfo?.boxesInfo
                            .map(box => box.givenPrizes)
                            .reduce((acc, cur) => cur + acc, 0) === 0
                            ? 0
                            : machineInfo?.boxesInfo
                                .map(box => box.currentMoney)
                                .reduce((acc, cur) => cur + acc, 0) /
                                (machineInfo?.boxesInfo
                                  .map(box => box.givenPrizes)
                                  .reduce((acc, cur) => cur + acc, 0) || 0) || 0
                          ).toFixed(2)}`}
                        </h3>
                      </div>
                    </>
                  ) : null}
                  <div className="line">
                    <h2>Estoque atual</h2>
                    <h3 style={{ color: 'orange' }}>
                      {machineInfo?.boxesInfo
                        .map(box => {
                          return box.currentPrizeCount;
                        })
                        .reduce((acc, cur) => cur + acc, 0)}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            <div className="box-cards">
              {machineInfo &&
                machineInfo.boxesInfo.map((box, index) => {
                  return (
                    <BoxCard
                      user={user}
                      box={box}
                      index={index}
                      key={v4()}
                      group={machineInfo.machine.group}
                      machineId={machineInfo.machine.id}
                      typeOfPrize={machineInfo.machine.typeOfPrize}
                      isRoleta={
                        !!machineInfo.machine.categoryLabel
                          .toLowerCase()
                          .includes('roleta')
                      }
                    />
                  );
                })}
            </div>
          </div>
          <History>
            <div className="grid-history">
              <div className="history-events">
                <div className="title">
                  <h1 className="heading-secondary-font">
                    Histórico de jogadas
                  </h1>
                  <Link
                    to={{
                      pathname: '/historico-de-eventos',
                      state: machineInfo?.machine.id,
                    }}
                  >
                    Ver mais
                  </Link>
                </div>
                <div className="events">
                  {machineInfo &&
                    machineInfo.transactionHistory.map(history => {
                      return (
                        <HistoryCard key={v4()}>
                          <div
                            className="circle"
                            style={{
                              backgroundColor: `${
                                history.type === 'IN' && !history.maintenance
                                  ? 'green'
                                  : history.type === 'OUT' &&
                                    !history.maintenance
                                  ? 'orange'
                                  : 'red'
                              }`,
                            }}
                          >
                            {history.type === 'IN' && !history.maintenance && (
                              <FiDollarSign />
                            )}
                            {history.type === 'OUT' && !history.maintenance && (
                              <FiGift />
                            )}
                            {history.maintenance && <FaTools />}
                          </div>
                          <div>
                            {history.type === 'IN' ? (
                              <>
                                <h1 className="table-title-font">Crédito</h1>
                                <p style={{ color: 'green' }}>
                                  {`R$ ${
                                    Number(history.value).toLocaleString(
                                      'pt-BR',
                                      {
                                        minimumFractionDigits: 2,
                                      },
                                    ) || '0,00'
                                  }`}
                                </p>
                                {history.offline && (
                                  <p style={{ color: 'red' }}>Offline</p>
                                )}
                              </>
                            ) : (
                              <>
                                <h1 className="table-title-font">Prêmio</h1>
                                {history.value}
                                {history.offline && (
                                  <p style={{ color: 'red' }}>Offline</p>
                                )}
                              </>
                            )}
                          </div>
                          <div>
                            <p className="time">
                              {format(new Date(history.date), `dd'-'MM'-'yy `, {
                                locale: ptLocale,
                              })}
                            </p>
                            <p className="time">
                              {format(new Date(history.date), ` H:mm`, {
                                locale: ptLocale,
                              })}
                            </p>
                          </div>
                        </HistoryCard>
                      );
                    })}
                </div>
              </div>
              <div className="remote">
                <div className="history-remote">
                  <div className="title">
                    <h1 className="heading-secondary-font">
                      Histórico de eventos
                    </h1>
                    <Link
                      to={{
                        pathname: '/historico-de-eventos-da-maquina',
                        state: machineInfo?.machine.id,
                      }}
                    >
                      Ver mais
                    </Link>
                  </div>

                  <div className="events">
                    {machineInfo &&
                      machineInfo.machineLogs.map(history => {
                        return (
                          <RemoteCard key={v4()}>
                            <div
                              className="circle"
                              style={{
                                backgroundColor: `${
                                  history.type === 'REMOTE_CREDIT'
                                    ? 'green'
                                    : 'orange'
                                }`,
                              }}
                            >
                              {history.type === 'REMOTE_CREDIT' ? (
                                <FiDollarSign />
                              ) : (
                                <FaTools />
                              )}
                            </div>
                            <div>
                              {history.type === 'REMOTE_CREDIT' ? (
                                <>
                                  <h1 className="table-title-font">
                                    {`Crédito remóto por ${history.user.name}`}
                                  </h1>
                                  <p>{`Observação: ${history.observations}`}</p>
                                  <p style={{ color: 'green' }}>
                                    {`R$ ${
                                      Number(history.quantity).toLocaleString(
                                        'pt-BR',
                                        {
                                          minimumFractionDigits: 2,
                                        },
                                      ) || '0,00'
                                    }`}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <h1 className="table-title-font">
                                    {`Correção de estoque por ${history.user.name}`}
                                  </h1>
                                  <p>{`Observação: ${history.observations}`}</p>
                                  <p>{history.quantity}</p>
                                </>
                              )}
                            </div>
                            <div>
                              <p className="time">
                                {format(
                                  new Date(history.createdAt),
                                  `dd'-'MM'-'yy `,
                                  {
                                    locale: ptLocale,
                                  },
                                )}
                              </p>
                              <p className="time">
                                {format(new Date(history.createdAt), ` H:mm`, {
                                  locale: ptLocale,
                                })}
                              </p>
                            </div>
                          </RemoteCard>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </History>
          {user?.role === 'OWNER' || user?.permissions?.deleteMachines ? (
            <div className="delete-machine">
              <Button
                title="Deletar máquina"
                color="tertiary"
                callback={() => toggleDeleteMachine(true)}
              />
            </div>
          ) : null}
        </SingleMachineContent>
      </SingleMachineContainer>
      {showTransferMachine ? (
        <TransferMachine machineInfo={machineInfo} />
      ) : null}
      {showDeleteMachine ? (
        <ModalDeleteMachine machine={machineInfo?.machine} />
      ) : null}
      {showChangeTypeOfPrize ? (
        <ChangeProductTypeInMachine
          prizes={machineInfo?.machine.group?.stock.prizes}
          typeOfPrize={machineInfo?.machine.typeOfPrize}
          machineId={machineInfo?.machine.id}
        />
      ) : null}
      {showEditMinimumStock ? (
        <EditMinimumStockInMachine
          minimumStock={machineInfo?.machine.minimumPrizeCount || '0'}
          machineId={machineInfo?.machine.id}
        />
      ) : null}
      {showMaintenanceMode && (
        <SetMaintenanceMode machineId={machineInfo?.machine.id} />
      )}
      {showMachineGoals && (
        <EditMachineGoals
          machineId={machineInfo?.machine.id}
          goals={{
            incomePerMonthGoal: machineInfo?.machine.incomePerMonthGoal,
            incomePerPrizeGoal: machineInfo?.machine.incomePerPrizeGoal,
          }}
        />
      )}
      {showRemoteCredit && <RemoteCredit machineId={machineInfo?.machine.id} />}
      {redirect && <Redirect to="maquinas" />}
    </Container>
  );
};
export default MachineInfoPage;
