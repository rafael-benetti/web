/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { useUser } from '../hooks/user';
import {
  ChangePasswordContainer,
  Content,
} from '../styles/pages/change-password';

const ChangePasswordPage: React.FC = () => {
  const [, token] = window.location.search.split('=');
  // hooks
  const { resetPassword } = useUser();

  useEffect(() => {
    (async () => {
      await resetPassword(token);
    })();
  }, []);

  return (
    <ChangePasswordContainer>
      <img src={Logo} alt="Logo Sttigma" />
      <Content>
        <div className="back">
          <Link to="/">
            <FiArrowLeft />
            <h1>Voltar</h1>
          </Link>
        </div>
        <h1 className="confirmed">Seu email foi confirmado!</h1>
        <p className="text">Enviamos sua nova senha no seu e-mail.</p>
      </Content>
      <div className="responsible-space" />
    </ChangePasswordContainer>
  );
};
export default ChangePasswordPage;
