import styled from 'styled-components';

export const OperatorsContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
`;

export const OperatorsContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  .filter {
    width: 40%;
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
  width: 100%;
  .table-title {
    background: rgba(115, 102, 255, 0.1);
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
`;

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 20px 0;
`;
