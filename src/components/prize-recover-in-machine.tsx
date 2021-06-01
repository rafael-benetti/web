/* eslint-disable react/jsx-curly-newline */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useCallback, useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { TransferFromMachineDto } from '../dto/transfer-from-machine';
import { Group } from '../entiti/group';
import { BoxInfo } from '../entiti/machine-info';
import { Prize } from '../entiti/prize';
import { useMachine } from '../hooks/machine';
import { useStock } from '../hooks/stock';
import { useToast } from '../hooks/toast';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import { PrizeRecoverInMachineContainer } from '../styles/components/prize-recover-in-machine';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';

interface Props {
  box: BoxInfo;
  index: number;
  group?: Group;
  machineId?: string;
  typeOfPrize?: Prize;
}

const PrizeRecoverInMachine: React.FC<Props> = ({
  box,
  index,
  group,
  machineId,
  typeOfPrize,
}) => {
  // hooks
  const { getUser, user } = useUser();
  const { togglePrizeRecover } = useMachine();
  const { addToast } = useToast();
  const { transferFromMachine } = useStock();

  // state
  const [busyBtn, setBusyBtn] = useState(false);
  const [productSelected, setProductSelected] = useState<{
    label: string;
    value: string;
  }>({
    label: 'Selecionar',
    value: '',
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [firstStep, setFirstStep] = useState<'GROUP' | 'PERSONAL' | undefined>(
    undefined,
  );

  const handlePrizeRecover = useCallback(
    async (type: 'GROUP' | 'USER') => {
      setBusyBtn(true);
      try {
        if (!productSelected) {
          addToast({
            title: 'Atenção',
            description: 'É necessário selecionar o tipo de produto',
            type: 'info',
          });
          setBusyBtn(false);
          return;
        }
        if (box.currentPrizeCount < amount) {
          addToast({
            title: 'Atenção',
            description:
              'Esse valor é maior do que a quantidade de prêmios que existe na cabine',
            type: 'info',
          });
          setBusyBtn(false);

          return;
        }
        if (amount < 0) {
          addToast({
            title: 'Atenção',
            description: 'Não é permitido inserir valor negativo.',
            type: 'info',
          });
          setBusyBtn(false);

          return;
        }
        if (!amount) {
          addToast({
            title: 'Atenção',
            description:
              'É necessário inserir uma quantidade de produtos que deseja transferir',
            type: 'info',
          });
          setBusyBtn(false);
          return;
        }
        const transferData: TransferFromMachineDto = {
          boxId: box.boxId,
          machineId: machineId || '',
          quantity: amount,
          toGroup: type === 'GROUP',
        };
        await transferFromMachine(transferData, productSelected.value);
        setBusyBtn(false);
        togglePrizeRecover(undefined, true);
      } catch (error) {
        setBusyBtn(false);
      }
    },
    [amount, productSelected],
  );

  useCallback(() => {
    (async () => {
      await getUser();
      setFirstStep(undefined);
    })();
  }, []);

  useEffect(() => {
    if (typeOfPrize) {
      setProductSelected({ label: typeOfPrize.label, value: typeOfPrize.id });
    }
  }, []);

  return (
    <>
      <PrizeRecoverInMachineContainer>
        <h1 className="title">{`Resgatando estoque cabine ${index + 1}`}</h1>
        {/* OWNER ROLE */}
        {user?.role === 'OWNER' && (
          <>
            {typeOfPrize ? (
              <div className="select-location">
                <p className="label-font">
                  {`Esta máquina possui o produto padrão - ${typeOfPrize.label}. `}
                </p>
              </div>
            ) : (
              <div className="select-location">
                <p className="label-font">Selecione o tipo de produto.</p>
                <ReactSelect
                  placeholder="Selecionar..."
                  value={productSelected}
                  options={group?.stock.prizes.map(prize => {
                    return {
                      label: prize.label,
                      value: prize.id,
                    };
                  })}
                  onChange={e => {
                    if (e) {
                      setProductSelected({ label: e.label, value: e.value });
                    }
                  }}
                />
              </div>
            )}
            {productSelected.value !== '' ? (
              <>
                <InputContainer
                  isFocused={isFocused}
                  style={{ marginTop: '2rem' }}
                >
                  <label htmlFor="amount">
                    <p>
                      Quanto deseja retirar deste produto, para retornar ao seu
                      estoque?
                    </p>
                    <div>
                      <input
                        onFocus={() => {
                          setIsFocused(true);
                        }}
                        onBlur={() => {
                          setIsFocused(false);
                        }}
                        type="number"
                        id="amount"
                        onChange={e => {
                          setAmount(parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </label>
                </InputContainer>
                <div className="transfer-btn">
                  <Button
                    title="Cancelar"
                    color="tertiary"
                    callback={() => togglePrizeRecover(undefined)}
                  />
                  <Button
                    title="Resgatar"
                    color="primary"
                    callback={() => handlePrizeRecover('GROUP')}
                    busy={busyBtn}
                  />
                </div>
              </>
            ) : null}
          </>
        )}

        {/* OPERATOR ROLE */}
        {user?.role === 'OPERATOR' && (
          <>
            {typeOfPrize ? (
              <div className="select-location">
                <p className="label-font">
                  {`Esta máquina possui o produto padrão - ${typeOfPrize.label}. `}
                </p>
              </div>
            ) : (
              <div className="select-location">
                <p className="label-font">Selecione o tipo de produto.</p>
                <ReactSelect
                  placeholder="Selecionar..."
                  value={productSelected}
                  options={user.stock?.prizes.map(prize => {
                    return {
                      label: prize.label,
                      value: prize.id,
                    };
                  })}
                  onChange={e => {
                    if (e) {
                      setProductSelected({ label: e.label, value: e.value });
                    }
                  }}
                />
              </div>
            )}
            {productSelected.value !== '' ? (
              <>
                <InputContainer
                  isFocused={isFocused}
                  style={{ marginTop: '2rem' }}
                >
                  <label htmlFor="amount">
                    <p>
                      Quanto deseja retirar deste produto, para retornar ao seu
                      estoque pessoal?
                    </p>
                    <div>
                      <input
                        onFocus={() => {
                          setIsFocused(true);
                        }}
                        onBlur={() => {
                          setIsFocused(false);
                        }}
                        type="number"
                        id="amount"
                        onChange={e => {
                          setAmount(parseFloat(e.target.value));
                        }}
                      />
                    </div>
                  </label>
                </InputContainer>
                <div className="transfer-btn">
                  <Button
                    title="Cancelar"
                    color="tertiary"
                    callback={() => togglePrizeRecover(undefined)}
                  />
                  <Button
                    title="Resgatar"
                    color="primary"
                    callback={() => handlePrizeRecover('USER')}
                    busy={busyBtn}
                  />
                </div>
              </>
            ) : null}
          </>
        )}

        {/* MANAGER ROLE */}
        {user?.role === 'MANAGER' && (
          <>
            {firstStep ? (
              <>
                {typeOfPrize ? (
                  <div className="select-location">
                    <p className="label-font">
                      {`Esta máquina possui o produto padrão - ${typeOfPrize.label}. `}
                    </p>
                  </div>
                ) : (
                  <div className="select-location">
                    <p className="label-font">Selecione o tipo de produto.</p>
                    {firstStep === 'GROUP' ? (
                      <ReactSelect
                        placeholder="Selecionar..."
                        value={productSelected}
                        options={group?.stock.prizes.map(prize => {
                          return {
                            label: prize.label,
                            value: prize.id,
                          };
                        })}
                        onChange={e => {
                          if (e) {
                            setProductSelected({
                              label: e.label,
                              value: e.value,
                            });
                          }
                        }}
                      />
                    ) : (
                      <ReactSelect
                        placeholder="Selecionar..."
                        value={productSelected}
                        options={user.stock?.prizes.map(prize => {
                          return {
                            label: prize.label,
                            value: prize.id,
                          };
                        })}
                        onChange={e => {
                          if (e) {
                            setProductSelected({
                              label: e.label,
                              value: e.value,
                            });
                          }
                        }}
                      />
                    )}
                  </div>
                )}

                {productSelected.value !== '' ? (
                  <>
                    <InputContainer
                      isFocused={isFocused}
                      style={{ marginTop: '2rem' }}
                    >
                      <label htmlFor="amount">
                        <p>
                          Quanto deseja retirar deste produto, para retornar ao
                          seu estoque?
                        </p>
                        <div>
                          <input
                            onFocus={() => {
                              setIsFocused(true);
                            }}
                            onBlur={() => {
                              setIsFocused(false);
                            }}
                            type="number"
                            id="amount"
                            onChange={e => {
                              setAmount(parseFloat(e.target.value));
                            }}
                          />
                        </div>
                      </label>
                    </InputContainer>
                    <div className="transfer-btn">
                      <Button
                        title="Cancelar"
                        color="tertiary"
                        callback={() => setFirstStep(undefined)}
                        busy={busyBtn}
                      />
                      <Button
                        title="Resgatar"
                        color="primary"
                        callback={() =>
                          handlePrizeRecover(
                            firstStep === 'GROUP' ? 'GROUP' : 'USER',
                          )
                        }
                        busy={busyBtn}
                      />
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="choose-stock">
                <h2>Selecione qual estoque deseja utilizar para Resgatar.</h2>
                <div className="grid">
                  <Button
                    title="Estoque da parceria"
                    color="primary"
                    callback={() => setFirstStep('GROUP')}
                  />
                  <Button
                    title="Estoque pessoal"
                    color="secondary"
                    callback={() => setFirstStep('PERSONAL')}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </PrizeRecoverInMachineContainer>
      <ContainerWithOpacity
        showContainer={() => togglePrizeRecover(undefined)}
      />
    </>
  );
};
export default PrizeRecoverInMachine;
