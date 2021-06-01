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
  ManagersContainer,
  ManagersContent,
  PaginationContainer,
  Table,
} from '../styles/pages/managers';
import { useManager } from '../hooks/manager';
import SingleManager from '../components/single-manager';
import { useUser } from '../hooks/user';
import { User } from '../entiti/user';

const ManagersPage: React.FC = () => {
  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [managersFiltered, setManagersFiltered] = useState<User[]>([]);
  const [page, setPage] = useState(1);

  // hook
  const { getManagers, managers } = useManager();
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
      await getManagers();
      setBusy(false);
    })();
  }, []);

  const filterManagers = useCallback(
    (data: string) => {
      const managersData: User[] = [];
      managers.forEach(manager => {
        if (manager.name.toString().toLowerCase().includes(data)) {
          managersData.push(manager);
        }
      });
      setManagersFiltered(managersData);
    },
    [managers],
  );

  return (
    <Container active="managers" loading={busy}>
      <ManagersContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Colaboradores</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Colaboradores' }]}
            />
          </div>
          {user?.permissions?.createManagers || user?.role === 'OWNER' ? (
            <Link to="/editar-colaborador">
              <Button title="Novo colaborador" color="primary" />
            </Link>
          ) : null}
        </PageTitle>
        <ManagersContent>
          <div className="filter">
            <InputContainer isFocused={isFocused}>
              <label htmlFor="manager-name">
                <p>Pesquisar</p>
                <div>
                  <input
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    id="manager-name"
                    onChange={e => {
                      filterManagers(e.target.value);
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
            {managers && managersFiltered.length === 0
              ? managers.map((manager, index) => {
                  if ((page - 1) * 10 <= index && index < page * 10) {
                    return (
                      <SingleManager
                        key={v4()}
                        data={{
                          ...manager,
                          phoneNumber: manager.phoneNumber
                            ? formatPhone(manager.phoneNumber, true)
                            : '-',
                        }}
                        user={user}
                      />
                    );
                  }
                  return null;
                })
              : managersFiltered.map((manager, index) => {
                  if ((page - 1) * 10 <= index && index < page * 10) {
                    return (
                      <SingleManager
                        key={v4()}
                        data={{
                          ...manager,
                          phoneNumber: manager.phoneNumber
                            ? formatPhone(manager.phoneNumber, true)
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
                managersFiltered.length === 0
                  ? Math.ceil(managers.length / 10)
                  : Math.ceil(managersFiltered.length / 10)
              }
              color="primary"
              variant="outlined"
              page={page}
              onChange={(event, p) => {
                setPage(p);
              }}
            />
          </PaginationContainer>
        </ManagersContent>
      </ManagersContainer>
    </Container>
  );
};
export default ManagersPage;
