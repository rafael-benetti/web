import React from 'react';

import { Container } from '../styles/components/container-with-opacity';

interface IProps {
  showContainer?(): void;
}

const ContainerWithOpacity: React.FC<IProps> = ({ showContainer }) => {
  return <Container onClick={showContainer} />;
};

export default ContainerWithOpacity;
