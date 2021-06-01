/* eslint-disable no-unused-expressions */
import React from 'react';
import { useModal } from '../hooks/modal';
import { ModalContainer } from '../styles/components/modal';
import Button from './button';

import ContainerWithOpacity from './container-with-opacity';

interface Props {
  title: string;
  text: string;
  type: string;
}

const Modal: React.FC<Props> = ({ text, title, type }) => {
  const {
    handleModal,
    handleCanCreateManager,
    handleCanCreateOperator,
  } = useModal();
  return (
    <>
      <ModalContainer>
        <div className="modal-title ">
          <h1 className="heading-secondary-font">{title}</h1>
        </div>
        <div className="modal-text">
          <h1>{text}</h1>
        </div>
        <div className="modal-buttons">
          <Button
            color="tertiary"
            title="Cancelar"
            callback={() => {
              if (type === 'CAN_CREATE_MANAGERS') {
                handleCanCreateManager(false);
              }
              if (type === 'CAN_CREATE_OPERATORS') {
                handleCanCreateOperator(false);
              }
              handleModal(undefined);
            }}
          />
          <Button
            color="primary"
            title="Aceitar"
            callback={() => {
              if (type === 'CAN_CREATE_MANAGERS') {
                handleCanCreateManager(true);
              }
              if (type === 'CAN_CREATE_OPERATORS') {
                handleCanCreateOperator(true);
              }
              handleModal(undefined);
            }}
          />
        </div>
      </ModalContainer>
      <ContainerWithOpacity />
    </>
  );
};
export default Modal;
