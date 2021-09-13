import React, { useCallback } from 'react';
import { Group } from '../entiti/group';
import { BoxInfo } from '../entiti/machine-info';
import { Prize } from '../entiti/prize';
import { User } from '../entiti/user';
import { useMachine } from '../hooks/machine';
import { BoxCardContainer } from '../styles/components/box-card';
import Button from './button';
import FixMachineStock from './fix-machine-stock';
import PrizeRecoverInMachine from './prize-recover-in-machine';
import TransferProductToBox from './transfer-product-to-box';

interface Props {
  box: BoxInfo;
  index: number;
  group?: Group;
  machineId?: string;
  user?: User;
  typeOfPrize?: Prize;
  isRoleta: boolean;
}

const BoxCard: React.FC<Props> = ({
  box,
  index,
  group,
  machineId,
  user,
  typeOfPrize,
  isRoleta,
}) => {
  // hooks
  const {
    toggleTransferProductToBox,
    showTransferProductToBox,
    togglePrizeRecover,
    showPrizeRecover,
    toggleFixMachineStock,
    showFixMachineStock,
  } = useMachine();

  const calculateIncome = useCallback((money, prizes) => {
    const result = money / prizes;
    if (!result) {
      return 0;
    }
    if (result === Infinity) {
      return 0;
    }
    return result.toFixed(2);
  }, []);

  return (
    <>
      <BoxCardContainer>
        <h1 className="heading-secondary-font">
          {isRoleta ? 'Haste' : 'Cabine'}
          {` ${index + 1}`}
        </h1>

        <div className="line">
          <h2>Faturamento</h2>
          <h3 style={{ color: 'green' }}>
            R$
            {` ${box.currentMoney}`}
          </h3>
        </div>
        <div className="line">
          <h2>Prêmios entregues</h2>
          <h3 style={{ color: 'red' }}>{box.givenPrizes}</h3>
        </div>
        {user?.role !== 'OPERATOR' ? (
          <>
            <div className="line">
              <h2>Fat. médio p/ prêmio</h2>
              <h3 style={{ color: '#00161d' }}>
                R$
                {` ${calculateIncome(box.currentMoney, box.givenPrizes)}`}
              </h3>
            </div>
          </>
        ) : null}
        <div className="line">
          <h2>Estoque atual</h2>
          <h3 style={{ color: 'orange' }}>{box.currentPrizeCount}</h3>
        </div>
        <div className="stock-actions">
          <div className="line" />
          <p>Estoque</p>
          <div className="line" />
        </div>
        <Button
          title="Abastecer"
          color="primary"
          callback={() => toggleTransferProductToBox(box.boxId)}
        />
        <div className="row">
          {user?.role === 'OWNER' || user?.permissions?.fixMachineStock ? (
            <Button
              title="Corrigir"
              color="tertiary"
              callback={() => {
                toggleFixMachineStock(box.boxId);
              }}
            />
          ) : null}
          <Button
            title="Resgatar"
            color="secondary"
            callback={() => {
              togglePrizeRecover(box.boxId);
            }}
          />
        </div>
      </BoxCardContainer>
      {showTransferProductToBox === box.boxId ? (
        <TransferProductToBox
          box={box}
          index={index}
          group={group}
          machineId={machineId}
          typeOfPrize={typeOfPrize}
        />
      ) : null}
      {showPrizeRecover === box.boxId && (
        <PrizeRecoverInMachine
          box={box}
          index={index}
          group={group}
          machineId={machineId}
          typeOfPrize={typeOfPrize}
        />
      )}
      {showFixMachineStock === box.boxId && (
        <FixMachineStock box={box} index={index} machineId={machineId} />
      )}
    </>
  );
};
export default BoxCard;
