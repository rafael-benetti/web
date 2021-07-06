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
import { FilterPointsOfSaleDto } from '../entiti/filter-point-of-sale';
import { useRoute } from '../hooks/route';

const PointsOfSalePage: React.FC = () => {
  // hooks
  const { getPointsOfSale, pointsOfSale, count } = usePointOfSale();
  const { getGroups, groups } = useGroup();
  const { getRoutes, routes } = useRoute();
  const { user } = useUser();
  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterPointsOfSaleDto>(
    {} as FilterPointsOfSaleDto,
  );
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [filterWasChanged, setFilterWasChanged] = useState(0);

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getPointsOfSale(pageSelected * 10 - 10, filters);
      await getGroups();
      await getRoutes(undefined, undefined);
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getPointsOfSale(pageSelected * 10 - 10, filters);
    })();
  }, [filterWasChanged, pageSelected]);

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
            <div className="filters label-filter">
              <p style={{ marginBottom: '1rem' }}>Parceria</p>
              <ReactSelect
                name="groupId"
                id="groupId"
                defaultValue={{
                  value: 'none',
                  label: 'Todos',
                }}
                options={[
                  {
                    value: 'none',
                    label: 'Todos',
                  },
                  ...(groups &&
                    groups.map(group => {
                      return {
                        value: group.id,
                        label: group.label ? group.label : 'Pessoal',
                      };
                    })),
                ]}
                onChange={(e: any) => {
                  if (e) {
                    const { value } = e;
                    if (value === 'none') {
                      setFilters(state => {
                        state.groupId = undefined;
                        return state;
                      });
                    } else {
                      setFilters(state => {
                        state.groupId = value;
                        return state;
                      });
                    }
                  }
                  setPageSelected(1);
                  setFilterWasChanged(filterWasChanged + 1);
                }}
              />
            </div>
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
                    id="label"
                    onChange={e => {
                      if (e) {
                        const { value } = e.target;
                        setFilters(state => {
                          state.label = value;
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
