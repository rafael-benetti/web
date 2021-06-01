/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react';
import ReactSelect from 'react-select';
import { Prize } from '../entiti/prize';
import { useMachine } from '../hooks/machine';

import { ChangeProductTypeInMachineContainer } from '../styles/components/change-product-type-in-machine';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';

interface Props {
  typeOfPrize?: Prize;
  prizes?: Prize[];
  machineId?: string;
}

const ChangeProductTypeInMachine: React.FC<Props> = ({
  typeOfPrize,
  prizes,
  machineId,
}) => {
  // hooks
  const { toggleChangeTypeOfPrize, editProductTypeInMachine } = useMachine();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [typeOfProductSelected, setTypeOfProductSelected] = useState<{
    value: string;
    label: string;
  }>({
    label: typeOfPrize?.label || 'Indefinido',
    value: typeOfPrize?.id || '',
  });

  return (
    <>
      <ChangeProductTypeInMachineContainer>
        <>
          <h1>Escolha uma máquina para realizar coleta.</h1>
          <div className="select-input">
            <ReactSelect
              placeholder="Selecionar..."
              value={typeOfProductSelected}
              options={
                prizes
                  ? [
                      { value: '', label: 'Indefinido' },
                      ...prizes.map(prize => {
                        return {
                          label: prize.label,
                          value: prize.id,
                        };
                      }),
                    ]
                  : [{ value: '', label: 'Indefinido' }]
              }
              onChange={e => {
                if (e) {
                  setTypeOfProductSelected({ value: e.value, label: e.label });
                }
              }}
            />
          </div>
          <div className="btn">
            <Button
              color="primary"
              title="Continuar"
              busy={busyBtn}
              callback={async () => {
                setBusyBtn(true);
                await editProductTypeInMachine(
                  typeOfProductSelected.value,
                  machineId!,
                );
                setBusyBtn(false);
                toggleChangeTypeOfPrize(false, true);
              }}
            />
          </div>
        </>
      </ChangeProductTypeInMachineContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleChangeTypeOfPrize(false);
        }}
      />
    </>
  );
};
export default ChangeProductTypeInMachine;
