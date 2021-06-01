/* eslint-disable no-underscore-dangle */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import Input from './input';
import getValidationErrors from '../utils/getValidationErrors';
import { Group } from '../entiti/group';
import { useGroup } from '../hooks/group';
import { HandleGroupContainer } from '../styles/components/handle-group';
import { HandleGroupsDto } from '../dto/handle-groups';

interface IProps {
  initialData?: Group;
}

const HandleGroup: React.FC<IProps> = ({ initialData }) => {
  const formRef = useRef<FormHandles>(null);

  // hooks
  const {
    createGroups,
    editGroups,
    openEditGroup,
    openCreateGroup,
  } = useGroup();

  // state
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialData) {
      formRef.current?.setData({
        label: initialData.label,
      });
    }
  }, [initialData]);

  const handleGroup = useCallback(
    async (data: HandleGroupsDto) => {
      setBusy(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          label: Yup.string().required('Insira nome para sua parceria'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        if (initialData) {
          await editGroups({ label: data.label }, initialData.id);
          openEditGroup(undefined, true);
        } else {
          const createGroup = {
            label: data.label,
          };
          await createGroups(createGroup);
        }
        setBusy(false);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
        if (initialData) {
          openEditGroup(undefined, true);
          setBusy(false);
          return;
        }
        setBusy(false);
        openEditGroup();
      }
    },
    [initialData],
  );

  return (
    <>
      <HandleGroupContainer>
        {initialData ? <h1>Editar Parceria</h1> : <h1>Criar Parceria</h1>}
        <Form ref={formRef} onSubmit={handleGroup}>
          <Input name="label" type="text" label="Nome" />
          <Button
            title={`${initialData ? 'Editar' : 'Cadastrar'}`}
            color="primary"
            isSubmit
            busy={busy}
          />
        </Form>
      </HandleGroupContainer>
      <ContainerWithOpacity
        showContainer={() => {
          if (initialData) {
            openEditGroup(undefined);
          } else {
            openCreateGroup(false);
          }
        }}
      />
    </>
  );
};

export default HandleGroup;
