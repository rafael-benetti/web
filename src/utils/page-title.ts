import styled from 'styled-components';

export const PageTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 37.5em) {
    padding: 0 3rem;
  }
  a {
    text-decoration: none;
  }
`;
