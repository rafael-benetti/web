import styled, { css } from 'styled-components';

export const GroupInfoContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const Cards = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2rem;

  @media screen and (max-width: 56.25em) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
`;

export const ManagementInfo = styled.div`
  margin: 2rem 0 4rem 0;
  border-radius: 1.5rem;
  padding: 3rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  .is-loading {
    height: 30vh !important;
  }
  .cards {
    width: 65%;
    display: flex;
    flex-direction: row;
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

interface NavBarProps {
  active: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
}

export const NavBar = styled.div<NavBarProps>`
  margin: 2rem 0;
  display: flex;
  align-items: center;
  div {
    width: 100%;
  }
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

export const GroupInfo = styled.div`
  margin: 2rem 0 4rem 0;
  border-radius: 1.5rem;
  padding: 3rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  .title {
    margin-bottom: 2rem;
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

export const GroupAnalitycs = styled.div`
  margin: 2rem 0 4rem 0;
  border-radius: 1.5rem;
  padding: 3rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  .title {
    margin-bottom: 2rem;
  }
`;

export const Table = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
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
  .center {
    text-align: center;
  }
  .right {
    text-align: center;
  }
`;

export const TablePoint = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  max-height: 40rem;
  overflow-y: scroll;
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
  .center {
    text-align: center;
  }
  .right {
    text-align: center;
  }
`;

export const Tables = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
`;

export const PointsOfSaleRank = styled.div`
  margin-top: 3rem;
`;
