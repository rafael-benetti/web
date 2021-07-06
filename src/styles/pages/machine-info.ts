import styled, { css } from 'styled-components';

export const SingleMachineContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

interface Props {
  maintenance?: boolean;
}

export const SingleMachineContent = styled.div<Props>`
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
    .column-info {
      flex: 4;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      .info {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        flex-wrap: wrap;
      }
      .actions {
        background-color: #fff;
        border-radius: 1.5rem;
        padding: 3rem;
        -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
        box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
        margin-right: 2rem;
        h1 {
          margin-bottom: 2rem;
        }
        .buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 1rem;
          justify-content: space-between;
          button {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
    .general {
      flex: 2;
      border-radius: 1.5rem;
      padding: 3rem;
      -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
      box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
      background-color: #fff;

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
        .spacer {
          flex: 1;
          height: 1px;
          background-color: rgba(115, 102, 255, 0.1);
          margin: 0 1.5rem;
        }
        a {
          text-decoration: none;
        }
        button {
          background-color: #7366ff;
          border: none;
          border-radius: 3px;
          padding: 0.5rem;
          h2 {
            color: #fff;
          }
        }
      }
    }
  }

  .operational {
    background-color: #fff;
    margin-top: 2rem;
    border-radius: 1.5rem;
    padding: 3rem;
    -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    .is-loading {
      height: 20vh;
    }
    .cards {
      width: 65%;
      display: flex;
      flex-direction: row;
    }
  }
  .last-collection {
    background-color: #fff;

    margin-top: 2rem;
    border-radius: 1.5rem;
    padding: 3rem;
    -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    .all-cabins {
      margin-top: 2rem;
      background: #fff;
      -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
      box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
      padding: 2rem;
      .row {
        margin-top: 2rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        div {
          text-align: center;
          h3 {
            margin-top: 1rem;
            font-size: 1.8rem;
          }
        }
      }
    }
    .box-cards {
      margin-top: 2rem;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 3rem;
    }
  }
  .history {
    background-color: #fff;
    margin-top: 2rem;
    border-radius: 1.5rem;
    padding: 3rem;
    -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  }
  .delete-machine {
    margin-top: 2rem;
    text-align: end;
  }

  @media screen and (max-width: 37.5em) {
    padding: 3rem 0rem;
    .first-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .column-info {
        width: 100%;
        flex: 1;
        .info {
          display: grid;
          grid-template-columns: 1fr;
          div {
            margin-right: 0;
          }
        }
        .actions {
          margin-right: 0;
          .buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 2rem;

            button {
              margin: 0 !important;
            }
          }
        }
      }
    }
    .general {
      h1 {
        margin-left: 1rem;
      }
      margin-top: 1rem;
      flex: 1;
      width: 100%;
      padding: 1rem 0rem;
    }
    .operational {
      h1 {
        margin-left: 1rem;
      }
      padding: 1rem 0rem;
      .cards {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        div {
          margin-right: 0;
        }
      }
    }
    .last-collection {
      h1 {
        margin-left: 1rem;
      }
      padding: 1rem 0rem;
      .box-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 2rem;
      }
    }
    .history {
      h1 {
        margin-left: 1rem;
      }
      padding: 1rem 0rem;
    }
  }

  ${props =>
    props.maintenance &&
    css`
      background-color: rgba(150, 40, 27, 0.9);
    `}
`;

export const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1 0 30rem;
  background: #fff;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  padding: 3rem;
  margin-right: 2rem;
  margin-bottom: 2rem;
  border-radius: 1.5rem;
  h1 {
    margin-bottom: 1rem;
    font-weight: 500;
    line-height: 1.2;
  }
  h2 {
    font-weight: 400;
    font-size: 1.4rem;
  }
  svg {
    align-self: center;
    width: 2.4rem;
    height: 2.4rem;
    margin-right: 2rem;
  }
`;

interface NavBarProps {
  active: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export const NavBar = styled.div<NavBarProps>`
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
      background-color: #7366ff;
      h1 {
        color: #fff;
      }
    }
  }
  ${props => {
    if (props.active === 'DAILY') {
      return css`
        .daily {
          background-color: #7366ff;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    if (props.active === 'WEEKLY') {
      return css`
        .weekly {
          background-color: #7366ff;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    return css`
      .monthly {
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

export const BoxCard = styled.div`
  background: #fff;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  padding: 2rem;
  .line {
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  button {
    width: 100%;
    margin-top: 2rem;
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
    grid-template-columns: repeat(4, minmax(10rem, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
`;

export const History = styled.div`
  margin-top: 3rem;
  background: #fff;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  border-radius: 1.5rem;
  padding: 3rem;
  .grid-history {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;
    .history-events {
      .title {
        display: flex;
        justify-content: space-between;
        h1 {
          margin-bottom: 2rem;
        }
      }
    }
    .remote {
      .history-remote {
        .title {
          display: flex;
          justify-content: space-between;
          h1 {
            margin-bottom: 2rem;
          }
        }
      }
    }
  }
`;

export const HistoryCard = styled.div`
  display: grid;
  grid-template-columns: 7rem repeat(2, 1fr);
  padding: 2rem 0;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(115, 102, 255, 0.1);
  }
  div {
    .time {
      color: #999;
      text-align: end;
      margin-bottom: 1rem;
    }
  }
  .circle {
    height: 5rem;
    width: 5rem;
    border-radius: 50%;
    text-align: center;
    svg {
      color: #fff;
      height: 3rem;
      width: 3rem;
      transform: translateY(25%);
    }
  }
`;
export const RemoteCard = styled.div`
  display: grid;
  grid-template-columns: 7rem 1fr 7rem;
  padding: 2rem 0;
  &:not(:last-child) {
    border-bottom: 1px solid rgba(115, 102, 255, 0.1);
  }
  div {
    .time {
      color: #999;
      text-align: end;
      margin-bottom: 1rem;
    }
  }
  .circle {
    height: 5rem;
    width: 5rem;
    border-radius: 50%;
    text-align: center;
    svg {
      color: #fff;
      height: 3rem;
      width: 3rem;
      transform: translateY(25%);
    }
  }
`;
