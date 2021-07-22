import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { useGroup } from '../hooks/group';
import { useReport } from '../hooks/report';
import {
  InventoryContainer,
  InventoryContent,
  Table,
} from '../styles/pages/inventory';
import { PageTitle } from '../utils/page-title';

const InventoryPage: React.FC = () => {
  // hooks
  const { getGroups, groups } = useGroup();
  const { getInventory, inventory } = useReport();

  // state
  const [busy, setBusy] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({
    value: 'none',
    label: 'Todas',
  });

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getGroups();
      await getInventory();
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getInventory(selectedGroup.value);
      setBusy(false);
    })();
  }, [selectedGroup]);

  return (
    <Container active="inventory" loading={busy}>
      <InventoryContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Inventário</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Inventário' }]}
            />
          </div>
        </PageTitle>
        <InventoryContent>
          <div className="filter">
            <ReactSelect
              name="filterGroup"
              value={selectedGroup}
              options={[
                { label: 'Todas', value: 'none' },
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
                  setSelectedGroup(e);
                }
              }}
            />
          </div>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">
                Máquinas por categoria
              </h1>
            </div>
            {inventory &&
              inventory.machinesPerCategory.map(machine => {
                return (
                  <div className="column">
                    <div className="grid-table">
                      <div className="category">{machine.categoryLabel}</div>
                      <div className="labels">
                        <div className="operation-label">em operação</div>
                        <div className="stock-label">em estoque</div>
                      </div>
                      <div className="values">
                        <div className="stock-label">
                          {machine.totalInOperation}
                        </div>
                        <div className="value">{machine.totalInStock}</div>
                      </div>
                    </div>
                    <div className="total">
                      <div className="total-label">Total</div>
                      <div className="total-value">
                        {machine.totalInOperation + machine.totalInStock}
                      </div>
                    </div>
                  </div>
                );
              })}
          </Table>
          <div className="grid">
            <Table>
              <div className="table-title">
                <h1 className="table-title-font partnerships-name">Prêmios</h1>
              </div>
              {inventory &&
                inventory.prizes.map(prize => {
                  return (
                    <div className="column">
                      <div className="grid-table">
                        <div className="category">{prize.prizeLabel}</div>
                        <div className="labels">
                          <div className="operation-label">
                            {selectedGroup.value !== 'none'
                              ? 'Parceria'
                              : 'Parcerias'}
                          </div>
                          <div className="operation-label">Usuários</div>
                          <div className="stock-label">Máquinas</div>
                        </div>
                        <div className="values">
                          <div className="stock-label">
                            {prize.groupsTotalPrizes}
                          </div>
                          <div className="value">{prize.usersTotalPrizes}</div>
                          <div className="value">
                            {prize.machinesTotalPrizes}
                          </div>
                        </div>
                      </div>
                      <div className="total">
                        <div className="total-label">Total</div>
                        <div className="total-value">
                          {prize.groupsTotalPrizes +
                            prize.usersTotalPrizes +
                            prize.machinesTotalPrizes}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Table>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font partnerships-name">
                  Suprimentos
                </h1>
              </div>

              {inventory &&
                inventory.supplies.map(supply => {
                  return (
                    <div className="column">
                      <div className="grid-table">
                        <div className="category">{supply.supplieLabel}</div>
                        <div className="labels">
                          <div className="operation-label">
                            {selectedGroup.value !== 'none'
                              ? 'Parceria'
                              : 'Parcerias'}
                          </div>
                          <div className="stock-label">Usuário</div>
                        </div>
                        <div className="values">
                          <div className="stock-label">
                            {supply.groupsTotalSupplies}
                          </div>
                          <div className="value">
                            {supply.usersTotalSupplies}
                          </div>
                        </div>
                      </div>
                      <div className="total">
                        <div className="total-label">Total</div>
                        <div className="total-value">
                          {supply.groupsTotalSupplies +
                            supply.usersTotalSupplies}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Table>
          </div>
        </InventoryContent>
      </InventoryContainer>
    </Container>
  );
};
export default InventoryPage;
