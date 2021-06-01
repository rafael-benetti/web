import styled from 'styled-components';

export const PhotoDetailContainer = styled.div`
  position: fixed;
  top: 50%;
  left: calc(12.5rem + 50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  z-index: 100;
  border-radius: 2rem;
  height: 70rem;
  width: 70%;
  background-color: #000;
  img {
    height: 70rem;
    width: 80%;
    object-fit: contain;
  }
  button {
    position: absolute;
    top: 3rem;
    right: 3rem;
    background-color: transparent;
    border: none;
    border-radius: 5rem;
    padding: 1rem;
    transition: all 0.3s;
    svg {
      width: 2rem;
      height: 2rem;
      color: #fff;
    }
    &:hover {
      background-color: #aaa;
    }
  }
  @media screen and (max-width: 75em) {
    left: 50%;
  }
`;
