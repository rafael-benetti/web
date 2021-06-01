import styled from 'styled-components';

export const ModalContainer = styled.div`
  position: fixed;
  top: 30vh;
  left: 50%;
  transform: translateX(-25%);
  width: 500px;
  background-color: #fff;
  z-index: 1000;
  border-radius: 0.5rem;
  padding: 3rem;
  -webkit-box-shadow: 0 0 20px rgba(89, 102, 122, 0.1);
  box-shadow: 0 0 20px rgba(89, 102, 122, 0.1);
  .modal-title {
    margin-bottom: 3rem;
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
