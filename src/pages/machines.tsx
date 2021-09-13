/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';
import { Pagination } from '@material-ui/lab';
import ReactSelect from 'react-select';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { AiOutlineWifi } from 'react-icons/ai';
import { RiWifiOffLine } from 'react-icons/ri';
import { FiInfo } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SingleMachine from '../components/single-machine';
import { useCategory } from '../hooks/category';
import { useGroup } from '../hooks/group';
import { useMachine } from '../hooks/machine';
import { usePointOfSale } from '../hooks/point-of-sale';
import { InputContainer } from '../styles/components/input';
import {
  Legend,
  MachinesContainer,
  MachinesContent,
  PaginationContainer,
  Table,
} from '../styles/pages/machines';
import { PageTitle } from '../utils/page-title';
import { useUser } from '../hooks/user';
import { useTelemetry } from '../hooks/telemetry';
import { useRoute } from '../hooks/route';
import { Route } from '../entiti/route';
import ModalTelemetry from '../components/modal-telemetry';

const MachinesPage: React.FC = () => {
  // hooks
  const { getGroups, groups } = useGroup();
  const { getPointsOfSale, pointsOfSale } = usePointOfSale();
  const { getCategories, categories } = useCategory();
  const { getMachines, machines, count, filters, handleFilter } = useMachine();
  const {
    getTelemetries,
    telemetries,
    toggleTelemetryModal,
    showTelemetryModal,
  } = useTelemetry();
  const { getRoutes, routes } = useRoute();
  const { user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [filterWasChanged, setFilterWasChanged] = useState(0);
  const [routesFiltered, setRoutesFiltered] = useState<Route[]>([]);
  const [label, setLabel] = useState<string>();
  const [busyFilter, setBusyFilter] = useState<boolean>(false);

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  const handleParams = useCallback((value: string | undefined) => {
    if (value) {
      if (value === 'none') {
        return undefined;
      }
      if (value === 'stock') {
        return null;
      }
      if (value !== 'none' && value !== null) {
        return value;
      }
    }
    return undefined;
  }, []);

  useEffect(() => {
    setBusy(true);
    toggleTelemetryModal(undefined);
    (async () => {
      await getMachines(pageSelected * 10 - 10, {
        categoryId: filters.categoryId
          ? (handleParams(filters.categoryId.value) as string | undefined)
          : undefined,
        groupId: filters.groupId?.value
          ? (handleParams(filters.groupId.value) as string | undefined)
          : undefined,
        isActive: filters.isActive || undefined,
        lean: filters.lean || undefined,
        pointOfSaleId: filters.pointOfSaleId?.value
          ? (handleParams(filters.pointOfSaleId.value) as string | undefined)
          : undefined,
        routeId: filters.routeId?.value
          ? (handleParams(filters.routeId.value) as string | undefined)
          : undefined,
        serialNumber: filters.serialNumber || undefined,
        telemetryStatus: filters.telemetryStatus
          ? (handleParams(filters.telemetryStatus.value) as
              | 'ONLINE'
              | 'OFFLINE'
              | 'VIRGIN'
              | 'NO_TELEMETRY'
              | 'none')
          : undefined,
      });
      await getGroups();
      await getPointsOfSale(undefined, undefined);
      await getCategories();
      await getTelemetries();
      await getRoutes(undefined, undefined);
      setRoutesFiltered(routes);
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    setBusyFilter(true);
    (async () => {
      await getMachines(pageSelected * 10 - 10, {
        categoryId: filters.categoryId
          ? (handleParams(filters.categoryId.value) as string | undefined)
          : undefined,
        groupId: filters.groupId?.value
          ? (handleParams(filters.groupId.value) as string | undefined)
          : undefined,
        isActive: filters.isActive || undefined,
        lean: filters.lean || undefined,
        pointOfSaleId: filters.pointOfSaleId?.value
          ? (handleParams(filters.pointOfSaleId.value) as string | undefined)
          : undefined,
        routeId: filters.routeId?.value
          ? (handleParams(filters.routeId.value) as string | undefined)
          : undefined,
        serialNumber: filters.serialNumber || undefined,
        telemetryStatus: filters.telemetryStatus
          ? (handleParams(filters.telemetryStatus.value) as
              | 'ONLINE'
              | 'OFFLINE'
              | 'VIRGIN'
              | 'NO_TELEMETRY'
              | 'none')
          : undefined,
      });

      if (filters.groupId === undefined || filters.groupId.value === 'none') {
        await getPointsOfSale(undefined, undefined);
        setRoutesFiltered(routes);
      } else {
        await getPointsOfSale(undefined, {
          groupId: filters.groupId.value,
        });
        setRoutesFiltered(
          routes.filter(route =>
            route.groupIds?.includes(filters.groupId!.value),
          ),
        );
      }
      setBusyFilter(false);
    })();
  }, [filterWasChanged, pageSelected, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleFilter({
        ...filters,
        serialNumber: label,
      });
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [label]);

  return (
    <Container active="machines" loading={busy}>
      <MachinesContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Máquinas</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Máquinas' }]}
            />
          </div>
          {user?.permissions?.createMachines || user?.role === 'OWNER' ? (
            <>
              {categories.length > 0 ? (
                <Link to="/editar-maquina">
                  <Button title="Nova Máquina" color="primary" />
                </Link>
              ) : (
                <Button
                  title="Nova Máquina"
                  color="primary"
                  callback={() => toggleTelemetryModal('true')}
                />
              )}
            </>
          ) : null}
        </PageTitle>
        <MachinesContent>
          <div className="filter">
            <div className="filters ">
              <p style={{ marginBottom: '1rem' }}>Parceria</p>
              <ReactSelect
                name="groupId"
                id="groupId"
                value={
                  filters.groupId
                    ? filters.groupId
                    : { label: 'Todas', value: 'none' }
                }
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
                    handleFilter({
                      groupId: e,
                      categoryId: undefined,
                      lean: undefined,
                      pointOfSaleId: undefined,
                      routeId: undefined,
                      serialNumber: undefined,
                      telemetryStatus: undefined,
                    });
                  }
                  setPageSelected(1);
                  setFilterWasChanged(filterWasChanged + 1);
                }}
              />
            </div>

            <div className="filters label-filter">
              <p style={{ marginBottom: '1rem' }}>Localização</p>
              <ReactSelect
                name="pointOfSaleId"
                value={
                  filters.pointOfSaleId
                    ? filters.pointOfSaleId
                    : { label: 'Todos', value: 'none' }
                }
                options={[
                  { value: 'none', label: 'Todos' },
                  { value: 'stock', label: 'Estoque' },
                  ...pointsOfSale.map(pointOfSale => {
                    return {
                      value: pointOfSale.id,
                      label: pointOfSale.label,
                    };
                  }),
                ]}
                onChange={e => {
                  if (e) {
                    handleFilter({
                      ...filters,
                      pointOfSaleId: e,
                    });
                  }
                  setPageSelected(1);
                  setFilterWasChanged(filterWasChanged + 1);
                }}
              />
            </div>
            <div className="filters label-filter">
              <p style={{ marginBottom: '1rem' }}>Categorias</p>
              <ReactSelect
                name="categoryId"
                value={
                  filters.categoryId
                    ? filters.categoryId
                    : { label: 'Todas', value: 'none' }
                }
                options={[
                  { value: 'none', label: 'Todas' },
                  ...(categories &&
                    categories.map(category => {
                      return {
                        value: category.id,
                        label: category.label,
                      };
                    })),
                ]}
                onChange={e => {
                  if (e) {
                    handleFilter({
                      ...filters,
                      categoryId: e,
                    });
                  }
                  setPageSelected(1);
                  setFilterWasChanged(filterWasChanged + 1);
                }}
              />
            </div>
            <div className="filters label-filter">
              <p style={{ marginBottom: '1rem' }}>Rota</p>
              <ReactSelect
                name="routerId"
                value={
                  filters.routeId
                    ? filters.routeId
                    : { label: 'Todas', value: 'none' }
                }
                options={[
                  {
                    value: 'none',
                    label: 'Todas',
                  },
                  ...(routesFiltered &&
                    routesFiltered.map(route => {
                      return {
                        value: route.id,
                        label: route.label,
                      };
                    })),
                ]}
                onChange={e => {
                  if (e) {
                    handleFilter({
                      ...filters,
                      routeId: e,
                    });
                    setPageSelected(1);
                    setFilterWasChanged(filterWasChanged + 1);
                  }
                }}
              />
            </div>
            <div className="filters label-filter">
              <p style={{ marginBottom: '1rem' }}>Status de telemetria</p>
              <ReactSelect
                name="telemetryId"
                value={
                  filters.telemetryStatus
                    ? filters.telemetryStatus
                    : {
                        value: 'none',
                        label: 'Todas',
                      }
                }
                options={[
                  {
                    value: 'none',
                    label: 'Todas',
                  },
                  { value: 'ONLINE', label: 'Online' },
                  { value: 'OFFLINE', label: 'Offline' },
                  { value: 'VIRGIN', label: 'Nunca conectada' },
                  { value: 'NO_TELEMETRY', label: 'Sem telemetria' },
                ]}
                onChange={e => {
                  if (e) {
                    handleFilter({
                      ...filters,
                      telemetryStatus: e as {
                        label: string;
                        value:
                          | 'ONLINE'
                          | 'OFFLINE'
                          | 'VIRGIN'
                          | 'NO_TELEMETRY'
                          | 'none';
                      },
                    });
                  }
                  setPageSelected(1);
                  setFilterWasChanged(filterWasChanged + 1);
                }}
              />
            </div>
            <div className="filters">
              <InputContainer>
                <label htmlFor="serial-number-name">
                  <p>Número de série</p>
                  <div>
                    <input
                      onFocus={() => {
                        setIsFocused(true);
                      }}
                      onBlur={() => {
                        setIsFocused(false);
                      }}
                      name="serialNumber"
                      type="text"
                      value={label}
                      onChange={e => {
                        if (e) {
                          const { value } = e.target;
                          setLabel(value);
                          setPageSelected(1);
                        }
                      }}
                    />
                  </div>
                </label>
              </InputContainer>
            </div>
            <button
              className="reset-filter"
              type="button"
              onClick={() => {
                handleFilter({});
                setPageSelected(1);
                setFilterWasChanged(filterWasChanged + 1);
              }}
            >
              Resetar filtro
            </button>
          </div>

          <Legend>
            <div>
              <VscDebugDisconnect color="#333" />
              <h2>Nunca conectada</h2>
            </div>
            <div>
              <RiWifiOffLine color="#ff008c" />
              <h2>Desconectada</h2>
            </div>
            <div>
              <AiOutlineWifi color="#228b22" />
              <h2>Conectada</h2>
            </div>
          </Legend>

          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">{`Máquinas (${count})`}</h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="serial-number">Núm. série</div>
              {groups.length === 1 ? null : (
                <div className="group">Parceria</div>
              )}
              <div className="operator">Operador</div>
              <div className="given-prizes">
                Prêmios entregues
                <FiInfo />
              </div>
              <div className="category">Telemetria</div>
              <div className="category">Categoria</div>
              <div className="location">Localização</div>
            </div>
            {machines &&
              machines.map(machine => {
                return (
                  <SingleMachine
                    key={v4()}
                    user={user}
                    machine={machine}
                    telemetry={telemetries.find(
                      telemetry => telemetry.id === machine.telemetryBoardId,
                    )}
                    pointOfSale={pointsOfSale.find(
                      point => point.id === machine.locationId,
                    )}
                    isSingleGroup={groups.length === 1}
                    group={groups.find(group => group.id === machine.groupId)}
                    category={categories.find(
                      category => category.id === machine.categoryId,
                    )}
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
        </MachinesContent>
      </MachinesContainer>
      {showTelemetryModal && (
        <ModalTelemetry
          title="Atenção"
          text="Para criar uma máquina é necessário possuir uma categoria já criada."
          isMachine
        />
      )}
    </Container>
  );
};
export default MachinesPage;
