/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../entiti/user';
import { SinglePointInRouteContainer } from '../styles/components/single-point-in-route';
import { PointOfSale } from '../entiti/point-of-sales';

interface Props {
  pointOfSale?: PointOfSale;
  user?: User;
}

const SinglePointInRoute: React.FC<Props> = ({ pointOfSale, user }) => {
  return (
    <SinglePointInRouteContainer>
      {user?.role === 'OPERATOR' ? (
        <button type="button">
          <div className="serial-number">{pointOfSale?.label}</div>
          <div className="group">
            {pointOfSale?.group.label || 'Parceria pessoal'}
          </div>
          <div className="city">{`${pointOfSale?.address.city} - ${pointOfSale?.address.state}`}</div>
          <div className="street">{`${pointOfSale?.address.street}, ${pointOfSale?.address.number}`}</div>
        </button>
      ) : (
        <Link
          to={{
            pathname: '/detalhes-do-ponto-de-venda',
            state: pointOfSale?.id,
          }}
        >
          <button type="button">
            <div className="serial-number">{pointOfSale?.label}</div>
            <div className="group">
              {pointOfSale?.group.label || 'Parceria pessoal'}
            </div>
            <div className="city">{`${pointOfSale?.address.city} - ${pointOfSale?.address.state}`}</div>
            <div className="street">{`${pointOfSale?.address.street}, ${pointOfSale?.address.number}`}</div>
          </button>
        </Link>
      )}
    </SinglePointInRouteContainer>
  );
};
export default SinglePointInRoute;
