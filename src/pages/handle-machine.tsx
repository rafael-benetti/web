/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { FormHandles, Scope } from '@unform/core';
import { v4 } from 'uuid';
import { FiXCircle, FiPlus } from 'react-icons/fi';
import Input from '../components/input';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SelectInput, { Options } from '../components/select-input';
import { Machine } from '../entiti/machine';
import { useGroup } from '../hooks/group';
import {
  HandleMachineContainer,
  HandleMachineContent,
  Boxes,
  Counters,
} from '../styles/pages/handle-machine';
import { PageTitle } from '../utils/page-title';
import { HandleMachineDto } from '../dto/handle-machine';
import { usePointOfSale } from '../hooks/point-of-sale';
import { useCategory } from '../hooks/category';
import { Box } from '../entiti/Box';
import SingleCheckbox from '../components/single-checkbox';
import Button from '../components/button';
import getValidationErrors from '../utils/getValidationErrors';
import { useMachine } from '../hooks/machine';
import { useOperator } from '../hooks/operator';
import { User } from '../entiti/user';
import { useTelemetry } from '../hooks/telemetry';
import { useToast } from '../hooks/toast';
import { Prize } from '../entiti/prize';

const HandleMachinePage: React.FC = () => {
  // location
  const initialData = useLocation().state as Machine;

  // refs
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { getGroups, groups } = useGroup();
  const { getPointsOfSale, pointsOfSale } = usePointOfSale();
  const { getOperators, operators } = useOperator();
  const {
    getCategories,
    categories,
    counterTypes,
    getCounterType,
  } = useCategory();
  const { createMachine, editMachine } = useMachine();
  const { getTelemetries, telemetries } = useTelemetry();
  const { addToast } = useToast();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [boxesCreater, setBoxesCreater] = useState<Box[]>([]);
  const [groupSelected, setGroupSelected] = useState<string>();
  const [availableOperators, setAvailableOperators] = useState<User[]>([]);
  const [availablePrizes, setAvailablePrizes] = useState<Prize[]>([]);
  const [machineId, setMachineId] = useState<string>();

  const [locationSelected, setLocationSelected] = useState<{
    value: string;
    label: string;
  }>({ value: 'stock', label: 'Estoque' });
  const [telemetrySelected, setTelemetrySelected] = useState<{
    value: string;
    label: string;
  }>({ value: 'none', label: 'Sem telemetria' });
  const [operatorSelected, setOperatorSelected] = useState<{
    value: string;
    label: string;
  }>({
    value: 'none',
    label: 'Sem operador',
  });
  const [typeOfPrize, setTypeOfPrize] = useState<{
    value: string;
    label: string;
  }>({ value: '', label: 'Indefinido' });
  const [categoryName, setCategoryName] = useState<string>();
  const [redirect, setRedirect] = useState(false);

  // const
  const [telemetry, setTelemetry] = useState<Options[]>([
    { label: 'Pino 2', value: 'Pino 2' },
    { label: 'Pino 3', value: 'Pino 3' },
    { label: 'Pino 4', value: 'Pino 4' },
    { label: 'Pino 5', value: 'Pino 5' },
    { label: 'Pino 6', value: 'Pino 6' },
    { label: 'Pino 7', value: 'Pino 7' },
    { label: 'Pino 8', value: 'Pino 8' },
    { label: 'Pino 9', value: 'Pino 9' },
    { label: 'Pino 10', value: 'Pino 10' },
    { label: 'Pino 11', value: 'Pino 11' },
    { label: 'Pino 12', value: 'Pino 12' },
    { label: 'Pino 13', value: 'Pino 13' },
  ]);

  const handleMachine = useCallback(
    async (data: HandleMachineDto) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          gameValue: Yup.number()
            .required('Valor da jogada obrigatório')
            .positive('Valor precisa ser positivo'),
          serialNumber: Yup.string().required('Número de série obrigatório'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        if (
          (data.minimumPrizeCount && data.minimumPrizeCount < 0) ||
          (data.incomePerMonthGoal && data.incomePerMonthGoal < 0) ||
          (data.incomePerPrizeGoal && data.incomePerPrizeGoal < 0)
        ) {
          addToast({
            title: 'Atenção',
            description:
              'Não é permitido valores negativos, verifique os campos.',
            type: 'info',
          });
          setBusyBtn(false);
          return;
        }
        if (initialData) {
          const editMachineData: HandleMachineDto = {
            boxes: boxesCreater,
            groupId: groups.length === 1 ? groups[0].id : initialData.groupId,
            gameValue: data.gameValue,
            categoryId: initialData.categoryId,
            serialNumber: data.serialNumber,
            locationId: locationSelected.value,
            operatorId: operatorSelected.value,
            telemetryBoardId: telemetrySelected.value,
          };
          const responseEdit = await editMachine(
            editMachineData,
            initialData.id,
          );
          setMachineId(initialData.id);
          setBusyBtn(false);
          if (responseEdit) {
            setRedirect(true);
          }
          return;
        }
        if ((!data.groupId || !data.categoryId) && groups.length > 1) {
          addToast({
            title: 'Aviso',
            description:
              'É necessário selecionar uma parceria e uma categoria pra criar uma máquina',
            type: 'info',
          });
          setBusyBtn(false);
          return;
        }
        const createData: HandleMachineDto = {
          boxes: boxesCreater,
          categoryId: data.categoryId,
          gameValue: data.gameValue,
          serialNumber: data.serialNumber,
          locationId: data.locationId,
          operatorId: operatorSelected.value,
          telemetryBoardId: telemetrySelected.value,
          groupId: groups.length === 1 ? groups[0].id : data.groupId,
          minimumPrizeCount: data.minimumPrizeCount,
          typeOfPrizeId: typeOfPrize.value,
          incomePerMonthGoal: !data.incomePerMonthGoal
            ? undefined
            : data.incomePerMonthGoal,
          incomePerPrizeGoal: !data.incomePerMonthGoal
            ? undefined
            : data.incomePerPrizeGoal,
        };
        const responseCreate = await createMachine(createData);
        if (responseCreate) {
          setMachineId(responseCreate.id);
          setRedirect(true);
        }
        setBusyBtn(false);
      } catch (error) {
        setBusyBtn(false);
        addToast({
          title: 'Aviso!',
          description: 'Algum campo obrigatório não foi preenchido.',
          type: 'info',
        });
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [
      initialData,
      boxesCreater,
      operatorSelected,
      locationSelected,
      telemetrySelected,
      typeOfPrize,
      machineId,
    ],
  );

  const getAvailableOperators = useCallback(
    id => {
      const temp: User[] = [];
      operators.forEach(operator => {
        operator.groupIds.forEach(groupId => {
          if (groupId === id) {
            if (temp.find(t => t.id === operator.id)) {
              return;
            }
            temp.push(operator);
          }
        });

        setAvailableOperators(temp);
      });
    },
    [availableOperators, operators],
  );

  useEffect(() => {
    if (initialData) {
      setCategoryName(initialData.categoryLabel);
      formRef.current?.setData({
        category:
          categories.find(category => category.id === initialData.categoryId)
            ?.label || '',

        serialNumber: initialData.serialNumber.toString(),
        gameValue: initialData.gameValue,
      });
      getAvailableOperators(initialData.groupId);
      setGroupSelected(initialData.groupId);
      if (initialData.operatorId) {
        setOperatorSelected({
          value: initialData.operatorId || '',
          label:
            operators.find(operator => operator.id === initialData.operatorId)
              ?.name || '',
        });
      } else {
        setOperatorSelected({
          value: 'none',
          label: 'Sem operador',
        });
      }
      if (initialData.telemetryBoardId) {
        setTelemetrySelected({
          value: initialData.telemetryBoardId || '',
          label: `STG-${
            telemetries.find(
              telemetryBoard =>
                telemetryBoard.id === initialData.telemetryBoardId,
            )?.id || ''
          }`,
        });
      } else {
        setOperatorSelected({
          value: 'none',
          label: 'Sem operador',
        });
      }
      if (initialData.boxes) {
        setBoxesCreater(initialData.boxes);
      }
    }
  }, [initialData, busy]);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getGroups();
      await getPointsOfSale(undefined, undefined);
      await getOperators();
      await getCategories();
      await getCounterType();
      await getTelemetries();
      if (groups.length === 1 && groups[0].isPersonal) {
        setGroupSelected(groups[0].id);
      }
      setBusy(false);
    })();
  }, []);

  return (
    <Container active="machines" loading={busy}>
      <HandleMachineContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">
              {initialData ? 'Editar máquina' : 'Criar máquina'}
            </h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Máquinas', url: '/maquinas' },
                {
                  name: `${initialData ? 'Editar máquina' : 'Criar máquina'}`,
                },
              ]}
            />
          </div>
        </PageTitle>
        <HandleMachineContent>
          <Form ref={formRef} onSubmit={handleMachine}>
            <div className="form-grid">
              <Input name="serialNumber" type="text" label="Número de série" />

              {initialData ? null : (
                <>
                  {groups.length === 1 && groups[0].isPersonal ? null : (
                    <SelectInput
                      name="groupId"
                      label="Parceria"
                      options={groups.map(group => {
                        return {
                          value: group.id,
                          label: group.label,
                        };
                      })}
                      onChange={(e: any) => {
                        setGroupSelected(e.value);
                        setLocationSelected({
                          value: 'stock',
                          label: 'Estoque',
                        });
                        setTelemetrySelected({
                          value: 'none',
                          label: 'Sem telemetria',
                        });
                        setOperatorSelected({
                          value: 'none',
                          label: 'Sem operador',
                        });
                        setTypeOfPrize({
                          value: '',
                          label: 'Indefinido',
                        });
                        getAvailableOperators(e.value);
                        setAvailablePrizes(
                          groups.find(group => group.id === e.value)!.stock
                            .prizes,
                        );
                      }}
                    />
                  )}
                </>
              )}
              {initialData ? (
                <Input name="category" isDisabled label="Categoria" />
              ) : (
                <SelectInput
                  name="categoryId"
                  label="Categoria"
                  onChange={e => {
                    const categoryId = e ? e.value : '';
                    const index = categories.findIndex(
                      category => category.id === categoryId,
                    );
                    setBoxesCreater(categories[index].boxes);
                    setCategoryName(e ? e.label : '');
                  }}
                  options={categories.map(category => {
                    return {
                      value: category.id,
                      label: category.label,
                    };
                  })}
                />
              )}
              <SelectInput
                name="operatorId"
                label="Operador"
                value={operatorSelected}
                isDisabled={!groupSelected}
                options={[
                  { label: 'Sem operador', value: 'none' },
                  ...availableOperators.map(availableOperator => {
                    return {
                      value: availableOperator.id,
                      label: availableOperator.name,
                    };
                  }),
                ]}
                onChange={(e: any) => {
                  setOperatorSelected({ value: e.value, label: e.label });
                }}
              />
              {initialData ? null : (
                <SelectInput
                  name="locationId"
                  label="Ponto de venda"
                  value={locationSelected}
                  isDisabled={!groupSelected}
                  options={[
                    { label: 'Estoque', value: 'stock' },
                    ...pointsOfSale
                      .filter(
                        pointOfSale => pointOfSale.groupId === groupSelected,
                      )
                      .map(pointOfSale => {
                        return {
                          value: pointOfSale.id,
                          label: pointOfSale.label,
                        };
                      }),
                  ]}
                  onChange={(e: any) => {
                    setLocationSelected({ value: e.value, label: e.label });
                  }}
                />
              )}
              <SelectInput
                name="telemetryBoardId"
                label="Telemetria"
                isDisabled={!groupSelected}
                value={telemetrySelected}
                options={[
                  { label: 'Sem telemetria', value: 'none' },
                  ...telemetries
                    .filter(
                      telemetryBoard =>
                        telemetryBoard.groupId === groupSelected &&
                        !telemetryBoard.machineId,
                    )
                    .map(pointOfSale => {
                      return {
                        value: pointOfSale.id,
                        label: `STG-${pointOfSale.id}`,
                      };
                    }),
                ]}
                onChange={(e: any) => {
                  setTelemetrySelected({ value: e.value, label: e.label });
                }}
              />
              <Input name="gameValue" label="Valor da jogada" type="number" />
              {initialData ? null : (
                <Input
                  name="minimumPrizeCount"
                  type="number"
                  label="Estoque mínimo"
                  tooltip="Você será alertado quando sua máquina estiver abaixo do estoque mínimo inserido (opcional)"
                />
              )}
              {initialData ? null : (
                <SelectInput
                  name="typeOfPrize"
                  label="Tipos de produtos"
                  value={typeOfPrize}
                  isDisabled={!groupSelected}
                  options={[
                    { label: 'Indefinido', value: '' },
                    ...availablePrizes.map(prize => {
                      return {
                        value: prize.id,
                        label: prize.label,
                      };
                    }),
                  ]}
                  onChange={(e: any) => {
                    setTypeOfPrize({ value: e.value, label: e.label });
                  }}
                />
              )}
              {!initialData && (
                <>
                  <Input
                    name="incomePerPrizeGoal"
                    type="number"
                    label="Meta de faturamento por prêmio"
                    tooltip="Este campo será utilizado apenas como analítico ao requisitar um relatório de máquina (opcional)"
                  />
                  <Input
                    name="incomePerMonthGoal"
                    type="number"
                    label="Meta de faturamento por mês"
                    tooltip="Este campo será utilizado apenas como analítico ao requisitar um relatório de máquina (opcional)"
                  />
                </>
              )}
            </div>
            <div className="category">
              {boxesCreater.map((box, index) => {
                return (
                  <Scope path={`boxes.${index}`} key={v4()}>
                    <Boxes>
                      <div className="cabin-title">
                        <h1 className="heading-secondary-font">
                          {`${
                            categoryName?.toLowerCase().includes('roleta')
                              ? 'Haste'
                              : 'Cabine'
                          } ${index + 1}`}
                        </h1>
                      </div>

                      {box.counters &&
                        box.counters.map((counter, indx) => {
                          return (
                            <Scope path={`counters.${indx}`} key={v4()}>
                              <Counters>
                                <div className="counter-title">
                                  <button
                                    className="delete-counter-btn"
                                    type="button"
                                    onClick={() => {
                                      boxesCreater[index].counters.splice(
                                        indx,
                                        1,
                                      );
                                      setBoxesCreater([...boxesCreater]);
                                    }}
                                  >
                                    <FiXCircle />
                                  </button>
                                  <h1>{`Contador ${indx + 1}`}</h1>
                                </div>
                                <div className="grid-counter">
                                  <div className="type-counter">
                                    <SelectInput
                                      id={`type ${indx} ${index}`}
                                      name="counterTypeId"
                                      label="Tipo do contador"
                                      options={counterTypes.map(counterType => {
                                        return {
                                          label: `${counterType.label} (${
                                            counterType.type === 'IN'
                                              ? 'Entrada'
                                              : 'Saída'
                                          })`,
                                          value: counterType.id,
                                        };
                                      })}
                                      value={
                                        boxesCreater[index].counters[indx]
                                          .counterTypeId
                                          ? counterTypes.map(counterType => {
                                              if (
                                                counterType.id ===
                                                boxesCreater[index].counters[
                                                  indx
                                                ].counterTypeId
                                              ) {
                                                return {
                                                  value: counterType.id,
                                                  label: `${
                                                    counterType.label
                                                  } (${
                                                    counterType.type === 'IN'
                                                      ? 'Entrada'
                                                      : 'Saída'
                                                  })`,
                                                };
                                              }
                                            })
                                          : {}
                                      }
                                      onChange={e => {
                                        boxesCreater[index].counters[
                                          indx
                                        ].counterTypeId = e ? e.value : '';
                                        setBoxesCreater([...boxesCreater]);
                                      }}
                                    />
                                  </div>
                                  <div className="pin-counter">
                                    <SelectInput
                                      id={`telemetry ${indx} ${index}`}
                                      name="pin"
                                      label="Telemetria"
                                      options={telemetry}
                                      value={
                                        boxesCreater[index].counters[indx].pin
                                          ? {
                                              value:
                                                boxesCreater[index].counters[
                                                  indx
                                                ].pin,
                                              label:
                                                boxesCreater[index].counters[
                                                  indx
                                                ].pin,
                                            }
                                          : {}
                                      }
                                      onChange={e => {
                                        const i = telemetry.findIndex(
                                          t => t.value === e!.value,
                                        );
                                        telemetry.splice(i, 1);
                                        setTelemetry(telemetry);
                                        boxesCreater[index].counters[
                                          indx
                                        ].pin = e ? e.value : '';
                                        setBoxesCreater([...boxesCreater]);
                                      }}
                                    />
                                  </div>
                                  <div className="clock-counter">
                                    <SingleCheckbox
                                      id={`digital ${indx} ${index}`}
                                      name="hasDigital"
                                      label="Digital"
                                      defaultChecked={
                                        !!boxesCreater[index].counters[indx]
                                          .hasDigital
                                      }
                                      onChange={e => {
                                        const value = e.target.checked;
                                        setBoxesCreater(state => {
                                          state[index].counters[
                                            indx
                                          ].hasDigital = value;
                                          return state;
                                        });
                                      }}
                                    />
                                    <SingleCheckbox
                                      id={`mecanico ${indx} ${index}`}
                                      name="hasMechanical"
                                      label="Mecânico"
                                      defaultChecked={
                                        !!boxesCreater[index].counters[indx]
                                          .hasMechanical
                                      }
                                      onChange={e => {
                                        const value = e.target.checked;
                                        setBoxesCreater(state => {
                                          state[index].counters[
                                            indx
                                          ].hasMechanical = value;
                                          return state;
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </Counters>
                            </Scope>
                          );
                        })}
                      <button
                        type="button"
                        className="add-counter"
                        onClick={() => {
                          boxesCreater[index].counters?.push({
                            hasDigital: false,
                            hasMechanical: false,

                            pin: undefined,
                          });
                          setBoxesCreater([...boxesCreater]);
                        }}
                      >
                        Adicionar Contador
                        <FiPlus size={16} />
                      </button>
                    </Boxes>
                  </Scope>
                );
              })}
            </div>
            <div className="submit-btn">
              {initialData ? (
                <Link
                  to={{
                    pathname: '/detalhes-da-maquina',
                    state: initialData.id,
                  }}
                >
                  <Button color="tertiary" title="Cancelar" />
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: '/maquinas',
                  }}
                >
                  <Button color="tertiary" title="Cancelar" />
                </Link>
              )}
              <Button
                isSubmit
                color="primary"
                title={initialData ? 'Editar' : 'Criar'}
                busy={busyBtn}
              />
            </div>
          </Form>
        </HandleMachineContent>
      </HandleMachineContainer>
      {redirect ? (
        <Redirect to={{ pathname: '/detalhes-da-maquina', state: machineId }} />
      ) : null}
    </Container>
  );
};
export default HandleMachinePage;
