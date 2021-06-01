import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 } from 'uuid';
import { Pagination } from '@material-ui/lab';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import ReactSelect from 'react-select';
import { DatePicker } from 'react-rainbow-components';
import {
  PaginationContainer,
  Table,
  TelemetryLogsContainer,
  TelemetryLogsContent,
  SingleTelemetryBoard,
} from '../styles/pages/telemetry-logs';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { PageTitle } from '../utils/page-title';
import { useTelemetry } from '../hooks/telemetry';

const TelemetryLogsPage: React.FC = () => {
  // location
  const machineId = useLocation().state as string;

  // hooks
  const { getTelemetryLogs, telemetryLogs, count } = useTelemetry();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [pageSelected, setPageSelected] = useState<number>(1);
  const [filterWasChanged, setFilterWasChanged] = useState(0);
  const [typeSelected, setTypeSelected] = useState<{
    label: string;
    value: string;
  }>({ label: 'todos', value: 'none' });
  const [range, setRenge] = useState<Date>();
  const [dateFiltered, setDateFiltered] = useState<{
    startDate: string;
    endDate: string;
  }>();

  const containerStyles = {
    maxWidth: 400,
  };

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getTelemetryLogs(pageSelected * 10 - 10, machineId, {
        endDate: dateFiltered?.endDate,
        startDate: dateFiltered?.startDate,
        type: typeSelected.value as 'IN' | 'OUT' | 'none',
      });
      setBusy(false);
    })();
  }, [filterWasChanged, pageSelected]);

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  return (
    <Container active="machines" loading={busy}>
      <TelemetryLogsContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Histórico de eventos</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: '/ Máquinas', url: '/maquinas' },
                {
                  name: '/ Detalhes da máquina',
                  state: { pathname: '/detalhes-da-maquina', state: machineId },
                },
              ]}
            />
          </div>
        </PageTitle>
        <TelemetryLogsContent>
          <div className="filters">
            <div className="select">
              <p className="label-font">Tipo de entrada</p>
              <ReactSelect
                name="type"
                value={typeSelected}
                options={[
                  { value: 'none', label: 'Todos' },
                  { value: 'IN', label: 'Entrada' },
                  { value: 'OUT', label: 'Saída' },
                ]}
                onChange={e => {
                  if (e) {
                    setTypeSelected({ value: e.value, label: e.label });
                  }
                  setPageSelected(1);
                  setFilterWasChanged(filterWasChanged + 1);
                }}
              />
            </div>
            <div className="picker">
              <p className="label-font">Selecionar data</p>
              <div
                className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
                style={containerStyles}
              >
                <DatePicker
                  id="datePicker-15"
                  placeholder="Selecione a data"
                  selectionType="range"
                  formatStyle="large"
                  variant="single"
                  locale="pt-BR"
                  value={range}
                  onChange={value => {
                    setRenge(value);
                    const [startDate, endDate] = value.toString().split(',');

                    if (endDate) {
                      setDateFiltered({
                        startDate,
                        endDate,
                      });
                      setPageSelected(1);
                      setFilterWasChanged(filterWasChanged + 1);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">
                Histórico de eventos
              </h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="label">Tipo</div>
              <div className="route">Pino</div>
              <div className="contact-name">Valor</div>
              <div className="contact-name">Modo manutenção</div>
              <div className="phone">Data</div>
            </div>
            {telemetryLogs.map(log => {
              return (
                <SingleTelemetryBoard key={v4()}>
                  <div className="label">
                    {log.type === 'IN' ? 'Entrada' : 'Saída'}
                  </div>
                  <div className="contact-name">{log.pin}</div>
                  <div className="contact-name">{log.value}</div>
                  <div className="contact-name">
                    {log.maintenance ? 'Sim' : 'Não'}
                  </div>
                  <div className="phone">
                    {format(new Date(log.date), `dd'-'MM'-'yy 'às' H:mm `, {
                      locale: ptLocale,
                    })}
                  </div>
                </SingleTelemetryBoard>
              );
            })}
          </Table>
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
        </TelemetryLogsContent>
      </TelemetryLogsContainer>
    </Container>
  );
};
export default TelemetryLogsPage;
