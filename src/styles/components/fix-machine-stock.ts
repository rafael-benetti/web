import styled from 'styled-components';

export const FixMachineStockContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  z-index: 100;
  background: #fff;
  border-radius: 0.5rem;
  padding: 3rem;
  width: 500px;
  h1 {
    font-size: 2.2rem;
    margin-bottom: 4rem;
    color: #2b2b2b;
    align-self: flex-start;
  }
  form {
    margin: 0;
    padding: 0;
    width: 100%;
    .first-input {
      margin-bottom: 1rem;
    }
    .btn {
      width: 100%;
      text-align: right;
      margin-top: 3rem;
      button:not(:last-child) {
        margin-right: 2rem;
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    width: 300px;
    height: 200px;
  }
`;
