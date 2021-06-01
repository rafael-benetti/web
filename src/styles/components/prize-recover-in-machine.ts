import styled from 'styled-components';

export const PrizeRecoverInMachineContainer = styled.div`
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
  .title {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    color: #2b2b2b;
    align-self: flex-start;
  }
  width: 100%;
  max-width: 50rem;

  .select-location {
    width: 100%;
    p {
      margin-bottom: 1rem;
    }
  }
  .quantity {
    align-self: flex-start;
    margin: 2rem 0;
  }
  .transfer-btn {
    margin-top: 2rem;
    width: 100%;
    text-align: end;
    button {
      &:not(:last-child) {
        margin-right: 2rem;
      }
    }
  }
  .choose-stock {
    width: 100%;
    text-align: start;
    h2 {
      font-size: 1.5rem;
      margin-bottom: 2rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 2rem;
    }
  }
`;
