/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { DatePicker } from 'react-rainbow-components';
import ReactSelect from 'react-select';
import { ClipLoader } from 'react-spinners';
import { v4 } from 'uuid';
import CreatableSelect from 'react-select/creatable';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { usePointOfSale } from '../hooks/point-of-sale';
import { useReport } from '../hooks/report';
import {
  ReportContainer,
  ReportContent,
  ReportResults,
  SingleMachineInPointReport,
  SingleMachineReport,
  SingleReportGroup,
  TableGroup,
  TableMachine,
  TablePointOfSale,
} from '../styles/pages/report';
import { PageTitle } from '../utils/page-title';
import { useGroup } from '../hooks/group';
import { useMachine } from '../hooks/machine';
import { PointOfSale } from '../entiti/point-of-sales';

export interface ReportFilter {
  type: 'GROUP' | 'MACHINE' | 'USER_STOCK' | 'POINT_OF_SALE' | 'COLLECTION';
  date?: { startDate: Date; endDate: Date };
  pointOfSale?: string;
}

const ReportPage: React.FC = () => {
  // hooks
  const { getPointsOfSale, pointsOfSale } = usePointOfSale();
  const { getMachines, machines } = useMachine();
  const { getGroups, groups } = useGroup();
  const {
    getGroupReport,
    getMachineReport,
    getPointsOfSaleReport,
    getUserStockReport,
    getCollectionReport,
    clearReport,
    groupReportData,
    machineReportData,
    pointsOfSaleReportData,
  } = useReport();

  // state
  const [busy, setBusy] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportFilter, setReportFilter] = useState<ReportFilter>();
  const [typeSelected, setTypeSelected] = useState<{
    value: string;
    label: string;
  }>();
  const [pointSelected, setPointSelected] = useState<{
    value: string;
    label: string;
  }>();
  const [range, setRenge] = useState<Date>();
  const [busyBtn, setBusyBtn] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<{
    value: string;
    label: string;
  }>({ label: 'Todas', value: 'none' });
  const [selectedMachines, setSelectedMachines] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedPdvs, setSelectedPdvs] = useState<
    { value: string; label: string }[]
  >([]);
  const [filteredPdvs, setFilteredPdvs] = useState<PointOfSale[]>([]);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getPointsOfSale(undefined, undefined);
      await getGroups();
      setBusy(false);
    })();
  }, []);

  useEffect(() => {
    if (reportFilter?.type === 'GROUP' && reportFilter.date) {
      (async () => {
        setLoadingReport(true);
        await getGroupReport(reportFilter.date!, {
          groupIds: selectedGroups.map(group => group.value),
        });
        setLoadingReport(false);
      })();
    }
    if (reportFilter?.type === 'MACHINE' && reportFilter.date) {
      (async () => {
        setLoadingReport(true);
        await getMachineReport(reportFilter.date!, {
          groupId: selectedGroup.value,
          machineIds: selectedMachines.map(machine => machine.value),
        });
        setLoadingReport(false);
      })();
    }
    if (reportFilter?.type === 'POINT_OF_SALE' && reportFilter.date) {
      (async () => {
        setLoadingReport(true);
        await getPointsOfSaleReport(reportFilter.date!, {
          groupId: selectedGroup.value,
          pointsOfSaleIds: selectedPdvs.map(pdv => pdv.value),
        });
        setLoadingReport(false);
      })();
    }
    clearReport();
  }, [
    reportFilter,
    selectedGroups,
    selectedGroup,
    selectedMachines,
    selectedPdvs,
  ]);

  const containerStyles = {
    maxWidth: 400,
  };

  return (
    <Container active="relatorio" loading={busy}>
      <ReportContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Relatório</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Relatório' }]}
            />
          </div>
        </PageTitle>
        <ReportContent>
          <div className="filter">
            <div className="filters label-filter">
              <p style={{ marginBottom: '1rem' }}>
                Selecione o tipo de relatório
              </p>
              <ReactSelect
                name="type"
                value={typeSelected}
                placeholder="Selecionar..."
                options={[
                  { value: 'GROUP', label: 'Relatório de parcerias' },
                  { value: 'MACHINE', label: 'Relatório de máquinas' },
                  {
                    value: 'USER_STOCK',
                    label: 'Relatório de estoque de usuários',
                  },
                  {
                    value: 'POINT_OF_SALE',
                    label: 'Relatório de ponto de venda',
                  },
                  {
                    value: 'COLLECTION',
                    label: 'Relatório de coletas (por PdV)',
                  },
                ]}
                onChange={e => {
                  if (e) {
                    setTypeSelected(e);
                    setRenge(undefined);
                    setReportFilter({
                      type: e.value as
                        | 'GROUP'
                        | 'MACHINE'
                        | 'USER_STOCK'
                        | 'POINT_OF_SALE'
                        | 'COLLECTION',
                    });
                    setSelectedGroups([]);
                    setSelectedMachines([]);
                    setSelectedPdvs([]);
                    setFilteredPdvs([]);
                    setSelectedGroup({ label: 'Todas', value: 'none' });
                  }
                }}
              />
            </div>
            {reportFilter?.type && reportFilter.type === 'COLLECTION' && (
              <div className="filters label-filter">
                <p style={{ marginBottom: '1rem' }}>
                  Selecione o ponto de venda
                </p>
                <ReactSelect
                  name="pointOfSale"
                  value={pointSelected}
                  placeholder="Selecionar..."
                  options={pointsOfSale.map(point => {
                    return {
                      value: point.id,
                      label: point.label || 'Parceria pesoal',
                    };
                  })}
                  onChange={e => {
                    if (e) {
                      setReportFilter({
                        ...reportFilter,
                        pointOfSale: e.value,
                      });
                    }
                  }}
                />
              </div>
            )}
            {reportFilter?.type && reportFilter.type !== 'USER_STOCK' && (
              <div className="filters label-filter">
                <p style={{ marginBottom: '1rem' }}>Selecione as datas</p>
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
                        setReportFilter({
                          ...reportFilter,
                          date: {
                            startDate: new Date(startDate),
                            endDate: new Date(endDate),
                          },
                        });
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {!loadingReport ? (
            <ReportResults>
              {groupReportData && (
                <>
                  <h1
                    className="heading-secondary-font"
                    style={{ marginBottom: '1rem' }}
                  >
                    Filtros
                  </h1>
                  <div className="filters-export">
                    <div className="filter">
                      <CreatableSelect
                        isMulti
                        value={selectedGroups}
                        placeholder="Todas as parcerias"
                        onChange={e => {
                          setSelectedGroups([...e]);
                        }}
                        options={groups.map(group => {
                          return { label: group.label, value: group.id };
                        })}
                      />
                    </div>
                    <Button
                      title="Exportar"
                      color="primary"
                      busy={busyBtn}
                      callback={async () => {
                        if (reportFilter) {
                          setBusyBtn(true);
                          await getGroupReport(
                            reportFilter.date!,
                            {
                              groupIds: selectedGroups.map(
                                group => group.value,
                              ),
                            },
                            true,
                          );
                          setBusyBtn(false);
                        }
                      }}
                    />
                  </div>
                  <TableGroup>
                    <div className="table-title">
                      <h1 className="table-title-font partnerships-name">
                        Relatório das parcerias
                      </h1>
                    </div>
                    <div className="primary-row table-title-font">
                      <div className="label">Nome</div>
                      <div className="route">Máquinas</div>
                      <div className="route">Faturamento</div>
                      <div className="contact-name">
                        Prêmios
                        <br /> adquiridos
                      </div>
                      <div className="contact-name">
                        Total em <br /> prêmios
                      </div>
                      <div className="contact-name">
                        Total em <br /> suprimentos
                      </div>
                      <div className="phone">Aluguel</div>
                      <div className="phone">Remoto</div>
                      <div className="phone">Balanço</div>
                    </div>
                    {groupReportData.map(data => {
                      return (
                        <SingleReportGroup key={v4()}>
                          <div className="label">{data.groupLabel}</div>
                          <div className="contact-name">
                            {data.numberOfMachines}
                          </div>
                          <div className="label" style={{ color: 'green' }}>
                            {`R$ ${
                              data.income.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                          <div className="contact-name">
                            {data.prizePurchaseAmount}
                          </div>
                          <div
                            className="contact-name"
                            style={{ color: 'orange' }}
                          >
                            {`R$ ${
                              data.prizePurchaseCost.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                          <div
                            className="contact-name"
                            style={{ color: 'orange' }}
                          >
                            {`R$ ${
                              data.maintenance.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                          <div className="phone" style={{ color: 'orange' }}>
                            {`R$ ${
                              data.rent.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                          <div className="phone">
                            {`R$ ${
                              data.remoteCreditCost.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                          <div className="phone">
                            {`R$ ${
                              data.balance.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                        </SingleReportGroup>
                      );
                    })}
                    <div className="table-title total">
                      <div>Total</div>
                      <div>
                        {groupReportData
                          .map(data => data.numberOfMachines)
                          .reduce((acc, cur) => cur + acc, 0) || '0'}
                      </div>
                      <div style={{ color: 'green' }}>
                        {`R$ ${
                          groupReportData
                            .map(data => data.income)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                      <div>
                        {groupReportData
                          .map(data => data.prizePurchaseAmount)
                          .reduce((acc, cur) => cur + acc, 0) || '0'}
                      </div>
                      <div style={{ color: 'orange' }}>
                        {`R$ ${
                          groupReportData
                            .map(data => data.prizePurchaseCost)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                      <div style={{ color: 'orange' }}>
                        {`R$ ${
                          groupReportData
                            .map(data => data.maintenance)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                      <div style={{ color: 'orange' }}>
                        {`R$ ${
                          groupReportData
                            .map(data => data.rent)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                      <div>
                        {`R$ ${
                          groupReportData
                            .map(data => data.remoteCreditCost)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                      <div>
                        {`R$ ${
                          groupReportData
                            .map(data => data.balance)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                    </div>
                  </TableGroup>
                </>
              )}
              {machineReportData && (
                <>
                  <h1
                    className="heading-secondary-font"
                    style={{ marginBottom: '1rem' }}
                  >
                    Filtros
                  </h1>
                  <div className="filters-export">
                    <div className="column">
                      <div className="filter">
                        <p className="label-font">Parcerias</p>
                        <ReactSelect
                          name="selectedGroup"
                          value={selectedGroup}
                          placeholder="Selecionar parceria"
                          options={[
                            { label: 'Todas', value: 'none' },
                            ...groups.map(group => {
                              return { label: group.label, value: group.id };
                            }),
                          ]}
                          onChange={e => {
                            if (e) {
                              setSelectedGroup(e);
                              setSelectedMachines([]);
                              (async () => {
                                await getMachines(undefined, {
                                  groupId: e.value,
                                });
                              })();
                            }
                          }}
                        />
                      </div>
                      {selectedGroup.value !== 'none' && (
                        <div className="filter">
                          <CreatableSelect
                            isMulti
                            value={selectedMachines}
                            placeholder="Todas as máquinas"
                            onChange={e => {
                              setSelectedMachines([...e]);
                            }}
                            options={machines.map(group => {
                              return {
                                label: group.serialNumber,
                                value: group.id,
                              };
                            })}
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      title="Exportar"
                      color="primary"
                      busy={busyBtn}
                      callback={async () => {
                        if (reportFilter) {
                          setBusyBtn(true);
                          await getMachineReport(
                            reportFilter.date!,
                            {
                              groupId: selectedGroup.value,
                              machineIds: selectedMachines.map(
                                machine => machine.value,
                              ),
                            },
                            true,
                          );
                          setBusyBtn(false);
                        }
                      }}
                    />
                  </div>

                  <TableMachine>
                    <div className="table-title">
                      <h1 className="table-title-font partnerships-name">
                        Relatório das parcerias
                      </h1>
                    </div>
                    <div className="primary-row table-title-font">
                      <div className="label">Máquina</div>
                      <div className="route">Parceria</div>
                      <div className="route">Categoria</div>
                      <div className="contact-name">Localização</div>
                      <div className="contact-name">Faturamento</div>
                      <div className="contact-name">Remoto</div>
                      <div className="phone">Prêmios</div>
                      <div className="phone">Jogadas</div>
                      <div className="phone">
                        Valor da <br /> jogada
                      </div>
                      <div className="phone">
                        Jogadas por <br /> prêmio
                      </div>
                      <div className="phone">
                        Meta <br /> R$/prêmio
                      </div>
                      <div className="phone">
                        Meta <br /> R$/mês
                      </div>
                      <div className="phone">
                        Média <br /> R$/dia
                      </div>
                    </div>
                    {machineReportData.map(data => {
                      return (
                        <SingleMachineReport key={v4()}>
                          <div className="label">{data.serialNumber}</div>
                          <div className="contact-name">{data.groupLabel}</div>
                          <div className="label">{data.category}</div>
                          <div className="contact-name">{data.location}</div>
                          <div
                            className="contact-name"
                            style={{ color: 'green' }}
                          >
                            {`R$ ${
                              data.income.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                          <div className="contact-name">
                            {`R$ ${
                              data.remoteCreditAmount.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                          <div className="phone">{data.prizes}</div>
                          <div className="phone">{data.numberOfPlays}</div>
                          <div className="phone">
                            {`R$ ${
                              data.gameValue.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                          <div className="phone">{data.playsPerPrize}</div>
                          <div className="phone">
                            {`R$ ${
                              data.incomePerPrizeGoal.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '-'
                            }`}
                          </div>
                          <div className="phone">
                            {`R$ ${
                              data.incomePerMonthGoal.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '-'
                            }`}
                          </div>
                          <div className="phone">
                            {`R$ ${
                              data.averagePerDay.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              }) || '0,00'
                            }`}
                          </div>
                        </SingleMachineReport>
                      );
                    })}
                    <div className="table-title total">
                      <div>Total</div>
                      <div />
                      <div />
                      <div />
                      <div style={{ color: 'green' }}>
                        {`R$ ${
                          machineReportData
                            .map(data => data.income)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                      <div>
                        {`R$ ${
                          machineReportData
                            .map(data => data.remoteCreditAmount)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                      <div>
                        {machineReportData
                          .map(data => data.prizes)
                          .reduce((acc, cur) => cur + acc, 0) || '0'}
                      </div>
                      <div>
                        {machineReportData
                          .map(data => data.numberOfPlays)
                          .reduce((acc, cur) => cur + acc, 0) || '0'}
                      </div>
                      <div />
                      <div>
                        {machineReportData
                          .map(data => data.playsPerPrize)
                          .reduce((acc, cur) => cur + acc, 0) || '0'}
                      </div>
                      <div>
                        {`R$ ${
                          machineReportData
                            .map(data => data.incomePerPrizeGoal)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '-'
                        }`}
                      </div>
                      <div>
                        {`R$ ${
                          machineReportData
                            .map(data => data.incomePerMonthGoal)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '-'
                        }`}
                      </div>
                      <div>
                        {`R$ ${
                          machineReportData
                            .map(data => data.averagePerDay)
                            .reduce((acc, cur) => cur + acc, 0)
                            .toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            }) || '0,00'
                        }`}
                      </div>
                    </div>
                  </TableMachine>
                </>
              )}
              {pointsOfSaleReportData && (
                <>
                  <h1
                    className="heading-secondary-font"
                    style={{ marginBottom: '1rem' }}
                  >
                    Filtros
                  </h1>
                  <div className="filters-export">
                    <div className="column">
                      <div className="filter">
                        <p className="label-font">Parcerias</p>
                        <ReactSelect
                          name="selectedGroup"
                          value={selectedGroup}
                          placeholder="Selecionar parceria"
                          options={[
                            { label: 'Todas', value: 'none' },
                            ...groups.map(group => {
                              return { label: group.label, value: group.id };
                            }),
                          ]}
                          onChange={e => {
                            if (e) {
                              setSelectedGroup(e);
                              setSelectedPdvs([]);
                              setFilteredPdvs(
                                pointsOfSale.filter(
                                  point => point.groupId === e.value,
                                ),
                              );
                            }
                          }}
                        />
                      </div>
                      {selectedGroup.value !== 'none' && (
                        <div className="filter">
                          <CreatableSelect
                            isMulti
                            value={selectedPdvs}
                            placeholder="Todos os PDVs"
                            onChange={e => {
                              setSelectedPdvs([...e]);
                            }}
                            options={filteredPdvs.map(point => {
                              return {
                                label: point.label,
                                value: point.id,
                              };
                            })}
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      title="Exportar"
                      color="primary"
                      busy={busyBtn}
                      callback={async () => {
                        if (reportFilter) {
                          setBusyBtn(true);
                          await getPointsOfSaleReport(
                            reportFilter.date!,
                            {
                              groupId: selectedGroup.value,
                              pointsOfSaleIds: selectedPdvs.map(
                                pdv => pdv.value,
                              ),
                            },
                            true,
                          );
                          setBusyBtn(false);
                        }
                      }}
                    />
                  </div>
                  <TablePointOfSale>
                    <div className="table-title">
                      <h1 className="table-title-font partnerships-name">
                        Relatório dos pontos de venda(PdV)
                      </h1>
                    </div>
                    {pointsOfSaleReportData.map(point => {
                      return (
                        <div key={v4()}>
                          <div className="table-title">
                            <h1 className="table-title-font partnerships-name">
                              {`${point.label} - ${point.groupLabel} - ${
                                point.address.city
                              }-${point.address.state}. Aluguel: R$ ${
                                point.rent.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                }) || '-'
                              }`}
                            </h1>
                          </div>
                          <div className="primary-row table-title-font">
                            <div className="label">Máquina</div>
                            <div className="route">Categoria</div>
                            <div className="contact-name">Faturamento</div>
                            <div className="contact-name">Remoto</div>
                            <div className="phone">Prêmios</div>
                            <div className="phone">Jogadas</div>
                            <div className="phone">
                              Valor da <br /> jogada
                            </div>
                            <div className="phone">
                              Jogadas por <br /> prêmio
                            </div>
                            <div className="phone">
                              Meta <br /> R$/prêmio
                            </div>
                            <div className="phone">
                              Meta <br /> R$/mês
                            </div>
                            <div className="phone">
                              Média <br /> R$/dia
                            </div>
                          </div>
                          {point.machineAnalytics.map(data => {
                            return (
                              <SingleMachineInPointReport key={v4()}>
                                <div className="label">{data.serialNumber}</div>

                                <div className="label">{data.category}</div>

                                <div
                                  className="contact-name"
                                  style={{ color: 'green' }}
                                >
                                  {`R$ ${
                                    data.income.toLocaleString('pt-BR', {
                                      minimumFractionDigits: 2,
                                    }) || '0,00'
                                  }`}
                                </div>
                                <div className="contact-name">
                                  {`R$ ${
                                    data.remoteCreditAmount.toLocaleString(
                                      'pt-BR',
                                      {
                                        minimumFractionDigits: 2,
                                      },
                                    ) || '0,00'
                                  }`}
                                </div>
                                <div className="phone">{data.prizes}</div>
                                <div className="phone">
                                  {data.numberOfPlays}
                                </div>
                                <div className="phone">
                                  {`R$ ${
                                    data.gameValue.toLocaleString('pt-BR', {
                                      minimumFractionDigits: 2,
                                    }) || '0,00'
                                  }`}
                                </div>
                                <div className="phone">
                                  {data.playsPerPrize}
                                </div>
                                <div className="phone">
                                  {`R$ ${
                                    data.incomePerPrizeGoal.toLocaleString(
                                      'pt-BR',
                                      {
                                        minimumFractionDigits: 2,
                                      },
                                    ) || '-'
                                  }`}
                                </div>
                                <div className="phone">
                                  {`R$ ${
                                    data.incomePerMonthGoal.toLocaleString(
                                      'pt-BR',
                                      {
                                        minimumFractionDigits: 2,
                                      },
                                    ) || '-'
                                  }`}
                                </div>
                                <div className="phone">
                                  {`R$ ${
                                    data.averagePerDay.toLocaleString('pt-BR', {
                                      minimumFractionDigits: 2,
                                    }) || '0,00'
                                  }`}
                                </div>
                              </SingleMachineInPointReport>
                            );
                          })}
                          <div className="table-title total">
                            <div>Total</div>
                            <div />
                            <div style={{ color: 'green' }}>
                              {`R$ ${
                                point.machineAnalytics
                                  .map(data => data.income)
                                  .reduce((acc, cur) => cur + acc, 0)
                                  .toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  }) || '0,00'
                              }`}
                            </div>
                            <div>
                              {`R$ ${
                                point.machineAnalytics
                                  .map(data => data.remoteCreditAmount)
                                  .reduce((acc, cur) => cur + acc, 0)
                                  .toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  }) || '0,00'
                              }`}
                            </div>
                            <div>
                              {point.machineAnalytics
                                .map(data => data.prizes)
                                .reduce((acc, cur) => cur + acc, 0) || '0'}
                            </div>
                            <div>
                              {point.machineAnalytics
                                .map(data => data.numberOfPlays)
                                .reduce((acc, cur) => cur + acc, 0) || '0'}
                            </div>
                            <div />
                            <div>
                              {point.machineAnalytics
                                .map(data => data.playsPerPrize)
                                .reduce((acc, cur) => cur + acc, 0) || '0'}
                            </div>
                            <div>
                              {`R$ ${
                                point.machineAnalytics
                                  .map(data => data.incomePerPrizeGoal)
                                  .reduce((acc, cur) => cur + acc, 0)
                                  .toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  }) || '-'
                              }`}
                            </div>
                            <div>
                              {`R$ ${
                                point.machineAnalytics
                                  .map(data => data.incomePerMonthGoal)
                                  .reduce((acc, cur) => cur + acc, 0)
                                  .toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  }) || '-'
                              }`}
                            </div>
                            <div>
                              {`R$ ${
                                point.machineAnalytics
                                  .map(data => data.averagePerDay)
                                  .reduce((acc, cur) => cur + acc, 0)
                                  .toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  }) || '0,00'
                              }`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </TablePointOfSale>
                </>
              )}
              {typeSelected?.value === 'USER_STOCK' && (
                <Button
                  title="Exportar"
                  color="primary"
                  busy={busyBtn}
                  callback={async () => {
                    setBusyBtn(true);
                    await getUserStockReport();
                    setBusyBtn(false);
                  }}
                />
              )}
              {typeSelected?.value === 'COLLECTION' && (
                <Button
                  title="Exportar"
                  color="primary"
                  busy={busyBtn}
                  callback={async () => {
                    if (reportFilter) {
                      setBusyBtn(true);
                      await getCollectionReport(
                        reportFilter.date!,
                        reportFilter.pointOfSale!,
                      );
                      setBusyBtn(false);
                    }
                  }}
                />
              )}
            </ReportResults>
          ) : (
            <div className="is-loading">
              <ClipLoader size={30} color="#7366ff" />
            </div>
          )}
        </ReportContent>
      </ReportContainer>
    </Container>
  );
};
export default ReportPage;
