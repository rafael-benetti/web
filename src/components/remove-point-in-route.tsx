import React, { useCallback, useState } from 'react';
import { Route } from '../entiti/route';
import { usePointOfSale } from '../hooks/point-of-sale';
import { useRoute } from '../hooks/route';
import { RemovePointInRouteContainer } from '../styles/components/remove-point-in-route';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';

interface Props {
  route?: Route;
  pointOfSaleId?: string;
}

const RemovePointInRoute: React.FC<Props> = ({ route, pointOfSaleId }) => {
  // hooks
  const { toggleActions } = usePointOfSale();
  const { editRoute } = useRoute();

  // state
  const [busyBtn, setBusyBtn] = useState<boolean>(false);

  const handleRemoveRoute = useCallback(async () => {
    setBusyBtn(true);
    try {
      if (route) {
        const array = route.pointsOfSaleIds;
        const index = array.findIndex(id => id === pointOfSaleId);
        array.splice(index, 1);
        const pointsOfSaleIds = array;
        const routeData: Omit<Route, 'id'> = {
          label: route.label,
          pointsOfSaleIds,
        };
        await editRoute(routeData, route.id);
      }
      setBusyBtn(false);
      toggleActions(undefined, true);
    } catch (error) {
      setBusyBtn(false);
    }
  }, []);

  return (
    <>
      <RemovePointInRouteContainer>
        <h1>{`Deseja remover este ponto de venda da rota: ${route?.label}`}</h1>
        {route?.pointsOfSaleIds.length === 1 && !busyBtn ? (
          <div className="warning">
            <h2>Atenção!</h2>
            <p>
              Esta rota possui apenas este ponto de venda. Se remover este ponto
              de venda desta rota, ela será deletada automaticamente.
            </p>
          </div>
        ) : null}
        <div className="btn">
          <Button
            color="tertiary"
            title="Cancelar"
            callback={() => toggleActions(undefined)}
          />
          <Button
            color="primary"
            title="Confirmar"
            busy={busyBtn}
            callback={() => handleRemoveRoute()}
          />
        </div>
      </RemovePointInRouteContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleActions(undefined);
        }}
      />
    </>
  );
};
export default RemovePointInRoute;
