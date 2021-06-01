import styled from 'styled-components';
import { shade } from 'polished';

export const PersonalSupplyItemContainer = styled.div`
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
      margin-bottom: 2rem;
    }
  }
  h1 {
    margin-bottom: 2rem;
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
