/* eslint-disable no-return-assign */
import React, { createContext, useCallback, useContext, useState } from 'react';

interface ModalContext {
  showModal: string | undefined;
  handleModal(type: string | undefined): void;
  handleCanCreateManager(bool: boolean): void;
  handleCanCreateOperator(bool: boolean): void;
  canCreateManager: boolean;
  canCreateOperator: boolean;
}

const ModalContext = createContext({} as ModalContext);

const ModalProvider: React.FC = ({ children }) => {
  // state
  const [showModal, setShowModal] = useState<string | undefined>();
  const [canCreateManager, setCanCreateManager] = useState(false);
  const [canCreateOperator, setCanCreateOperator] = useState(false);

  const handleModal = useCallback((type: string) => {
    if (type) {
      setShowModal(type);
    } else {
      setShowModal(undefined);
    }
  }, []);

  const handleCanCreateManager = useCallback((bool: boolean) => {
    setCanCreateManager(bool);
  }, []);
  const handleCanCreateOperator = useCallback((bool: boolean) => {
    setCanCreateOperator(bool);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        showModal,
        handleModal,
        canCreateManager,
        handleCanCreateManager,
        handleCanCreateOperator,
        canCreateOperator,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

function useModal(): ModalContext {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ToastProvider');
  }
  return context;
}

export { ModalProvider, useModal };
