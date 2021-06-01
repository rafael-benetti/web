/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Input from './input';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import { useMachine } from '../hooks/machine';
import { FixMachineStockContainer } from '../styles/components/fix-machine-stock';
import { BoxInfo } from '../entiti/machine-info';
import { FixMachineStockDto } from '../dto/fix-machine-stock';
import getValidationErrors from '../utils/getValidationErrors';

interface Props {
  machineId?: string;
  box: BoxInfo;
  index: number;
}

const FixMachineStock: React.FC<Props> = ({ box, machineId, index }) => {
  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { toggleFixMachineStock, fixMachineStock } = useMachine();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);

  const handleEditRent = useCallback(
    async (data: Omit<FixMachineStockDto, 'boxId'>) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          quantity: Yup.number()
            .required('Insira um valor')
            .positive('Não é possível inserir valor negativo'),
          observations: Yup.string().required('Insira o motivo desta correção'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        setBusyBtn(false);
        if (machineId && box.boxId) {
          await fixMachineStock(
            {
              boxId: box.boxId,
              quantity: data.quantity,
              observations: data.observations,
            },
            machineId,
          );
        }
        toggleFixMachineStock(undefined, true);
        setBusyBtn(false);
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
      <FixMachineStockContainer>
        <h1>{`Corrigir estoque da Cabine ${index + 1}`}</h1>
        <Form ref={formRef} onSubmit={handleEditRent}>
          <p style={{ marginBottom: '2rem' }}>
            Insira o valor atual do estoque da cabine selecionada e o motivo
            desta correção.
          </p>
          <div className="first-input">
            <Input name="quantity" type="number" label="Valor" />
          </div>
          <Input name="observations" type="text" label="Motivo" />
          <div className="btn">
            <Button
              color="tertiary"
              title="Cancelar"
              callback={() => toggleFixMachineStock(undefined)}
            />
            <Button color="primary" title="Corrigir" busy={busyBtn} isSubmit />
          </div>
        </Form>
      </FixMachineStockContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleFixMachineStock(undefined);
        }}
      />
    </>
  );
};
export default FixMachineStock;
