/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import ReactSelect from 'react-select';
import { FiGrid } from 'react-icons/fi';
import { AiOutlineBars } from 'react-icons/ai';
import { classNames } from 'react-select/src/utils';
import Button from '../components/button';
import Container from '../components/container';
import CreateStockItem from '../components/create-stock-item';
import CurrentPath from '../components/current-path';
import MachineItem from '../components/machine-item';
import PrizeItem from '../components/prize-item';
import SupplyItem from '../components/supply-item';
import { useGroup } from '../hooks/group';
import { useMachine } from '../hooks/machine';
import { useStock } from '../hooks/stock';
import { useUser } from '../hooks/user';
import {
  StockContainer,
  StockContent,
  NavBar,
  StockItems,
  TablePrize,
  TableMachine,
  TableSupplies,
} from '../styles/pages/stock';
import { PageTitle } from '../utils/page-title';

const StockPage: React.FC = () => {
  // hooks
  const { getGroups, groups } = useGroup();
  const { getMachines, machines } = useMachine();
  const {
    prizes,
    supplies,
    getStockItems,
    toggleCreateProduct,
    openCreateProduct,
    shouldRefresh,
  } = useStock();
  const { getOperators, operators, getManagers, managers, user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [filter, setFilter] = useState<{ value: string; label: string }>({
    label: 'Todas',
    value: '',
  });
  const [stockItem, setStockItem] = useState<
    'PRIZES' | 'MACHINES' | 'SUPPLIES'
  >('PRIZES');
  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getGroups();
      await getMachines(undefined, { pointOfSaleId: null }, true);
      await getStockItems('GROUP');
      await getOperators();
      await getManagers();
      setBusy(false);
    })();
  }, [shouldRefresh]);

  return (
    <Container active="group-stock" loading={busy}>
      <StockContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Estoque</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Estoque' }]}
            />
          </div>
          {user?.permissions?.createProducts || user?.role === 'OWNER' ? (
            <Button
              title="Criar estoque"
              color="primary"
              callback={() => toggleCreateProduct(true)}
            />
          ) : null}
        </PageTitle>
        <StockContent>
          <div className="filter">
            <ReactSelect
              name="filterGroup"
              value={filter}
              options={[
                { label: 'Todas', value: '' },
                ...(groups &&
                  groups.map(group => {
                    return {
                      label: group.label,
                      value: group.id,
                    };
                  })),
              ]}
              onChange={e => {
                if (e) {
                  setFilter({ label: e.label, value: e.value });
                }
              }}
            />
          </div>
          <div className="view">
            <p>Visualizar em:</p>
            <button
              type="button"
              onClick={() => setIsGridView(true)}
              className={isGridView ? 'colored' : ''}
            >
              <FiGrid />
            </button>
            <button
              type="button"
              onClick={() => setIsGridView(false)}
              className={!isGridView ? 'colored' : ''}
            >
              <AiOutlineBars />
            </button>
          </div>
          <NavBar active={stockItem}>
            <button
              type="button"
              className="prizes"
              onClick={() => {
                setStockItem('PRIZES');
              }}
            >
              <h1 className="side-bar-secondary-font">Prêmios</h1>
            </button>
            <button
              type="button"
              className="machines"
              onClick={() => {
                setStockItem('MACHINES');
              }}
            >
              <h1 className="side-bar-secondary-font">Máquinas</h1>
            </button>
            <button
              type="button"
              className="supplies"
              onClick={() => {
                setStockItem('SUPPLIES');
              }}
            >
              <h1 className="side-bar-secondary-font">Suprimentos</h1>
            </button>
          </NavBar>
          <StockItems>
            {stockItem === 'PRIZES' ? (
              <>
                {isGridView ? (
                  <div className="prizes-items items">
                    {prizes.map(prize => {
                      if (filter.value !== '') {
                        if (prize.ownerId === filter.value.toString()) {
                          return (
                            <PrizeItem
                              key={v4()}
                              prize={prize}
                              groups={groups}
                              operators={operators}
                              managers={managers}
                              user={user}
                              isGridView={isGridView}
                            />
                          );
                        }
                        return null;
                      }
                      return (
                        <PrizeItem
                          key={v4()}
                          prize={prize}
                          groups={groups}
                          operators={operators}
                          managers={managers}
                          user={user}
                          isGridView={isGridView}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <TablePrize>
                    <div className="table-title">
                      <h1 className="table-title-font partnerships-name">
                        Prêmios
                      </h1>
                    </div>
                    <div className="primary-row table-title-font">
                      <div className="label">Nome</div>
                      {groups.length === 1 ? null : (
                        <div className="group">Parceria</div>
                      )}
                      <div className="route">Quantidade</div>
                      <div className="contact-name">Transferir</div>
                      <div className="phone">Adicionar</div>
                      <div className="phone">Remover</div>
                    </div>
                    {prizes &&
                      prizes.map(prize => {
                        if (filter.value !== '') {
                          if (prize.ownerId === filter.value.toString()) {
                            return (
                              <PrizeItem
                                key={v4()}
                                prize={prize}
                                groups={groups}
                                operators={operators}
                                managers={managers}
                                user={user}
                                isGridView={isGridView}
                              />
                            );
                          }
                          return null;
                        }
                        return (
                          <PrizeItem
                            key={v4()}
                            prize={prize}
                            groups={groups}
                            operators={operators}
                            managers={managers}
                            user={user}
                            isGridView={isGridView}
                          />
                        );
                      })}
                  </TablePrize>
                )}
              </>
            ) : stockItem === 'MACHINES' ? (
              <>
                {isGridView ? (
                  <div className="machines-items items">
                    {machines.map(machine => {
                      if (filter.value !== '') {
                        if (machine.groupId === filter.value.toString()) {
                          return (
                            <MachineItem
                              key={v4()}
                              machine={machine}
                              groups={groups}
                              isGridView={isGridView}
                            />
                          );
                        }
                        return null;
                      }
                      return (
                        <MachineItem
                          key={v4()}
                          machine={machine}
                          groups={groups}
                          isGridView={isGridView}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <TableMachine>
                    <div className="table-title">
                      <h1 className="table-title-font partnerships-name">
                        Máquinas
                      </h1>
                    </div>
                    <div className="primary-row table-title-font">
                      <div className="label">Serial Num.</div>
                      {groups.length === 1 ? null : (
                        <div className="group">Parceria</div>
                      )}
                      <div className="route">Categoria</div>
                    </div>
                    {machines &&
                      machines.map(machine => {
                        if (filter.value !== '') {
                          if (machine.groupId === filter.value.toString()) {
                            return (
                              <MachineItem
                                key={v4()}
                                machine={machine}
                                groups={groups}
                                isGridView={isGridView}
                              />
                            );
                          }
                          return null;
                        }
                        return (
                          <MachineItem
                            key={v4()}
                            machine={machine}
                            groups={groups}
                            isGridView={isGridView}
                          />
                        );
                      })}
                  </TableMachine>
                )}
              </>
            ) : (
              <>
                {isGridView ? (
                  <div className="supplies-items items">
                    {supplies.map(supply => {
                      if (filter.value !== '') {
                        if (supply.ownerId === filter.value.toString()) {
                          return (
                            <SupplyItem
                              key={v4()}
                              supply={supply}
                              groups={groups}
                              operators={operators}
                              managers={managers}
                              user={user}
                              isGridView={isGridView}
                            />
                          );
                        }
                        return null;
                      }
                      return (
                        <SupplyItem
                          key={v4()}
                          supply={supply}
                          groups={groups}
                          operators={operators}
                          managers={managers}
                          user={user}
                          isGridView={isGridView}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <TableSupplies>
                    <div className="table-title">
                      <h1 className="table-title-font partnerships-name">
                        Suprimentos
                      </h1>
                    </div>
                    <div className="primary-row table-title-font">
                      <div className="label">Nome</div>
                      {groups.length === 1 ? null : (
                        <div className="group">Parceria</div>
                      )}
                      <div className="route">Quantidade</div>
                      <div className="contact-name">Transferir</div>
                      <div className="phone">Adicionar</div>
                      <div className="phone">Remover</div>
                    </div>
                    {supplies &&
                      supplies.map(supply => {
                        if (filter.value !== '') {
                          if (supply.ownerId === filter.value.toString()) {
                            return (
                              <SupplyItem
                                key={v4()}
                                supply={supply}
                                groups={groups}
                                operators={operators}
                                managers={managers}
                                user={user}
                                isGridView={isGridView}
                              />
                            );
                          }
                          return null;
                        }
                        return (
                          <SupplyItem
                            key={v4()}
                            supply={supply}
                            groups={groups}
                            operators={operators}
                            managers={managers}
                            user={user}
                            isGridView={isGridView}
                          />
                        );
                      })}
                  </TableSupplies>
                )}
              </>
            )}
          </StockItems>
        </StockContent>
      </StockContainer>
      {openCreateProduct ? <CreateStockItem groups={groups} /> : null}
    </Container>
  );
};
export default StockPage;
