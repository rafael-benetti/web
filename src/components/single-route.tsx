import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PointOfSale } from '../entiti/point-of-sales';
import { Route } from '../entiti/route';
import { User } from '../entiti/user';
import { SingleRouteContainer } from '../styles/components/single-route';

interface Props {
  route: Route;
  operator?: User;
  operators: User[];
  locations: PointOfSale[];
  user?: User;
}

const SingleRoute: React.FC<Props> = ({ route, operator, locations }) => {
  // hooks

  const findLocation = useCallback(
    (pointsOfSale: PointOfSale[], locationsId: string[]) => {
      const locationsData: PointOfSale[] = [];
      if (locationsId && pointsOfSale) {
        locationsId.forEach(id => {
          pointsOfSale.forEach(pointOfSale => {
            if (pointOfSale.id === id) {
              locationsData.push(pointOfSale);
            }
          });
        });
      }
      return locationsData;
    },
    [locations, route],
  );

  return (
    <>
      <SingleRouteContainer>
        <Link to={{ pathname: '/single-route', state: route.id }}>
          <button className="edit-btn" type="button">
            <div className="label">{route.label}</div>
            <div className="operator">
              {operator?.name ? operator.name : null}
            </div>
            <div className="locations">
              {findLocation(locations, route.pointsOfSaleIds)
                .map(location => location.label)
                .join(', ')}
            </div>
          </button>
        </Link>
      </SingleRouteContainer>
    </>
  );
};
export default SingleRoute;
