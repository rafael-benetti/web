import styled from 'styled-components';

export const HandlePointOfSalePageContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;
export const HandlePointOfSalePageContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  form {
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 3rem;
    }
    .form-buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      margin-top: 3rem;
      button {
        &:not(:last-child) {
          margin-right: 1.5rem;
        }
      }
    }
    .rent-input {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .check {
        margin-left: 1rem;
        label {
          flex-direction: row-reverse;
          div {
            margin-right: 1rem;
          }
        }
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    padding: 2rem 1.5rem;
    form {
      .form-grid {
        grid-gap: 1rem;
      }
      .form-buttons {
        flex-direction: column-reverse;
        justify-content: center;
        button {
          width: 100%;
          margin-bottom: 1rem;
          &:not(:last-child) {
            margin-right: 0;
          }
        }
      }
    }
  }
`;
