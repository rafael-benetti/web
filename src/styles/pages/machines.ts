import styled from 'styled-components';

export const MachinesContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const MachinesContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  .filter {
    width: 100%;
    margin-bottom: 3rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    .reset-filter {
      border: none;
      background-color: inherit;
      text-align: start;
      color: blue;
      outline: none;
    }
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 1.5rem;
    .filter {
      width: 100%;
      grid-template-columns: repeat(2, 1fr);
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
    grid-template-columns: repeat(7, minmax(100px, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
  .operator {
    text-align: center;
  }
  .given-prizes {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    svg {
      margin-left: 1rem;
    }
    &:hover {
      cursor: pointer;
    }
    &:hover::before {
      content: 'Prêmios entregues desde a última coleta';
      position: absolute;
      bottom: 3rem;
      left: 0;
      border-radius: 2rem;
      padding: 1rem;
      background-color: #ccc;
      color: #333;
      font-weight: 400;
      transition: all ease 0.4s;
    }
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

export const Legend = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 0;
  div {
    display: flex;
    flex-direction: row;
    margin-right: 1rem;
    svg {
      margin-right: 0.5rem;
    }
  }
`;
