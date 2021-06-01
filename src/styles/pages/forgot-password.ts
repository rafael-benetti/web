import styled, { keyframes } from 'styled-components';

const appear = keyframes`
  from: {
    opacity: 0
  }
  to: {
    opacity: 1
  }
`;

export const ForgotPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  animation: ${appear} 0.8s;
  img {
    width: 250px;
  }
  .filter {
    margin: 3rem 0 3rem 0;
  }
  .back {
    a {
      display: flex;
    }
    margin-bottom: 3rem;
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
    .column {
      margin: 3rem 0 2rem 0;
      .link {
        text-align: right;
        margin-top: 1rem;
      }
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
