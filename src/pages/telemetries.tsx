import React, { useCallback, useEffect, useState } from 'react';
import { Pagination } from '@material-ui/lab';
import { AiOutlineWifi } from 'react-icons/ai';
import { RiWifiOffLine } from 'react-icons/ri';
import { VscDebugDisconnect } from 'react-icons/vsc';
import ReactSelect from 'react-select';
import { v4 } from 'uuid';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SingleTelemetry from '../components/single-telemetry';
import { useGroup } from '../hooks/group';
import { useTelemetry } from '../hooks/telemetry';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import {
  Legend,
  PaginationContainer,
  Table,
  TelemetriesContainer,
  TelemetriesContent,
} from '../styles/pages/telemetries';
import { PageTitle } from '../utils/page-title';

const TelemetriesPage: React.FC = () => {
  // hooks
  const {
    getTelemetries,
    telemetries,
    toggleTelemetryModal,
    toggleTransferTelemetry,
    telemetryCount,
  } = useTelemetry();
  const { getGroups, groups } = useGroup();
  const { getUser, user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<{
    groupId?: string;
    telemetryBoardId?: string;
  }>();
  const [groupSelected, setGroupSelected] = useState<{
    value: string;
    label: string;
  }>({
    value: 'none',
    label: 'Todas', // await login(data)
  });
  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  useEffect(() => {
    setBusy(true);
    toggleTelemetryModal(undefined);
    toggleTransferTelemetry(undefined);
    (async () => {
      await getTelemetries(page * 10 - 10, filter);
      await getGroups();
      await getUser();
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getTelemetries(page * 10 - 10, filter);
    })();
  }, [page, filter]);

  return (
    <Container active="telemetries" loading={busy}>
      <TelemetriesContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Telemetrias</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Telemetrias' }]}
            />
          </div>
        </PageTitle>
        <TelemetriesContent>
          <div className="filter">
            <div className="filter-select">
              <p style={{ marginBottom: '1rem' }}>Parceria</p>
              <ReactSelect
                name="groupId"
                id="groupId"
                defaultValue={groupSelected}
                options={[
                  {
                    value: 'none',
                    label: 'Todas',
                  },
                  ...(groups &&
                    groups.map(group => {
                      return {
                        value: group.id,
                        label: group.label ? group.label : 'Pessoal',
                      };
                    })),
                ]}
                onChange={e => {
                  if (e) {
                    setGroupSelected(e);
                    setFilter({ ...filter, groupId: e?.value });
                  }
                }}
              />
            </div>
            <InputContainer isFocused={isFocused}>
              <label htmlFor="group-name">
                <p>Pesquisar pelo número da telemetria</p>
                <div>
                  <input
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    type="number"
                    id="group-name"
                    onChange={e => {
                      if (e) {
                        setFilter({
                          ...filter,
                          telemetryBoardId: e.target.value,
                        });
                      }
                    }}
                  />
                </div>
              </label>
            </InputContainer>
          </div>
          <Legend>
            <div>
              <VscDebugDisconnect color="#333" />
              <h2>Nunca conectada</h2>
            </div>
            <div>
              <RiWifiOffLine color="#f73164" />
              <h2>Desconectada</h2>
            </div>
            <div>
              <AiOutlineWifi color="#228b22" />
              <h2>Conectada</h2>
            </div>
          </Legend>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">
                Telemetrias
              </h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="status">Status</div>
              <div className="code">Código</div>
              <div className="group">Parceria</div>
              <div className="machine">Instalado à</div>
              <div className="last-conection center">Última conexão</div>
            </div>
            {telemetries &&
              telemetries.map(telemetry => {
                return (
                  <SingleTelemetry
                    key={v4()}
                    telemetry={telemetry}
                    group={groups.find(group => group.id === telemetry.groupId)}
                    groups={groups}
                    user={user}
                  />
                );
              })}
          </Table>
          <PaginationContainer>
            <Pagination
              count={numberOfPages(telemetryCount || 0)}
              color="primary"
              variant="outlined"
              page={page}
              onChange={(event, p) => {
                setPage(p);
              }}
            />
          </PaginationContainer>
        </TelemetriesContent>
      </TelemetriesContainer>
    </Container>
  );
};
export default TelemetriesPage;
