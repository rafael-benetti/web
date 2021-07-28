import styled from 'styled-components';

export const HandleRouteContainer = styled.div`
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
  min-width: 550px;
  h1 {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    color: #2b2b2b;
    align-self: flex-start;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 80%;
    width: 100%;
    .locations {
      margin: 2rem 0;
      p {
        margin-bottom: 1.5rem;
      }
      .no {
        text-align: center;
        margin-bottom: 1.5rem;
        color: red;
      }
      .scroll {
        max-height: 25vh;
        overflow-y: scroll;
      }
    }
    button {
      align-self: flex-end;
      width: 13rem;
      margin-top: 2rem;
    }
  }
  @media screen and (max-width: 37.5em) {
    width: 300px;
    height: 200px;
  }
`;
