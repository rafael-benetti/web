import styled from 'styled-components';

export const ModalTelemetryContainer = styled.div`
  position: fixed;
  top: 30vh;
  left: 50%;
  transform: translateX(-25%);
  width: 500px;
  background-color: #fff;
  z-index: 1000;
  border-radius: 0.5rem;
  padding: 3rem;
  .modal-title {
    margin-bottom: 3rem;
    .font {
      font-size: 1.5rem;
      font-weight: 500;
    }
  }
  .modal-text {
    margin-bottom: 3rem;
  }
  .modal-buttons {
    text-align: right;
    button {
      &:not(:last-child) {
        margin-right: 1.5rem;
      }
    }
  }
  @media screen and (max-width: 56.25em) {
    width: 80%;
    transform: translateX(-50%);
  }
`;
