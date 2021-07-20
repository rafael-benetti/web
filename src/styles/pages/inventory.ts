import styled from 'styled-components';

export const InventoryContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
`;

export const InventoryContent = styled.div`
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
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 4rem;
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 1.5rem;
    .filter {
      width: 100%;
    }
  }
`;

export const Table = styled.div`
  width: 100%;
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
  }
  .start {
    text-align: start;
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
  .column {
    margin-bottom: 0.5rem;
    border-left: 1px solid #9999;
    border-right: 1px solid #9999;
    &:not(:first-child) {
      border-top: 1px solid #9999;
    }

    .grid-table {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border-bottom: 1px solid #9999;
      .category {
        display: flex;
        align-items: center;
        padding: 4rem 2rem;
        border-right: 1px solid #9999;
        background: rgba(115, 102, 255, 0.1);
      }
      .labels {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        padding-left: 1rem;
      }
      .values {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
      }
    }
    .total {
      display: grid;
      grid-template-columns: 2fr 1fr;
      background: rgba(115, 102, 255, 0.1);
      padding: 1rem 0;
      border-bottom: 1px solid #9999;
      .total-label {
        padding-left: 2rem;
      }
    }
  }
`;
