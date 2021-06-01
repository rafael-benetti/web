import styled from 'styled-components';

export const CardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border: none;
  letter-spacing: 0.5px;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  padding: 2rem;
  overflow: hidden;
  height: 11rem;
  z-index: 1;
  .label {
    margin-left: 1.5rem;
    z-index: 3;

    p {
      margin-bottom: 0.5rem;
      color: #333;
    }
    span {
      font-size: 2rem;
      font-weight: bold;
    }
  }
  .background-icon {
    position: absolute;
    right: -2rem;
    transition: transform 0.4s ease;

    svg {
      height: 8rem;
      width: 8rem;
      opacity: 0.4;
      transform: rotate(0) scale(1);
    }
  }
  &:hover {
    cursor: pointer;
    .background-icon {
      transform: rotate(-10deg) scale(1.1);
    }
  }
`;
