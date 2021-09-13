import styled from 'styled-components';
import { shade } from 'polished';

export const AddRemoveItemsContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  transform: translate(-50%, -50%);
  z-index: 1500;
  background: #fff;
  border-radius: 0.5rem;
  padding: 3rem;
  width: 300px;
  h1 {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    color: #2b2b2b;
  }
  h2 {
    font-size: 1.8rem;
    color: #2b2b2b;
    margin-bottom: 2rem;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      margin-bottom: 1rem;
    }
    .amount {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 1rem;
      div {
        width: 5rem;
      }
      .minus-plus-btn {
        height: 3rem;
        margin: 0.5rem 0.5rem 0 0.5rem;
        padding: 0 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        color: #000;
        background: inherit;
      }
    }
    .add-btn {
      padding: 0.6rem 2.8rem;
      border: none;
      border-radius: 0.3rem;
      transition: all 0.4s;
      background-color: #28a745;
      margin-top: 1rem;
      color: #fff;
      &:hover {
        background-color: ${shade(0.2, '#28a745')};
      }
    }
    .remove-btn {
      padding: 0.6rem 2.8rem;
      border: none;
      border-radius: 0.3rem;
      transition: all 0.4s;
      background-color: #ff008c;
      margin-top: 1rem;
      color: #fff;
      &:hover {
        background-color: ${shade(0.2, '#ff008c')};
      }
    }
  }
`;
