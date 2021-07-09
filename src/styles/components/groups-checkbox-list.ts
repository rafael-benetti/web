import styled from 'styled-components';

export const GroupsCheckboxListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 1rem;

  div {
    display: flex;
    align-items: center;
    input[type='checkbox'] {
      width: 2rem;
      height: 2rem;
      margin-right: 1rem;
      &:hover {
        cursor: pointer;
      }
    }
    &:hover {
      cursor: pointer;
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
