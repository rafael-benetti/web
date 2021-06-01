import styled, { css } from 'styled-components';
import TooltipInput from '../../components/tooltip-input';

interface Props {
  isFocused?: boolean;
  isDisabled?: boolean;
  isErrored?: boolean;
}

export const InputContainer = styled.div<Props>`
  position: relative;
  width: 100%;
  .label-tooltip {
    position: relative;
    border: none;
    display: flex;
    align-items: center;
    .tooltip {
      position: relative;
      border: none;
      .tooltip-label {
        position: absolute;
        top: 0;
        left: 50%;
        display: flex;
        background-color: #ccc;
        padding: 0.5rem 2rem;
        border-radius: 15px;
        transform: translate(-50%, -100%);
        visibility: hidden;
        width: 40rem;
        p {
          width: 40rem;
        }
      }
      .svg {
        svg {
          margin-left: 0.5rem;
          margin-bottom: 0.8rem;
          width: 1.8rem;
          height: 1.8rem;
        }
      }
      &:hover {
        cursor: pointer;
        .tooltip-label {
          visibility: visible;
        }
      }
    }
  }
  p {
    margin-bottom: 0.8rem;
  }
  label {
    div {
      position: relative;
      background-color: #fff;
      width: 100%;
      border-radius: 0.5rem;
      border: 1px solid #ced4da;

      input {
        display: block;
        width: 100%;
        padding: 0.6rem 1.2rem;
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 1.5;
        outline: none;
        color: #898989;
        background-color: #fff;
        background-clip: padding-box;
        border: none;
        border-radius: 0.5rem;
        -webkit-transition: border-color 0.15s ease-in-out,
          -webkit-box-shadow 0.15s ease-in-out;
        transition: border-color 0.15s ease-in-out,
          -webkit-box-shadow 0.15s ease-in-out;
        margin-right: 2rem;
        &:disabled {
          background-color: #e9ecef;
        }
      }

      ${p =>
        p.isFocused &&
        css`
          color: #495057;
          background-color: #fff;
          border-color: #80bdff;
          outline: rgba(0, 0, 0, 0);
          -webkit-box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        `}
      ${p =>
        p.isDisabled &&
        css`
          input {
            background-color: #e9ecef;
          }
        `}
    ${props =>
        props.isErrored &&
        css`
          border-color: #c53030;
          -webkit-box-shadow: 0 0 0 0rem rgba(0, 123, 255, 0.25);
          box-shadow: 0 0 0 0rem rgba(0, 123, 255, 0.25);
        `};
    }
  }
  @media screen and (max-width: 87.5em) {
    label {
      div {
        margin-bottom: 1rem;

        input {
          padding: 1.1rem 1.3rem;
        }
      }
    }
  }
`;

export const Error = styled(TooltipInput)`
  position: absolute;
  top: 75%;
  right: 5px;
  transform: translateY(-50%);
  z-index: 600;
  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
