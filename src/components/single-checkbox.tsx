/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, InputHTMLAttributes } from 'react';
import { useField } from '@unform/core';
import { SingleCheckboxContainer } from '../styles/components/single-checkbox';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
}

const SingleCheckbox: React.FC<Props> = ({ id, name, label, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>();
  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref: HTMLInputElement) => {
        return ref.checked ? 'true' : 'false';
      },
      setValue: (ref: HTMLInputElement, value: string) => {
        ref.checked = value === 'true';
      },
    });
  }, [fieldName, registerField]);

  return (
    <SingleCheckboxContainer>
      <div className="input-container">
        <input
          defaultChecked={inputRef.current?.value === 'true'}
          ref={ref => {
            inputRef.current = ref as HTMLInputElement;
          }}
          value={inputRef.current?.checked ? 'true' : 'false'}
          type="checkbox"
          id={id}
          {...rest}
        />
        <label htmlFor={id} key={id} className="label-font">
          {label}
          <div className="checkbox-state" />
        </label>
      </div>
    </SingleCheckboxContainer>
  );
};

export default SingleCheckbox;
