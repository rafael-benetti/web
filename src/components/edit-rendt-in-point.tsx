import React, { useCallback, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Input from './input';
import { PointOfSaleInfo } from '../entiti/point-of-sale-info';
import { usePointOfSale } from '../hooks/point-of-sale';
import { EditRentInPointContainer } from '../styles/components/edit-rendt-in-point';
import ContainerWithOpacity from './container-with-opacity';
import SingleCheckbox from './single-checkbox';
import Button from './button';

interface Props {
  pointOfSaleInfo?: PointOfSaleInfo;
}

const EditRentInPoint: React.FC<Props> = ({ pointOfSaleInfo }) => {
  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { toggleActions, editRent } = usePointOfSale();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [type, setType] = useState<string>(() => {
    if (pointOfSaleInfo?.pointOfSale.isPercentage) {
      return '%';
    }
    return 'R$';
  });
  const [money, setMoney] = useState<string>(() => {
    return pointOfSaleInfo?.pointOfSale.rent?.toString() || '';
  });
  const [isPercentage, setIsPercentage] = useState<boolean>(
    pointOfSaleInfo?.pointOfSale.isPercentage || false,
  );

  const handleEditRent = useCallback(async () => {
    setBusyBtn(true);
    try {
      if (pointOfSaleInfo) {
        await editRent(
          { isPercentage, rent: money },
          pointOfSaleInfo?.pointOfSale.id,
        );
      }
      setBusyBtn(false);
      toggleActions(undefined, true);
    } catch (error) {
      setBusyBtn(false);
    }
  }, [money, isPercentage]);

  return (
    <>
      <EditRentInPointContainer>
        <h1>Editar o aluguel deste ponto.</h1>
        <Form ref={formRef} onSubmit={handleEditRent}>
          <div className="rent-input">
            <Input
              name="rent"
              type="text"
              value={type + money}
              onChange={e => {
                if (!isPercentage) {
                  setMoney(
                    e.target.value.replaceAll('R', '').replaceAll('$', ''),
                  );
                } else {
                  setMoney(e.target.value.replaceAll('%', ''));
                }
              }}
            />
            <div className="check">
              <SingleCheckbox
                name="isPercentage"
                type="checkbox"
                id="isPercentage"
                label="Porcento"
                checked={isPercentage}
                onChange={e => {
                  setIsPercentage(e.target.checked);
                  if (!e.target.checked) {
                    setType('R$');
                  } else {
                    setType('%');
                  }
                }}
              />
            </div>
          </div>
          <div className="btn">
            <Button
              color="tertiary"
              title="Cancelar"
              callback={() => toggleActions(undefined)}
            />
            <Button color="primary" title="Continuar" busy={busyBtn} isSubmit />
          </div>
        </Form>
      </EditRentInPointContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleActions(undefined);
        }}
      />
    </>
  );
};
export default EditRentInPoint;
