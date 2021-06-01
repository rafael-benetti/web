/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../entiti/group';
import { User } from '../entiti/user';
import { SingleGroupContainer } from '../styles/components/single-group';

interface Props {
  data: Group;
  user?: User;
}

const SingleGroup: React.FC<Props> = ({ data, user }) => {
  return (
    <SingleGroupContainer>
      <Link to={{ pathname: '/detalhes-da-parceria', state: data.id }}>
        <button type="button" className="edit-btn">
          <h1 className="groups-name" style={{ textAlign: 'start' }}>
            {data.isPersonal ? 'Parceria Pessoal' : data.label}
          </h1>
        </button>
      </Link>
    </SingleGroupContainer>
  );
};

export default SingleGroup;
