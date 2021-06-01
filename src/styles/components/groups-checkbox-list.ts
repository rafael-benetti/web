import styled from 'styled-components';
import check from '../../assets/check.svg';

export const GroupsCheckboxListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  input {
    display: none;
  }
  label {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 1rem;
    div {
      width: 2rem;
      height: 2rem;
      border: 1px solid blue;
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
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      margin-bottom: 10px;
      div {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`;
