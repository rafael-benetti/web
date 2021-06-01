/* eslint-disable no-unused-expressions */
import React from 'react';
import { Link } from 'react-router-dom';
import { Telemetry } from '../entiti/telemetry';
import { useTelemetry } from '../hooks/telemetry';
import { ModalTelemetryContainer } from '../styles/components/modal-telemetry';
import Button from './button';

import ContainerWithOpacity from './container-with-opacity';

interface Props {
  title: string;
  text: string;
  telemetry?: Telemetry;
  isMachine?: boolean;
}

const ModalTelemetry: React.FC<Props> = ({
  text,
  title,
  telemetry,
  isMachine,
}) => {
  const { toggleTelemetryModal } = useTelemetry();
  return (
    <>
      <ModalTelemetryContainer>
        <div className="modal-title ">
          <h1 className="font">{title}</h1>
        </div>
        <div className="modal-text">
          <h1>{text}</h1>
        </div>
        <div className="modal-buttons">
          {!isMachine && (
            <Link
              to={{
                pathname: '/detalhes-da-maquina',
                state: telemetry?.machineId,
              }}
              style={{ marginRight: '2rem' }}
            >
              <Button color="secondary" title="Acessar a máquina" />
            </Link>
          )}
          <Button
            color="primary"
            title="Ok, Entendi!"
            callback={() => {
              toggleTelemetryModal(undefined);
            }}
          />
        </div>
      </ModalTelemetryContainer>
      <ContainerWithOpacity />
    </>
  );
};
export default ModalTelemetry;
