/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-return-assign */
import React, {
  InputHTMLAttributes,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useField } from '@unform/core';
import { v4 } from 'uuid';
import {
  CreateUsersPermissions,
  PermissionCheckboxTableContainer,
  PermissionsContainer,
  Table,
} from '../styles/components/permissions-checkbox-table';
import Modal from './modal';
import { useModal } from '../hooks/modal';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  initialData: string[];
}

const PermissionsCheckboxTable: React.FC<Props> = ({
  name,
  initialData,
  ...rest
}) => {
  const permissions = [
    {
      options: [
        // MENAGER PERMISSIONS
        { value: 'listManagers', id: 'listManagers' },
        { value: 'createManagers', id: 'createManagers' },
        // OPERATOR PERMISSIONS
        { value: 'listOperators', id: 'listOperators' },
        { value: 'createOperators', id: 'createOperators' },
        // REPORTS PERMISSIONS
        { value: 'generateReports', id: 'generateReports' },
        // GROUPS PERMISSIONS
        { value: 'createGroups', id: 'createGroups' },
        { value: 'editGroups', id: 'editGroups' },
        { value: 'deleteGroups', id: 'deleteGroups' },
        // ROUTES PERMISSIONS
        { value: 'createRoutes', id: 'createRoutes' },
        { value: 'editRoutes', id: 'editRoutes' },
        { value: 'deleteRoutes', id: 'deleteRoutes' },
        // POINTS OF SALE PERMISSIONS
        { value: 'createPointsOfSale', id: 'createPointsOfSale' },
        { value: 'editPointsOfSale', id: 'editPointsOfSale' },
        { value: 'deletePointsOfSale', id: 'deletePointsOfSale' },
        // STOCK PERMISSIONS
        { value: 'createProducts', id: 'createProducts' },
        { value: 'editProducts', id: 'editProducts' },
        { value: 'deleteProducts', id: 'deleteProducts' },
        // CATEGORIES PERMISSIONS
        { value: 'createCategories', id: 'createCategories' },
        { value: 'editCategories', id: 'editCategories' },
        { value: 'deleteCategories', id: 'deleteCategories' },
        // CATEGORIES PERMISSIONS
        { value: 'createMachines', id: 'createMachines' },
        { value: 'editMachines', id: 'editMachines' },
        { value: 'deleteMachines', id: 'deleteMachines' },
        // REMOTE CREDIT PERMISSION
        { value: 'addRemoteCredit', id: 'addRemoteCredit' },
        // REMOTE MAINTENANCE PERMISSION
        { value: 'toggleMaintenanceMode', id: 'toggleMaintenanceMode' },
      ],
    },
  ];

  // state

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const { fieldName, registerField, defaultValue = initialData } = useField(
    name,
  );

  // hooks
  const {
    showModal,
    handleModal,
    canCreateManager,
    handleCanCreateManager,
    canCreateOperator,
    handleCanCreateOperator,
  } = useModal();

  const labelValue = useCallback((type: string) => {
    if (type === 'addRemoteCredit') {
      return 'Crédito remoto';
    }
    if (type === 'toggleMaintenanceMode') {
      return 'Modo manutenção';
    }
    return '';
  }, []);

  useEffect(() => {
    if (initialData.find(d => d === 'createManagers')) {
      handleCanCreateManager(true);
    }
    if (initialData.find(d => d === 'createOperators')) {
      handleCanCreateOperator(true);
    }
  }, []);

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
    // ---------------- CAN CREATE OPERATORS LOGIC ------------------
    if (canCreateOperator) {
      inputRefs.current.map((e, index) => {
        if (
          index === 20 ||
          index === 21 ||
          index === 23 ||
          index === 24 ||
          index === 3
        ) {
          e.checked = true;
        }
      });
    } else if (!canCreateManager) {
      inputRefs.current.map(e => (e.checked = false));
    }
    // ----------------  CAN CREATE MANAGERS LOGIC ------------------
    if (canCreateManager) {
      inputRefs.current.map(e => (e.checked = true));
    } else if (!canCreateOperator) {
      inputRefs.current.map(e => (e.checked = false));
    }
  }, [fieldName, registerField, canCreateManager, canCreateOperator]);

  return (
    <PermissionsContainer>
      {permissions.map(permission => {
        return (
          <div key={v4()}>
            <CreateUsersPermissions key={v4()}>
              {permission.options.map((option, index) => {
                if (index === 1 || index === 3) {
                  return (
                    <div className="input-container" key={v4()}>
                      <input
                        defaultChecked={defaultValue.find(
                          (dv: string) => dv === option.id,
                        )}
                        ref={ref => {
                          inputRefs.current[index] = ref as HTMLInputElement;
                        }}
                        disabled={index === 3 && !!canCreateManager}
                        onClick={() => {
                          if (index === 1) {
                            if (canCreateManager) {
                              handleCanCreateManager(false);
                              handleCanCreateOperator(false);
                              return;
                            }
                            handleModal('CAN_CREATE_MANAGERS');
                          } else {
                            if (canCreateManager) {
                              return;
                            }
                            if (canCreateOperator) {
                              handleCanCreateOperator(false);
                              return;
                            }
                            handleModal('CAN_CREATE_OPERATORS');
                          }
                        }}
                        value={option.value}
                        type="checkbox"
                        id={option.id}
                        {...rest}
                      />
                      <label htmlFor={option.id} key={option.id}>
                        <h1>
                          {index === 1
                            ? 'Criar colaboradores'
                            : 'Criar operadores'}
                        </h1>
                        <div className="checkbox-state" />
                      </label>
                    </div>
                  );
                }
                return null;
              })}
            </CreateUsersPermissions>
            <Table key={v4()}>
              {/* Title Row */}
              <div className="primary-row table-title-font">
                <div className="no-content" />
                <div className="list">Visualizar</div>
                <div className="label">Cadastrar</div>
                <div className="contact-name">Editar</div>
                <div className="phone">Deletar</div>
              </div>
              {/* MANAGERS PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Colaboradores</div>
                {permission.options.map((option, index) => {
                  if (index <= 0) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
              {/* OPERATORS PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Operadores</div>
                {permission.options.map((option, index) => {
                  if (index > 1 && index <= 2) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
              {/* REPORTS PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Relatórios</div>
                {permission.options.map((option, index) => {
                  if (index > 3 && index <= 4) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
              {/* GROUPS PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Parcerias</div>
                <div className="blank-space" />
                {permission.options.map((option, index) => {
                  if (index > 4 && index <= 7) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find((dv: string) => {
                            return dv === option.id;
                          })}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
              {/* ROUTES PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Rotas</div>
                <div className="blank-space" />
                {permission.options.map((option, index) => {
                  if (index > 7 && index <= 10) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
              {/* POINTS OF SALE PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Pontos de venda</div>
                <div className="blank-space" />
                {permission.options.map((option, index) => {
                  if (index > 10 && index <= 13) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
              {/* STOCK PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Estoque</div>
                <div className="blank-space" />
                {permission.options.map((option, index) => {
                  if (index > 13 && index <= 16) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          onChange={e => {
                            if (index === 22 || index === 23 || index === 24) {
                              if (e.target.checked) {
                                inputRefs.current.map(e => (e.checked = true));
                              }
                            }
                          }}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
              {/* CATEGORIES PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Categorias</div>
                <div className="blank-space" />
                {permission.options.map((option, index) => {
                  if (index > 16 && index <= 19) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
              {/* MACHINES PERMISSIONS */}
              <PermissionCheckboxTableContainer key={v4()}>
                <div key={v4()}>Máquinas</div>
                <div className="blank-space" />
                {permission.options.map((option, index) => {
                  if (index > 19 && index <= 22) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={
                            !!canCreateManager ||
                            (canCreateOperator && index === 20) ||
                            (canCreateOperator && index === 21)
                          }
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </PermissionCheckboxTableContainer>
            </Table>
            <div key={v4()} className="extra-permissions">
              <div className="title">
                <h1 className="heading-secondary-font">Permissões extras</h1>
              </div>
              <div key={v4()} className="inputs">
                {permission.options.map((option, index) => {
                  if (index > 22 && index <= 24) {
                    return (
                      <div className="input-container" key={v4()}>
                        <input
                          defaultChecked={defaultValue.find(
                            (dv: string) => dv === option.id,
                          )}
                          ref={ref => {
                            inputRefs.current[index] = ref as HTMLInputElement;
                          }}
                          disabled={!!canCreateManager || !!canCreateOperator}
                          value={option.value}
                          type="checkbox"
                          id={option.id}
                          {...rest}
                        />
                        <label htmlFor={option.id} key={option.id}>
                          <h1 className="label-font ">
                            {labelValue(option.value)}
                          </h1>
                          <div className="checkbox-state" />
                        </label>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        );
      })}
      {showModal === 'CAN_CREATE_MANAGERS' ? (
        <Modal
          title="Importante"
          text="Ao permitir um colaborador criar outros colaboradores, todas suas permissões serão setadas como verdadeiras automaticamente"
          type="CAN_CREATE_MANAGERS"
        />
      ) : null}
      {showModal === 'CAN_CREATE_OPERATORS' ? (
        <Modal
          title="Importante"
          text="Ao permitir um colaborador criar operadores, algumas permissões serão setadas como verdadeiras automaticamente"
          type="CAN_CREATE_OPERATORS"
        />
      ) : null}
    </PermissionsContainer>
  );
};
export default PermissionsCheckboxTable;
