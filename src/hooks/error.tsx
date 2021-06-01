/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useCallback } from 'react';
import { useToast } from './toast';

interface ErrorContext {
  shootError(code: string): void;
}

const ErrorContext = createContext({} as ErrorContext);

const ErrorProvider: React.FC = ({ children }) => {
  // hooks
  const { addToast } = useToast();

  let error = '';
  const description = '';

  const shootError = useCallback((code: string) => {
    switch (code) {
      case 'INVALID_EMAIL_PASSWORD_COMBINATION':
        error = 'E-mail ou senha incorretos.';
        break;
      case 'UNKNOWN_CODE':
        error = 'Um erro inesperado ocorreu.';
        break;
      case 'EMAIL_ALREADY_USED':
        error = 'Este e-mail já está sendo utilizado.';
        break;
      case 'MACHINE_BELONGS_TO_A_ROUTE':
        error =
          'Não é possível trocar um operador de uma máquina que está em uma rota.';
        break;
      case 'SERIAL_NUMBER_ALREADY_USED':
        error = 'Este número de série já está sendo utilizado.';
        break;
      case 'OLD_PASSWoRD_IS_MISSING':
        error = 'É necessário informar a senha antigo para trocar de senha.';
        break;
      case 'OLD_PASSWPRD_DOES_MATCH':
        error = 'Senha antiga está incorreta.';
        break;
      case 'NAME_ALREADY_USED':
        error = 'Este nome já está em uso.';
        break;
      case 'LABEL_ALREADY_USED':
        error = 'Este nome ja está em uso.';
        break;
      case 'INCORRECT_EMAIL_PASSWORD_COMBINATION':
        error = 'E-mail ou senha incorretos.';
        break;
      case 'INCORRECT_FILTERS':
        error = 'Filtros incorretos.';
        break;
      case 'INCORRECT_PERMISSIONS_FOR_OPERATOR':
        error = 'Permissão incorreta para operador.';
        break;
      case 'INCORRECT_PERMISSIONS_FOR_MANAGER':
        error = 'Permissão incorreta para colaborador.';
        break;
      case 'INSUFFICIENT_PRODUCTS':
        error = 'Você não possui produtos suficientes para trasferir.';
        break;
      case 'NO_TRANSFERS_BETWEEN_OPERATORS':
        error = 'Não é possível transferir para outro operador.';
        break;
      case 'NO_TRANSFERS_BETWEEN_MACHINES':
        error = 'Não é possível transferir para outra máquina.';
        break;
      case 'PRODUCT_NOT_FOUND':
        error = 'Não foi possível encontrar este produto.';
        break;
      case 'TELEMETRY_BOARD_NOT_FOUND':
        error = 'Não foi possível encontrar esta telemetria.';
        break;
      case 'COUNTER_TYPE_NOT_FOUND':
        error = 'Não foi possível encontrar este contador.';
        break;
      case 'PRODUCT_IN_STOCK':
        error = 'Esta máquina está no estoque.';
        break;
      case 'POINT_OF_SALE_NOT_FOUND':
        error = 'Não foi possível encontrar este ponto de venda.';
        break;
      case 'GROUP_NOT_FOUND':
        error = 'Não foi possível encontrar esta parceria.';
        break;
      case 'SELLING_POINT_NOT_FOUND':
        error = 'Não foi possível encontrar este ponto de venda.';
        break;
      case 'MACHINE_CATEGORY_NOT_FOUND':
        error = 'Não foi possível encontrar esta categoria.';
        break;
      case 'MACHINE_NOT_FOUND':
        error = 'Não foi possível encontrar esta máquina.';
        break;
      case 'BOX_NOT_FOUND':
        error = 'Não foi possível encontrar este box.';
        break;
      case 'COUNTER_NOT_FOUND':
        error = 'Não foi possível encontrar este contador.';
        break;
      case 'ROUTE_NOT_FOUND':
        error = 'Não foi possível encontrar esta rota.';
        break;
      case 'USER_NOT_FOUND':
        error = 'Não foi possível encontrar est usuário.';
        break;
      case 'MISSING_GROUP_ID':
        error = 'É necessário informar uma parceria para transferir.';
        break;
      case 'AUTHORIZATION_ERROR':
        error = 'Você não possui permissão para fazer isso.';
        break;
      case 'THIS_MACHINE_IS_OFFLINE':
        error = 'Você não pode realizar coleta em máquinas que estão offline.';
        break;
      default:
        error =
          'Um erro aconteceu, caso o erro permaneça entre em contato com a equipe Sttigma';
        break;
    }
    if (error !== '') {
      addToast({
        title: 'Ops!',
        description: error,
        type: 'error',
        duration: 4000,
      });
    }
  }, []);

  return (
    <ErrorContext.Provider value={{ shootError }}>
      {children}
    </ErrorContext.Provider>
  );
};

function useError(): ErrorContext {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('Use error must be inside an ErrorProvider');
  }
  return context;
}

export { ErrorProvider, useError };
