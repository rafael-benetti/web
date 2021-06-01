/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Machine } from '../entiti/machine';
import { useMachine } from '../hooks/machine';
import { ModalContainer } from '../styles/components/modal';
import Button from './button';

import ContainerWithOpacity from './container-with-opacity';

interface Props {
  machine?: Machine;
}

const ModalDeleteMachine: React.FC<Props> = ({ machine }) => {
  // hooks
  const { toggleDeleteMachine, deleteMachine } = useMachine();

  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);

  const handleDeleteMachine = useCallback(async () => {
    setBusyBtn(true);
    try {
      if (machine) {
        await deleteMachine({ isActive: false }, machine.id);
      }
      setBusyBtn(false);
      setRedirect(true);
    } catch (error) {
      setBusyBtn(false);
    }
  }, []);

  return (
    <>
      <ModalContainer>
        <div className="modal-title ">
          <h1 className="heading-secondary-font">{`Deletar ${machine?.serialNumber}`}</h1>
        </div>
        <div className="modal-text">
          <h1>{`Ao deletar uma máquina você não terá mais acesso à ela. Tem certeza que deseja deletar a ${machine?.serialNumber}?`}</h1>
        </div>
        <div className="modal-buttons">
          <Button
            color="tertiary"
            title="Cancelar"
            callback={() => {
              toggleDeleteMachine(false);
            }}
          />
          <Button
            color="primary"
            title="Confirmar"
            callback={() => {
              handleDeleteMachine();
            }}
          />
        </div>
      </ModalContainer>
      <ContainerWithOpacity showContainer={() => toggleDeleteMachine(false)} />
      {redirect ? <Redirect to="maquinas" /> : null}
    </>
  );
};
export default ModalDeleteMachine;
