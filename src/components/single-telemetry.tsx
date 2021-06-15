import React, { useCallback } from 'react';
// eslint-disable-next-line import/no-duplicates
import { format, differenceInMinutes } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { RiWifiOffLine } from 'react-icons/ri';
import { AiOutlineWifi } from 'react-icons/ai';
import { Group } from '../entiti/group';
import { Telemetry } from '../entiti/telemetry';
import TransferTelemetry from './transfer-telemetry';
import { SingleTelemetryContainer } from '../styles/components/single-telemetry';
import { useTelemetry } from '../hooks/telemetry';
import ModalTelemetry from './modal-telemetry';
import { User } from '../entiti/user';

interface SingleTelemetryProps {
  telemetry: Telemetry;
  group?: Group;
  groups: Group[];
  user?: User;
}

const SingleTelemetry: React.FC<SingleTelemetryProps> = ({
  telemetry,
  group,
  groups,
  user,
}) => {
  // hooks
  const {
    showTransferTelemetry,
    toggleTransferTelemetry,
    showTelemetryModal,
    toggleTelemetryModal,
  } = useTelemetry();

  const boardStatus = useCallback(lastConnection => {
    if (!lastConnection) {
      return <VscDebugDisconnect color="#333" />;
    }
    if (differenceInMinutes(new Date(), new Date(lastConnection)) > 10) {
      return <RiWifiOffLine color="#f73164" />;
    }
    return <AiOutlineWifi color="#228b22" />;
  }, []);

  return (
    <>
      <SingleTelemetryContainer>
        <button
          className="edit-btn"
          type="button"
          onClick={() => {
            if (
              user?.permissions?.editGroups === true ||
              user?.role === 'OWNER'
            ) {
              if (telemetry.machineId) {
                toggleTelemetryModal(telemetry.id);
                return;
              }
              toggleTransferTelemetry(telemetry.id);
            }
          }}
        >
          <div className="status">{boardStatus(telemetry.lastConnection)}</div>
          <div className="code">{`STG-${telemetry.id}`}</div>
          <div className="group">{group?.label}</div>
          <div className="machine">
            {telemetry.machine?.serialNumber || '-'}
          </div>
          <div className="last-conection center">
            {telemetry.lastConnection
              ? `${format(
                  new Date(telemetry.lastConnection),
                  `dd'-'MM'-'yy 'às' H:mm`,
                  {
                    locale: ptLocale,
                  },
                )}`
              : '-'}
          </div>
        </button>
      </SingleTelemetryContainer>
      {showTransferTelemetry === telemetry.id ? (
        <TransferTelemetry groups={groups} telemetry={telemetry} />
      ) : null}
      {showTelemetryModal === telemetry.id ? (
        <ModalTelemetry
          telemetry={telemetry}
          title="Não é possível transferir"
          text={`A placa STG-${telemetry.id} se encontra vinculada a uma máquina`}
        />
      ) : null}
    </>
  );
};
export default SingleTelemetry;
