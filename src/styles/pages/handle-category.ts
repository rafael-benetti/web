import styled from 'styled-components';

export const HandleCategoryContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const HandleCategoryContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.2);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.2);
  form {
    .label-input {
      width: 40%;
    }
    .add-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      border: none;
      background-color: inherit;
      color: #7366ff;
      margin-top: 2.5rem;
      svg {
        margin-left: 0.3rem;
      }
    }

    .submit-btn {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      margin-top: 2.5rem;
    }
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 1.5rem;
    form {
      .label-input {
        width: 100%;
      }
    }
  }
`;

export const Boxes = styled.div`
  position: relative;
  width: 100%;
  margin-top: 3rem;
  padding: 5rem 3rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.2);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.2);
  .cabine-title {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    svg {
      margin-right: 1rem;
    }
  }
  .delete-box-btn {
    border: none;
    background-color: inherit;
    color: #f73164;
    svg {
      height: 2rem;
      width: 2rem;
    }
  }
  .add-counter {
    position: absolute;
    bottom: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: none;
    background-color: inherit;
    color: #a927f9;
    svg {
      margin-left: 0.3rem;
    }
  }
`;

export const Counters = styled.div`
  margin-top: 1rem;
  padding: 2rem 0;
  border-top: 1px solid #ccc;
  .counter-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
    .delete-counter-btn {
      border: none;
      background-color: inherit;
      color: #f73164;
      svg {
        height: 2rem;
        width: 2rem;
        margin-right: 1rem;
      }
    }
  }
  .grid-counter {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 2rem;

    .clock-counter {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
    }
  }
  @media screen and (max-width: 37.5em) {
    .grid-counter {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;
