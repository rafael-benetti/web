import styled from 'styled-components';

export const OperatorRoutesContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const OperatorRoutesContent = styled.div`
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
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
  }
  @media screen and (max-width: 37.5em) {
    padding: 5rem 2rem;
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
    grid-template-columns: repeat(2, minmax(100px, 2fr)) 3fr;
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
    .locations {
      text-align: center;
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
