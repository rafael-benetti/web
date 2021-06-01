import React from 'react';
import { FiHardDrive } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Group } from '../entiti/group';
import { Machine } from '../entiti/machine';
import {
  MachineItemContainer,
  MachineItemTable,
} from '../styles/components/machine-item';

interface Props {
  machine: Machine;
  groups: Group[];
  isGridView: boolean;
}

const MachineItem: React.FC<Props> = ({ machine, groups, isGridView }) => {
  return (
    <>
      {isGridView ? (
        <MachineItemContainer>
          <Link to={{ pathname: 'single-machine', state: machine.id }}>
            <div className="row">
              <h1 className="group heading-secondary-font">
                {groups.find(group => group.id === machine.groupId)?.isPersonal
                  ? 'Parceria pessoal'
                  : groups.find(group => group.id === machine.groupId)?.label}
              </h1>
              <FiHardDrive />
            </div>
            <div className="row">
              <h1 className="label ">{machine.serialNumber}</h1>
              <h1 className="category ">{machine.categoryLabel}</h1>
            </div>
          </Link>
        </MachineItemContainer>
      ) : (
        <Link
          to={{ pathname: 'single-machine', state: machine.id }}
          style={{ textDecoration: 'none', color: '#333' }}
        >
          <MachineItemTable>
            <div className="label">{machine.serialNumber}</div>
            <div className="group">
              {machine.group?.label ? machine.group?.label : 'Parceria pessoal'}
            </div>
            <div className="quantity">{machine.categoryLabel}</div>
          </MachineItemTable>
        </Link>
      )}
    </>
  );
};
export default MachineItem;
