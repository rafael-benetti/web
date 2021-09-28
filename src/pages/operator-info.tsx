import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { User } from '../entiti/user';
import { useUser } from '../hooks/user';
import {
  OperatorInfoContainer,
  OperatorInfoContent,
  SingleStock,
  Table,
} from '../styles/pages/operator-info';
import { PageTitle } from '../utils/page-title';

const OperatorInfoPage: React.FC = () => {
  // location
  const operator = useLocation().state as User;
  // hooks
  const { user } = useUser();
  // state
  const [busy] = useState(false);

  return (
    <Container active="operators" loading={busy}>
      <OperatorInfoContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">{`Detalhes do operador - ${operator.name}`}</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Operadores', url: '/operadores' },
                { name: 'Detalhes do operador' },
              ]}
            />
          </div>
          {user?.role === 'OWNER' || user?.permissions?.editMachines ? (
            <Link
              to={{
                pathname: `${
                  user?.permissions?.createOperators || user?.role === 'OWNER'
                    ? '/editar-operador'
                    : '/operadores'
                }`,
                state: operator,
              }}
            >
              <Button title="Editar operador" color="primary" />
            </Link>
          ) : null}
        </PageTitle>
        <OperatorInfoContent>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">Prêmios</h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="category">Nome</div>
              <div className="category">Quantidade</div>
            </div>
            {operator &&
              operator.stock?.prizes.map(prize => {
                return (
                  <SingleStock>
                    <div>
                      <h1>{prize.label}</h1>
                    </div>
                    <div>
                      <h1>{prize.quantity}</h1>
                    </div>
                  </SingleStock>
                );
              })}
          </Table>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">
                Suprimentos
              </h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="category">Nome</div>
              <div className="category">Quantidade</div>
            </div>
            {operator &&
              operator.stock?.supplies.map(supply => {
                return (
                  <SingleStock>
                    <div>
                      <h1>{supply.label}</h1>
                    </div>
                    <div>
                      <h1>{supply.quantity}</h1>
                    </div>
                  </SingleStock>
                );
              })}
          </Table>
        </OperatorInfoContent>
      </OperatorInfoContainer>
    </Container>
  );
};
export default OperatorInfoPage;
