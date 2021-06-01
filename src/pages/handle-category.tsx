/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import {FiPlus, FiXCircle} from 'react-icons/fi';
import { FormHandles, Scope } from '@unform/core';
import { Form } from '@unform/web';
import { v4 } from 'uuid';
import { Redirect, useLocation } from 'react-router-dom';
import Input from '../components/input';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import {
  Boxes,
  Counters,
  HandleCategoryContainer,
  HandleCategoryContent,
} from '../styles/pages/handle-category';
import { PageTitle } from '../utils/page-title';
import Button from '../components/button';
import SingleCheckbox from '../components/single-checkbox';
import SelectInput, { Options } from '../components/select-input';
import { Box } from '../entiti/Box';
import getValidationErrors from '../utils/getValidationErrors';
import { useCategory } from '../hooks/category';
import { Category } from '../entiti/category';
import { handleCategoryDto } from '../dto/handle-category';


const HandleCategoryPage: React.FC = () => {
  // location
  const initialData = useLocation().state as Category;

  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const {createCategory, editCategory, getCounterType, counterTypes} = useCategory();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [redirect, setRedirect] = useState(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [boxesCreater, setBoxesCreater] = useState<Box[]>([])

  const [telemetry, setTelemetry] = useState<Options[]>([
    {label: 'Pino 2', value: 'Pino 2'},
    {label: 'Pino 3', value: 'Pino 3'},
    {label: 'Pino 4', value: 'Pino 4'},
    {label: 'Pino 5', value: 'Pino 5'},
    {label: 'Pino 6', value: 'Pino 6'},
    {label: 'Pino 7', value: 'Pino 7'},
    {label: 'Pino 8', value: 'Pino 8'},
    {label: 'Pino 9', value: 'Pino 9'},
    {label: 'Pino 10', value: 'Pino 10'},
    {label: 'Pino 11', value: 'Pino 11'},
    {label: 'Pino 12', value: 'Pino 12'},
    {label: 'Pino 13', value: 'Pino 13'},
  ]);

    useEffect(() => {
      setBusy(true);
      (async() => {
        await getCounterType()
      })()
      setBusy(false);
    }, [])

  const handleCategory = useCallback(async data => {
    setBusyBtn(true);
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        label: Yup.string().required('Insira um nome'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      if(initialData) {
        const editCategoryData: handleCategoryDto ={
          label: data.label,
          boxes: boxesCreater,
        }
        const response = await editCategory(editCategoryData, initialData.id)
        if(response){
          setBusyBtn(false);
          setRedirect(true);
          return
        }
        setBusyBtn(false);
        return;
      }
      const createCategoryData: handleCategoryDto ={
        label: data.label,
        boxes: boxesCreater,
      }
      const response = await createCategory(createCategoryData)
      if(response){
        setBusyBtn(false);
        setRedirect(true);
        return
      }
      setBusyBtn(false);

    } catch (error) {
      setBusyBtn(false);
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
      }
    }
  }, [boxesCreater]);

  useEffect(() => {
    setBusy(true);
    if(initialData) {
      formRef.current?.setData({
        label: initialData.label,
      })
      setBoxesCreater(initialData.boxes)
    }
    setBusy(false);
  }, [])

  return (
    <Container active="categories" loading={busy}>
      <HandleCategoryContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">{initialData ? 'Editar categoria' : 'Criar categoria'}</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Categorias', url: 'categorias' },
                { name: `${initialData ? 'Editar categoria': 'Criar categoria'}` },
              ]}
            />
          </div>
        </PageTitle>
        <HandleCategoryContent>
          <Form ref={formRef} onSubmit={handleCategory}>
            <div className="label-input">
              <Input name="label" label="Nome" />
            </div>
            {boxesCreater.map((box, index) => {
              return (
                <Scope path={`boxes.${index}`} key={v4()}>
                  <Boxes>
                    <div className="cabine-title">
                      {initialData ? null : (
                        <button
                          className="delete-box-btn"
                          type="button"
                          onClick={() => {
                      boxesCreater.splice(index, 1);
                      setBoxesCreater([...boxesCreater])
                    }}
                        >
                          <FiXCircle  />
                        </button>
                      )}
                      <h1 className="heading-secondary-font cabin-title">{`Cabine ${index + 1}`}</h1>
                    </div>
                    {box.counters && box.counters.map((counter, indx) => {
                      return (
                        <Scope path={`counters.${indx}`} key={v4()}>
                          <Counters>
                            <div className="counter-title">
                              <button
                                className="delete-counter-btn"
                                type="button"
                                onClick={() => {
                                  boxesCreater[index].counters.splice(indx, 1);
                                  setBoxesCreater([...boxesCreater])
                                }}
                              >
                                <FiXCircle  />
                              </button>
                              <h1>{`Contador ${indx + 1}`}</h1>
                            </div>
                            <div className="grid-counter">
                              <div className="type-counter">
                                <SelectInput
                                  id={`type ${indx} ${index}`}
                                  name='counterTypeId'
                                  label="Tipo do contador"
                                  options={counterTypes.map(counterType => {
                                    return {label: `${counterType.label} (${counterType.type === 'IN' ? 'Entrada' : 'Saída'})`, value: counterType.id}
                                  })}
                                  value={boxesCreater[index].counters[indx].counterTypeId ? counterTypes.map(counterType => {
                                    if(counterType.id === boxesCreater[index].counters[indx].counterTypeId) {
                                      return {value: counterType.id, label: `${counterType.label} (${counterType.type === 'IN' ? 'Entrada' : 'Saída'})`}
                                    }
                                  }) : {}}
                                  onChange={(e) => {
                                    boxesCreater[index].counters[indx].counterTypeId = e ? e.value : '';
                                    setBoxesCreater([...boxesCreater]);
                                }}
                                />
                              </div>
                              <div className="pin-counter">
                                <SelectInput
                                  id={`telemetry ${indx} ${index}`}
                                  name='pin'
                                  label="Telemetria"
                                  options={telemetry}
                                  value={boxesCreater[index].counters[indx].pin ? {value: boxesCreater[index].counters[indx].pin, label: boxesCreater[index].counters[indx].pin} : {}}
                                  onChange={(e) => {
                                    const i = telemetry.findIndex(t => t.value === e!.value)
                                    telemetry.splice(i, 1)
                                    setTelemetry(telemetry)
                                    boxesCreater[index].counters[indx].pin = e ? e.value : '';
                                    setBoxesCreater([...boxesCreater]);
                                }}
                                />
                              </div>

                              <div className="clock-counter">
                                <SingleCheckbox
                                  id={`digital ${indx} ${index}`}
                                  name="hasDigital"
                                  label="Digital"
                                  defaultChecked={!!boxesCreater[index].counters[indx].hasDigital}
                                  onChange={(e) => {
                                    const value = e.target.checked;
                                    setBoxesCreater(state => {
                                      state[index].counters[indx].hasDigital = value;
                                      return state;
                                    })
                                }}
                                />
                                <SingleCheckbox
                                  id={`mecanico ${indx} ${index}`}
                                  name="hasMechanical"
                                  label="Mecânico"
                                  defaultChecked={!!boxesCreater[index].counters[indx].hasMechanical}
                                  onChange={(e) => {
                                    const value = e.target.checked;
                                    setBoxesCreater(state => {
                                      state[index].counters[indx].hasMechanical = value;
                                      return state;
                                    })
                                }}
                                />
                              </div>
                            </div>
                          </Counters>
                        </Scope>
                      )
                    })}
                    <button
                      type="button"
                      className="add-counter"
                      onClick={() => {
                        boxesCreater[index].counters?.push({hasDigital: false, hasMechanical: false, counterTypeId: undefined,  pin: undefined})
                        setBoxesCreater([...boxesCreater]);
                      }}
                    >
                      Adicionar Contador
                      <FiPlus size={16} />
                    </button>
                  </Boxes>
                </Scope>
              )
            })}
            {initialData ? null : (
              <button
                type="button"
                className="add-box"
                onClick={() => {
                setBoxesCreater([...boxesCreater, {counters: []}]);
                }}
              >
                Adicionar cabine
                <FiPlus size={16} />
              </button>
)}
            <div className="submit-btn">
              <Button color="primary" title={initialData ? 'Editar' : 'Criar'} isSubmit busy={busyBtn} />
            </div>
          </Form>
        </HandleCategoryContent>
      </HandleCategoryContainer>
      {redirect ? <Redirect to="categorias" /> : null }
    </Container>
  );
};
export default HandleCategoryPage;
