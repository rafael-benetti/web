/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import { useMachine } from '../hooks/machine';
import { SetMaintenanceModeContainer } from '../styles/components/set-maintenance-mode';

interface Props {
  machineId?: string;
}

const SetMaintenanceMode: React.FC<Props> = ({ machineId }) => {
  // hooks
  const { toggleMaintenanceMode, setMaintenanceMode } = useMachine();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);

  return (
    <>
      <SetMaintenanceModeContainer>
        <h1>Ativar modo manutenção.</h1>
        <p>lembre q blablalblalblalballba</p>
        <div className="btn">
          <Button
            color="tertiary"
            title="Cancelar"
            callback={() => toggleMaintenanceMode(false)}
          />
          <Button
            color="primary"
            title="Continuar"
            busy={busyBtn}
            callback={async () => {
              setBusyBtn(true);
              if (machineId) {
                await setMaintenanceMode(true, machineId);
                setBusyBtn(false);
                toggleMaintenanceMode(false, true);
              }
              setBusyBtn(false);
            }}
          />
        </div>
      </SetMaintenanceModeContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleMaintenanceMode(false);
        }}
      />
    </>
  );
};
export default SetMaintenanceMode;
