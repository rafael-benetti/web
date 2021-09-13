import styled, { css } from 'styled-components';

export const PointOfSaleInfoContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const PointOfSaleInfoContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.15);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.15);
  .first-row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    .actions {
      flex: 1;
      border-radius: 1.5rem;
      padding: 3rem;
      -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
      box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
      margin-left: 2rem;
      h1 {
        margin-bottom: 2rem;
      }
      .buttons {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        grid-gap: 3rem;
        justify-content: space-between;
        button {
          width: 100%;
        }
      }
    }
    .general {
      flex: 2;
      border-radius: 1.5rem;
      padding: 3rem;
      -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
      box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
      h1 {
        border-bottom: 2px solid #fff;
        margin-bottom: 2rem;
      }
      .general-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;

        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          svg {
            margin-right: 0.5rem;
          }
        }
        button {
          background-color: #00161d;
          border: none;
          border-radius: 3px;
          padding: 0.5rem;
          h2 {
            color: #fff;
          }
        }
        .spacer {
          flex: 1;
          height: 1px;
          background-color: rgba(115, 102, 255, 0.1);
          margin: 0 1.5rem;
        }
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 0rem;
    .first-row {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .actions {
        margin-left: 0;
        margin-top: 1.5rem;
        width: 100%;
        padding: 1rem 2rem;
        .buttons {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          grid-gap: 2rem;

          button {
            margin: 0 !important;
          }
        }
      }
      .general {
        width: 100%;
        h1 {
          margin-left: 1rem;
        }
        margin-top: 1rem;
        flex: 1;
        padding: 1rem 2rem;
      }
    }
  }
`;

export const MachinesInPointOfSale = styled.div`
  margin-top: 2rem;
  border-radius: 1.5rem;
  padding: 3rem;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  @media screen and (max-width: 37.5em) {
    padding: 3rem 2rem;
    margin-top: 1.5rem;
  }
`;

export const Table = styled.div`
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
  }
  .primary-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, minmax(10rem, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
  .total {
    display: grid;
    grid-template-columns: 4fr 1fr;
  }
`;

interface NavBarProps {
  active: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
}

export const NavBar = styled.div<NavBarProps>`
  margin: 2rem 0;
  display: flex;
  align-items: center;
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
  div {
    width: 100%;
  }
  ${props => {
    if (props.active === 'DAILY') {
      return css`
        .daily {
          background-color: #00161d;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    if (props.active === 'WEEKLY') {
      return css`
        .weekly {
          background-color: #00161d;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    if (!props.active) {
      return css`
        .period {
          background-color: #00161d;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    return css`
      .monthly {
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

export const ManagementInfo = styled.div`
  margin-top: 2rem;
  border-radius: 1.5rem;
  padding: 3rem;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  .is-loading {
    height: 30vh !important;
  }
  .cards {
    width: 65%;
    display: flex;
    flex-direction: row;
  }
  .date-picker {
    color: #333;
  }
  .filters {
    div {
      #datePicker-15 {
        div {
          div {
            input {
              padding: 2rem 1rem;
              font-size: 1.4rem;
              border-radius: 5px;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 2rem;
    margin-top: 1.5rem;
    .cards {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      div {
        margin-right: 0;
      }
    }
  }
`;

export const MachinesRate = styled.div`
  margin-top: 2rem;
  border-radius: 1.5rem;
  padding: 3rem;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 2rem;
    margin-top: 1.5rem;
    .row {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;
