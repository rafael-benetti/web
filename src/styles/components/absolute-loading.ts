import styled from 'styled-components';

export const AbsoluteLoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  .loading {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 20rem;
    height: 20rem;
    background: #00161d;
    border-radius: 1rem;
    opacity: 0.6;
  }
`;
