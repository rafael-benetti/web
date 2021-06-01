import React, { useCallback, useRef, useState } from 'react';
import * as Yup from 'yup';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import Button from '../components/button';
import { Content, LoginPageContainer } from '../styles/pages/login';
import Logo from '../assets/logo-login.png';
import Input from '../components/input';
import { LoginDto } from '../dto/login';
import getValidationErrors from '../utils/getValidationErrors';
import { useAuth } from '../hooks/auth';

const LoginPage: React.FC = () => {
  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { login } = useAuth();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);

  const handleLoginForm = useCallback(async (data: LoginDto) => {
    setBusyBtn(true);
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('Insira um email'),
        password: Yup.string().required('Insira uma senha'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      await login(data);
      setBusyBtn(false);
    } catch (error) {
      setBusyBtn(false);
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
      }
    }
  }, []);

  return (
    <LoginPageContainer>
      <img src={Logo} alt="Logo Sttigma" />
      <Content>
        <Form ref={formRef} onSubmit={handleLoginForm}>
          <Input name="email" type="text" label="E-mail" />
          <div className="column">
            <Input name="password" type="password" label="Senha" />
            <div className="link">
              <Link to="recuperar-senha">Esqueci minha seinha</Link>
            </div>
          </div>
          <Button title="Entrar" color="primary" isSubmit busy={busyBtn} />
        </Form>
      </Content>
      <div className="responsible-space" />
    </LoginPageContainer>
  );
};
export default LoginPage;
