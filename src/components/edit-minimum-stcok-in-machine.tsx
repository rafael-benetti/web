/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Input from './input';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import { EditMinimumStockInMachineContainer } from '../styles/components/edit-minimum-stcok-in-machine';
import { useMachine } from '../hooks/machine';

interface Props {
  minimumStock: string;
  machineId?: string;
}

const EditMinimumStockInMachine: React.FC<Props> = ({
  minimumStock,
  machineId,
}) => {
  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { toggleEditMinimumStock, minimumPrizeCount } = useMachine();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [minimumPrizeCountData, setMinimumPrizeCountData] = useState<string>(
    minimumStock || '',
  );

  const handleEditRent = useCallback(async () => {
    setBusyBtn(true);
    try {
      await minimumPrizeCount(minimumPrizeCountData, machineId!);
      setBusyBtn(false);
      toggleEditMinimumStock(false, true);
    } catch (error) {
      setBusyBtn(false);
    }
  }, [minimumPrizeCountData]);

  return (
    <>
      <EditMinimumStockInMachineContainer>
        <h1>Editar estoque mínimo.</h1>
        <Form ref={formRef} onSubmit={handleEditRent}>
          <div className="rent-input">
            <Input
              name="minimumStock"
              type="number"
              defaultValue={minimumStock}
              onChange={e => setMinimumPrizeCountData(e.target.value)}
            />
          </div>
          <div className="btn">
            <Button
              color="tertiary"
              title="Cancelar"
              callback={() => toggleEditMinimumStock(false)}
            />
            <Button color="primary" title="Continuar" busy={busyBtn} isSubmit />
          </div>
        </Form>
      </EditMinimumStockInMachineContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleEditMinimumStock(false);
        }}
      />
    </>
  );
};
export default EditMinimumStockInMachine;
