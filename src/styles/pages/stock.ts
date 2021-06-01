import styled, { css } from 'styled-components';

export const StockContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const StockContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  .view {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    margin-bottom: 2rem;
    button {
      margin-left: 1rem;
      border: none;
      background-color: inherit;
      outline: none;
      svg {
        width: 2rem;
        height: 2rem;
      }
    }
    .colored {
      svg {
        color: #7366ff;
      }
    }
  }
  .filter {
    width: 40%;
    margin-bottom: 3rem;
  }
  @media screen and (max-width: 56.25em) {
    padding: 1rem 0;
    .filter {
      width: 100%;
      padding: 0 2rem;
    }
  }
`;

interface NavBarProps {
  active: 'PRIZES' | 'MACHINES' | 'SUPPLIES';
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
      background-color: #7366ff;
      h1 {
        color: #fff;
      }
    }
  }
  ${props => {
    if (props.active === 'PRIZES') {
      return css`
        .prizes {
          background-color: #7366ff;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    if (props.active === 'MACHINES') {
      return css`
        .machines {
          background-color: #7366ff;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    return css`
      .supplies {
        background-color: #7366ff;
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

export const TablePrize = styled.div`
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
  }
  .primary-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, minmax(100px, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
`;

export const TableMachine = styled.div`
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
  }
  .primary-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
`;

export const TableSupplies = styled.div`
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
  }
  .primary-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, minmax(100px, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
`;
