import styled, { css } from 'styled-components';

export const CreateStockItemContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  transform: translate(-50%, -50%);
  z-index: 1500;
  background: #fff;
  border-radius: 0.5rem;
  padding: 3rem;
  h2 {
    margin-bottom: 2rem;
  }
  form {
    width: 100%;
    .label-input {
      margin-top: 2rem;
    }
    .quantity-cost {
      margin: 2rem 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 2rem;
    }
  }
`;

interface NavBarProps {
  active: 'PRIZE' | 'SUPPLY' | 'MACHINE';
}

export const NavBar = styled.div<NavBarProps>`
  display: flex;
  flex-direction: row;
  margin-bottom: 2rem;

  .btns {
    border: none;
    padding: 1rem 2rem;
    border-radius: 1rem;
    margin-right: 1.5rem;
    background-color: #fff;
    -webkit-box-shadow: 0 0.3rem 0.5rem rgba(115, 102, 255, 0.3);
    box-shadow: 0 0.3rem 0.5rem rgba(115, 102, 255, 0.3);
    transition: all 0.5s;
    outline: none;
    h1 {
      margin-bottom: 0;
    }

    &:hover {
      background-color: #7366ff;
      h1 {
        color: #fff;
      }
    }
  }
  ${props => {
    if (props.active === 'PRIZE') {
      return css`
        .prizes {
          background-color: #7366ff;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    if (props.active === 'MACHINE') {
      return css`
        .machines {
          background-color: #7366ff;
          h1 {
            color: #fff;
          }
        }
      `;
    }
    return css`
      .supplies {
        background-color: #7366ff;
        h1 {
          color: #fff;
        }
      }
    `;
  }}
  @media screen and (max-width: 56.25em) {
    margin-left: 2rem;
  }
`;
