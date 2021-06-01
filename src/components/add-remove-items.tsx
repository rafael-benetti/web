import React, { useCallback, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { ClipLoader } from 'react-spinners';
import { useStock } from '../hooks/stock';
import Input from './input';
import { AddRemoveItemsContainer } from '../styles/components/add-remove-items';
import ContainerWithOpacity from './container-with-opacity';
import getValidationErrors from '../utils/getValidationErrors';
import { StockItem } from '../entiti/stock-item';
import { HandleAddProductDto } from '../dto/handle-add-product';

interface Props {
  prize?: StockItem;
  supply?: StockItem;
  isAdd: boolean;
}

const AddRemoveItems: React.FC<Props> = ({ prize, supply, isAdd }) => {
  // refs
  const formRef = useRef<FormHandles>(null);

  // hooks
  const {
    toggleAddItems,
    toggleRemoveItems,
    addProduct,
    removeProduct,
  } = useStock();

  // state
  const [productAmount, setProductAmount] = useState(0);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);

  const handleProduct = useCallback(
    async (data: { quantity: number; cost: number }) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          quantity: Yup.number().required(
            'É necessário inserir uma quantidade',
          ),
          cost: Yup.number()
            .required('É necessário inserir um valor')
            .positive('Não é permitido valor negativo'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        if (isAdd) {
          if (prize) {
            const addPrizeData: HandleAddProductDto = {
              cost: data.cost,
              groupId: prize.ownerId,
              quantity: data.quantity,
              type: 'PRIZE',
            };
            await addProduct(addPrizeData, prize.id);
          }
          if (supply) {
            const addSupplyData: HandleAddProductDto = {
              cost: data.cost,
              groupId: supply.ownerId,
              quantity: data.quantity,
              type: 'SUPPLY',
            };
            await addProduct(addSupplyData, supply.id);
          }
        }
        if (!isAdd) {
          if (prize) {
            const addPrizeData: HandleAddProductDto = {
              cost: data.cost,
              groupId: prize.ownerId,
              quantity: data.quantity,
              type: 'PRIZE',
            };
            await removeProduct(addPrizeData, prize.id);
          }
          if (supply) {
            const addSupplyData: HandleAddProductDto = {
              cost: data.cost,
              groupId: supply.ownerId,
              quantity: data.quantity,
              type: 'SUPPLY',
            };
            await removeProduct(addSupplyData, supply.id);
          }
        }
        setBusyBtn(false);
        toggleAddItems(undefined);
      } catch (error) {
        setBusyBtn(false);
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [],
  );

  return (
    <>
      <AddRemoveItemsContainer>
        <h1>
          {isAdd
            ? `Adicionar ${prize ? 'Produto' : 'Suprimento'}`
            : `Remover ${prize ? 'Produto' : 'Suprimento'}`}
        </h1>
        <h2>{prize ? prize.label : supply?.label}</h2>
        <Form ref={formRef} onSubmit={handleProduct}>
          <p className="label-font">Quantidade: </p>
          <div className="amount">
            <button
              type="button"
              className="minus-plus-btn"
              onClick={() => {
                if (productAmount > 0) {
                  setProductAmount(productAmount - 1);
                }
              }}
            >
              <FiMinus />
            </button>
            <Input
              name="quantity"
              type="text"
              value={productAmount.toString()}
              onChange={e => {
                setProductAmount(parseFloat(e.target.value) || 0);
              }}
            />

            <button
              className="minus-plus-btn"
              type="button"
              onClick={() => {
                setProductAmount(productAmount + 1);
              }}
            >
              <FiPlus />
            </button>
          </div>

          <Input name="cost" type="number" placeholder="R$" label="Preço" />
          {isAdd ? (
            <button className="add-btn" type="submit">
              {busyBtn ? <ClipLoader color="#fff" size={14} /> : 'Adicionar'}
            </button>
          ) : (
            <button className="remove-btn" type="submit">
              {busyBtn ? <ClipLoader color="#fff" size={14} /> : 'Remover'}
            </button>
          )}
        </Form>
      </AddRemoveItemsContainer>
      <ContainerWithOpacity
        showContainer={() => {
          if (isAdd) {
            toggleAddItems(undefined);
          } else {
            toggleRemoveItems(undefined);
          }
        }}
      />
    </>
  );
};
export default AddRemoveItems;
