import styled from 'styled-components';

export const SingleOperatorContainer = styled.div`
  width: 100%;
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
      grid-template-columns: repeat(5, minmax(150px, 1fr));
      grid-template-rows: min-content;
      grid-auto-rows: min-content;
      align-items: center;
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
      .avatar {
        img {
          height: 6rem;
          width: 6rem;
          border-radius: 5px;
          object-fit: cover;
        }
      }
    }
  }
`;
