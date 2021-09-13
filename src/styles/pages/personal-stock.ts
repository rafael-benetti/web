import styled, { css } from 'styled-components';

export const PersonalStockContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const PersonalStockContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);

  @media screen and (max-width: 56.25em) {
    padding: 1rem 0;
    .filter {
      width: 100%;
      padding: 0 2rem;
    }
  }
`;

interface NavBarProps {
  active: 'PRIZES' | 'SUPPLIES';
}

export const NavBar = styled.div<NavBarProps>`
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
    if (props.active === 'PRIZES') {
      return css`
        .prizes {
          background-color: #00161d;
          h1 {
            color: #fff;
          }
        }
      `;
    }

    return css`
      .supplies {
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

export const StockItems = styled.div`
  margin-top: 3rem;
  .items {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 3rem;
  }
  @media screen and (max-width: 87.5em) {
    .items {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media screen and (max-width: 56.25em) {
    .items {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
