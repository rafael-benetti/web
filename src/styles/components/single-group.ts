import styled from 'styled-components';

export const SingleGroupContainer = styled.div`
  text-align: center;
  &:nth-of-type(odd) {
    background-color: rgba(245, 247, 250, 0.5);
  }
  &:hover {
    background-color: rgba(115, 102, 255, 0.1);
  }
  a {
    text-decoration: none;
    .edit-btn {
      display: grid;
      grid-template-columns: repeat(2, minmax(150px, 1fr));
      grid-template-rows: min-content;
      grid-auto-rows: min-content;
      align-items: center;
      outline: none;
      width: 100%;
      background-color: inherit;
      border-top: none;
      border-left: none;
      border-right: none;
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
    }
  }
`;
