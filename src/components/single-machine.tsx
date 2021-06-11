/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
import { differenceInMinutes } from 'date-fns';
import React, { useCallback } from 'react';
import { AiOutlineWifi } from 'react-icons/ai';
import { RiWifiOffLine } from 'react-icons/ri';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import { Category } from '../entiti/category';
import { Group } from '../entiti/group';
import { Machine } from '../entiti/machine';
import { PointOfSale } from '../entiti/point-of-sales';
import { Telemetry } from '../entiti/telemetry';
import { User } from '../entiti/user';
import { SingleMachineContainer } from '../styles/components/single-machine';

interface Props {
  machine: Machine;
  pointOfSale?: PointOfSale;
  group?: Group;
  category?: Category;
  isSingleGroup: boolean;
  user?: User;
  telemetry?: Telemetry;
}

const MachineInPoint: React.FC<Props> = ({
  machine,
  group,
  pointOfSale,
  category,
  isSingleGroup,
  telemetry,
}) => {
  const telemetryStatus = useCallback(
    (telemetryBoard: Telemetry | undefined) => {
      if (telemetryBoard) {
        if (!machine.lastConnection) {
          return <VscDebugDisconnect color="#333" />;
        }
        if (
          differenceInMinutes(new Date(), new Date(machine.lastConnection)) > 10
        ) {
          return <RiWifiOffLine color="#f73164" />;
        }
        return <AiOutlineWifi color="#228b22" />;
      }
      return '';
    },
    [],
  );

  return (
    <SingleMachineContainer>
      <Link to={{ pathname: '/detalhes-da-maquina', state: machine.id }}>
        <button className="edit-btn" type="button">
          <div className="serial-number">{machine.serialNumber}</div>
          {isSingleGroup ? null : group?.isPersonal ? (
            'Parceria pessoal'
          ) : (
            <div className="group">{group?.label || ''}</div>
          )}
          <div className="telemetry">
            {telemetryStatus(telemetry)}
            <p>{telemetry ? `STG-${telemetry.id}` : '-'}</p>
          </div>
          <div className="category">{machine.categoryLabel || ''}</div>
          {pointOfSale ? (
            <div className="location">{pointOfSale?.label || ''}</div>
          ) : (
            'Estoque'
          )}
        </button>
      </Link>
    </SingleMachineContainer>
  );
};
export default MachineInPoint;
