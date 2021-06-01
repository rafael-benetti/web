/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import React, { useCallback, useState } from 'react';
import ReactSelect from 'react-select';

import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import { Group } from '../entiti/group';
import { TransferTelemetryContainer } from '../styles/components/transfer-telemetry';
import { Telemetry } from '../entiti/telemetry';
import { useToast } from '../hooks/toast';
import { useTelemetry } from '../hooks/telemetry';

interface Props {
  telemetry: Telemetry;
  groups: Group[];
}

const TransferTelemetry: React.FC<Props> = ({ groups, telemetry }) => {
  // hooks
  const { addToast } = useToast();
  const { transferTelemetry, toggleTransferTelemetry } = useTelemetry();

  // state
  const [busy, setBusy] = useState(false);
  const [groupId, setGroupId] = useState<string | undefined>();

  const handleTransferTelemetry = useCallback(async () => {
    setBusy(true);

    if (groupId === telemetry.groupId) {
      addToast({
        title: 'Aviso!',
        description:
          'Não é possível transferir uma telemetria para a mesma parceria',
        type: 'info',
      });
      return;
    }

    if (groupId) {
      await transferTelemetry(groupId, telemetry.id);
      setBusy(false);
      return;
    }

    addToast({
      title: 'Aviso!',
      description:
        'Para transferir uma telemetria é necessário selecionar uma parceria',
      type: 'info',
    });
  }, [groupId]);

  return (
    <>
      <TransferTelemetryContainer>
        <h1>Transferir Telemetria</h1>
        <div className="label-select">
          <p className="label-font">Parceria</p>
          <ReactSelect
            onChange={(e: any) => {
              setGroupId(e.value);
            }}
            options={
              groups &&
              groups.map(group => {
                return {
                  label: group.label,
                  value: group.id,
                };
              })
            }
          />
        </div>
        <Button
          title="Transferir"
          color="primary"
          isSubmit={false}
          busy={busy}
          callback={() => handleTransferTelemetry()}
        />
      </TransferTelemetryContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleTransferTelemetry(undefined);
        }}
      />
    </>
  );
};

export default TransferTelemetry;
