/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, InputHTMLAttributes } from 'react';
import { useField } from '@unform/core';
import { SwitchContainer } from '../styles/components/switch-button';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
}

const Switch: React.FC<Props> = ({ id, name, label, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>();
  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref: HTMLInputElement) => {
        return ref.checked;
      },
      setValue: (ref: HTMLInputElement, value: boolean) => {
        ref.checked = value === true;
      },
    });
  }, [fieldName, registerField]);

  return (
    <SwitchContainer>
      <input
        ref={ref => {
          inputRef.current = ref as HTMLInputElement;
        }}
        value={inputRef.current?.checked.toString()}
        type="checkbox"
        id={id}
        {...rest}
      />
      {label}
      <label htmlFor={id} key={id}>
        <div className="switch-state" />
      </label>
    </SwitchContainer>
  );
};

export default Switch;
