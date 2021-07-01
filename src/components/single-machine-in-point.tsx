/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-nested-ternary */
import React, { useCallback } from 'react';
// eslint-disable-next-line import/no-duplicates
import { differenceInMinutes, format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import { AiOutlineWifi } from 'react-icons/ai';
import { RiWifiOffLine } from 'react-icons/ri';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import { MachineInfo } from '../entiti/machine-info';
import { User } from '../entiti/user';
import { SingleMachineInPointContainer } from '../styles/components/single-machine-in-point';

interface Props {
  machineInfo?: MachineInfo;
  user?: User;
}

const SingleMachineInPoint: React.FC<Props> = ({ machineInfo }) => {
  const telemetryStatus = useCallback((lastConnection: Date | undefined) => {
    if (lastConnection) {
      if (differenceInMinutes(new Date(), new Date(lastConnection)) > 10) {
        return <RiWifiOffLine color="#f73164" />;
      }
      return <AiOutlineWifi color="#228b22" />;
    }
    return <VscDebugDisconnect color="#333" />;
  }, []);

  return (
    <SingleMachineInPointContainer>
      <Link
        to={{
          pathname: '/detalhes-da-maquina',
          state: machineInfo?.machine.id,
        }}
      >
        <button type="button">
          <div className="serial-number">
            {machineInfo?.machine.serialNumber}
          </div>
          <div className="telemetry">
            {machineInfo?.machine.telemetryBoardId
              ? telemetryStatus(machineInfo?.machine.lastConnection)
              : ''}
            <p>
              {machineInfo?.machine.telemetryBoardId
                ? `STG-${machineInfo?.machine.telemetryBoardId}`
                : 'Sem telemetria'}
            </p>
          </div>
          <div className="category">{machineInfo?.machine.categoryLabel}</div>
          <div className="lastCollection">
            {machineInfo?.machine.lastCollection
              ? format(
                  new Date(machineInfo.machine.lastCollection),
                  `dd'-'MM'-'yy 'às' H:mm`,
                  {
                    locale: ptLocale,
                  },
                )
              : 'Nunca coletada'}
          </div>
          <div className="value">
            R$
            {` ${
              machineInfo?.machine.boxes &&
              machineInfo?.machine.boxes
                .map(box => box.currentMoney)
                .reduce((acc, cur) => acc! + cur!, 0)
            } `}
          </div>
        </button>
      </Link>
    </SingleMachineInPointContainer>
  );
};
export default SingleMachineInPoint;
