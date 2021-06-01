/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Redirect, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import Input from '../components/input';
import Switch from '../components/switch-button';
import CurrentPath from '../components/current-path';
import Container from '../components/container';
import { HandleOperatorDto, OperatorPermissions } from '../dto/handle-operator';
import {
  HandleOperatorContainer,
  HandleOperatorContent,
  Table,
  PermissionsType,
  ExtraPermissions,
  Label,
} from '../styles/pages/handle-operator';
import { PageTitle } from '../utils/page-title';
import { useUtils } from '../hooks/utils';
import GroupsCheckboxList from '../components/groups-checkbox-list';
import { useGroup } from '../hooks/group';
import Button from '../components/button';
import { useToast } from '../hooks/toast';
import getValidationErrors from '../utils/getValidationErrors';
import { useOperator } from '../hooks/operator';

interface DataProps {
  email: string;
  name: string;
  isActive?: boolean;
  phoneNumber?: string;
}

const HandleOperatorPage: React.FC = () => {
  // location
  const initialData = useLocation().state as HandleOperatorDto;

  // ref
  const formRef = useRef<FormHandles>(null);

  // hooks
  const { formatPhone, unformatPhone } = useUtils();
  const { getGroups, groups } = useGroup();
  const { addToast } = useToast();
  const { createOperator, editOperator } = useOperator();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [redirect, setRedirect] = useState(false);
  const [groupsIds, setGroupsIds] = useState<string[]>([]);
  const [
    operatorPermissions,
    setOperatorPermissions,
  ] = useState<OperatorPermissions>({
    editMachines: false,
    deleteMachines: false,
    toggleMaintenanceMode: false,
    addRemoteCredit: false,
    editCollections: false,
    deleteCollections: false,
    fixMachineStock: false,
  });

  const handleOperator = useCallback(
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
          const editOperatorData: HandleOperatorDto = {
            groupIds: groupsIds,
            isActive: data.isActive,
            phoneNumber: data.phoneNumber
              ? unformatPhone(data.phoneNumber)
              : undefined,
            permissions: operatorPermissions,
          };

          await editOperator(editOperatorData, initialData.id!);
          setBusyBtn(false);
          setRedirect(true);
          return;
        }
        const createOperatorData: HandleOperatorDto = {
          email: data.email,
          groupIds: groupsIds,
          name: data.name,
          phoneNumber: data.phoneNumber
            ? unformatPhone(data.phoneNumber)
            : undefined,
          permissions: operatorPermissions,
        };
        const response = await createOperator(createOperatorData);
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
    [operatorPermissions, groupsIds, initialData],
  );

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getGroups();
    })();
    setBusy(false);
  }, []);

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
      setOperatorPermissions({ ...initialData.permissions });
    }
  }, [initialData]);

  return (
    <Container active="operators" loading={busy}>
      <HandleOperatorContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Criar um Operador</h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/dashboard' },
                { name: 'Operadores', url: '/operators' },
                {
                  name: `${initialData ? 'Editar Operador' : 'Criar Operador'}`,
                },
              ]}
            />
          </div>
        </PageTitle>
        <HandleOperatorContent>
          <Form ref={formRef} onSubmit={handleOperator}>
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
              <Table>
                {/* Title Row */}
                <div className="primary-row table-title-font">
                  <div className="no-content" />
                  <div className="contact-name">Editar</div>
                  <div className="phone">Deletar</div>
                </div>
                <PermissionsType>
                  <h1 className="label-font">Máquinas</h1>
                  <div className="inputs">
                    <input
                      type="checkbox"
                      checked={operatorPermissions.editMachines}
                      id="editMachines"
                      onChange={e => {
                        setOperatorPermissions({
                          ...operatorPermissions,
                          editMachines: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={operatorPermissions.deleteMachines}
                      id="deleteMachines"
                      onChange={e => {
                        setOperatorPermissions({
                          ...operatorPermissions,
                          deleteMachines: e.target.checked,
                        });
                      }}
                    />
                  </div>
                </PermissionsType>
                <PermissionsType>
                  <h1 className="label-font">Coletas</h1>
                  <div className="inputs">
                    <input
                      type="checkbox"
                      checked={operatorPermissions.editCollections}
                      id="editCollections"
                      onChange={e => {
                        setOperatorPermissions({
                          ...operatorPermissions,
                          editCollections: e.target.checked,
                        });
                      }}
                    />
                    <input
                      type="checkbox"
                      checked={operatorPermissions.deleteCollections}
                      id="deleteCollections"
                      onChange={e => {
                        setOperatorPermissions({
                          ...operatorPermissions,
                          deleteCollections: e.target.checked,
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
              <ExtraPermissions>
                <Label htmlFor="addRemoteCredit">
                  <h2 className="label-font">Crédito remoto</h2>
                  <input
                    id="addRemoteCredit"
                    type="checkbox"
                    checked={operatorPermissions.addRemoteCredit}
                    onChange={e => {
                      setOperatorPermissions({
                        ...operatorPermissions,
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
                    checked={operatorPermissions.toggleMaintenanceMode}
                    onChange={e => {
                      setOperatorPermissions({
                        ...operatorPermissions,
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
                    checked={operatorPermissions.fixMachineStock}
                    onChange={e => {
                      setOperatorPermissions({
                        ...operatorPermissions,
                        fixMachineStock: e.target.checked,
                      });
                    }}
                  />
                </Label>
              </ExtraPermissions>
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
        </HandleOperatorContent>
      </HandleOperatorContainer>
      {redirect ? <Redirect to="/operators" /> : null}
    </Container>
  );
};
export default HandleOperatorPage;
