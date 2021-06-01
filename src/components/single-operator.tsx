/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../entiti/user';
import { SingleOperatorContainer } from '../styles/components/single-operator';
import profileImg from '../assets/profile.jpg';

interface Props {
  data: User;
  user?: User;
}

const SingleOperator: React.FC<Props> = ({ data, user }) => {
  // hooks

  return (
    <SingleOperatorContainer>
      <Link
        to={{
          pathname: `${
            user?.permissions?.createOperators || user?.role === 'OWNER'
              ? '/handle-operator'
              : '/operators'
          }`,
          state: data,
        }}
      >
        <button className="edit-btn" type="button">
          <div className="avatar">
            <img
              src={
                data.photo
                  ? data.photo.downloadUrl
                    ? data?.photo.downloadUrl
                    : profileImg
                  : profileImg
              }
              alt=""
            />
          </div>
          <div className="name">{data.name}</div>
          <div className="email">{data.email}</div>
          <div className="phone-number">{data.phoneNumber}</div>
          <div className="active">{data.isActive ? 'Ativo' : 'Inativo'}</div>
        </button>
      </Link>
    </SingleOperatorContainer>
  );
};
export default SingleOperator;
