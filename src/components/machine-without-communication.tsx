/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-duplicates
import { formatDistance, differenceInMinutes } from 'date-fns';
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
  category?: string;
}

const MachineWithoutCommunication: React.FC<Props> = ({
  machine,
  group,
  time,
  machineId,
  isPoint,
  category,
}) => {
  const timeRange = useCallback((timeData: Date | undefined) => {
    let stringona = '';
    if (timeData) {
      let totalMinutes = differenceInMinutes(new Date(), new Date(timeData));
      const totalDays = Math.trunc(totalMinutes / 60 / 24);
      totalMinutes -= totalDays * 60 * 24;
      const totalHours = Math.trunc(totalMinutes / 60);
      totalMinutes -= totalHours * 60;
      if (totalDays > 0) {
        if (totalDays === 1) {
          stringona += `${totalDays} dia `;
        } else {
          stringona += `${totalDays} dias `;
        }
      }
      if (totalHours > 0) {
        if (totalHours === 1) {
          stringona += `${totalHours} hora `;
        } else {
          stringona += `${totalHours} horas `;
        }
      }
      if (totalMinutes > 0) {
        if (totalMinutes === 1) {
          stringona += `${totalMinutes} minuto`;
        } else {
          stringona += `${totalMinutes} minutos`;
        }
      }
    }
    return stringona;
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
          <div className="label">
            {`${machine || 'BT001'}`}
            {!isPoint && (
              <>
                <br />
                {`${category || '(a)'}`}
              </>
            )}
          </div>
          {typeof group === 'string' ? (
            <div className="center">{`${group || '-'}`}</div>
          ) : (
            <div className="center">
              {`${group === undefined ? '-' : group}`}
            </div>
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
