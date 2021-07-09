import styled from 'styled-components';

export const CollectionsContainer = styled.div`
  min-height: calc(100vh - 7rem);
  max-width: 100%;
  padding: 2.5rem;

  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const CollectionsContent = styled.div`
  max-width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  padding: 3rem 1.5rem;

  .filters-container {
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
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
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1rem;
    border-bottom: 1px solid #9999;
  }
  .center {
    text-align: center;
  }
`;
