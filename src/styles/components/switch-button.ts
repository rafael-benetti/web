import styled from 'styled-components';

import check from '../../assets/check.svg';

export const SwitchContainer = styled.div`
  input {
    display: none;
  }
  label {
    div {
      margin-top: 0.8rem;
      position: relative;
      width: 6rem;
      height: 3.4rem;
      border-radius: 2rem;
      background-color: #f4f4f4;
      &::before {
        content: '';
        position: absolute;
        bottom: 0.4rem;
        left: 0.4rem;
        height: 2.6rem;
        width: 2.6rem;
        border-radius: 50%;
        background: green;
        z-index: 5;
        background: #fff;
        transition: all 0.4s;
      }
      &::after {
        content: 'x';
        position: absolute;
        left: 1.2rem;
        top: 0.8rem;
        font-weight: 400;
        font-size: 1.6rem;
        opacity: 0.3;
        color: #2c323f;
        z-index: 10;
        transition: all 0.3s;
      }
    }
    &:hover {
      cursor: pointer;
    }
  }
  input[type='checkbox']:checked + label {
    div {
      background-color: #7366ff;
      &::before {
        content: '';

        transform: translateX(2.6rem);
      }
      &::after {
        content: url(${check});
        opacity: 1;
        font-weight: bold;
        left: 3.6rem;
      }
    }
  }
`;
