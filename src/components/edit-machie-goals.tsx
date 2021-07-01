/* eslint-disable react/jsx-curly-newline */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Form } from '@unform/web';
import Input from './input';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';
import { useMachine } from '../hooks/machine';
import { EditMachineGoalsContainer } from '../styles/components/edit-machine-goals';
import { useToast } from '../hooks/toast';
import getValidationErrors from '../utils/getValidationErrors';

interface Props {
  goals: { incomePerPrizeGoal?: string; incomePerMonthGoal?: string };
  machineId?: string;
}

const EditMachineGoals: React.FC<Props> = ({ goals, machineId }) => {
  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { toggleGoals, editGoals } = useMachine();
  const {addToast} = useToast()

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [goalsData, setGoalsData] = useState<{
    incomePerPrizeGoal?: string;
    incomePerMonthGoal?: string;
  }>();

  const handleEditGoal = useCallback(async (data: { incomePerPrizeGoal?: string; incomePerMonthGoal?: string }) => {
    setBusyBtn(true);
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        incomePerMonthGoal: Yup.string().required('Insira a meta de faturamento por mês'),
        incomePerPrizeGoal: Yup.string().required('Insira a meta de faturamento por prêmio'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      if(goalsData?.incomePerMonthGoal && parseFloat(goalsData.incomePerMonthGoal) < 0) {
        addToast({title: 'Aviso', description: 'Não é possível inserir metas negativas', type: 'info'})
        setBusyBtn(false);
        return
      }
      if(goalsData?.incomePerPrizeGoal && parseFloat(goalsData.incomePerPrizeGoal) < 0) {
        addToast({title: 'Aviso', description: 'Não é possível inserir metas negativas', type: 'info'})
        setBusyBtn(false);
        return
      }
      await editGoals( machineId!, goalsData);
      setBusyBtn(false);
      toggleGoals(false, true);
    } catch (error) {
      setBusyBtn(false);
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
      }
    }
  }, [goalsData]);

  return (
    <>
      <EditMachineGoalsContainer>
        <h1>Editar metas da máquina.</h1>
        <div className="description" style={{marginBottom: '2rem'}}>
          <p>Você pode definir metas para esta máquina. Essas metas serão um indicativo na geração de relatórios.</p>
        </div>
        <Form ref={formRef} onSubmit={handleEditGoal}>
          <div className="rent-input">
            <Input
              label="Faturamento por mês"
              name="incomePerMonthGoal"
              type="number"
              defaultValue={goals.incomePerMonthGoal}
              onChange={e =>
                setGoalsData({ ...goalsData, incomePerMonthGoal: e.target.value })}
            />
            <Input
              label="Faturamento por prêmio"
              name="incomePerPrizeGoal"
              type="number"
              defaultValue={goals.incomePerPrizeGoal}
              onChange={e =>
                setGoalsData({ ...goalsData, incomePerPrizeGoal: e.target.value })
              }
            />
          </div>
          <div className="btn">
            <Button color="tertiary" title="Cancelar" callback={() => toggleGoals(false)} />
            <Button color="primary" title="Continuar" busy={busyBtn} isSubmit />
          </div>
        </Form>
      </EditMachineGoalsContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleGoals(false);
        }}
      />
    </>
  );
};
export default EditMachineGoals;
