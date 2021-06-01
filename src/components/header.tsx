/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { BsPerson } from 'react-icons/bs';
import { BiExit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { HeaderContainer, UserMenu } from '../styles/components/header';
import ProfileImg from '../assets/profile.jpg';
import { useUser } from '../hooks/user';
import { useAuth } from '../hooks/auth';

const Header: React.FC = () => {
  // hooks
  const { logOut } = useAuth();
  const { getUser, user } = useUser();

  // state
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getUser();
      setBusy(false);
    })();
  }, []);

  return (
    <HeaderContainer>
      <UserMenu>
        <div className="header-menu">
          <img
            src={
              user?.photo
                ? user?.photo.downloadUrl
                  ? user?.photo.downloadUrl
                  : ProfileImg
                : ProfileImg
            }
            alt="Perfil"
          />
          <div className="label">
            <h1>{user?.name}</h1>
            <p>
              {user?.email}
              <RiArrowDownSLine />
            </p>
          </div>
        </div>
        <div className="menu">
          <div className="menu-content">
            <Link to="/profile">
              <button type="button">
                <BsPerson size={15} />
                <span>Perfil</span>
              </button>
            </Link>
            <button
              type="button"
              onClick={() => {
                logOut();
              }}
            >
              <BiExit size={15} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </UserMenu>
    </HeaderContainer>
  );
};

export default Header;
