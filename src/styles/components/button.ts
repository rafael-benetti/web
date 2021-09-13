import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface IProps {
  color: string;
}

export const ButtonContainer = styled.button<IProps>`
  padding: 0.6rem 2.8rem;
  border: none;
  border-radius: 0.3rem;
  transition: all 0.4s;
  .css-1aojsy8 {
    margin: 0;
  }
  ${props => {
    if (props.color === 'primary') {
      return css`
        background-color: #00161d;
        &:hover {
          background-color: ${shade(0.2, '#00161d')};
        }
      `;
    }
    if (props.color === 'tertiary') {
      return css`
        background-color: #ff2a00;
        &:hover {
          background-color: ${shade(0.2, '#ff2a00')};
        }
      `;
    }
    if (props.color === 'secondary') {
      return css`
        background-color: #ff008c;
        &:hover {
          background-color: ${shade(0.2, '#ff008c')};
        }
      `;
    }
    if (props.color === 'quartiary') {
      return css`
        background-color: #17a2b8;
        &:hover {
          background-color: ${shade(0.2, '#17a2b8')};
        }
      `;
    }
    if (props.color === 'quinary') {
      return css`
        background-color: #4b8b3b;
        &:hover {
          background-color: ${shade(0.2, '#4B8B3B')};
        }
      `;
    }
    if (props.color === 'sexternary') {
      return css`
        background-color: #0013ff;
        &:hover {
          background-color: ${shade(0.2, '#0013ff')};
        }
      `;
    }
    if (props.color === 'septenary') {
      return css`
        background-color: #f9a602;
        &:hover {
          background-color: ${shade(0.2, '#f9a602')};
        }
      `;
    }

    return css`
      background-color: #ccc;
    `;
  }}
`;
