import React from 'react';

import Button from '../components/button';
import { Content, LoginPageContainer } from '../styles/pages/login';
import Logo from '../assets/logo.png';

const LoginPage: React.FC = () => {
  return (
    <LoginPageContainer>
      <img src={Logo} alt="Logo Sttigma" />
      <Content>
        <Button
          title="Entrar"
          color="primary"
          callback={() => window.location.reload()}
        />
      </Content>
      <div className="responsible-space" />
    </LoginPageContainer>
  );
};
export default LoginPage;
