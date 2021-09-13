import styled, { css } from 'styled-components';

export const TransferMachineContainer = styled.div`
  position: fixed;
  top: 30%;
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
`;

interface NavBarProps {
  active: 'POINT_OF_SALE' | 'GROUP';
}

export const NavBar = styled.div<NavBarProps>`
  align-self: flex-start;
  margin: 2rem 0;
  button {
    border: none;
    padding: 1rem 2rem;
    border-radius: 1rem;
    margin-right: 1.5rem;
    background-color: #fff;
    -webkit-box-shadow: 0 0.3rem 0.5rem rgba(115, 102, 255, 0.3);
    box-shadow: 0 0.3rem 0.5rem rgba(115, 102, 255, 0.3);
    transition: all 0.5s;
    outline: none;

    &:hover {
      background-color: #00161d;
      h1 {
        color: #fff;
      }
    }
  }
  ${props => {
    if (props.active === 'POINT_OF_SALE') {
      return css`
        .location {
          background-color: #00161d;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    return css`
      .group {
        background-color: #00161d;
        h1 {
          color: #fff;
        }
      }
    `;
  }}
  @media screen and (max-width: 56.25em) {
    margin-left: 2rem;
  }
`;

export const TransferToLocation = styled.div`
  width: 100%;
  max-width: 50rem;

  .select-location {
    width: 100%;
    p {
      margin-bottom: 1rem;
    }
  }
  .transfer-btn {
    margin-top: 2rem;
    text-align: end;
  }
  .collect-btn {
    text-align: center;
  }
  h2 {
    text-align: center;
    margin: 2rem;
  }
`;

export const TransferToGroup = styled.div`
  width: 100%;
  max-width: 50rem;

  .select-location {
    width: 100%;
    p {
      margin-bottom: 1rem;
    }
  }
  .transfer-btn {
    margin-top: 2rem;
    text-align: end;
  }
  .collect-btn {
    text-align: center;
  }
  h2 {
    text-align: center;
    margin: 2rem;
  }
`;
