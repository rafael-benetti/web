/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { TransferProductDto } from '../dto/transfer-product';
import { Group } from '../entiti/group';
import { BoxInfo } from '../entiti/machine-info';
import { Prize } from '../entiti/prize';
import { useMachine } from '../hooks/machine';
import { useToast } from '../hooks/toast';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import { TransferProductToBoxContainer } from '../styles/components/transfer-product-to-box';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';

interface Props {
  box: BoxInfo;
  index: number;
  group?: Group;
  machineId?: string;
  typeOfPrize?: Prize;
}

const TransferProductToBox: React.FC<Props> = ({
  box,
  index,
  group,
  machineId,
  typeOfPrize
}) => {
  // hooks
  const { getUser, user } = useUser();
  const { toggleTransferProductToBox, transferProductToMachine } = useMachine();
  const { addToast } = useToast();

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

  const handleTranserProduct = useCallback(
    async (type: 'GROUP' | 'USER') => {
      setBusyBtn(true);
      try {
          if(type === 'GROUP') {
            if(amount > group?.stock.prizes.find(
              prize => prize.id === productSelected.value,
            )?.quantity! ){
              addToast({title: 'Aviso!', description: 'Quantidade insuficiente de produtos', type: 'info'})
              return
            }
          }
          if(type === 'USER') {
            if(amount > user?.stock?.prizes.find(
              prize => prize.id === productSelected.value,
            )?.quantity! ){
              addToast({title: 'Aviso!', description: 'Quantidade insuficiente de produtos', type: 'info'})
              return
            }
          }
          if(amount < 0) {
            addToast({title: 'Aviso!', description: 'Não é possível inserir valor negativo', type: 'info'})
              return
          }
          if(!amount) {
            addToast({title: 'Aviso!', description: 'É necessário inserir um valor', type: 'info'})
              return
          }
        const transferData: TransferProductDto = {
          productType: 'PRIZE',
          productQuantity: amount,
          from: {
            id: (type === 'GROUP' ? group?.id : user?.id) || '',
            type: type === 'GROUP' ? 'GROUP' : 'USER',
          },
          to: {
            id: machineId || '',
            type: 'MACHINE',
            boxId: box.boxId,
          },
        };
        await transferProductToMachine(transferData, productSelected.value);
        setBusyBtn(false);
        toggleTransferProductToBox(undefined, true)
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
      if(typeOfPrize) {
        setProductSelected({label: typeOfPrize.label, value: typeOfPrize.id})
      }
    })();
  }, []);

  useEffect(() => {
      if(typeOfPrize) {
        setProductSelected({label: typeOfPrize.label, value: typeOfPrize.id})
      }
  }, [])

  return (
    <>
      <TransferProductToBoxContainer>
        <h1 className="title">{`Abastecendo cabine ${index + 1}`}</h1>
        {/* OWNER ROLE */}
        {user?.role === 'OWNER' && (
          <>
            {typeOfPrize ? (
              <div>
                <h1 className="heading-secondary-font">{`Produto padrão do tipo - ${typeOfPrize.label}`}</h1>
              </div>
             ): (
               <div className="select-location">
                 <p className="label-font">
                   Selecione o produto que deseja abastecer
                 </p>
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
                <h2 className="quantity">
                  {`Quantidade de produtos: ${
                    group?.stock.prizes.find(
                      prize => prize.id === productSelected.value,
                    )?.quantity
                  }`}
                </h2>
                <InputContainer isFocused={isFocused}>
                  <label htmlFor="amount">
                    <p>Quanto deseja abastecer?</p>
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
                    callback={() =>
                      toggleTransferProductToBox(undefined)}
                    busy={busyBtn}
                  />
                  <Button
                    title="Abastecer"
                    color="primary"
                    callback={() => handleTranserProduct('GROUP')}
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
              <div>
                <h1 className="heading-secondary-font">{`Produto padrão do tipo - ${typeOfPrize.label}`}</h1>
              </div>
             ): (
               <div className="select-location">
                 <p className="label-font">
                   Selecione o produto que deseja abastecer
                 </p>
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
                {user.stock?.prizes.find(prize => prize.id === productSelected.value) ? (
                  <>
                    <h2 className="quantity">
                      {`Quantidade de produtos: ${
                    user.stock?.prizes.find(
                      prize => prize.id === productSelected.value,
                    )?.quantity
                  }`}
                    </h2>
                    <InputContainer isFocused={isFocused}>
                      <label htmlFor="amount">
                        <p>Quanto deseja abastecer?</p>
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
                  </>
                ) : (<div style={{marginTop: '2rem'}}>Não existe este produto no seu estoque. Peça para algum colaborador da parceria para que te transfira este produto.</div>)}
                <div className="transfer-btn">
                  <Button
                    title="Cancelar"
                    color="tertiary"
                    callback={() =>
                      toggleTransferProductToBox(undefined)}
                    busy={busyBtn}
                  />
                  <Button
                    title="Abastecer"
                    color="primary"
                    callback={() => handleTranserProduct('USER')}
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
                  <div>
                    <h1 className="heading-secondary-font">{`Produto padrão do tipo - ${typeOfPrize.label}`}</h1>
                  </div>
             ): (
               <div className="select-location">
                 <p className="label-font">
                   Selecione o produto que deseja abastecer
                 </p>
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
                    {firstStep === 'GROUP' && (
                      <>
                        <h2 className="quantity">
                          {`Quantidade de produtos: ${
                          group?.stock.prizes.find(
                            prize => prize.id === productSelected.value,
                          )?.quantity
                        }`}
                        </h2>
                        <InputContainer isFocused={isFocused}>
                          <label htmlFor="amount">
                            <p>Quanto deseja abastecer?</p>
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
                      </>
                    )}
                    {firstStep === 'PERSONAL' && (
                      <>
                        {user.stock?.prizes.find(prize => prize.id === productSelected.value) ? (
                          <>
                            <h2 className="quantity">
                              {`Quantidade de produtos: ${
                           user.stock?.prizes.find(
                             prize => prize.id === productSelected.value,
                           )?.quantity
                         }`}
                            </h2>
                            <InputContainer isFocused={isFocused}>
                              <label htmlFor="amount">
                                <p>Quanto deseja abastecer?</p>
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
                          </>
                       ): (
                         <div style={{marginTop: '2rem'}}>Não existe este produto no seu estoque pessoal. Verifique no estoque da parceria.</div>
                       )}
                      </>
                    )}

                    <div className="transfer-btn">
                      <Button
                        title="Cancelar"
                        color="tertiary"
                        callback={() =>
                          setFirstStep(undefined)}
                        busy={busyBtn}
                      />
                      <Button
                        title="Abastecer"
                        color="primary"
                        callback={() =>
                          handleTranserProduct(
                            firstStep === 'GROUP' ? 'GROUP' : 'USER',
                          )}
                        busy={busyBtn}
                      />

                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="choose-stock">
                <h2>Selecione qual estoque deseja utilizar para abastecer.</h2>
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
      </TransferProductToBoxContainer>
      <ContainerWithOpacity
        showContainer={() => toggleTransferProductToBox(undefined)}
      />
    </>
  );
};
export default TransferProductToBox;
