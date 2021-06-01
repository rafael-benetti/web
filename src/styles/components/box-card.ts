import styled from 'styled-components';

export const BoxCardContainer = styled.div`
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
  .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .stock-actions {
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    p {
      margin: 0 1rem;
    }
    .line {
      margin: 0;
      width: 100%;
      height: 1px;
      background-color: #ccc;
    }
  }
  button {
    margin-top: 1rem;
    width: 100%;
  }
`;
