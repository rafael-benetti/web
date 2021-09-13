import styled from 'styled-components';
import check from '../../assets/check.svg';

export const PermissionsContainer = styled.div`
  .extra-permissions {
    .title {
      margin: 3rem 0 1.5rem 0;
    }
    .inputs {
      display: flex;
      flex-direction: row;
      align-items: center;
      .input-container {
        margin-right: 2rem;
        display: grid;
        justify-items: center;
        input {
          display: none;
        }
        label {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 10px;
          div {
            margin-left: 1rem;
            width: 2rem;
            height: 2rem;
            border: 1px solid blue;
            border-radius: 0.3rem;
            background-color: #fff;
            -webkit-transition: border 0.15s ease-in-out,
              color 0.15s ease-in-out;
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
            color: #00161d;
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
            div {
              width: 2.5rem;
              height: 2.5rem;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 37.5em) {
    .extra-permissions {
      .title {
        margin: 1.5rem 0 1.5rem 0;
      }
    }
  }
`;

export const PermissionCheckboxTableContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr repeat(4, 10rem);
  align-items: center;
  padding: 1rem;
  &:nth-of-type(odd) {
    background-color: rgba(245, 247, 250, 0.5);
  }
  .input-container {
    display: grid;
    justify-items: center;
    input {
      display: none;
    }
    label {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
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
        color: #00161d;
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
        div {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    .input-container {
      justify-items: right;
    }
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

export const CreateUsersPermissions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 3rem;
  div {
    margin-right: 2rem;
    input {
      display: none;
    }
    label {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      div {
        width: 2rem;
        height: 2rem;
        border: 1px solid blue;
        border-radius: 0.3rem;
        background-color: #fff;
        -webkit-transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
        transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
        margin-left: 1rem;
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
        color: #00161d;
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
        div {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    .input-container {
      justify-items: right;
    }
  }
`;
