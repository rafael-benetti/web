import styled, { css } from 'styled-components';

interface Props {
  isToggle: boolean;
}

export const SideBarContainer = styled.div<Props>`
  position: fixed;
  width: 25rem;
  grid-column: start-container / end-sidebar;
  grid-row: start-container / end-container;
  min-height: 100vh;
  background-color: #fff;
  -webkit-box-shadow: 0 0 2rem 0 rgba(89, 102, 122, 0.1);
  box-shadow: 0 0 2rem 0 rgba(89, 102, 122, 0.1);
  text-align: center;
  z-index: 900;
  @media screen and (max-width: 75em) {
    position: fixed;
    top: 0;
    left: -300px;
    width: 250px;
    transition: all 0.5s;
    z-index: 900;
    ${props =>
      props.isToggle &&
      css`
        left: 0;
      `}
  }
`;

export const SideBarLogo = styled.div`
  img {
    padding: 3rem;
    max-width: 100%;
    height: auto;
    -webkit-box-shadow: -0.9rem 0 2rem rgba(89, 102, 122, 0.1);
    box-shadow: -0.9rem 0 2rem rgba(89, 102, 122, 0.1);
  }
`;

export const SideBarNav = styled.nav`
  width: 100%;
  padding: 2rem;
`;

interface IProps {
  active: string;
}

export const NavBtn = styled.div<IProps>`
  width: 100%;
  margin-bottom: 0.5rem;
  a {
    text-decoration: none;
  }
  .nav-link {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem 1rem;
    border-radius: 0.5rem;
    border: none;
    width: 100%;
    color: #2b2b2b;
    text-decoration: none;
    background-image: linear-gradient(
      90deg,
      #fff 0%,
      #fff 50%,
      rgb(106, 118, 122) 50%,
      rgb(230, 231, 231) 100%
    );
    background-size: 230%;
    transition: all 0.4s;
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: 0.5px;
    svg {
      flex: 1;
    }
    .icon {
      flex: 1;
      transform: rotate(0deg);
      transition: transform 0.4s;
    }
    span {
      text-align: start;
      flex: 5;
      padding-left: 1rem;
    }
    &:active {
      outline: none;
      background-position: 100%;
      color: #fff;
    }
  }
`;

export const NavSelectBtn = styled.div<IProps>`
  width: 100%;
  margin-bottom: 0.5rem;
  input {
    display: none;
  }
  input[type='checkbox'] + label {
    .nav-link {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 1rem 1rem;
      border-radius: 0.5rem;
      border: none;
      width: 100%;
      color: #2b2b2b;
      text-decoration: none;
      background-image: linear-gradient(
        90deg,
        #fff 0%,
        #fff 50%,
        rgb(106, 118, 122) 50%,
        rgb(230, 231, 231) 100%
      );
      background-size: 230%;
      transition: all 0.4s;
      font-size: 1.4rem;
      font-weight: bold;
      letter-spacing: 0.5px;
      svg {
        flex: 1;
      }
      .icon {
        flex: 1;
        transform: rotate(0deg);
        transition: transform 0.4s;
      }
      span {
        text-align: start;
        flex: 5;
        padding-left: 1rem;
      }
      &:active {
        outline: none;
        background-position: 100%;
        color: #fff;
        cursor: pointer;
      }
    }
    .select-btns {
      opacity: 0;
      visibility: none;
      width: 0;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-around;
      margin-left: 2rem;
      height: 0rem;
      a {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 1.5rem;
        color: #2b2b2b;
        text-decoration: none;
        font-size: 1.4rem;
        font-weight: bold;
        svg {
          margin-right: 1rem;
        }
      }
    }
  }
  input[type='checkbox']:checked + label {
    .nav-link {
      background-image: -webkit-gradient(
        linear,
        left top,
        right top,
        from(#00161d),
        to(#00161d)
      );
      background-image: linear-gradient(
        90deg,
        rgb(106, 118, 122) 0%,
        rgb(230, 231, 231) 100%
      );
      color: #fff;
      -webkit-box-shadow: 0px 0px 12px 0px rgba(115, 102, 255, 0.35);
      box-shadow: 0px 0px 12px 0px rgba(115, 102, 255, 0.35);

      .icon {
        transform: rotate(90deg);
      }
    }
    .select-btns {
      opacity: 1;
      visibility: visible;
      width: 100%;
      height: 3rem;
    }
  }
`;

export const ToggleButton = styled.button<Props>`
  position: fixed;
  top: 0;
  left: 60px;
  height: 60px;
  width: 5rem;
  background-color: transparent;
  border: none;
  outline: none;
  transition: all 0.5s;
  .icon {
    position: relative;
    &,
    &::after,
    &::before {
      width: 3rem;
      height: 2px;
      background-color: #00161d;
      display: inline-block;
      transition: all 0.2s;
    }
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
    }
    &::before {
      top: -0.8rem;
    }
    &::after {
      top: 0.8rem;
    }
  }
  display: none;

  ${props =>
    props.isToggle &&
    css`
      left: 200px;
      .icon {
        background-color: transparent;
        &::before {
          top: 0;
          transform: rotate(135deg);
        }

        &::after {
          top: 0;
          transform: rotate(-135deg);
        }
      }
    `}
  @media screen and (max-width: 75em) {
    display: block;
  }
  @media screen and (max-width: 37.5em) {
    left: 2rem;
    ${props =>
      props.isToggle &&
      css`
        left: 200px;
      `}
  }
`;
