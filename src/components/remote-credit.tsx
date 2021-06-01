import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import React, { useCallback, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { RemoteCreditDto } from '../dto/remote-credit-dto';
import { useMachine } from '../hooks/machine';
import getValidationErrors from '../utils/getValidationErrors';
import Input from './input';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import { RemoteCreditContainer } from '../styles/pages/remote-credit';

interface Props {
  machineId?: string;
}

const RemoteCredit: React.FC<Props> = ({ machineId }) => {
  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { toggleRemoteCredit, sendRemoteCredit } = useMachine();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);

  const handleRemoteCredit = useCallback(async (data: RemoteCreditDto) => {
    setBusyBtn(true);
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        quantity: Yup.number()
          .required('Insira um valor')
          .positive('Não é possível inserir valor negativo'),
        observations: Yup.string().required('Insira o motivo desta correção'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

      if (machineId) {
        await sendRemoteCredit(data, machineId);
        toggleRemoteCredit(false, true);
        setBusyBtn(false);
      }
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
    <>
      <RemoteCreditContainer>
        <h1>Enviar crédito remoto</h1>
        <Form ref={formRef} onSubmit={handleRemoteCredit}>
          <p style={{ marginBottom: '2rem' }}>
            Insira o valor do crétido que deseja enviar e o motivo dessa ação.
          </p>
          <div className="first-input">
            <Input name="quantity" type="number" label="Valor" />
          </div>
          <Input name="observations" type="text" label="Motivo" />
          <div className="btn">
            <Button
              color="tertiary"
              title="Cancelar"
              callback={() => toggleRemoteCredit(false)}
            />
            <Button color="primary" title="Enviar" busy={busyBtn} isSubmit />
          </div>
        </Form>
      </RemoteCreditContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleRemoteCredit(false);
        }}
      />
    </>
  );
};
export default RemoteCredit;
