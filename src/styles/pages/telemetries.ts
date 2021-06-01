import styled from 'styled-components';

export const TelemetriesContainer = styled.div`
  min-height: calc(100vh - 7rem);
  max-width: 100%;
  padding: 2.5rem;

  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const TelemetriesContent = styled.div`
  max-width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  padding: 3rem 1.5rem;

  .filter {
    width: 40%;
    margin-bottom: 3rem;
  }
  .warning-personal-group {
    text-align: center;
    margin: 2rem;
  }
  @media screen and (max-width: 37.5em) {
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
    grid-template-columns: repeat(5, minmax(100px, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
  .center {
    text-align: center;
  }
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

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 20px 0;
`;
