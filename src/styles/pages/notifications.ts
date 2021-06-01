import styled from 'styled-components';

export const NotificationsContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const NotificationsContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  .filter {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    margin-bottom: 3rem;
  }
  @media screen and (max-width: 37.5em) {
    padding: 5rem 2rem;
    .filter {
      width: 100%;
    }
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
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 20px 0;
`;

export const SingleNotifications = styled.div`
  width: 100%;
  &:nth-of-type(odd) {
    background-color: rgba(245, 247, 250, 0.5);
  }
  &:hover {
    background-color: rgba(115, 102, 255, 0.1);
  }
  a {
    text-decoration: none;
    color: #333;
  }
  .row {
    display: grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
    grid-template-rows: min-content;
    grid-auto-rows: min-content;
    text-align: start;
    outline: none;
    width: 100%;
    background-color: inherit;
    border-top: none;
    border-left: none;
    border-right: none;
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    div {
      padding: 0.3rem;
    }
  }
`;
