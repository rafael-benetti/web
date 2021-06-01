import React, { createContext, useCallback, useContext, useState } from 'react';

interface UtilsContext {
  formatCnpj(value: string): string;
  formatPhone(value: string, fromApi: boolean): string;
  formatCep(value: string): string;
  unformatCnpj(value: string): string;
  unformatPhone(value: string): string;
  unformatCep(value: string): string;
  formatMoney(value: string): string;
  phoneFormatted?: string;
  cnpjFormatted?: string;
  cepFormatted: string;
}

const UtilsContext = createContext({} as UtilsContext);

const UtilsProvider: React.FC = ({ children }) => {
  // state
  const [cnpjFormatted, setCnpjFormatted] = useState<string>();
  const [phoneFormatted, setPhoneFormatted] = useState<string>();
  const [cepFormatted, setCepFormatted] = useState<string>('');

  const formatCnpj = useCallback((value: string) => {
    const formattedString = value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{2}).(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{2}).(\d{3}).(\d{3})(\d)/, '$1.$2.$3/$4')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');

    setCnpjFormatted(formattedString);
    return formattedString;
  }, []);

  const formatPhone = useCallback((value: string, fromApi: boolean) => {
    if (!fromApi) {
      const formattedString = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})(-)(\d)(\d{3})(\d)/, '$1$3-$4$5')
        .replace(/(-\d{4})\d+?$/, '$1');

      setPhoneFormatted(formattedString);

      return formattedString;
    }
    const formattedString = value
      .substring(3)
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})(-)(\d)(\d{3})(\d)/, '$1$3-$4$5')
      .replace(/(-\d{4})\d+?$/, '$1');
    setPhoneFormatted(formattedString);
    return formattedString;
  }, []);

  const formatCep = useCallback((value: string) => {
    const formattedString = value.replace(/(\d{5})(\d)/, '$1-$2');
    setCepFormatted(formattedString);
    return formattedString;
  }, []);

  const unformatCnpj = useCallback((value: string) => {
    const cnpj = value
      .split('.')
      .join('')
      .split('/')
      .join('')
      .split('-')
      .join('');

    return cnpj;
  }, []);

  const unformatPhone = useCallback((value: string) => {
    const phone = `+55${value
      .split('(')
      .join('')
      .split(')')
      .join('')
      .split('-')
      .join('')
      .split(' ')
      .join('')}`;

    return phone;
  }, []);

  const unformatCep = useCallback((value: string) => {
    const cep = value.split('.').join('').split('-').join('');
    return cep;
  }, []);

  const formatMoney = useCallback((value: string) => {
    const result = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return result;
  }, []);

  return (
    <UtilsContext.Provider
      value={{
        formatCep,
        formatCnpj,
        formatMoney,
        formatPhone,
        unformatCep,
        unformatCnpj,
        unformatPhone,
        cnpjFormatted,
        phoneFormatted,
        cepFormatted,
      }}
    >
      {children}
    </UtilsContext.Provider>
  );
};

function useUtils(): UtilsContext {
  const context = useContext(UtilsContext);
  if (!context) {
    throw new Error('useUtils must be used within a AuthProvider');
  }
  return context;
}

export { UtilsProvider, useUtils };
