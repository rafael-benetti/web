import styled from 'styled-components';

export const RemovePointInRouteContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  z-index: 100;
  background: #fff;
  border-radius: 0.5rem;
  padding: 3rem;
  width: 50rem;
  min-height: 20rem;

  h1 {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    color: #2b2b2b;
    align-self: flex-start;
  }
  .warning {
    border: 1px solid #ccc;
    padding: 2rem;
    margin-bottom: 2rem;
    h2 {
      font-size: 2.2rem;
      color: #2b2b2b;
      text-align: center;
      color: red;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.5rem;
      text-align: center;
    }
  }
  .select-input {
    width: 100%;
  }
  .btn {
    width: 100%;
    text-align: center;
    button:not(:last-child) {
      margin-right: 2rem;
    }
  }
  @media screen and (max-width: 37.5em) {
    width: 300px;
    height: 200px;
  }
`;
