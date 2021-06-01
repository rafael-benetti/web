/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../entiti/user';
import { SingleManagerContainer } from '../styles/components/single-manager';
import profileImg from '../assets/profile.jpg';

interface Props {
  data: User;
  user?: User;
}

const SingleManager: React.FC<Props> = ({ data, user }) => {
  return (
    <SingleManagerContainer>
      <Link
        to={{
          pathname: `${
            user?.permissions?.createManagers || user?.role === 'OWNER'
              ? '/handle-manager'
              : '/managers'
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
    </SingleManagerContainer>
  );
};
export default SingleManager;
