/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import { SingleMachineInRouteContainer } from '../styles/components/single-machine-in-route';
import { Machine } from '../entiti/machine';

interface Props {
  machine?: Machine;
}

const SingleMachineInRoute: React.FC<Props> = ({ machine }) => {
  return (
    <SingleMachineInRouteContainer>
      <Link to={{ pathname: '/detalhes-da-maquina', state: machine?.id || '' }}>
        <button type="button">
          <div className="serial-number">{machine?.serialNumber || '-'}</div>
          <div className="city">{`${machine?.categoryLabel || ''}`}</div>
          <div className="group">
            {machine?.pointOfSale?.label || 'Estoque'}
          </div>
          <div className="street">
            {`${
              machine?.lastCollection &&
              format(
                new Date(machine.lastCollection),
                `dd'-'MM'-'yy 'às' H:mm`,
                {
                  locale: ptLocale,
                },
              )
            }`}
          </div>
        </button>
      </Link>
    </SingleMachineInRouteContainer>
  );
};
export default SingleMachineInRoute;
