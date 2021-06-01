/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import { Link } from 'react-router-dom';
import { Collection } from '../entiti/collection';
import { User } from '../entiti/user';
import { SingleCollectionContainer } from '../styles/components/single-collection';

interface Props {
  collection?: Collection;
  user?: User;
}

const SingleCollection: React.FC<Props> = ({ collection, user }) => {
  return (
    <SingleCollectionContainer>
      <Link
        to={{
          pathname: `${
            user?.permissions?.editPointsOfSale || user?.role === 'OWNER'
              ? '/collection-info'
              : '/collections'
          }`,
          state: collection!.id,
        }}
      >
        <button className="edit-btn" type="button">
          <div className="data">
            {collection &&
              format(new Date(collection.date), `dd'-'MM'-'yy 'às' H:mm`, {
                locale: ptLocale,
              })}
          </div>
          <div className="serial-number">
            {collection?.machine.serialNumber}
          </div>
          <div className="location">{collection?.pointOfSale.label}</div>
          <div className="user center">{collection?.user.name}</div>
        </button>
      </Link>
    </SingleCollectionContainer>
  );
};
export default SingleCollection;
