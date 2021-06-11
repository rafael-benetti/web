// eslint-disable-next-line import/no-duplicates
import { formatDistance } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
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
      return formatDistance(new Date(), new Date(timeData), {
        locale: ptLocale,
      });
    }
    return 0;
  }, []);

  return (
    <MachineWithoutCommunicationContainer>
      <Link
        to={
          isPoint
            ? { pathname: 'detalhes-do-ponto-de-venda', state: machineId }
            : { pathname: 'detalhes-da-maquina', state: machineId }
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
            <div className="right">{`${timeRange(time)} `}</div>
          )}
        </button>
      </Link>
    </MachineWithoutCommunicationContainer>
  );
};
export default MachineWithoutCommunication;
