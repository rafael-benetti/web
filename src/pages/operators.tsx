/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';
import { Pagination } from '@material-ui/lab';
import Button from '../components/button';
import CurrentPath from '../components/current-path';
import Container from '../components/container';
import { PageTitle } from '../utils/page-title';
import { InputContainer } from '../styles/components/input';
import {
  OperatorsContainer,
  OperatorsContent,
  PaginationContainer,
  Table,
} from '../styles/pages/operators';
import { useUser } from '../hooks/user';
import { useOperator } from '../hooks/operator';
import SingleOperator from '../components/single-operator';
import { User } from '../entiti/user';

const OperatorsPage: React.FC = () => {
  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [operatorsFiltered, setOperatorsFiltered] = useState<User[]>([]);
  const [page, setPage] = useState(1);

  // hook
  const { getOperators, operators } = useOperator();
  const { user } = useUser();

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
    setBusy(true);
    (async () => {
      await getOperators();
      setBusy(false);
    })();
  }, []);

  const filterOperators = useCallback(
    (data: string) => {
      const operatorsData: User[] = [];
      operators.forEach(operator => {
        if (operator.name.toString().toLowerCase().includes(data)) {
          operatorsData.push(operator);
        }
      });
      setOperatorsFiltered(operatorsData);
    },
    [operators],
  );

  return (
    <Container active="operators" loading={busy}>
      <OperatorsContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Operadores</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Operadores' }]}
            />
          </div>
          {user?.permissions?.createOperators || user?.role === 'OWNER' ? (
            <Link to="/editar-operador">
              <Button title="Novo operador" color="primary" />
            </Link>
          ) : null}
        </PageTitle>
        <OperatorsContent>
          <div className="filter">
            <InputContainer isFocused={isFocused}>
              <label htmlFor="operator-name">
                <p>Pesquisar</p>
                <div>
                  <input
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    id="operator-name"
                    onChange={e => {
                      filterOperators(e.target.value);
                    }}
                  />
                </div>
              </label>
            </InputContainer>
          </div>
          <Table>
            <div className="table-title primary-row">
              <div />
              <h1 className="table-title-font manager-name">Nome</h1>
              <h1 className="table-title-font email-name">Email</h1>
              <h1 className="table-title-font phone-name">Telefone</h1>
              <h1 className="table-title-font active-name">Ativo</h1>
            </div>
            {operators && operatorsFiltered.length === 0
              ? operators.map((operator, index) => {
                  if ((page - 1) * 10 <= index && index < page * 10) {
                    return (
                      <SingleOperator
                        key={v4()}
                        data={{
                          ...operator,
                          phoneNumber: operator.phoneNumber
                            ? formatPhone(operator.phoneNumber, true)
                            : '-',
                        }}
                        user={user}
                      />
                    );
                  }
                  return null;
                })
              : operatorsFiltered.map((operator, index) => {
                  if ((page - 1) * 10 <= index && index < page * 10) {
                    return (
                      <SingleOperator
                        key={v4()}
                        data={{
                          ...operator,
                          phoneNumber: operator.phoneNumber
                            ? formatPhone(operator.phoneNumber, true)
                            : '-',
                        }}
                        user={user}
                      />
                    );
                  }
                  return null;
                })}
          </Table>
          <PaginationContainer>
            <Pagination
              count={
                operatorsFiltered.length === 0
                  ? Math.ceil(operators.length / 10)
                  : Math.ceil(operatorsFiltered.length / 10)
              }
              color="primary"
              variant="outlined"
              page={page}
              onChange={(event, p) => {
                setPage(p);
              }}
            />
          </PaginationContainer>
        </OperatorsContent>
      </OperatorsContainer>
    </Container>
  );
};
export default OperatorsPage;
