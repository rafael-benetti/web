import styled from 'styled-components';

export const HandleManagerContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const HandleContentManager = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  form {
    .section-info {
      display: grid;
      grid-template-columns: [start] calc(50% - 1.5rem) [middle] 1fr [end];
      grid-gap: 3rem;
      align-items: center;
      .phone-password {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        div {
          &:not(:last-child) {
            margin-right: 3rem;
          }
        }
      }
    }
    .section-groups {
      .title {
        margin: 3rem 0 1.5rem 0;
      }
    }
    .section-permissions {
      .title {
        margin: 3rem 0 1.5rem 0;
      }
    }
    .divider {
      height: 1px;
      width: 100%;
      background-color: rgba(245, 247, 250, 0.9);
      margin: 3rem 0;
    }
    .submit-buttons {
      text-align: end;
      button {
        &:not(:last-child) {
          margin-right: 1.5rem;
        }
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 1.5rem;
    form {
      .section-info {
        grid-gap: 1rem;
        grid-template-columns: [start] calc(50% - 0.5rem) [middle] 1fr [end];

        .phone-password {
          grid-column: start/end;
          display: flex;
          grid-column-gap: 1rem;
          div {
            &:not(:last-child) {
              margin-right: 0;
            }
          }
        }
      }
      .section-groups {
        .title {
          margin: 1.5rem 0 1.5rem 0;
        }
      }
      .section-permissions {
        .title {
          margin: 1.5rem 0 1.5rem 0;
        }
      }
    }
  }
`;

export const CreateUsersPermissions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 3rem;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 2rem;
  h2 {
    margin-right: 1rem;
  }
  &:hover {
    cursor: pointer;
  }
`;

export const Table = styled.div`
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
  }
  .primary-row {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr repeat(4, 10rem);
    border-bottom: 1px solid #9999;
    border-top: 1px solid #9999;
    div {
      padding: 1rem;
    }
  }
  @media screen and (max-width: 37.5em) {
    .primary-row {
      justify-items: right;
    }
  }
`;

export const PermissionsType = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr repeat(4, 10rem);
  align-items: center;
  padding: 1rem;
  &:nth-of-type(odd) {
    background-color: rgba(245, 247, 250, 0.5);
  }
  .inputs {
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(4, 10rem);
    input[type='checkbox'] {
      width: 2rem;
      height: 2rem;
      &:hover {
        cursor: pointer;
      }
    }
  }
`;
