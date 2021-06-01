/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Button from '../components/button';
import Container from '../components/container';
import { PageTitle } from '../utils/page-title';
import { InputContainer } from '../styles/components/input';
import CurrentPath from '../components/current-path';
import {
  CounterTypesContainer,
  CounterTypesContent,
  Table,
} from '../styles/pages/counter-types';
import { useCategory } from '../hooks/category';
import SingleCounterType from '../components/single-counter-type';
import HandleCounterType from '../components/handle-counter-type';
import { useUser } from '../hooks/user';

const CounterTypesPage: React.FC = () => {
  // hooks
  const {
    getCounterType,
    counterTypes,
    toggleCreateCounterType,
    showCreateCounterType,
  } = useCategory();
  const { user } = useUser();

  // state
  const [filter, setFilter] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getCounterType();
      setBusy(false);
    })();
  }, []);

  return (
    <Container active="counter-types" loading={busy}>
      <CounterTypesContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Tipos de Contadores</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Tipos de contadores' },
              ]}
            />
          </div>
          {user?.permissions?.createCategories || user?.role === 'OWNER' ? (
            <Button
              title="Novo tipo de contador"
              color="primary"
              callback={() => toggleCreateCounterType(true)}
            />
          ) : null}
        </PageTitle>
        <CounterTypesContent>
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
                    id="group-name"
                    onChange={e => {
                      setFilter(e.target.value);
                    }}
                  />
                </div>
              </label>
            </InputContainer>
          </div>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">
                Tipos de contadores
              </h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="name">Nome</div>
              <div className="type">Tipo</div>
            </div>
            {counterTypes.map(counterType => {
              if (filter) {
                if (
                  counterType.label
                    .toLocaleLowerCase()
                    .includes(filter.toLowerCase())
                ) {
                  const temp = counterType;
                  return (
                    <SingleCounterType
                      key={v4()}
                      counterType={temp}
                      user={user}
                    />
                  );
                }
                return null;
              }
              return (
                <SingleCounterType
                  key={v4()}
                  counterType={counterType}
                  user={user}
                />
              );
            })}
          </Table>
        </CounterTypesContent>
      </CounterTypesContainer>
      {showCreateCounterType ? <HandleCounterType /> : null}
    </Container>
  );
};

export default CounterTypesPage;
