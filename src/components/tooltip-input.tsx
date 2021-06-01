import React from 'react';

import { Container } from '../styles/components/tooltip-input';

interface TooltipProps {
  title: string;
  className?: string;
}

const TooltipInput: React.FC<TooltipProps> = ({
  title,
  className = '',
  children,
}) => {
  return (
    <Container className={className}>
      {children}
      <span>{title}</span>
    </Container>
  );
};

export default TooltipInput;
