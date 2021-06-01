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
  MachineLogsContainer,
  MachineLogsContent,
  SingleTelemetryBoard,
} from '../styles/pages/machine-logs';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { PageTitle } from '../utils/page-title';
import { useTelemetry } from '../hooks/telemetry';

const MachineEventsLogs: React.FC = () => {
  // location
  const machineId = useLocation().state as string;

  // hooks
  const { getMachineLogs, machineLogs, count } = useTelemetry();

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
      await getMachineLogs(pageSelected * 10 - 10, machineId, {
        endDate: dateFiltered?.endDate,
        startDate: dateFiltered?.startDate,
        type: typeSelected.value as 'FIX_STOCK' | 'REMOTE_CREDIT' | 'none',
      });
      setBusy(false);
    })();
  }, [filterWasChanged, pageSelected]);

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  return (
    <Container active="machines" loading={busy}>
      <MachineLogsContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Histórico de créditos remoto</h1>
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
        <MachineLogsContent>
          <div className="filters">
            <div className="select">
              <p className="label-font">Tipo de entrada</p>
              <ReactSelect
                name="type"
                value={typeSelected}
                options={[
                  { value: 'none', label: 'Todos' },
                  { value: 'REMOTE_CREDIT', label: 'Crédito remoto' },
                  { value: 'FIX_STOCK', label: 'Correção de estoque' },
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
                Histórico de créditos remoto
              </h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="label">Tipo</div>
              <div className="route">Quantidade</div>
              <div className="contact-name">Observação</div>
              <div className="phone">Data</div>
            </div>
            {machineLogs.map(log => {
              return (
                <SingleTelemetryBoard key={v4()}>
                  <div className="label">
                    {log.type === 'REMOTE_CREDIT'
                      ? 'Crédito remoto'
                      : 'Correção de estoque'}
                  </div>
                  <div className="contact-name">{log.quantity}</div>
                  <div className="contact-name">{log.observations}</div>
                  <div className="phone">
                    {format(
                      new Date(log.createdAt),
                      `dd'-'MM'-'yy 'às' H:mm `,
                      {
                        locale: ptLocale,
                      },
                    )}
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
        </MachineLogsContent>
      </MachineLogsContainer>
    </Container>
  );
};
export default MachineEventsLogs;
