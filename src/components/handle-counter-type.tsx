import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Input from './input';
import { CounterType } from '../entiti/counter-type';
import { useCategory } from '../hooks/category';
import { HandleCounterTypeContainer } from '../styles/components/handle-counter-type';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import SelectInput from './select-input';
import getValidationErrors from '../utils/getValidationErrors';

interface Props {
  initialData?: CounterType;
}

const HandleCounterType: React.FC<Props> = ({ initialData }) => {
  // refs
  const formRef = useRef<FormHandles>(null);

  // state
  const [busy, setBusy] = useState(false);

  // hooks
  const {
    toggleCreateCounterType,
    toggleEditCounterType,
    editCounterType,
    createCounterType,
    showEditCounterType,
  } = useCategory();

  const handleCounterType = useCallback(
    async (data: Omit<CounterType, 'id'>) => {
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
          const editData: Omit<CounterType, 'type'> = {
            id: initialData.id,
            label: data.label,
          };
          await editCounterType(editData);
          setBusy(false);
          toggleEditCounterType(undefined);
          return;
        }
        await createCounterType(data);
        setBusy(false);
        toggleCreateCounterType(false);
        return;
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
        setBusy(false);
        toggleCreateCounterType(false);
      }
    },
    [initialData],
  );

  useEffect(() => {
    if (initialData) {
      formRef.current?.setData({
        label: initialData?.label,
      });
    }
  }, []);

  return (
    <>
      <HandleCounterTypeContainer>
        {initialData ? (
          <h1>Editar tipo de contador</h1>
        ) : (
          <h1>Criar tipo de contador</h1>
        )}
        <Form ref={formRef} onSubmit={handleCounterType}>
          <Input name="label" type="text" label="Nome" />
          {showEditCounterType ? null : (
            <div className="select-input">
              <SelectInput
                name="type"
                options={[
                  { label: 'Entrada', value: 'IN' },
                  { label: 'Saída', value: 'OUT' },
                ]}
                label="Tipo"
              />
            </div>
          )}
          <Button
            title={`${initialData ? 'Editar' : 'Cadastrar'}`}
            color="primary"
            isSubmit
            busy={busy}
          />
        </Form>
      </HandleCounterTypeContainer>
      <ContainerWithOpacity
        showContainer={() => {
          if (initialData) {
            toggleEditCounterType(undefined);
          }
          toggleCreateCounterType(false);
        }}
      />
    </>
  );
};

export default HandleCounterType;
