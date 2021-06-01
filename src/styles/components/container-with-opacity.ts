import styled, { keyframes } from 'styled-components';

const appear = keyframes`
  from{
    opacity: 0;
  },
  to {
    opacity: 0.2;
  }
`;

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 90;
  background: #000;
  opacity: 0.2;
  min-height: 100vh;
  width: 100%;
  animation: ${appear} 1s;
`;
