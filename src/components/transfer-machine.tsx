/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { MachineInfo } from '../entiti/machine-info';
import { useGroup } from '../hooks/group';
import { useMachine } from '../hooks/machine';
import { usePointOfSale } from '../hooks/point-of-sale';
import {
  TransferMachineContainer,
  NavBar,
  TransferToLocation,
  TransferToGroup,
} from '../styles/components/transfer-machine';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';

interface Props {
  machineInfo?: MachineInfo;
}

const TransferMachine: React.FC<Props> = ({ machineInfo }) => {
  // hooks
  const { getPointsOfSale, pointsOfSale } = usePointOfSale();
  const { getGroups, groups } = useGroup();
  const { toggleTransferMachine, transferMachine } = useMachine();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [transferType, setTransferType] = useState<'POINT_OF_SALE' | 'GROUP'>(
    'POINT_OF_SALE',
  );
  const [locationSelected, setLocationSelected] = useState<{
    label: string;
    value: string;
  }>({
    label: machineInfo?.machine.pointOfSale?.label || 'Estoque',
    value: machineInfo?.machine.pointOfSale?.id || 'stock',
  });
  const [groupSelected, setGroupSelected] = useState<{
    label: string;
    value: string;
  }>({
    label: machineInfo?.machine.group?.label || '',
    value: machineInfo?.machine.group?.id || '',
  });

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getPointsOfSale(undefined, undefined);
      await getGroups();
      await setBusy(false);
    })();
  }, []);

  const handleTransferMachine = useCallback(async () => {
    setBusyBtn(true);
    try {
      if (machineInfo) {
        if (locationSelected) {
          if (locationSelected.value === 'stock') {
            await transferMachine({ locationId: null }, machineInfo.machine.id);
            setBusyBtn(false);
            toggleTransferMachine(false, true);
            return;
          }
          await transferMachine(
            { locationId: locationSelected.value },
            machineInfo.machine.id,
          );
        }
      }
      setBusyBtn(false);
      toggleTransferMachine(false, true);
    } catch (error) {
      setBusyBtn(false);
    }
  }, [locationSelected]);

  const handleTransferMachineToGroup = useCallback(async () => {
    setBusyBtn(true);
    try {
      if (machineInfo) {
        if (groupSelected) {
          await transferMachine(
            { groupId: groupSelected.value },
            machineInfo.machine.id,
          );
        }
      }
      setBusyBtn(false);
      toggleTransferMachine(false, true);
    } catch (error) {
      setBusyBtn(false);
    }
  }, [groupSelected]);

  return (
    <>
      <TransferMachineContainer>
        <h1 className="title">{`Transferir máquina - ${machineInfo?.machine.serialNumber}`}</h1>
        <NavBar active={transferType}>
          <button
            type="button"
            className="location"
            onClick={() => {
              setTransferType('POINT_OF_SALE');
            }}
          >
            <h1 className="side-bar-secondary-font">Ponto de venda</h1>
          </button>
          <button
            type="button"
            className="group"
            onClick={() => {
              setTransferType('GROUP');
            }}
          >
            <h1 className="side-bar-secondary-font">Parceria</h1>
          </button>
        </NavBar>
        {transferType === 'POINT_OF_SALE' ? (
          <TransferToLocation>
            {machineInfo &&
            machineInfo.boxesInfo.find(box => box.currentMoney > 0) &&
            machineInfo.machine.locationId !== undefined ? (
              <>
                <h2 className="warning">
                  Uma máquina não pode ser transferida com dinheiro em alguma
                  das cabines. Para tranferi-la realize uma coleta.
                </h2>
                <div className="collect-btn">
                  <Button
                    title="Entendi!"
                    color="primary"
                    callback={() => toggleTransferMachine(false)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="select-location">
                  <p className="label-font">Selecionar ponto de venda</p>
                  <ReactSelect
                    placeholder="Selecionar..."
                    value={locationSelected}
                    options={[
                      { label: 'Estoque', value: 'stock' },
                      ...pointsOfSale.map(point => {
                        return {
                          label: point.label,
                          value: point.id,
                        };
                      }),
                    ]}
                    onChange={e => {
                      if (e) {
                        setLocationSelected({ label: e.label, value: e.value });
                      }
                    }}
                  />
                </div>
                <div className="transfer-btn">
                  <Button
                    title="Transferir"
                    color="primary"
                    callback={() => handleTransferMachine()}
                  />
                </div>
              </>
            )}
          </TransferToLocation>
        ) : (
          <>
            <TransferToGroup>
              {machineInfo &&
              (machineInfo.boxesInfo.find(box => box.currentMoney > 0) ||
                machineInfo.boxesInfo.find(
                  box => box.currentPrizeCount > 0,
                )) ? (
                <>
                  <h2 className="warning">
                    Uma máquina não pode ser transferida para outra parceria com
                    dinheiro ou prêmio em alguma das cabines. Para tranferi-la
                    realize uma coleta e esvazie o estoque da máquina.
                  </h2>
                  <div className="collect-btn">
                    <Button
                      title="Entendi!"
                      color="primary"
                      callback={() => toggleTransferMachine(false)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="select-location">
                    <h2 style={{ textAlign: 'start', margin: '2rem 0' }}>
                      Ao transferir uma máquina para outra parceria, esta
                      máquina irá automaticamente para o estoque da parceria,
                      ficará sem operador responsável, sem telemetria, sem
                      estoque mínimo e sem tipo de produto.
                    </h2>
                    <p className="label-font">Selecionar uma parceria.</p>
                    <ReactSelect
                      placeholder="Selecionar..."
                      value={groupSelected}
                      options={groups.map(group => {
                        return {
                          label: group.label,
                          value: group.id,
                        };
                      })}
                      onChange={e => {
                        if (e) {
                          setGroupSelected({
                            label: e.label,
                            value: e.value,
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="transfer-btn">
                    <Button
                      title="Transferir"
                      color="primary"
                      callback={() => handleTransferMachineToGroup()}
                    />
                  </div>
                </>
              )}
            </TransferToGroup>
          </>
        )}
      </TransferMachineContainer>
      <ContainerWithOpacity
        showContainer={() => toggleTransferMachine(false)}
      />
    </>
  );
};
export default TransferMachine;
