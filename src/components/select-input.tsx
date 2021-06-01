/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import React, { useRef, useEffect } from 'react';
import ReactSelect, {
  OptionTypeBase,
  Props as SelectProps,
} from 'react-select';

import { useField } from '@unform/core';
import { SelectInputContainer } from '../styles/components/select-input';

export interface Options {
  value: number | string | boolean | undefined;
  label: string;
}

interface Props extends SelectProps<OptionTypeBase> {
  name: string;
  label?: string;
  options: Options[];
}

const SelectInput: React.FC<Props> = ({ name, label, options, ...rest }) => {
  const selectRef = useRef(null);
  const { fieldName, registerField } = useField(name);
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      setValue: (ref: any, value: string | number) => {
        ref.state.value = value;
      },

      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }
          return ref.state.value.map((option: OptionTypeBase) => option.value);
        }

        if (!ref.state.value) {
          return '';
        }
        return ref.state.value.value;
      },
    });
  }, [fieldName, registerField, rest.isMulti]);
  return (
    <SelectInputContainer>
      <label htmlFor={name}>{label ? <p>{label}</p> : null}</label>
      <ReactSelect
        ref={selectRef}
        classNamePrefix="react-select"
        placeholder="Selecionar..."
        options={options}
        {...rest}
      />
    </SelectInputContainer>
  );
};

export default SelectInput;
