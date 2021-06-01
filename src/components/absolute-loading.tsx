import React from 'react';
import { ClipLoader } from 'react-spinners';
import { AbsoluteLoadingContainer } from '../styles/components/absolute-loading';

const AbsoluteLoading: React.FC = () => {
  return (
    <AbsoluteLoadingContainer>
      <div className="loading">
        <div className="colored">
          <ClipLoader size={50} color="#fff" />
        </div>
      </div>
    </AbsoluteLoadingContainer>
  );
};
export default AbsoluteLoading;
