/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { ClipLoader } from 'react-spinners';
import { Route } from '../entiti/route';
import Input from './input';
import { HandleRouteContainer } from '../styles/components/handle-route';
import ContainerWithOpacity from './container-with-opacity';
import SelectInput from './select-input';
import { User } from '../entiti/user';
import GroupsCheckboxList from './groups-checkbox-list';
import { PointOfSale } from '../entiti/point-of-sales';
import Button from './button';
import { useRoute } from '../hooks/route';
import getValidationErrors from '../utils/getValidationErrors';
import { useToast } from '../hooks/toast';
import { usePointOfSale } from '../hooks/point-of-sale';

interface Props {
  initialData?: Route;
  operators: User[];
}

const HandleRoute: React.FC<Props> = ({ initialData, operators }) => {
  // refs
  const formRef = useRef<FormHandles>(null);

  // hooks
  const {
    toggleCreateRoute,
    createRoute,
    toggleEditRoute,
    editRoute,
    toggleActions,
  } = useRoute();
  const { getPointsOfSale, pointsOfSale } = usePointOfSale();
  const { addToast } = useToast();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);

  const [pointsOfSaleToRender, setPointsOfSaleToRender] = useState<
    PointOfSale[]
  >([]);
  const [pointsOfSaleChecked, setPointsOfSaleChecked] = useState<string[]>([]);
  const [operatorsToRender, setOperatorsToRender] = useState<User[]>([]);
  const [operatorSelected, setOperatorSelected] = useState<{
    label: string;
    value: string;
  }>({ value: 'none', label: 'Definir depois' });

  const handleRoute = useCallback(
    async (data: Omit<Route, 'id'>) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          label: Yup.string().required('Insira um nome para sua rota'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        if (pointsOfSaleChecked.length === 0) {
          addToast({
            title: 'Aviso!',
            description:
              'Para criar uma rota é necessário selecionar um ponto de venda',
            type: 'info',
          });
          setBusyBtn(false);
          return;
        }
        if (initialData) {
          await editRoute(data, initialData.id);
          setBusyBtn(false);
          toggleActions(true);
          toggleEditRoute(false);
          return;
        }
        await createRoute(data);
        setBusyBtn(false);
        toggleCreateRoute(false);
      } catch (error) {
        setBusyBtn(false);
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },

    [pointsOfSaleChecked, operatorSelected],
  );
  function arrayContainsArray(superset: string[], subset: string[]) {
    return subset.every(function (value) {
      return superset.indexOf(value) >= 0;
    });
  }

  const obteinOperatorsToRender = useCallback(
    (pointsOfSaleCheckedData: string[]) => {
      const groupsInPointsOfSales: string[] = [];

      pointsOfSaleToRender.forEach(pointOfSale => {
        pointsOfSaleCheckedData.forEach(pointOfSaleCheckedId => {
          if (pointOfSale.id === pointOfSaleCheckedId) {
            groupsInPointsOfSales.push(pointOfSale.groupId);
          }
        });
      });
      const availableOperators: User[] = [];
      operators.forEach(operator => {
        const checker = arrayContainsArray(
          operator.groupIds,
          groupsInPointsOfSales,
        );
        if (checker === true) {
          availableOperators.push(operator);
        }
      });
      setOperatorsToRender(availableOperators);
      if (groupsInPointsOfSales.length < 1) {
        setOperatorsToRender([]);
      }
    },
    [operatorsToRender],
  );

  useEffect(() => {
    obteinOperatorsToRender(pointsOfSaleChecked);
  }, [pointsOfSaleChecked]);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getPointsOfSale(undefined, undefined);
      const availablePoints: PointOfSale[] = [];
      pointsOfSale?.forEach(pointOfSale => {
        if (!pointOfSale.routeId) {
          availablePoints.push(pointOfSale);
        }
      });
      setPointsOfSaleToRender(availablePoints);
      setBusy(false);
      if (initialData) {
        if (initialData.operatorId) {
          setOperatorSelected({
            label:
              operators.find(operator => operator.id === initialData.operatorId)
                ?.name || '',
            value: initialData.operatorId,
          });
        }
        setPointsOfSaleChecked([...initialData.pointsOfSaleIds]);
        formRef.current?.setData({
          label: initialData.label,
          pointsOfSaleIds: [''],
        });
        // pointsOfSale?.forEach(pointOfSale => {
        //   initialData.pointsOfSaleIds.forEach(initialPointId => {
        //     if (pointOfSale.id === initialPointId) {
        //       availablePoints.push(pointOfSale);
        //     }
        //   });
        // });
      }
    })();
  }, [toggleEditRoute, editRoute, initialData]);

  return (
    <>
      {!busy ? (
        <HandleRouteContainer>
          {initialData ? <h1>Editar Rota</h1> : <h1>Criar Rota</h1>}
          <Form ref={formRef} onSubmit={handleRoute}>
            <Input name="label" type="text" label="Nome" />
            <div className="locations">
              <p className="label-font">Pontos de venda</p>
              <div className="scroll">
                <GroupsCheckboxList
                  name="pointsOfSaleIds"
                  initialValues={pointsOfSaleChecked}
                  options={pointsOfSale.map(pointOfSaleToRender => {
                    return {
                      id: pointOfSaleToRender.id,
                      label: pointOfSaleToRender.label,
                      value: pointOfSaleToRender.id,
                    };
                  })}
                  onChange={e => {
                    if (e.target.checked) {
                      pointsOfSaleChecked.push(e.target.value.toString());
                      setPointsOfSaleChecked([...pointsOfSaleChecked]);
                    }
                    if (!e.target.checked) {
                      const index = pointsOfSaleChecked.findIndex(
                        pointOfSaleChecked =>
                          pointOfSaleChecked === e.target.value,
                      );
                      pointsOfSaleChecked.splice(index, 1);
                      setPointsOfSaleChecked(pointsOfSaleChecked);
                    }
                    obteinOperatorsToRender(pointsOfSaleChecked);
                    setOperatorSelected({ value: '', label: '' });
                  }}
                />
              </div>
              {pointsOfSaleToRender.length === 0 ? (
                <div className="no">
                  Não há nenhum ponto de venda disponível
                </div>
              ) : null}
            </div>
            {pointsOfSaleChecked.length > 0 ? (
              <SelectInput
                maxMenuHeight={100}
                name="operatorId"
                label="Selecione um operador. (Lista de operadores que possuem acesso ao(s) ponto(s) de venda selecionados)"
                value={operatorSelected}
                onChange={(e: any) => {
                  setOperatorSelected({ value: e.value, label: e.label });
                }}
                options={[
                  { value: 'none', label: 'Definir depois' },
                  ...(operatorsToRender &&
                    operatorsToRender.map(operatorToRender => {
                      return {
                        label: operatorToRender.name,
                        value: operatorToRender.id,
                      };
                    })),
                ]}
              />
            ) : null}
            <Button color="primary" isSubmit title="Salvar" busy={busyBtn} />
          </Form>
        </HandleRouteContainer>
      ) : (
        <div>
          <ClipLoader size={30} color="#7366ff" />
        </div>
      )}
      <ContainerWithOpacity
        showContainer={() => {
          if (!initialData) {
            toggleCreateRoute(false);
          } else {
            toggleEditRoute(false);
          }
        }}
      />
    </>
  );
};
export default HandleRoute;
