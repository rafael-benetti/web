/* eslint-disable consistent-return */
import styled, { css } from 'styled-components';

export const DashboardContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  .filters-container {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
  }
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const DashboardContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  .title {
    margin-bottom: 2rem;
  }
`;

interface NotificationProps {
  count: number;
}

export const Notification = styled.button<NotificationProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: none;
  border-radius: 0.3rem;
  transition: all 0.4s;
  padding: 0.6rem 2.8rem;
  background-color: #00161d;
  p {
    color: #fff;
  }
  svg {
    margin-left: 1rem;
    color: #fff;
    height: 2rem;
    width: 2rem;
  }
  ${props => {
    if (props.count > 0) {
      return css`
        .circle {
          position: absolute;
          top: 0;
          right: 0;
          background-color: #ff008c;
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(25%, -25%);
          p {
            color: #fff;
          }
        }
      `;
    }
  }}
`;

export const Cards = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2rem;

  a {
    text-decoration: none;
  }

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
  background-color: #fff;

  .is-loading {
    height: 30vh !important;
  }
  .cards {
    width: 65%;
    display: flex;
    flex-direction: row;
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

export const DashboardInfo = styled.div`
  margin: 2rem 0 4rem 0;
  border-radius: 1.5rem;
  padding: 3rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  background-color: #fff;

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

export const DashboardAnalitycs = styled.div`
  background-color: #fff;

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

export const Tables = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
`;
