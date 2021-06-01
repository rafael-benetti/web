/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { differenceInMinutes } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import { ClipLoader } from 'react-spinners';
import { Machine } from '../entiti/machine';
import { useCollection } from '../hooks/collection';
import { useMachine } from '../hooks/machine';
import { useToast } from '../hooks/toast';
import { ChooseMachineToCollectContainer } from '../styles/components/choose-machine-to-collect';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';

const ChooseMachineToCollect: React.FC = () => {
  // hooks
  const { getMachines, machines } = useMachine();
  const { toggleNewCollection } = useCollection();
  const { addToast } = useToast();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [machineId, setMachineId] = useState<string>('');

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getMachines(undefined, undefined);
      setBusy(false);
    })();
  }, []);

  const machineToSelect: Machine[] = [];
   machines.forEach(machine => {
    if(machine.locationId !== undefined && differenceInMinutes(
      new Date(),
      new Date(machine.lastConnection),
    ) < 10) {
      machineToSelect.push(machine)
    }
  })

  return (
    <>
      <ChooseMachineToCollectContainer>
        {!busy ? (
          <>
            <h1>Escolha uma máquina para realizar coleta.</h1>
            <p>Coletas podem ser realizadas apenas em máquinas que estão online e em um ponto de venda.</p>
            <h2>Máquinas que estão online e em um ponto de venda:</h2>
            <div className="select-input">
              <ReactSelect
                placeholder="Selecionar..."
                options={machineToSelect.map(machine => {
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
              {machineId ? (
                <Link
                  to={{
                    pathname: '/criar-coleta',
                    state: {machine :machines.find(machine => machine.id === machineId), initialData: undefined} ,
                  }}
                >
                  <Button color="primary" title="Continuar" busy={busyBtn} />
                </Link>
              ) : (
                <Button
                  color="primary"
                  title="Continuar"
                  busy={busyBtn}
                  callback={() => addToast({
                  title: 'Atenção!',
                  description:
                    'Para continuar é necessário selecionar uma máquina',
                  type: 'info',
                })}
                />

              )}
            </div>
          </>
        ) : (
          <div>
            <ClipLoader size={30} color="#7366ff" />
          </div>
        )}
      </ChooseMachineToCollectContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleNewCollection(false);
        }}
      />
    </>
  );
};
export default ChooseMachineToCollect;
