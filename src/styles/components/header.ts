import styled from 'styled-components';

export const HeaderContainer = styled.div`
  grid-column: start-container / end-container;
  grid-row: start-container / end-header;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #fff;
  -webkit-box-shadow: 0 0 20px rgba(89, 102, 122, 0.1);
  box-shadow: 0 0 20px rgba(89, 102, 122, 0.1);
  padding: 0 6rem;
  z-index: 20;
  @media screen and (max-width: 75em) {
    position: fixed;
    width: 100%;
  }
  @media screen and (max-width: 37.5em) {
    padding: 0 2rem;
  }
`;

export const UserMenu = styled.div`
  padding: 1.5rem 0;

  .header-menu {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    img {
      margin-right: 1.5rem;
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      object-fit: contain;
    }
    .label {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-around;
      color: #2b2b2b;
      letter-spacing: 0.7px;
      h1 {
        font-weight: bold;
        font-size: 1.4rem;
      }
      p {
        font-size: 1.2rem;
        line-height: 1;
        color: rgba(43, 43, 43, 0.7);
        font-weight: bold;
        svg {
          margin-left: 1rem;
        }
      }
    }
  }
  .menu {
    position: relative;
    width: 0;
    visibility: hidden;
    opacity: 0;
    transition: all 0.4s;
    .menu-content {
      position: absolute;
      top: 1rem;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 1rem;
      -webkit-box-shadow: 0 0 20px rgba(89, 102, 122, 0.1);
      box-shadow: 0 0 20px rgba(89, 102, 122, 0.1);
      z-index: 100;
      color: #2b2b2b;
      width: 0;
      visibility: hidden;
      opacity: 0;
      a {
        text-decoration: none;
      }
      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 1rem;
        border: none;
        visibility: hidden;
        width: 0;
        background-color: inherit;
        transition: color 0.4s;
        &:not(:last-child) {
          border-bottom: 1px solid #f8f9fa;
        }
        span {
          font-size: 1.4rem;
          letter-spacing: 0.7px;
          margin-left: 1rem;
        }
        &:hover {
          color: #6f42c1;
        }
      }
    }
    &::after {
      content: '';
      position: absolute;
      transform: rotate(45deg);
      width: 0;
      opacity: 0;
      visibility: none;
      background-color: #fff;
      -webkit-box-shadow: 0 0 20px rgba(89, 102, 122, 0.1);
      box-shadow: 0 0 20px rgba(89, 102, 122, 0.1);
      z-index: -1;
    }
  }
  &:hover {
    .menu {
      width: 16rem;
      visibility: visible;
      opacity: 1;
      .menu-content {
        width: 18rem;
        visibility: visible;
        opacity: 1;
        button {
          width: 16rem;
          visibility: visible;
          opacity: 1;
        }
      }
      &::after {
        top: 0.5rem;
        right: -0.5rem;
        height: 2rem;
        width: 2rem;
        opacity: 1;
        visibility: visible;
      }
      .menu-content {
        cursor: pointer;
      }
    }
  }
  &:hover {
    cursor: pointer;
  }
`;
