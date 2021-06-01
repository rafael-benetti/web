/* eslint-disable no-underscore-dangle */
import React from 'react';
import { CounterType } from '../entiti/counter-type';
import { User } from '../entiti/user';
import { useCategory } from '../hooks/category';
import { CounterTypeContainer } from '../styles/components/single-counter-type';
import HandleCounterType from './handle-counter-type';

interface IProps {
  counterType: CounterType;
  user?: User;
}

const SingleCounterType: React.FC<IProps> = ({ counterType, user }) => {
  // hooks
  const { toggleEditCounterType, showEditCounterType } = useCategory();

  return (
    <CounterTypeContainer>
      <button
        type="button"
        className="edit-btn"
        onClick={() => {
          if (!user?.permissions?.editCategories && user?.role !== 'OWNER') {
            return;
          }
          toggleEditCounterType(counterType.id);
        }}
      >
        <div className="counter-type-name" style={{ textAlign: 'start' }}>
          {counterType.label}
        </div>
        <div className="counter-type">
          {counterType.type === 'IN' ? 'Entrada' : 'Saída'}
        </div>
      </button>
      {showEditCounterType === counterType.id ? (
        <HandleCounterType initialData={counterType} />
      ) : null}
    </CounterTypeContainer>
  );
};

export default SingleCounterType;
