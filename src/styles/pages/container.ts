import styled from 'styled-components';

export const ContainerStyle = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: [start-container] 25rem [end-sidebar start-main] 1fr [end-container];
  grid-template-rows: [start-container] 60px [end-header start-main] 1fr [end-container];
  @media screen and (max-width: 75em) {
    grid-template-columns: [start-container] 0px [end-sidebar start-main] 1fr [end-container];
  }
  .main {
    grid-column: start-main / end-container;
    grid-row: start-main / end-header;
    z-index: 1;
    .is-loading {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
