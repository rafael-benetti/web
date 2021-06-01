/* eslint-disable prettier/prettier */
import React from 'react';
import { FiGift } from 'react-icons/fi';
import { Group } from '../entiti/group';
import { StockItem } from '../entiti/stock-item';
import { User } from '../entiti/user';
import { useStock } from '../hooks/stock';
import { PrizeItemContainer, PrizeItemTable } from '../styles/components/prize-item';
import AddRemoveItems from './add-remove-items';
import Button from './button';
import TransferProduct from './transfer-product';

interface Props {
  prize: StockItem;
  groups: Group[];
  operators: User[];
  managers: User[];
  user?: User;
  isGridView: boolean;
}

const PrizeItem: React.FC<Props> = ({ prize, groups, operators, managers, user, isGridView }) => {
  const {
    toggleAddItems,
    openAddItems,
    toggleRemoveItems,
    openRemoveItems,
    toggleTransferProduct,
    openTransferProduct
  } = useStock();

  return (
    <>
      {isGridView ? (
        <PrizeItemContainer>
          <div className="row">
            <h1 className="group heading-secondary-font">
              {prize.ownerLabel}
            </h1>
            <FiGift />
          </div>
          <div className="row">
            <h1 className="label ">{prize.label}</h1>
            <h1 className="qtd ">{`Quantidade: ${prize.quantity}`}</h1>
          </div>
          {user?.permissions?.createProducts || user?.role === 'OWNER' ? (
            <div className="buttons-row">
              <button
                className="remove-btn"
                type="button"
                onClick={() =>
            toggleRemoveItems({ ownerItemId: prize.ownerId, itemId: prize.id })}
              >
                Remover
              </button>
              <button
                className="add-btn"
                type="button"
                onClick={() =>
            toggleAddItems({ ownerItemId: prize.ownerId, itemId: prize.id })}
              >
                Adicionar
              </button>
            </div>
      ): null}
          <button
            type="button"
            onClick={() =>
          toggleTransferProduct({ownerItemId: prize.ownerId, itemId: prize.id})}
          >
            Transferir
          </button>

        </PrizeItemContainer>
    )
      : (
        <PrizeItemTable>
          <div className="label">{prize.label}</div>

          <div className="group">{prize.ownerLabel}</div>
          <div className="quantity">{prize.quantity}</div>

          <div className="transfer">
            <Button
              title="Transferir"
              color="primary"
              callback={() =>
          toggleTransferProduct({ownerItemId: prize.ownerId, itemId: prize.id})}
            />
          </div>
          {user?.permissions?.createProducts || user?.role === 'OWNER' ? (
            <>
              <div className="add">
                <Button
                  title="Adicionar"
                  color="quartiary"
                  callback={() =>
            toggleAddItems({ ownerItemId: prize.ownerId, itemId: prize.id })}
                />
              </div>
              <div className="remove">
                <Button
                  title="Remover"
                  color="tertiary"
                  callback={() =>
            toggleRemoveItems({ ownerItemId: prize.ownerId, itemId: prize.id })}
                />
              </div>
            </>
          ): (
            <>
              <div>-</div>
              <div>-</div>
            </>
          )}
        </PrizeItemTable>
    )}

      {openAddItems?.itemId === prize.id &&
      openAddItems.ownerItemId === prize.ownerId ? (
        <AddRemoveItems prize={prize} isAdd  />
      ) : null}
      {openRemoveItems?.itemId === prize.id &&
      openRemoveItems.ownerItemId === prize.ownerId ? (
        <AddRemoveItems prize={prize} isAdd={false}  />
      ) : null}
      {openTransferProduct?.itemId === prize.id &&
      openTransferProduct.ownerItemId === prize.ownerId ? (
        <TransferProduct prize={prize} isGroupStock groups={groups} operators={operators} managers={managers} />
      ) : null}
    </>
  );
};
export default PrizeItem;
