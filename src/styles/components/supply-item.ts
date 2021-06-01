import styled from 'styled-components';
import { shade } from 'polished';

export const SupplyItemContainer = styled.div`
  padding: 2rem;
  border-radius: 1rem;
  -webkit-box-shadow: 0 0.5rem 1rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0.5rem 1rem rgba(115, 102, 255, 0.1);
  .row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    svg {
      width: 1.5rem;
      height: 1.5rem;
      color: #f73164;
    }
  }
  h1 {
    margin-bottom: 2rem;
  }
  .buttons-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.2rem;
    border-top: 1px solid #eee;
    padding-top: 2rem;
    .remove-btn {
      background-color: #f73164;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-right: 0.1rem;
      &:hover {
        background-color: ${shade(0.2, '#f73164')};
      }
    }
    .add-btn {
      background-color: #28a745;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: 0.1rem;
      &:hover {
        background-color: ${shade(0.2, '#28a745')};
      }
    }
  }
  button {
    width: 100%;
    padding: 0.8rem;
    border: none;
    background-color: #7366ff;
    border-radius: 1rem;
    color: #fff;
    font-weight: 500;
    transition: all 0.5s;
    outline: none;
    &:hover {
      background-color: ${shade(0.2, '#7366ff')};
    }
  }
`;

export const SupplyItemTable = styled.div`
  width: 100%;
  &:nth-of-type(odd) {
    background-color: rgba(245, 247, 250, 0.5);
  }
  &:hover {
    background-color: rgba(115, 102, 255, 0.1);
  }

  display: grid;
  grid-template-columns: repeat(6, minmax(100px, 1fr));
  grid-template-rows: min-content;
  grid-auto-rows: min-content;
  text-align: start;
  outline: none;
  width: 100%;
  background-color: inherit;
  border-top: none;
  border-left: none;
  border-right: none;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  div {
    padding: 0.3rem;
  }
`;
