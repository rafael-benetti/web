/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import ReactSelect from 'react-select';
import { v4 } from 'uuid';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SinglePointOfSale from '../components/single-point-of-sale';
import { useGroup } from '../hooks/group';
import { usePointOfSale } from '../hooks/point-of-sale';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import {
  PaginationContainer,
  PointsOfSaleContainer,
  PointsOfSaleContent,
  Table,
} from '../styles/pages/points-of-sale';
import { PageTitle } from '../utils/page-title';
import { useRoute } from '../hooks/route';
import { useOperator } from '../hooks/operator';

const PointsOfSalePage: React.FC = () => {
  // hooks
  const {
    getPointsOfSale,
    pointsOfSale,
    count,
    filters,
    handleFilter,
  } = usePointOfSale();
  const { getGroups, groups } = useGroup();
  const { getRoutes, routes } = useRoute();
  const { user } = useUser();
  const { getOperators, operators } = useOperator();
  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [label, setLabel] = useState<string>();

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getPointsOfSale(pageSelected * 10 - 10, {
        groupId: filters.group?.value || undefined,
        label: filters.label || undefined,
        operatorId: filters.operator?.value || undefined,
        routeId: filters.route?.value || undefined,
      });
      await getGroups();
      await getRoutes(undefined, undefined);
      await getOperators();
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getPointsOfSale(pageSelected * 10 - 10, {
        groupId: filters.group?.value || undefined,
        label: filters.label || undefined,
        operatorId: filters.operator?.value || undefined,
        routeId: filters.route?.value || undefined,
      });
      if (filters.group) {
        if (filters.group.value !== 'none')
          await getRoutes(undefined, { groupId: filters.group.value });
      }
    })();
  }, [filters, pageSelected]);

  useEffect(() => {
    (async () => {
      if (filters.group) {
        if (filters.group.value !== 'none')
          await getPointsOfSale(undefined, { groupId: filters.group.value });
        await getRoutes(undefined, { groupId: filters.group.value });
      }
    })();
  }, [filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleFilter({
        ...filters,
        label,
      });
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [label]);

  return (
    <Container active="points-of-sale" loading={busy}>
      <PointsOfSaleContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Pontos de vendas</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Pontos de venda', url: 'pontos-de-venda' },
              ]}
            />
          </div>
          {user?.permissions?.createPointsOfSale || user?.role === 'OWNER' ? (
            <Link
              to={{
                pathname: '/editar-ponto-de-venda',
                state: { initialData: {} },
              }}
            >
              <Button title="Novo Ponto de venda" color="primary" />
            </Link>
          ) : null}
        </PageTitle>
        <PointsOfSaleContent>
          <div className="filter">
            <InputContainer isFocused={isFocused}>
              <label htmlFor="group-name">
                <p>Pesquisar</p>
                <div>
                  <input
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    value={label}
                    id="label"
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
            {user?.role !== 'OPERATOR' && (
              <>
                <div className="filters label-filter">
                  <p style={{ marginBottom: '1rem' }}>Parceria</p>
                  <ReactSelect
                    name="groupId"
                    id="groupId"
                    value={
                      filters.group
                        ? filters.group
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
                          ...filters,
                          route: undefined,
                          operator: undefined,
                          group: e,
                        });
                        setPageSelected(1);
                      }
                    }}
                  />
                </div>
                <div className="filters label-filter">
                  <p style={{ marginBottom: '1rem' }}>Rota</p>
                  <ReactSelect
                    name="routeId"
                    id="routeId"
                    value={
                      filters.route
                        ? filters.route
                        : { label: 'Todas', value: 'none' }
                    }
                    options={[
                      {
                        value: 'none',
                        label: 'Todas',
                      },
                      ...(routes &&
                        routes.map(operator => {
                          return {
                            value: operator.id,
                            label: operator.label,
                          };
                        })),
                    ]}
                    onChange={e => {
                      if (e) {
                        handleFilter({ ...filters, route: e });
                        setPageSelected(1);
                      }
                    }}
                  />
                </div>
                <div className="filters label-filter">
                  <p style={{ marginBottom: '1rem' }}>Operador</p>
                  <ReactSelect
                    name="operatorId"
                    id="operatorId"
                    value={
                      filters.operator
                        ? filters.operator
                        : { label: 'Todos', value: 'none' }
                    }
                    options={[
                      {
                        value: 'none',
                        label: 'Todos',
                      },
                      ...(operators &&
                        operators.map(operator => {
                          return {
                            value: operator.id,
                            label: operator.name,
                          };
                        })),
                    ]}
                    onChange={e => {
                      if (e) {
                        handleFilter({ ...filters, operator: e });
                        setPageSelected(1);
                      }
                    }}
                  />
                </div>
              </>
            )}
            <button
              className="reset-filter"
              type="button"
              onClick={() => {
                handleFilter({});
                setPageSelected(1);
              }}
            >
              Resetar filtro
            </button>
          </div>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">
                {`Pontos de vendas (${count})`}
              </h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="label">Nome</div>
              {groups.length === 1 ? null : (
                <div className="group">Parceria</div>
              )}
              <div className="route">Rota</div>
              <div className="contact-name">Responsável</div>
              <div className="phone">Telefone</div>
            </div>
            {pointsOfSale &&
              pointsOfSale.map(pointOfSale => {
                return (
                  <SinglePointOfSale
                    key={v4()}
                    user={user}
                    routeLabel={
                      routes.find(route => route.id === pointOfSale.routeId)
                        ?.label
                    }
                    isSingleGroup={groups.length === 1}
                    pointOfSale={pointOfSale}
                    group={groups.find(
                      group => group.id === pointOfSale.groupId,
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
        </PointsOfSaleContent>
      </PointsOfSaleContainer>
    </Container>
  );
};
export default PointsOfSalePage;
