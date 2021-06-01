import styled from 'styled-components';

export const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  img {
    width: 250px;
  }
  .responsible-space {
    display: none;
  }
  @media screen and (max-width: 56.25em) {
    padding: 0 3rem;

    .responsible-space {
      display: block;
      height: 10vh;
    }
  }
`;

export const Content = styled.div`
  width: 460px;
  background: #fff;
  border-radius: 1.5rem;
  padding: 3.2rem 2.4rem;
  margin-top: 2rem;
  -webkit-box-shadow: 0 0 37px rgba(8, 21, 66, 0.05);
  box-shadow: 0 0 37px rgba(8, 21, 66, 0.05);
  form {
    div {
      margin-bottom: 3rem;
    }
  }
  @media screen and (max-width: 56.25em) {
    width: 100%;
    form {
      button {
        width: 100%;
      }
    }
  }
`;
