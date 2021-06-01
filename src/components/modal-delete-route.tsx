/* eslint-disable no-unused-expressions */
import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from '../entiti/route';
import { useRoute } from '../hooks/route';
import { ModalContainer } from '../styles/components/modal';
import Button from './button';

import ContainerWithOpacity from './container-with-opacity';

interface Props {
  route?: Route;
}

const ModalDeleteRoute: React.FC<Props> = ({ route }) => {
  // hooks
  const { toggleDeleteRoute, deleteRoute } = useRoute();

  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);

  const handleDeleteRoute = useCallback(async () => {
    setBusyBtn(true);
    try {
      if (route) {
        await deleteRoute(route.id);
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
          <h1 className="heading-secondary-font">{`Deletar ${route?.label}`}</h1>
        </div>
        <div className="modal-text">
          <h1>{`Ao deletar uma rota você não terá mais acesso a rota. Tem certeza que deseja deletar a ${route?.label}?`}</h1>
        </div>
        <div className="modal-buttons">
          <Button
            color="tertiary"
            title="Cancelar"
            callback={() => {
              toggleDeleteRoute(false);
            }}
          />
          <Button
            color="primary"
            title="Aceitar"
            busy={busyBtn}
            callback={() => {
              handleDeleteRoute();
            }}
          />
        </div>
      </ModalContainer>
      <ContainerWithOpacity showContainer={() => toggleDeleteRoute(false)} />
      {redirect ? <Redirect to="/rotas" /> : null}
    </>
  );
};
export default ModalDeleteRoute;
