/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { v4 } from 'uuid';
import { Pagination } from '@material-ui/lab';
import ReactSelect from 'react-select';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { AiOutlineWifi } from 'react-icons/ai';
import { RiWifiOffLine } from 'react-icons/ri';
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
import { FilterMachineDto } from '../entiti/filter-machine';
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
  const { getMachines, machines, count } = useMachine();
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
  const [filters, setFilters] = useState<FilterMachineDto>({});
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [filterWasChanged, setFilterWasChanged] = useState(0);
  const [routesFiltered, setRoutesFiltered] = useState<Route[]>([]);
  const [groupSelected, setGroupSelected] = useState<{
    value: string;
    label: string;
  }>({
    value: 'none',
    label: 'Todas', // await login(data)
  });
  const [pointsOfSaleSelected, setPointsOfSaleSelected] = useState<{
    value: string;
    label: string;
  }>({
    value: 'none',
    label: 'Todas', // await login(data)
  });
  const [categorySelected, setCategorySelected] = useState<{
    value: string;
    label: string;
  }>({
    value: 'none',
    label: 'Todas', // await login(data)
  });
  const [routeSelected, setRouteSelected] = useState<{
    value: string;
    label: string;
  }>({
    value: 'none',
    label: 'Todas', // await login(data)
  });
  const [telemetryStatusSelected, setTelemetryStatusSelected] = useState<{
    value: string;
    label: string;
  }>({
    value: 'none',
    label: 'Todas', // await login(data)
  });
  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  useEffect(() => {
    setBusy(true);
    toggleTelemetryModal(undefined);
    (async () => {
      await getMachines(pageSelected * 10 - 10, filters);
      await getGroups();
      await getPointsOfSale(undefined, undefined);
      await getCategories();
      await getTelemetries();
      await getRoutes();
      setRoutesFiltered(routes);
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getMachines(pageSelected * 10 - 10, filters);
      if (groupSelected?.value === 'none') {
        await getPointsOfSale(undefined, undefined);
        setRoutesFiltered(routes);
      } else {
        await getPointsOfSale(undefined, {
          groupId: groupSelected?.value,
        });

        setRoutesFiltered(
          routes.filter(route => route.groupIds?.includes(groupSelected.value)),
        );
      }
    })();
  }, [filterWasChanged, pageSelected]);

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
                <Link to="/handle-machine">
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
                defaultValue={groupSelected}
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
                    setGroupSelected({
                      label: e?.label,
                      value: e?.value,
                    });
                    const { value } = e;
                    if (value === 'none') {
                      setFilters(state => {
                        state = {
                          groupId: undefined,
                          categoryId: undefined,
                          lean: undefined,
                          pointOfSaleId: undefined,
                          routeId: undefined,
                          serialNumber: undefined,
                          telemetryStatus: undefined,
                        };
                        return state;
                      });
                    } else {
                      setFilters(state => {
                        state = {
                          groupId: value,
                          categoryId: undefined,
                          lean: undefined,
                          pointOfSaleId: undefined,
                          routeId: undefined,
                          serialNumber: undefined,
                          telemetryStatus: undefined,
                        };
                        return state;
                      });
                    }
                    setPointsOfSaleSelected({ value: 'none', label: 'Todas' });
                    setCategorySelected({ value: 'none', label: 'Todas' });
                    setRouteSelected({ value: 'none', label: 'Todas' });
                    setTelemetryStatusSelected({
                      value: 'none',
                      label: 'Todas',
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
                value={pointsOfSaleSelected}
                options={[
                  { value: 'none', label: 'Todas' },
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
                    setPointsOfSaleSelected({ value: e.value, label: e.label });
                    const { value } = e;
                    if (value === 'none') {
                      setFilters(state => {
                        state.pointOfSaleId = undefined;
                        return state;
                      });
                    } else if (value === 'stock') {
                      setFilters(state => {
                        state.pointOfSaleId = null;
                        return state;
                      });
                    } else {
                      setFilters(state => {
                        state.pointOfSaleId = value;
                        return state;
                      });
                    }
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
                value={categorySelected}
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
                    setCategorySelected({ value: e.value, label: e.label });
                    const { value } = e;
                    if (value === 'none') {
                      setFilters(state => {
                        state.categoryId = undefined;
                        return state;
                      });
                    } else {
                      setFilters(state => {
                        state.categoryId = value;
                        return state;
                      });
                    }
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
                value={routeSelected}
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
                    setRouteSelected({ label: e.label, value: e.value });
                    const { value } = e;
                    if (value === 'none') {
                      setFilters(state => {
                        state.routeId = undefined;
                        return state;
                      });
                    } else {
                      setFilters(state => {
                        state.routeId = value;
                        return state;
                      });
                    }
                  }
                  setPageSelected(1);
                  setFilterWasChanged(filterWasChanged + 1);
                }}
              />
            </div>
            <div className="filters label-filter">
              <p style={{ marginBottom: '1rem' }}>Status de telemetria</p>
              <ReactSelect
                name="telemetryId"
                value={telemetryStatusSelected}
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
                    setTelemetryStatusSelected({
                      label: e.label,
                      value: e.value,
                    });

                    const { value } = e;
                    if (value === 'none') {
                      setFilters(state => {
                        state.telemetryStatus = undefined;
                        return state;
                      });
                    } else {
                      setFilters(state => {
                        state.telemetryStatus = value as
                          | 'ONLINE'
                          | 'OFFLINE'
                          | 'VIRGIN'
                          | 'NO_TELEMETRY'
                          | 'none';
                        return state;
                      });
                    }
                  }
                  setPageSelected(1);
                  setFilterWasChanged(filterWasChanged + 1);
                }}
              />
            </div>
            <div className="filters">
              <InputContainer>
                <label htmlFor="serial-number-name">
                  <p>Serial Number</p>
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
                      onChange={e => {
                        if (e) {
                          const { value } = e.target;
                          setFilters(state => {
                            state.serialNumber = value;
                            return state;
                          });
                          setPageSelected(1);
                          setFilterWasChanged(filterWasChanged + 1);
                        }
                      }}
                    />
                  </div>
                </label>
              </InputContainer>
            </div>
          </div>

          <Legend>
            <div>
              <VscDebugDisconnect color="#333" />
              <h2>Nunca conectada</h2>
            </div>
            <div>
              <RiWifiOffLine color="#f73164" />
              <h2>Desconectada</h2>
            </div>
            <div>
              <AiOutlineWifi color="#228b22" />
              <h2>Conectada</h2>
            </div>
          </Legend>

          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">Máquinas</h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="serial-number">Núm. série</div>
              {groups.length === 1 ? null : (
                <div className="group">Parceria</div>
              )}
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
