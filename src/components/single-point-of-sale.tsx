/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../entiti/group';
import { PointOfSale } from '../entiti/point-of-sales';
import { User } from '../entiti/user';
import { PointOfSaleContainer } from '../styles/components/single-point-of-sale';

interface IProps {
  pointOfSale: PointOfSale;
  group?: Group;
  isSingleGroup: boolean;
  user?: User;
  routeLabel?: string;
}

const SinglePointOfSale: React.FC<IProps> = ({
  pointOfSale,
  group,
  isSingleGroup,
  routeLabel,
  user,
}) => {
  const formatPhone = useCallback((value: string) => {
    const formattedString = value
      .replaceAll('+55', '')
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})(-)(\d)(\d{3})(\d)/, '$1$3-$4$5')
      .replace(/(-\d{4})\d+?$/, '$1');

    return formattedString;
  }, []);

  return (
    <PointOfSaleContainer>
      {user?.role === 'OPERATOR' ? (
        <a>
          <button className="edit-btn" type="button">
            <div className="label">{pointOfSale.label}</div>
            {isSingleGroup ? null : group?.isPersonal ? (
              'Parceria pessoal'
            ) : (
              <div className="group">{group?.label}</div>
            )}
            <div className="contact-name">{routeLabel || '-'}</div>

            <div className="contact-name">{pointOfSale.contactName}</div>
            <div className="phone">
              {formatPhone(pointOfSale.primaryPhoneNumber)}
            </div>
          </button>
        </a>
      ) : (
        <Link
          to={{ pathname: 'detalhes-do-ponto-de-venda', state: pointOfSale.id }}
        >
          <button className="edit-btn" type="button">
            <div className="label">{pointOfSale.label}</div>
            {isSingleGroup ? null : group?.isPersonal ? (
              'Parceria pessoal'
            ) : (
              <div className="group">{group?.label}</div>
            )}
            <div className="contact-name">{routeLabel || '-'}</div>

            <div className="contact-name">{pointOfSale.contactName}</div>
            <div className="phone">
              {formatPhone(pointOfSale.primaryPhoneNumber)}
            </div>
          </button>
        </Link>
      )}
    </PointOfSaleContainer>
  );
};
export default SinglePointOfSale;
