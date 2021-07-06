import styled from 'styled-components';

export const SingleMachineContainer = styled.div`
  width: 100%;
  &:nth-of-type(odd) {
    background-color: rgba(245, 247, 250, 0.5);
  }
  &:hover {
    background-color: rgba(115, 102, 255, 0.1);
  }
  a {
    text-decoration: none;
    .edit-btn {
      display: grid;
      grid-template-columns: repeat(7, minmax(100px, 1fr));
      grid-template-rows: min-content;
      grid-auto-rows: min-content;
      text-align: start;
      outline: none;
      width: 100%;
      background-color: inherit;
      border-top: none;
      border-left: none;
      border-right: none;
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      div {
        padding: 0.3rem;
      }
      .given-prizes {
        text-align: center;
      }
      .operator {
        text-align: center;
      }
      .telemetry {
        display: flex;
        align-items: center;
        svg {
          width: 2rem;
          height: 2rem;
          margin-right: 1rem;
        }
      }
    }
  }
`;
