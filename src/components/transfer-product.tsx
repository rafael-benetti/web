/* eslint-disable no-nested-ternary */
import React, { useCallback, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FormHandles, Scope } from '@unform/core';
import { Form } from '@unform/web';
import Input from './input';
import { TransferProductDto } from '../dto/transfer-product';
import {
  NavBar,
  TransferProductContainer,
} from '../styles/components/tansfer-product';
import getValidationErrors from '../utils/getValidationErrors';
import ContainerWithOpacity from './container-with-opacity';
import { useStock } from '../hooks/stock';
import Button from './button';
import SelectInput from './select-input';
import { Group } from '../entiti/group';
import { User } from '../entiti/user';
import { StockItem } from '../entiti/stock-item';
import { useToast } from '../hooks/toast';

interface Props {
  prize?: StockItem;
  supply?: StockItem;
  personalPrize?: StockItem;
  personalSupply?: StockItem;
  isGroupStock: boolean;
  groups: Group[];
  operators: User[];
  managers: User[];
  isPersonal?: boolean;
}

const TransferProduct: React.FC<Props> = ({
  prize,
  supply,
  isGroupStock,
  groups,
  operators,
  managers,
  personalPrize,
  personalSupply,
  isPersonal,
}) => {
  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { toggleTransferProduct, trasferProduct } = useStock();
  const { addToast } = useToast();

  // state
  const [busyBtn, setBusyBtn] = useState(false);
  const [transferType, setTransferType] = useState<
    'GROUP' | 'MANAGER' | 'OPERATOR'
  >('GROUP');

  const handleTransfer = useCallback(
    async (data: TransferProductDto) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          productQuantity: Yup.string().required('Insira uma quantidade'),
          cost:
            transferType === 'GROUP' && !isPersonal
              ? Yup.string().required(
                  'Custo obrigatório. Caso não existir, insira o valor 0',
                )
              : Yup.object(),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        if (!data.to.id) {
          addToast({
            title: 'Atenção!',
            description: 'É necessário selecionar uma parceria',
            type: 'info',
          });
          return;
        }
        if (prize) {
          if (data.productQuantity > (prize.quantity || 0)) {
            addToast({
              title: 'Atenção!',
              description:
                'Não é possível transferir uma quantia maior do que existe no estoque',
              type: 'info',
            });
            return;
          }
          const prizeTransferData: TransferProductDto = {
            productQuantity: parseFloat(data.productQuantity.toString()),
            productType: 'PRIZE',
            cost: data.cost ? data.cost : undefined,
            from: {
              id: prize.ownerId,
              type: 'GROUP',
            },
            to: {
              id: data.to.id,
              type: transferType === 'GROUP' ? 'GROUP' : 'USER',
            },
          };
          await trasferProduct(prizeTransferData, prize.id);
          setBusyBtn(false);
          toggleTransferProduct(undefined);
        }
        if (supply) {
          if (data.productQuantity > (supply.quantity || 0)) {
            addToast({
              title: 'Atenção!',
              description:
                'Não é possível transferir uma quantia maior do que existe no estoque',
              type: 'info',
            });
            return;
          }
          const supplyTransferData: TransferProductDto = {
            productQuantity: parseFloat(data.productQuantity.toString()),
            productType: 'SUPPLY',
            cost: data.cost ? data.cost : undefined,
            from: {
              id: supply.ownerId,
              type: 'GROUP',
            },
            to: {
              id: data.to.id,
              type: transferType === 'GROUP' ? 'GROUP' : 'USER',
            },
          };
          await trasferProduct(supplyTransferData, supply.id);
          setBusyBtn(false);
          toggleTransferProduct(undefined);
        }
        if (personalPrize) {
          if (data.productQuantity > (personalPrize.quantity || 0)) {
            addToast({
              title: 'Atenção!',
              description:
                'Não é possível transferir uma quantia maior do que existe no estoque',
              type: 'info',
            });
            return;
          }
          const personalPrizeTransferData: TransferProductDto = {
            productQuantity: parseFloat(data.productQuantity.toString()),
            productType: 'PRIZE',
            cost: data.cost ? data.cost : undefined,
            from: {
              id: personalPrize.ownerId,
              type: 'USER',
            },
            to: {
              id: data.to.id,
              type: transferType === 'GROUP' ? 'GROUP' : 'USER',
            },
          };
          await trasferProduct(personalPrizeTransferData, personalPrize.id);
          setBusyBtn(false);
          toggleTransferProduct(undefined);
        }
        if (personalSupply) {
          if (data.productQuantity > (personalSupply.quantity || 0)) {
            addToast({
              title: 'Atenção!',
              description:
                'Não é possível transferir uma quantia maior do que existe no estoque',
              type: 'info',
            });
            return;
          }
          const personalSupplyTransferData: TransferProductDto = {
            productQuantity: parseFloat(data.productQuantity.toString()),
            productType: 'SUPPLY',
            cost: data.cost ? data.cost : undefined,
            from: {
              id: personalSupply.ownerId,
              type: 'USER',
            },
            to: {
              id: data.to.id,
              type: transferType === 'GROUP' ? 'GROUP' : 'USER',
            },
          };
          await trasferProduct(personalSupplyTransferData, personalSupply.id);
          setBusyBtn(false);
          toggleTransferProduct(undefined);
        }
      } catch (error) {
        setBusyBtn(false);
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [transferType],
  );

  return (
    <>
      <TransferProductContainer>
        <h2 className="heading-secondary-font">Transferir para</h2>
        <NavBar active={transferType}>
          <button
            type="button"
            className="prizes btns"
            onClick={() => {
              setTransferType('GROUP');
            }}
          >
            <h1 className="side-bar-secondary-font ">Parcerias</h1>
          </button>
          <button
            type="button"
            className="machines btns"
            onClick={() => {
              setTransferType('MANAGER');
            }}
          >
            <h1 className="side-bar-secondary-font">Colaborador</h1>
          </button>
          <button
            type="button"
            className="supplies btns"
            onClick={() => {
              setTransferType('OPERATOR');
            }}
          >
            <h1 className="side-bar-secondary-font">Operador</h1>
          </button>
        </NavBar>
        <Form ref={formRef} onSubmit={handleTransfer}>
          <Scope path="to">
            {transferType === 'GROUP' ? (
              <SelectInput
                name="id"
                label="Parceria"
                options={groups.map(group => {
                  return {
                    label: group.isPersonal ? 'Parceria pessoal' : group.label,
                    value: group.id,
                  };
                })}
              />
            ) : transferType === 'MANAGER' ? (
              <SelectInput
                name="id"
                label="Colaborador"
                options={managers.map(manager => {
                  return {
                    label: manager.name,
                    value: manager.id,
                  };
                })}
              />
            ) : (
              <SelectInput
                name="id"
                label="Operador"
                options={operators.map(operator => {
                  return {
                    label: operator.name,
                    value: operator.id,
                  };
                })}
              />
            )}
          </Scope>
          {!isPersonal ? (
            <div className="quantity-cost">
              <Input label="Quantidade" name="productQuantity" type="number" />
              {isGroupStock && transferType === 'GROUP' ? (
                <Input label="Preço por unidade" name="cost" type="number" />
              ) : null}
            </div>
          ) : (
            <div className="quantity-cost">
              <Input label="Quantidade" name="productQuantity" type="number" />
            </div>
          )}

          <Button title="Transferir" color="primary" isSubmit busy={busyBtn} />
        </Form>
      </TransferProductContainer>
      <ContainerWithOpacity
        showContainer={() => toggleTransferProduct(undefined)}
      />
    </>
  );
};
export default TransferProduct;
