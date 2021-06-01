import styled from 'styled-components';

export const SingleGroupContainer = styled.div`
  text-align: center;
  &:nth-of-type(odd) {
    background-color: rgba(245, 247, 250, 0.5);
  }
  &:hover {
    background-color: rgba(115, 102, 255, 0.1);
  }
  .edit-btn {
    outline: none;
    width: 100%;
    background-color: inherit;
    border-top: none;
    border-left: none;
    border-right: none;
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
  }
`;
