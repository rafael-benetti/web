/* eslint-disable react/jsx-curly-newline */
import React from 'react';
import { AiOutlineTool } from 'react-icons/ai';
import { Group } from '../entiti/group';
import { StockItem } from '../entiti/stock-item';
import { User } from '../entiti/user';
import { useStock } from '../hooks/stock';
import {
  SupplyItemContainer,
  SupplyItemTable,
} from '../styles/components/supply-item';
import AddRemoveItems from './add-remove-items';
import Button from './button';
import TransferProduct from './transfer-product';

interface Props {
  supply: StockItem;
  groups: Group[];
  operators: User[];
  managers: User[];
  user?: User;
  isGridView: boolean;
}

const SupplyItem: React.FC<Props> = ({
  supply,
  operators,
  groups,
  managers,
  user,
  isGridView,
}) => {
  const {
    toggleAddItems,
    openAddItems,
    toggleRemoveItems,
    openRemoveItems,
    toggleTransferProduct,
    openTransferProduct,
  } = useStock();

  return (
    <>
      {isGridView ? (
        <SupplyItemContainer>
          <div className="row">
            <h1 className="group heading-secondary-font">
              {supply.ownerLabel}
            </h1>
            <AiOutlineTool />
          </div>
          <div className="row">
            <h1 className="label ">{supply.label}</h1>
            <h1 className="qtd ">{`Quantidade: ${supply.quantity}`}</h1>
          </div>
          {user?.permissions?.createProducts || user?.role === 'OWNER' ? (
            <div className="buttons-row">
              <button
                className="remove-btn"
                type="button"
                onClick={() =>
                  toggleRemoveItems({
                    ownerItemId: supply.ownerId,
                    itemId: supply.id,
                  })
                }
              >
                Remover
              </button>
              <button
                className="add-btn"
                type="button"
                onClick={() =>
                  toggleAddItems({
                    ownerItemId: supply.ownerId,
                    itemId: supply.id,
                  })
                }
              >
                Adicionar
              </button>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() =>
              toggleTransferProduct({
                ownerItemId: supply.ownerId,
                itemId: supply.id,
              })
            }
          >
            Transferir
          </button>
        </SupplyItemContainer>
      ) : (
        <SupplyItemTable>
          <div className="label">{supply.label}</div>

          <div className="group">{supply.ownerLabel}</div>
          <div className="quantity">{supply.quantity}</div>

          <div className="transfer">
            <Button
              title="Transferir"
              color="primary"
              callback={() =>
                toggleTransferProduct({
                  ownerItemId: supply.ownerId,
                  itemId: supply.id,
                })
              }
            />
          </div>
          {user?.permissions?.createProducts || user?.role === 'OWNER' ? (
            <>
              <div className="add">
                <Button
                  title="Adicionar"
                  color="quartiary"
                  callback={() =>
                    toggleAddItems({
                      ownerItemId: supply.ownerId,
                      itemId: supply.id,
                    })
                  }
                />
              </div>
              <div className="remove">
                <Button
                  title="Remover"
                  color="tertiary"
                  callback={() =>
                    toggleRemoveItems({
                      ownerItemId: supply.ownerId,
                      itemId: supply.id,
                    })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div>-</div>
              <div>-</div>
            </>
          )}
        </SupplyItemTable>
      )}
      {openAddItems?.itemId === supply.id &&
      openAddItems.ownerItemId === supply.ownerId ? (
        <AddRemoveItems supply={supply} isAdd />
      ) : null}
      {openRemoveItems?.itemId === supply.id &&
      openRemoveItems.ownerItemId === supply.ownerId ? (
        <AddRemoveItems supply={supply} isAdd={false} />
      ) : null}
      {openTransferProduct?.itemId === supply.id &&
      openTransferProduct.ownerItemId === supply.ownerId ? (
        <TransferProduct
          supply={supply}
          isGroupStock
          groups={groups}
          operators={operators}
          managers={managers}
        />
      ) : null}
    </>
  );
};
export default SupplyItem;
