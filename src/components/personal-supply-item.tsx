/* eslint-disable prettier/prettier */
import React from 'react';
import { FiGift } from 'react-icons/fi';
import TransferProduct from './transfer-product';
import { Group } from '../entiti/group';
import { User } from '../entiti/user';
import { useStock } from '../hooks/stock';
import { PersonalSupplyItemContainer } from '../styles/components/personal-supply-item';
import { StockItem } from '../entiti/stock-item';

interface Props {
  operators: User[];
  managers: User[];
  groups: Group[];
  supply: StockItem;
}

const PersonalSupplyItem: React.FC<Props> = ({
  supply,
  operators,
  managers,
  groups,
}) => {
  // hooks
  const { toggleTransferProduct, openTransferProduct } = useStock();

  return (
    <>
      <PersonalSupplyItemContainer>
        <div className="row">
          <FiGift />
        </div>
        <div className="row">
          <h1 className="label ">{supply.label}</h1>
          <h1 className="qtd ">{`Quantidade: ${supply.quantity}`}</h1>
        </div>

        <button
          type="button"
          onClick={() =>
            toggleTransferProduct({
              ownerItemId: '',
              itemId: supply.id,
            })}
        >
          Transferir
        </button>

        {openTransferProduct?.itemId === supply.id ? (
          <TransferProduct
            personalSupply={supply}
            isGroupStock
            groups={groups}
            operators={operators}
            managers={managers}
          />
        ) : null}
      </PersonalSupplyItemContainer>
    </>
  );
};
export default PersonalSupplyItem;
