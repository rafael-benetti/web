import styled from 'styled-components';

export const OperatorInfoContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const OperatorInfoContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.15);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.15);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
`;

export const Table = styled.div`
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
  }
  .primary-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(100px, 1fr));
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

export const SingleStock = styled.div`
  width: 100%;
  &:nth-of-type(odd) {
    background-color: rgba(245, 247, 250, 0.5);
  }
  &:hover {
    background-color: rgba(115, 102, 255, 0.1);
  }

  display: grid;
  grid-template-columns: repeat(2, minmax(100px, 1fr));
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
  .given-prizes {
    text-align: center;
  }
  .operator {
    text-align: center;
  }
  .telemetry {
    display: flex;
    align-items: center;
    svg {
      width: 2rem;
      height: 2rem;
      margin-right: 1rem;
    }
  }
`;
