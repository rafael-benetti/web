/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { InputHTMLAttributes, useRef, useEffect } from 'react';
import { useField } from '@unform/core';

import { v4 } from 'uuid';
import { GroupsCheckboxListContainer } from '../styles/components/groups-checkbox-list';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  options: {
    value: string;
    label: string;
    id: string;
  }[];
  initialValues: string[];
}

const GroupsCheckboxList: React.FC<Props> = ({
  name,
  options,
  initialValues,
  ...rest
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { fieldName, registerField, defaultValue = initialValues } = useField(
    name,
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs.current,
      getValue: (refs: HTMLInputElement[]) => {
        return refs.filter(ref => ref?.checked).map(ref => ref.value);
      },
      clearValue: (refs: HTMLInputElement[]) => {
        refs.forEach(ref => {
          ref.checked = false;
        });
      },
      setValue: (refs: HTMLInputElement[], values: string[]) => {
        refs.forEach(ref => {
          if (values.includes(ref.id)) {
            ref.checked = true;
          }
        });
      },
    });
  }, [fieldName, registerField]);

  return (
    <GroupsCheckboxListContainer>
      {options.map((option, index) => (
        <div key={v4()}>
          <input
            defaultChecked={defaultValue.find((dv: string) => dv === option.id)}
            ref={ref => {
              inputRefs.current[index] = ref as HTMLInputElement;
            }}
            value={option.value}
            type="checkbox"
            id={option.id}
            {...rest}
          />
          <label htmlFor={option.id} key={option.label}>
            <div className="checkbox-state" />
            <span className="label-font">{option.label}</span>
          </label>
        </div>
      ))}
    </GroupsCheckboxListContainer>
  );
};

export default GroupsCheckboxList;
