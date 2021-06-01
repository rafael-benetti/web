import React, { useCallback, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Input from './input';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import {
  CreateStockItemContainer,
  NavBar,
} from '../styles/components/create-stock-item';
import getValidationErrors from '../utils/getValidationErrors';
import { useStock } from '../hooks/stock';
import { CreateProductDto } from '../dto/create-product';
import { Group } from '../entiti/group';
import SelectInput from './select-input';
import { useToast } from '../hooks/toast';

interface Props {
  groups: Group[];
}

const CreateStockItem: React.FC<Props> = ({ groups }) => {
  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { createProduct, toggleCreateProduct } = useStock();
  const { addToast } = useToast();

  // state
  const [productType, setProductType] = useState<'PRIZE' | 'SUPPLY'>('PRIZE');
  const [busyBtn, setBusyBtn] = useState(false);

  const handleCreateProduct = useCallback(
    async (data: CreateProductDto) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          label: Yup.string().required('Insira um nome'),
          quantity: Yup.string().required('Insira uma quantidade'),
          cost: Yup.string().required('Insira um preço'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        if (!data.groupId) {
          addToast({
            title: 'Aviso',
            description:
              'Para criar um produto é necessário selecionar uma parceria',
            type: 'info',
          });
          setBusyBtn(false);

          return;
        }
        const createProductData: CreateProductDto = {
          cost: data.cost,
          groupId: data.groupId,
          label: data.label,
          quantity: data.quantity,
          type: productType,
        };
        await createProduct(createProductData);
        setBusyBtn(false);
        toggleCreateProduct(false);
      } catch (error) {
        setBusyBtn(false);
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [productType],
  );

  return (
    <>
      <CreateStockItemContainer>
        <h2 className="heading-secondary-font">Criar novo produto</h2>
        <NavBar active={productType}>
          <button
            type="button"
            className="prizes btns"
            onClick={() => {
              setProductType('PRIZE');
            }}
          >
            <h1 className="side-bar-secondary-font ">Prêmio</h1>
          </button>
          <button
            type="button"
            className="supplies btns"
            onClick={() => {
              setProductType('SUPPLY');
            }}
          >
            <h1 className="side-bar-secondary-font">Suprimento</h1>
          </button>
        </NavBar>
        <Form ref={formRef} onSubmit={handleCreateProduct}>
          <SelectInput
            label="Parceria"
            name="groupId"
            options={groups.map(group => {
              return {
                label: group.isPersonal ? 'Parceria pessoal' : group.label,
                value: group.id,
              };
            })}
          />
          <div className="label-input">
            <Input label="Nome" name="label" type="text" />
          </div>
          <div className="quantity-cost">
            <Input label="Quantidade" name="quantity" type="number" />
            <Input label="Preço" name="cost" type="number" />
          </div>
          <Button title="Salvar" color="primary" isSubmit busy={busyBtn} />
        </Form>
      </CreateStockItemContainer>
      <ContainerWithOpacity showContainer={() => toggleCreateProduct(false)} />
    </>
  );
};
export default CreateStockItem;
