import React, { useCallback, useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { ClipLoader } from 'react-spinners';
import { PointOfSaleInfo } from '../entiti/point-of-sale-info';
import { useMachine } from '../hooks/machine';
import { usePointOfSale } from '../hooks/point-of-sale';
import { AddMachineInPointContainer } from '../styles/components/add-machine-in-point';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';

interface Props {
  pointOfSaleInfo?: PointOfSaleInfo;
}

const AddMachineInPoint: React.FC<Props> = ({ pointOfSaleInfo }) => {
  // hooks
  const { getMachines, machines, transferMachine } = useMachine();
  const { toggleActions } = usePointOfSale();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [machineId, setMachineId] = useState<string>('');

  const addToPoint = useCallback(async () => {
    setBusyBtn(true);
    try {
      await transferMachine(
        {
          groupId: pointOfSaleInfo?.pointOfSale.groupId,
          locationId: pointOfSaleInfo?.pointOfSale.id,
        },
        machineId,
      );
      setBusyBtn(false);
      toggleActions(undefined, true);
    } catch (error) {
      setBusyBtn(false);
    }
  }, [machineId]);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getMachines(
        undefined,
        {
          pointOfSaleId: null,
          groupId: pointOfSaleInfo?.pointOfSale.groupId,
        },
        true,
      );
      setBusy(false);
    })();
  }, []);

  return (
    <>
      <AddMachineInPointContainer>
        {!busy ? (
          <>
            <h1>Escolha uma máquina para adicionar neste ponto.</h1>
            <div className="select-input">
              <ReactSelect
                placeholder="Selecionar..."
                options={machines.map(machine => {
                  return {
                    label: machine.serialNumber,
                    value: machine.id,
                  };
                })}
                onChange={e => {
                  if (e) {
                    setMachineId(e.value);
                  }
                }}
              />
            </div>
            <div className="btn">
              <Button
                color="tertiary"
                title="Cancelar"
                callback={() => toggleActions(undefined)}
              />
              <Button
                color="primary"
                title="Continuar"
                busy={busyBtn}
                callback={() => addToPoint()}
              />
            </div>
          </>
        ) : (
          <div>
            <ClipLoader size={30} color="#00161d" />
          </div>
        )}
      </AddMachineInPointContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleActions(undefined);
        }}
      />
    </>
  );
};
export default AddMachineInPoint;
