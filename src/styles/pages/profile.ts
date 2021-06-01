import styled from 'styled-components';

export const ProfileContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const ProfileContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  label {
    .img {
      img {
        object-fit: contain;
        height: 25rem;
        width: 25rem;
        border-radius: 5px;
        &:hover {
          cursor: pointer;
        }
      }
    }

    #file-picker {
      visibility: hidden;
    }
  }

  form {
    width: 50%;
    min-width: 350px;
    margin-top: 2.5rem;
    div {
      margin-bottom: 2rem;
    }
    .changing-password {
      .change-password-btn {
        background-color: inherit;
        border: none;
        margin-top: 1rem;
        font-size: 1.4rem;
        color: var(--color-primary);
      }
      .confirm-password {
        margin-bottom: 0;
        .confirm {
          margin-bottom: 0;
          div {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .change-password {
    div {
      margin-bottom: 0;
    }
    .change-password-btn {
      background-color: inherit;
      border: none;
      margin-top: 1rem;
      font-size: 14px;
      color: var(--color-primary);
    }
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 1.5rem;
  }
`;
