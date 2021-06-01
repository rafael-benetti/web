import styled from 'styled-components';

export const GroupsContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;
export const GroupsContent = styled.div`
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
  .warning-personal-group {
    text-align: center;
    margin: 2rem;
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
  display: grid;
  grid-column: 1fr;
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
  }
`;
