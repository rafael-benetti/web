import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { useGroup } from '../hooks/group';
import {
  InventoryContainer,
  InventoryContent,
  Table,
} from '../styles/pages/inventory';
import { PageTitle } from '../utils/page-title';

const InventoryPage: React.FC = () => {
  // hooks
  const { getGroups, groups } = useGroup();

  // state
  const [busy, setBusy] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({
    value: 'none',
    label: 'Todas',
  });

  const machineCategory = [
    { label: 'Black', stock: 12, inPoint: 56 },
    { label: 'Carrossel', stock: 12, inPoint: 56 },
    { label: 'Big Truck', stock: 12, inPoint: 56 },
    { label: 'Maguine', stock: 12, inPoint: 56 },
    { label: 'Xablengas', stock: 12, inPoint: 56 },
    { label: 'Leiaas', stock: 12, inPoint: 56 },
    { label: 'Popo', stock: 12, inPoint: 56 },
  ];

  const products = [
    { label: 'Pelucia 20cm', user: 12, machine: 56, group: 32 },
    { label: 'Mega torosso', user: 12, machine: 56, group: 32 },
    { label: 'Rodinha', user: 12, machine: 56, group: 32 },
    { label: 'Chapéu de mendigo', user: 12, machine: 56, group: 32 },
    { label: 'Xablengas', user: 12, machine: 56, group: 32 },
    { label: 'Leiaas', user: 12, machine: 56, group: 32 },
    { label: 'Popo', user: 12, machine: 56, group: 32 },
  ];

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getGroups();
      setBusy(false);
    })();
  }, []);

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
          <div className="grid">
            <Table>
              <div className="table-title">
                <h1 className="table-title-font partnerships-name">Produtos</h1>
              </div>
              {products.map(product => {
                return (
                  <div className="column">
                    <div className="grid-table">
                      <div className="category">{product.label}</div>
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
                        <div className="stock-label">{product.group}</div>
                        <div className="value">{product.user}</div>
                        <div className="value">{product.machine}</div>
                      </div>
                    </div>
                    <div className="total">
                      <div className="total-label">Total</div>
                      <div className="total-value">
                        {product.group + product.user + product.machine}
                      </div>
                    </div>
                  </div>
                );
              })}
            </Table>
            <Table>
              <div className="table-title">
                <h1 className="table-title-font partnerships-name">
                  Categorias de máquinas
                </h1>
              </div>

              {machineCategory.map(machine => {
                return (
                  <div className="column">
                    <div className="grid-table">
                      <div className="category">{machine.label}</div>
                      <div className="labels">
                        <div className="operation-label">em operação</div>
                        <div className="stock-label">em estoque</div>
                      </div>
                      <div className="values">
                        <div className="stock-label">{machine.inPoint}</div>
                        <div className="value">{machine.stock}</div>
                      </div>
                    </div>
                    <div className="total">
                      <div className="total-label">Total</div>
                      <div className="total-value">
                        {machine.inPoint + machine.stock}
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
