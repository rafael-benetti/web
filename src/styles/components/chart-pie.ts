import styled from 'styled-components';

export const ChartPieContainer = styled.div`
  position: relative;
  min-height: 30rem;
  margin: 0 auto;
  max-width: 60rem;
  .chart-container {
    padding: 2rem 0;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }
`;
