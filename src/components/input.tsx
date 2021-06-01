import React, { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons';
import { useField } from '@unform/core';

import { InputContainer, Error } from '../styles/components/input';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  placeholder?: string;
  isDisabled?: boolean;
  value?: string;
  label?: string;
  id?: string;
  tooltip?: string;
}

const Input: React.FC<IProps> = ({
  name,
  placeholder,
  isDisabled,
  label,
  icon: Icon,
  id,
  tooltip,
  ...rest
}) => {
  // refs
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  // state
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <InputContainer
      isFocused={isFocused}
      isDisabled={isDisabled || false}
      isErrored={!!error}
    >
      {Icon && <Icon size={20} />}
      {label && !tooltip ? <p className="label-font">{label}</p> : null}
      {label && tooltip && (
        <div className="label-tooltip">
          <p className="label-font">{label}</p>
          <div className="tooltip">
            <div className="tooltip-label">
              <p className="floating-text">{tooltip}</p>
            </div>
            <div className="svg">
              <FiAlertCircle />
            </div>
          </div>
        </div>
      )}
      <label htmlFor={name}>
        <div>
          <input
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            id={id || name}
            disabled={isDisabled || false}
            defaultValue={defaultValue}
            ref={inputRef}
            placeholder={placeholder}
            autoComplete="off"
            {...rest}
          />
        </div>
      </label>
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </InputContainer>
  );
};

export default Input;
