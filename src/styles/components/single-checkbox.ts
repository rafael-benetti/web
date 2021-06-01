import styled from 'styled-components';
import check from '../../assets/check.svg';

export const SingleCheckboxContainer = styled.div`
  input {
    display: none;
  }
  label {
    div {
      width: 2rem;
      height: 2rem;
      border: 1px solid blue;
      margin-left: 1rem;
      border-radius: 0.3rem;
      background-color: #fff;
      -webkit-transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
      transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
      &::after {
        content: '';
        position: absolute;
        opacity: 0;
        visibility: none;
        transition: all 0.3s;
      }
    }
    &:hover {
      cursor: pointer;
    }
    span {
      margin-left: 1rem;
    }
  }
  input[type='checkbox']:checked + label {
    div {
      color: #7366ff;
      &::after {
        content: url(${check});
        position: absolute;
        opacity: 1;
        visibility: visible;
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    label {
      div {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  }
  label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 1.5rem;
    &:hover {
      cursor: pointer;
    }
  }
`;
