/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import Button from '../components/button';
import Container from '../components/container';
import { useGroup } from '../hooks/group';
import { GroupsContainer, GroupsContent, Table } from '../styles/pages/groups';
import { PageTitle } from '../utils/page-title';
import CreateEditGroup from '../components/handle-group';
import SingleGroup from '../components/single-group';
import { InputContainer } from '../styles/components/input';
import CurrentPath from '../components/current-path';
import { useUser } from '../hooks/user';

const GroupsPage: React.FC = () => {
  // hooks
  const { getGroups, groups, openCreateGroup, showCreateGroup } = useGroup();
  const { user } = useUser();

  // state
  const [filter, setFilter] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getGroups();
      setBusy(false);
    })();
  }, []);

  return (
    <Container active="groups" loading={busy}>
      <GroupsContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Parcerias</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Parcerias' }]}
            />
          </div>
          {user?.permissions?.editGroups || user?.role === 'OWNER' ? (
            <Button
              title="Nova Parceria"
              color="primary"
              callback={() => {
                openCreateGroup(true);
              }}
            />
          ) : null}
        </PageTitle>
        <GroupsContent>
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
              <h1 className="table-title-font partnerships-name">Nome</h1>
            </div>
            {groups &&
              groups.map(group => {
                if (groups.length === 1 && groups[0].isPersonal) {
                  return null;
                }
                if (filter) {
                  if (
                    group.label.toLowerCase().includes(filter.toLowerCase())
                  ) {
                    const temp = group;
                    return <SingleGroup key={v4()} data={temp} user={user} />;
                  }
                  return null;
                }
                return <SingleGroup key={v4()} data={group} user={user} />;
              })}
          </Table>
          <div className="warning-personal-group">
            {groups.length === 1 && groups[0].isPersonal
              ? 'Você não possui nenhuma parceria além da parceria pessoal'
              : null}
          </div>
        </GroupsContent>
      </GroupsContainer>
      {showCreateGroup ? <CreateEditGroup /> : null}
    </Container>
  );
};

export default GroupsPage;
