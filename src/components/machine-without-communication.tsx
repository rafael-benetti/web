// eslint-disable-next-line import/no-duplicates
import { differenceInDays } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MachineWithoutCommunicationContainer } from '../styles/components/machine-without-communication';

interface Props {
  machine?: string;
  group?: string | number;
  time?: Date | number;
  machineId?: string;
  isPoint?: boolean;
}

const MachineWithoutCommunication: React.FC<Props> = ({
  machine,
  group,
  time,
  machineId,
  isPoint,
}) => {
  const timeRange = useCallback((timeData: Date | undefined) => {
    if (timeData) {
      return differenceInDays(new Date(), new Date(timeData));
    }
    return 0;
  }, []);

  return (
    <MachineWithoutCommunicationContainer>
      <Link
        to={
          isPoint
            ? { pathname: 'single-point-of-sale', state: machineId }
            : { pathname: 'single-machine', state: machineId }
        }
      >
        <button className="edit-btn" type="button">
          <div className="label">{`${machine || 'BT001'}`}</div>
          {typeof group === 'string' ? (
            <div className="center">{`${group || 'Parceria pessoal'}`}</div>
          ) : (
            <div className="center">{`${group || '-'}`}</div>
          )}
          {typeof time === 'number' ? (
            <div className="right">
              {isPoint
                ? `${
                    time.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    }) || '0,00'
                  }`
                : `${time}`}
            </div>
          ) : (
            <div className="right">
              {`${timeRange(time)} ${timeRange(time) > 1 ? 'dias' : 'dia'}`}
            </div>
          )}
        </button>
      </Link>
    </MachineWithoutCommunicationContainer>
  );
};
export default MachineWithoutCommunication;
