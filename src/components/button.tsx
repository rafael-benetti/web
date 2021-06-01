import React from 'react';
import { ClipLoader } from 'react-spinners';

import { ButtonContainer } from '../styles/components/button';

interface IProps {
  title: string;
  isSubmit?: boolean;
  color: string;
  callback?(): void;
  busy?: boolean;
}

const Button: React.FC<IProps> = ({
  title,
  isSubmit,
  color,
  callback,
  busy = false,
}) => {
  return (
    <ButtonContainer
      type={isSubmit ? 'submit' : 'button'}
      className="btn-font"
      color={color}
      onClick={() => {
        if (callback) callback();
      }}
    >
      {busy ? <ClipLoader size={15} color="#fff" /> : title}
    </ButtonContainer>
  );
};

export default Button;
