/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Redirect } from 'react-router-dom';
import Input from '../components/input';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { useUser } from '../hooks/user';
import { ProfileContainer, ProfileContent } from '../styles/pages/profile';
import getValidationErrors from '../utils/getValidationErrors';
import { PageTitle } from '../utils/page-title';
import profileImg from '../assets/profile.jpg';
import { EditProfileDto } from '../dto/edit-profile';
import { useUtils } from '../hooks/utils';

const ProfilePage: React.FC = () => {
  // ref
  const formRef = useRef<FormHandles>(null);
  // state
  const [changePassword, setChangePassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyBtn, setBusyBtn] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>();
  const [currentFile, setCurrentFile] = useState<File>();
  const [redirect, setRedirect] = useState(false);

  // hooks
  const { user, editProfile } = useUser();
  const { unformatPhone, formatPhone } = useUtils();

  useEffect(() => {
    formRef.current?.setData({
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber ? formatPhone(user.phoneNumber, true) : '',
    });
  }, [user]);

  const handlePickImage = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          setCurrentImage(reader.result.toString());
        }
      };
    },
    [currentImage],
  );

  const handleEditProfile = useCallback(
    async (data: EditProfileDto) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          // password: Yup.string().required('Insira uma senha'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        let dataProfile;
        if (changePassword) {
          dataProfile = {
            name: data.name,
            phoneNumber: data.phoneNumber
              ? unformatPhone(data.phoneNumber)
              : '',
            newPassword: data.newPassword,
            password: data.password,
          };
        } else {
          dataProfile = {
            name: data.name,
            phoneNumber: data.phoneNumber
              ? unformatPhone(data.phoneNumber)
              : '',
          };
        }
        await editProfile(dataProfile, currentFile);
        setBusyBtn(false);
        setRedirect(true);
      } catch (error) {
        setBusyBtn(false);
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [changePassword, currentFile],
  );

  return (
    <Container active="dashboard" loading={busy}>
      <ProfileContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Perfil</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Perfil' }]}
            />
          </div>
        </PageTitle>
        <ProfileContent>
          <label htmlFor="file-picker">
            <div className="img">
              <img
                src={
                  currentImage ||
                  (user?.photo ? user?.photo.downloadUrl : profileImg)
                }
                alt="imagem-perfil"
              />
            </div>
            <input
              id="file-picker"
              name="teste"
              type="file"
              onChange={async e => {
                if (e.target.files && e.target.files[0]) {
                  handlePickImage(e.target.files[0]);
                  setCurrentFile(e.target.files[0]);
                }
              }}
            />
          </label>

          <Form ref={formRef} onSubmit={handleEditProfile}>
            <Input name="name" label="Nome" />
            <Input name="email" label="E-mail" isDisabled />
            <Input
              name="phoneNumber"
              label="Telefone"
              onChange={event => {
                const { value } = event.target;
                event.target.value = formatPhone(value, false);
              }}
            />
            {changePassword ? (
              <div className="changing-password">
                <div className="old-password">
                  <Input name="password" type="password" label="Senha antiga" />
                </div>
                <div className="confirm-password">
                  <Input
                    name="newPassword"
                    type="password"
                    label="Nova senha"
                  />
                  <div className="confirm">
                    <Input
                      name="confirmPassword"
                      type="password"
                      label="Confirmar nova senha"
                    />
                  </div>
                </div>
                <button
                  className="change-password-btn"
                  type="button"
                  onClick={() => setChangePassword(false)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="change-password">
                <Input
                  name="fakePassword"
                  label="Senha"
                  isDisabled
                  type="text"
                  value="********"
                />
                <button
                  className="change-password-btn"
                  type="button"
                  onClick={() => setChangePassword(true)}
                >
                  Trocar de senha
                </button>
              </div>
            )}
            <Button isSubmit color="primary" title="Salvar" busy={busyBtn} />
          </Form>
        </ProfileContent>
      </ProfileContainer>
      {redirect && <Redirect to="/dashboard" />}
    </Container>
  );
};
export default ProfilePage;
