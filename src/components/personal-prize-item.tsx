/* eslint-disable prettier/prettier */
import React from 'react';
import { FiGift } from 'react-icons/fi';
import TransferProduct from './transfer-product';
import { Group } from '../entiti/group';
import { User } from '../entiti/user';
import { useStock } from '../hooks/stock';
import { PersonalPrizeItemContainer } from '../styles/components/personal-prize-item';
import { StockItem } from '../entiti/stock-item';

interface Props {
  operators: User[];
  managers: User[];
  groups: Group[];
  prize: StockItem;
}

const PersonalPrizeItem: React.FC<Props> = ({
  prize,
  operators,
  managers,
  groups,
}) => {
  // hooks
  const { toggleTransferProduct, openTransferProduct } = useStock();

  return (
    <>
      <PersonalPrizeItemContainer>
        <div className="row">
          <FiGift />
        </div>
        <div className="row">
          <h1 className="label ">{prize.label}</h1>
          <h1 className="qtd ">{`Quantidade: ${prize.quantity}`}</h1>
        </div>

        <button
          type="button"
          onClick={() =>
            toggleTransferProduct({
              ownerItemId: '',
              itemId: prize.id,
            })}
        >
          Transferir
        </button>

        {openTransferProduct?.itemId === prize.id ? (
          <TransferProduct
            personalPrize={prize}
            isGroupStock
            groups={groups}
            operators={operators}
            managers={managers}
            isPersonal
          />
        ) : null}
      </PersonalPrizeItemContainer>
    </>
  );
};
export default PersonalPrizeItem;
