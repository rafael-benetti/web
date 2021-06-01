/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import PersonalPrizeItem from '../components/personal-prize-item';
import PersonalSupplyItem from '../components/personal-supply-item';
import { useGroup } from '../hooks/group';
import { useStock } from '../hooks/stock';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import {
  PersonalStockContainer,
  PersonalStockContent,
  NavBar,
  StockItems,
} from '../styles/pages/personal-stock';
import { PageTitle } from '../utils/page-title';

const PersonalStockPage: React.FC = () => {
  // hook
  const { getManagers, getOperators, managers, operators } = useUser();
  const { groups, getGroups } = useGroup();
  const { getStockItems, supplies, prizes, shouldRefresh } = useStock();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [filter, setFilter] = useState('');
  const [personalStockItemType, setPersonalStockItemType] = useState<
    'PRIZES' | 'SUPPLIES'
  >('PRIZES');

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getStockItems('USER');
      await getGroups();
      await getOperators();
      await getManagers();
      setBusy(false);
    })();
  }, [shouldRefresh]);

  return (
    <Container active="personal-stock" loading={busy}>
      <PersonalStockContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Estoque pessoal</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Estoque pessoal' }]}
            />
          </div>
        </PageTitle>
        <PersonalStockContent>
          <NavBar active={personalStockItemType}>
            <button
              type="button"
              className="prizes"
              onClick={() => {
                setPersonalStockItemType('PRIZES');
              }}
            >
              <h1 className="side-bar-secondary-font">Prêmios</h1>
            </button>
            <button
              type="button"
              className="supplies"
              onClick={() => {
                setPersonalStockItemType('SUPPLIES');
              }}
            >
              <h1 className="side-bar-secondary-font">Suprimentos</h1>
            </button>
          </NavBar>
          <StockItems>
            {personalStockItemType === 'PRIZES' ? (
              <div className="prizes-items items">
                {prizes.map(prize => {
                  return (
                    <PersonalPrizeItem
                      key={v4()}
                      groups={groups}
                      managers={managers}
                      operators={operators}
                      prize={prize}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="prizes-items items">
                {supplies.map(supply => {
                  return (
                    <PersonalSupplyItem
                      key={v4()}
                      groups={groups}
                      managers={managers}
                      operators={operators}
                      supply={supply}
                    />
                  );
                })}
              </div>
            )}
          </StockItems>
        </PersonalStockContent>
      </PersonalStockContainer>
    </Container>
  );
};
export default PersonalStockPage;
