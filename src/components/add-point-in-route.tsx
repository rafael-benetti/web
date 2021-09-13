import React, { useCallback, useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { ClipLoader } from 'react-spinners';
import { Route } from '../entiti/route';
import { usePointOfSale } from '../hooks/point-of-sale';
import { useRoute } from '../hooks/route';
import { AddPointInRouteContainer } from '../styles/components/add-point-in-route.ts';
import Button from './button';
import ContainerWithOpacity from './container-with-opacity';

interface Props {
  pointOfSaleId?: string;
}

const AddPointInRoute: React.FC<Props> = ({ pointOfSaleId }) => {
  // hooks
  const { getRoutes, routes, editRoute } = useRoute();
  const { toggleActions } = usePointOfSale();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [routeSelected, setRouterSelected] = useState<Route>();

  const handleAddRoute = useCallback(async () => {
    setBusyBtn(true);
    try {
      if (pointOfSaleId) {
        if (routeSelected) {
          const arrayData = routeSelected.pointsOfSaleIds;
          arrayData.push(pointOfSaleId);
          const routeData: Omit<Route, 'id'> = {
            label: routeSelected.label,
            pointsOfSaleIds: arrayData,
          };
          await editRoute(routeData, routeSelected.id);
        }
      }
      setBusyBtn(false);
      toggleActions(undefined, true);
    } catch (error) {
      setBusyBtn(false);
    }
  }, [routeSelected]);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getRoutes(undefined, undefined);
      setBusy(false);
    })();
  }, []);

  return (
    <>
      <AddPointInRouteContainer>
        {!busy ? (
          <>
            <h1>Selecione uma rota para este ponto ser adicionado.</h1>
            <div className="select-input">
              <ReactSelect
                placeholder="Selecionar..."
                options={routes.map(route => {
                  return {
                    label: route.label,
                    value: route.id,
                  };
                })}
                onChange={e => {
                  if (e) {
                    routes.forEach(routeD => {
                      if (routeD.id === e.value) {
                        setRouterSelected(routeD);
                      }
                    });
                  }
                }}
              />
            </div>
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
                callback={() => handleAddRoute()}
              />
            </div>
          </>
        ) : (
          <div>
            <ClipLoader size={30} color="#00161d" />
          </div>
        )}
      </AddPointInRouteContainer>
      <ContainerWithOpacity
        showContainer={() => {
          toggleActions(undefined);
        }}
      />
    </>
  );
};
export default AddPointInRoute;
