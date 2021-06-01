import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    background: #70bb35;
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 400;
    opacity: 0;
    transition: opacity 0.4s;
    visibility: hidden;

    position: absolute;
    bottom: calc(100% + 12px);
    width: 160px;
    left: 50%;
    transform: translateX(-50%);
    color: #111;

    &::before {
      content: '';
      border-style: solid;
      border-color: #70bb35 transparent;
      border-width: 6px 6px 0 6px;
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
