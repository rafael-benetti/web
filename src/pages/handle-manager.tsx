/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Redirect, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import Switch from '../components/switch-button';
import Input from '../components/input';
import Container from '../components/container';
import { HandleManagerDto, ManagerPermissions } from '../dto/handle-manager';
import { useGroup } from '../hooks/group';
import { useManager } from '../hooks/manager';
import { useUtils } from '../hooks/utils';
import GroupsCheckboxList from '../components/groups-checkbox-list';
import {
  HandleManagerContainer,
  HandleContentManager,
  CreateUsersPermissions,
  Label,
  Table,
  PermissionsType,
} from '../styles/pages/handle-manager';
import getValidationErrors from '../utils/getValidationErrors';
import CurrentPath from '../components/current-path';
import { PageTitle } from '../utils/page-title';
import Button from '../components/button';
import { useModal } from '../hooks/modal';
import Modal from '../components/modal';
import { useToast } from '../hooks/toast';

interface DataProps {
  email: string;
  name: string;
  isActive?: boolean;
  phoneNumber?: string;
}

const HandleManagerPage: React.FC = () => {
  // location
  const initialData = useLocation().state as HandleManagerDto;

  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { formatPhone, unformatPhone } = useUtils();
  const { createManager, editManager } = useManager();
  const { getGroups, groups } = useGroup();
  const { addToast } = useToast();
  const {
    showModal,
    handleModal,
    canCreateManager,
    canCreateOperator,
    handleCanCreateManager,
    handleCanCreateOperator,
  } = useModal();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [redirect, setRedirect] = useState(false);
  const [
    managerPermissions,
    setManagerPermissions,
  ] = useState<ManagerPermissions>({
    addRemoteCredit: false,
    createCategories: false,
    createGroups: false,
    createMachines: false,
    createManagers: false,
    createOperators: false,
    createPointsOfSale: false,
    createProducts: false,
    createRoutes: false,
    deleteCategories: false,
    deleteGroups: false,
    deleteMachines: false,
    deletePointsOfSale: false,
    deleteProducts: false,
    deleteRoutes: false,
    editCategories: false,
    editGroups: false,
    editMachines: false,
    editPointsOfSale: false,
    editProducts: false,
    editRoutes: false,
    generateReports: false,
    listManagers: false,
    listOperators: false,
    toggleMaintenanceMode: false,
    fixMachineStock: false,
  });
  const [groupsIds, setGroupsIds] = useState<string[]>([]);

  const handleManager = useCallback(
    async (data: DataProps) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Formato de e-mail inválido')
            .required('Insira um email'),
          name: Yup.string().required('Insira um nome'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        if (groupsIds.length === 0) {
          addToast({
            title: 'Atenção!',
            description: 'Para continuar é necessário selecionar uma parceria',
            type: 'info',
          });
          setBusyBtn(false);
          return;
        }
        if (initialData) {
          const editManagerData: HandleManagerDto = {
            groupIds: groupsIds,
            isActive: data.isActive,
            permissions: managerPermissions,
            phoneNumber: data.phoneNumber
              ? unformatPhone(data.phoneNumber)
              : undefined,
          };
          await editManager(editManagerData, initialData.id!);
          setBusyBtn(false);
          setRedirect(true);
          return;
        }
        const createManagerData: HandleManagerDto = {
          email: data.email,
          groupIds: groupsIds,
          name: data.name,
          phoneNumber: data.phoneNumber
            ? unformatPhone(data.phoneNumber)
            : undefined,
          permissions: managerPermissions,
        };
        const response = await createManager(createManagerData);
        if (response) {
          setBusyBtn(false);
          setRedirect(true);
        } else {
          setBusyBtn(false);
        }
      } catch (error) {
        setBusyBtn(false);
        addToast({
          title: 'Aviso!',
          description: 'Algum campo obrigatório não foi preenchido.',
          type: 'info',
        });
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [managerPermissions, groupsIds, initialData],
  );

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getGroups();
    })();
    setBusy(false);
  }, []);

  useEffect(() => {
    if (canCreateManager) {
      setManagerPermissions({
        addRemoteCredit: true,
        createCategories: true,
        createGroups: true,
        createMachines: true,
        createManagers: true,
        createOperators: true,
        createPointsOfSale: true,
        createProducts: true,
        createRoutes: true,
        deleteCategories: true,
        deleteGroups: true,
        deleteMachines: true,
        deletePointsOfSale: true,
        deleteProducts: true,
        deleteRoutes: true,
        editCategories: true,
        editGroups: true,
        editMachines: true,
        editPointsOfSale: true,
        editProducts: true,
        editRoutes: true,
        generateReports: true,
        listManagers: true,
        listOperators: true,
        toggleMaintenanceMode: true,
        fixMachineStock: true,
      });
    }
    if (canCreateOperator && !canCreateManager) {
      setManagerPermissions({
        ...managerPermissions,
        addRemoteCredit: true,
        toggleMaintenanceMode: true,
        createMachines: true,
        editMachines: true,
        createOperators: true,
      });
    }
  }, [canCreateOperator, handleCanCreateManager, showModal]);

  useEffect(() => {
    if (initialData) {
      formRef.current?.setData({
        name: initialData.name,
        email: initialData.email,
        isActive: initialData.isActive,
        phoneNumber: initialData.phoneNumber
          ? formatPhone(initialData.phoneNumber, false)
          : '',
        groupIds: [''],
      });
      setGroupsIds(initialData.groupIds);
      setManagerPermissions({ ...initialData.permissions });
    }
  }, [initialData]);

  return (
    <Container active="managers" loading={busy}>
      <HandleManagerContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Criar um colaborador</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/dashboard' },
                { name: 'Colaboradores', url: 'managers' },
                {
                  name: `${
                    initialData ? 'Editar Colaborador' : 'Criar Colaborador'
                  }`,
                },
              ]}
            />
          </div>
        </PageTitle>
        <HandleContentManager>
          <Form ref={formRef} onSubmit={handleManager}>
            {/* ------------------------- SETION INFO --------------------------------*/}
            <div className="section-info">
              <Input
                name="name"
                type="text"
                label="Nome"
                isDisabled={!!initialData}
              />
              <Input
                name="email"
                type="text"
                label="Email"
                isDisabled={!!initialData}
              />
              <div className="phone-password">
                <Input
                  name="phoneNumber"
                  type="text"
                  label="Telefone"
                  onChange={event => {
                    const { value } = event.target;
                    event.target.value = formatPhone(value, false);
                  }}
                />
              </div>
              {initialData ? (
                <Switch id="isActive" label="Ativo" name="isActive" />
              ) : null}
            </div>
            {/* ------------------------- END --------------------------------*/}
            {/* ------------------------- SETION GROUPS --------------------------------*/}
            <div className="section-groups">
              <div className="title">
                <h1 className="heading-secondary-font">Parcerias</h1>
              </div>
              <div className="groups">
                <GroupsCheckboxList
                  name="groupIds"
                  initialValues={groupsIds}
                  onChange={e => {
                    setGroupsIds([...groupsIds, e.target.value.toString()]);
                    if (
                      groupsIds.find(id => id === e.target.value.toString())
                    ) {
                      const index = groupsIds.findIndex(
                        id => id === e.target.value.toString(),
                      );
                      groupsIds.splice(index, 1);
                      setGroupsIds([...groupsIds]);
                    }
                  }}
                  options={groups.map(group => {
                    return {
                      id: group.id,
                      label: group.label,
                      value: group.id,
                    };
                  })}
                />
              </div>
            </div>
            {/* ------------------------- END --------------------------------*/}
            {/* ------------------------- SECTION PERMISSIONS --------------------------------*/}
            <div className="section-permissions">
              <div className="title">
                <h1 className="heading-secondary-font">Permissões</h1>
              </div>
              <CreateUsersPermissions>
                <Label htmlFor="createManagers">
                  <h2 className="label-font">Criar colaboradores</h2>
                  <input
                    id="createManagers"
                    type="checkbox"
                    checked={managerPermissions.createManagers}
                    onClick={() => {
                      if (!canCreateManager) {
                        handleModal('CAN_CREATE_MANAGERS');
                      }
                    }}
                    onChange={e => {
                      if (!e.target.checked) {
                        setManagerPermissions({
                          ...managerPermissions,
                          createManagers: false,
                        });
                        handleCanCreateManager(false);
                      }
                    }}
                  />
                </Label>
                <Label htmlFor="createOperators">
                  <h2 className="label-font">Criar Operadores</h2>
                  <input
                    id="createOperators"
                    type="checkbox"
                    checked={managerPermissions.createOperators}
                    onClick={() => {
                      if (!canCreateOperator && !canCreateManager) {
                        handleModal('CAN_CREATE_OPERATORS');
                      }
                    }}
                    onChange={e => {
                      if (!e.target.checked) {
                        setManagerPermissions({
                          ...managerPermissions,
                          createManagers: false,
                          createOperators: false,
                        });
                        handleCanCreateManager(false);
                        handleCanCreateOperator(false);
                      }
                    }}
                  />
                </Label>
              </CreateUsersPermissions>
              <Table>
                {/* Title Row */}
                <div className="primary-row table-title-font">
                  <div className="no-content" />
                  <div className="list">Visualizar</div>
                  <div className="label">Cadastrar</div>
                  <div className="contact-name">Editar</div>
                  <div className="phone">Deletar</div>
                </div>
                {/* --------- Managers ---------*/}
                <PermissionsType>
                  <h1 className="label-font">Colaboradores</h1>
                  <div className="inputs">
                    <input
                      type="checkbox"
                      checked={managerPermissions.listManagers}
                      id="listManagers"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            listManagers: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          listManagers: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                {/* --------- Operators ---------*/}
                <PermissionsType>
                  <h1 className="label-font">Operadores</h1>
                  <div className="inputs">
                    <input
                      type="checkbox"
                      checked={managerPermissions.listOperators}
                      id="listOperators"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            listOperators: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          listOperators: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                {/* --------- Reports ---------*/}
                <PermissionsType>
                  <h1 className="label-font">Relatórios</h1>
                  <div className="inputs">
                    <input
                      type="checkbox"
                      checked={managerPermissions.generateReports}
                      id="generateReports"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            generateReports: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          generateReports: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                {/* --------- Groups ---------*/}
                <PermissionsType>
                  <div>
                    <h1 className="label-font">Parcerias</h1>
                  </div>
                  <div className="inputs">
                    <div className="blank-space" />
                    <input
                      type="checkbox"
                      checked={managerPermissions.createGroups}
                      id="createGroups"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            createGroups: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          createGroups: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.editGroups}
                      id="editGroups"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            editGroups: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          editGroups: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.deleteGroups}
                      id="deleteGroups"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            deleteGroups: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          deleteGroups: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                {/* --------- Routes ---------*/}
                <PermissionsType>
                  <div>
                    <h1 className="label-font">Rotas</h1>
                  </div>
                  <div className="inputs">
                    <div className="blank-space" />
                    <input
                      type="checkbox"
                      checked={managerPermissions.createRoutes}
                      id="createRoutes"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            createRoutes: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          createRoutes: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.editRoutes}
                      id="editRoutes"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            editRoutes: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          editRoutes: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.deleteRoutes}
                      id="deleteRoutes"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            deleteRoutes: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          deleteRoutes: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                {/* --------- PointsOfSale ---------*/}
                <PermissionsType>
                  <div>
                    <h1 className="label-font">Pontos de venda</h1>
                  </div>
                  <div className="inputs">
                    <div className="blank-space" />
                    <input
                      type="checkbox"
                      checked={managerPermissions.createPointsOfSale}
                      id="createPointsOfSale"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            createPointsOfSale: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          createPointsOfSale: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.editPointsOfSale}
                      id="editPointsOfSale"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            editPointsOfSale: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          editPointsOfSale: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.deletePointsOfSale}
                      id="deletePointsOfSale"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            deletePointsOfSale: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          deletePointsOfSale: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                {/* --------- Stock ---------*/}
                <PermissionsType>
                  <div>
                    <h1 className="label-font">Estoque</h1>
                  </div>
                  <div className="inputs">
                    <div className="blank-space" />
                    <input
                      type="checkbox"
                      checked={managerPermissions.createProducts}
                      id="createProducts"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            createProducts: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          createProducts: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.editProducts}
                      id="editProducts"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            editProducts: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          editProducts: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.deleteProducts}
                      id="deleteProducts"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            deleteProducts: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          deleteProducts: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                {/* --------- Category ---------*/}
                <PermissionsType>
                  <div>
                    <h1 className="label-font">Categorias</h1>
                  </div>
                  <div className="inputs">
                    <div className="blank-space" />
                    <input
                      type="checkbox"
                      checked={managerPermissions.createCategories}
                      id="createCategories"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            createCategories: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          createCategories: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.editCategories}
                      id="editCategories"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            editCategories: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          editCategories: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.deleteCategories}
                      id="deleteCategories"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            deleteCategories: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          deleteCategories: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                {/* --------- Machies ---------*/}
                <PermissionsType>
                  <div>
                    <h1 className="label-font">Máquinas</h1>
                  </div>
                  <div className="inputs">
                    <div className="blank-space" />
                    <input
                      type="checkbox"
                      checked={managerPermissions.createMachines}
                      id="createMachines"
                      onChange={e => {
                        if (canCreateManager || canCreateOperator) {
                          handleCanCreateManager(false);
                          handleCanCreateOperator(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            createOperators: false,
                            createMachines: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          createMachines: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.editMachines}
                      id="editMachines"
                      onChange={e => {
                        if (canCreateManager || canCreateOperator) {
                          handleCanCreateManager(false);
                          handleCanCreateOperator(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            createOperators: false,
                            editMachines: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          editMachines: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={managerPermissions.deleteMachines}
                      id="deleteMachines"
                      onChange={e => {
                        if (canCreateManager) {
                          handleCanCreateManager(false);
                          setManagerPermissions({
                            ...managerPermissions,
                            createManagers: false,
                            deleteMachines: e.target.checked,
                          });
                          return;
                        }
                        setManagerPermissions({
                          ...managerPermissions,
                          deleteMachines: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
              </Table>
              {/* Extra permissions */}
              <div className="title">
                <h1 className="heading-secondary-font">Permissões Extras</h1>
              </div>
              <CreateUsersPermissions>
                <Label htmlFor="addRemoteCredit">
                  <h2 className="label-font">Crédito remoto</h2>
                  <input
                    id="addRemoteCredit"
                    type="checkbox"
                    checked={managerPermissions.addRemoteCredit}
                    onChange={e => {
                      if (canCreateManager || canCreateOperator) {
                        handleCanCreateManager(false);
                        handleCanCreateOperator(false);
                        setManagerPermissions({
                          ...managerPermissions,
                          createManagers: false,
                          createOperators: false,
                          addRemoteCredit: e.target.checked,
                        });
                        return;
                      }
                      setManagerPermissions({
                        ...managerPermissions,
                        addRemoteCredit: e.target.checked,
                      });
                    }}
                  />
                </Label>
                <Label htmlFor="toggleMaintenanceMode">
                  <h2 className="label-font">Modo manutenção</h2>
                  <input
                    id="toggleMaintenanceMode"
                    type="checkbox"
                    checked={managerPermissions.toggleMaintenanceMode}
                    onChange={e => {
                      if (canCreateManager || canCreateOperator) {
                        handleCanCreateManager(false);
                        handleCanCreateOperator(false);
                        setManagerPermissions({
                          ...managerPermissions,
                          createManagers: false,
                          createOperators: false,
                          toggleMaintenanceMode: e.target.checked,
                        });
                        return;
                      }
                      setManagerPermissions({
                        ...managerPermissions,
                        toggleMaintenanceMode: e.target.checked,
                      });
                    }}
                  />
                </Label>
                <Label htmlFor="fixMachineStock">
                  <h2 className="label-font">Corrigir estoque das máquina</h2>
                  <input
                    id="fixMachineStock"
                    type="checkbox"
                    checked={managerPermissions.fixMachineStock}
                    onChange={e => {
                      if (canCreateManager || canCreateOperator) {
                        handleCanCreateManager(false);
                        handleCanCreateOperator(false);
                        setManagerPermissions({
                          ...managerPermissions,
                          createManagers: false,
                          createOperators: false,
                          fixMachineStock: e.target.checked,
                        });
                        return;
                      }
                      setManagerPermissions({
                        ...managerPermissions,
                        fixMachineStock: e.target.checked,
                      });
                    }}
                  />
                </Label>
              </CreateUsersPermissions>
            </div>
            {/* ------------------------- END --------------------------------*/}
            <div className="divider" />
            <div className="submit-buttons">
              <Button
                color="tertiary"
                title="Cancelar"
                callback={() => setRedirect(true)}
              />
              {initialData ? (
                <Button
                  isSubmit
                  color="primary"
                  title="Editar"
                  busy={busyBtn}
                />
              ) : (
                <Button
                  isSubmit
                  color="primary"
                  title="Cadastrar"
                  busy={busyBtn}
                />
              )}
            </div>
          </Form>
        </HandleContentManager>
      </HandleManagerContainer>
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
      {redirect ? <Redirect to="managers" /> : null}
    </Container>
  );
};
export default HandleManagerPage;
