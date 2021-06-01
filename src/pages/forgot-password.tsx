/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Button from '../components/button';
import Logo from '../assets/logo-login.png';
import { InputContainer } from '../styles/components/input';
import {
  ForgotPasswordContainer,
  Content,
} from '../styles/pages/forgot-password';
import { useUser } from '../hooks/user';

const ForgotPasswordPage: React.FC = () => {
  // hooks
  const { forgotPassword } = useUser();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();

  return (
    <ForgotPasswordContainer>
      <img src={Logo} alt="Logo Sttigma" />
      <Content>
        <div className="back">
          <Link to="/">
            <FiArrowLeft />
            <h1>Voltar</h1>
          </Link>
        </div>
        <div className="filter">
          <InputContainer isFocused={isFocused}>
            <label htmlFor="group-name">
              <p>Email para recuperar senha.</p>
              <div>
                <input
                  onFocus={() => {
                    setIsFocused(true);
                  }}
                  onBlur={() => {
                    setIsFocused(false);
                  }}
                  id="email"
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </label>
          </InputContainer>
        </div>
        <Button
          title="Enviar"
          color="primary"
          callback={async () => {
            if (email) {
              await forgotPassword(email);
            }
          }}
          busy={busyBtn}
        />
      </Content>
      <div className="responsible-space" />
    </ForgotPasswordContainer>
  );
};
export default ForgotPasswordPage;
