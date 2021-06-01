import { Pagination } from '@material-ui/lab';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineWifi } from 'react-icons/ai';
import { RiWifiOffLine } from 'react-icons/ri';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { v4 } from 'uuid';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SingleTelemetry from '../components/single-telemetry';
import { Telemetry } from '../entiti/telemetry';
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
  } = useTelemetry();
  const { getGroups, groups } = useGroup();
  const { getUser, user } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [telemetriesFiltered, setTelemetriesFiltered] = useState<Telemetry[]>(
    [],
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    setBusy(true);
    toggleTelemetryModal(undefined);
    toggleTransferTelemetry(undefined);
    (async () => {
      await getTelemetries();
      await getGroups();
      await getUser();
      setBusy(false);
    })();
  }, []);

  const filterTelemetries = useCallback(
    (data: string) => {
      const telemetriesData: Telemetry[] = [];
      telemetries.forEach(telemetry => {
        if (`STG-${telemetry.id}`.toString().toLowerCase().includes(data)) {
          telemetriesData.push(telemetry);
        }
      });
      setTelemetriesFiltered(telemetriesData);
    },
    [telemetries],
  );

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
                      filterTelemetries(e.target.value);
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
            {telemetries && telemetriesFiltered.length === 0
              ? telemetries.map((telemetry, index) => {
                  if ((page - 1) * 10 <= index && index < page * 10) {
                    return (
                      <SingleTelemetry
                        key={v4()}
                        telemetry={telemetry}
                        group={groups.find(
                          group => group.id === telemetry.groupId,
                        )}
                        groups={groups}
                        user={user}
                      />
                    );
                  }
                  return null;
                })
              : telemetriesFiltered.map((telemetry, index) => {
                  if ((page - 1) * 10 <= index && index < page * 10) {
                    return (
                      <SingleTelemetry
                        key={v4()}
                        telemetry={telemetry}
                        group={groups.find(
                          group => group.id === telemetry.groupId,
                        )}
                        groups={groups}
                      />
                    );
                  }
                  return null;
                })}
          </Table>
          <PaginationContainer>
            <Pagination
              count={
                telemetriesFiltered.length === 0
                  ? Math.ceil(telemetries.length / 10)
                  : Math.ceil(telemetriesFiltered.length / 10)
              }
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
