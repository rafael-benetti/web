/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pagination } from '@material-ui/lab';
import React, { useCallback, useEffect, useState } from 'react';
import Button from '../components/button';
import ChooseMachineToCollect from '../components/choose-machine-to-collect';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SingleCollection from '../components/single-colletion';
import { useCategory } from '../hooks/category';
import { useCollection } from '../hooks/collection';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import {
  CollectionsContainer,
  CollectionsContent,
  Table,
} from '../styles/pages/collections';
import { PaginationContainer } from '../styles/pages/points-of-sale';
import { PageTitle } from '../utils/page-title';

const CollectionsPage: React.FC = () => {
  // hooks
  const {
    getCollections,
    collections,
    toggleNewCollection,
    showNewCollection,
    count,
  } = useCollection();
  const { getCounterType, counterTypes } = useCategory();
  const { getUser, user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [tableBusy, setTableBusy] = useState<boolean>(false);
  const [filterWasChanged, setFilterWasChanged] = useState(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [pageSelected, setPageSelected] = useState<number>(1);

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  useEffect(() => {
    setBusy(true);
    toggleNewCollection(false);
    (async () => {
      await getCollections(pageSelected * 10 - 10, filter);
      await getUser();
      await getCounterType();
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    setTableBusy(true);
    (async () => {
      await getCollections(pageSelected * 10 - 10, filter);
      setTableBusy(false);
    })();
  }, [filterWasChanged]);

  return (
    <Container active="collections" loading={busy}>
      <CollectionsContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Coletas</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Coletas' }]}
            />
          </div>
          <Button
            title="Nova coleta"
            color="primary"
            callback={() => toggleNewCollection(true)}
          />
        </PageTitle>
        <CollectionsContent>
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
                      setFilterWasChanged(filterWasChanged + 1);
                    }}
                  />
                </div>
              </label>
            </InputContainer>
          </div>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">Coletas</h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="data">Realizada em:</div>
              <div className="code">Núm. Série</div>
              <div className="machine">Localização</div>
              <div className="last-conection center">Operador</div>
            </div>
            {collections &&
              collections.map(collection => {
                return (
                  <SingleCollection
                    key={collection.id}
                    collection={collection}
                    user={user}
                  />
                );
              })}
          </Table>
        </CollectionsContent>
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
      </CollectionsContainer>
      {showNewCollection ? <ChooseMachineToCollect /> : null}
    </Container>
  );
};
export default CollectionsPage;
