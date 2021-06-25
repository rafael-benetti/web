/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import cep from 'cep-promise';

import { FormHandles, Scope } from '@unform/core';
import { Form } from '@unform/web';
import { Redirect, useLocation } from 'react-router-dom';
import { OptionTypeBase } from 'react-select';
import Input from '../components/input';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { HandlePointOfSaleDto } from '../dto/handle-point-os-sale-dto';
import { PointOfSale } from '../entiti/point-of-sales';
import {
  HandlePointOfSalePageContainer,
  HandlePointOfSalePageContent,
} from '../styles/pages/handle-point-of-sale';
import { PageTitle } from '../utils/page-title';
import getValidationErrors from '../utils/getValidationErrors';
import Button from '../components/button';
import SelectInput from '../components/select-input';
import { useGroup } from '../hooks/group';
import { usePointOfSale } from '../hooks/point-of-sale';
import { useToast } from '../hooks/toast';
import { useUtils } from '../hooks/utils';
import AbsoluteLoading from '../components/absolute-loading';
import { Group } from '../entiti/group';
import SingleCheckbox from '../components/single-checkbox';

interface Data {
  pointOfSale: PointOfSale;
  group: Group;
}

interface InitialData {
  initialData: Data;
}

const HandlePointOfSalePage: React.FC = () => {
  // location
  const { initialData } = useLocation().state as InitialData;

  // ref
  const formRef = useRef<FormHandles>(null);
  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [busyBtn, setBusyBtn] = useState<boolean>(false);
  const [loadingCepResponse, setLoadingCepResponse] = useState<boolean>(false);
  const [isPercentage, setIsPercentage] = useState<boolean>(() => {
    if (Object.keys(initialData).length > 0) {
      if (initialData.pointOfSale.isPercentage) {
        return true;
      }
      return false;
    }
    return false;
  });
  const [selectValue, setSelectValue] = useState<unknown>();
  const [redirect, setRedirect] = useState(false);
  const [type, setType] = useState<string>(() => {
    if (Object.keys(initialData).length > 0) {
      if (initialData.pointOfSale.isPercentage) {
        return '%';
      }
      return 'R$';
    }
    return 'R$';
  });
  const [money, setMoney] = useState<string>(() => {
    if (Object.keys(initialData).length > 0) {
      return initialData.pointOfSale.rent?.toString() || '';
    }
    return '';
  });
  // hooks
  const { groups, getGroups } = useGroup();
  const { createPointOfSale, editPointOfSale } = usePointOfSale();
  const { formatCep, unformatCnpj, cepFormatted, formatPhone } = useUtils();
  const { addToast } = useToast();

  useEffect(() => {
    setBusy(true);

    (async () => {
      await getGroups();
      setBusy(false);
    })();
    if (initialData) {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      formRef.current?.setData({
        label: initialData.pointOfSale.label,
        groupId: initialData.group.isPersonal
          ? 'Parceria pessoal'
          : initialData.group.label,
        contactName: initialData.pointOfSale.contactName,
        primaryPhoneNumber: formatPhone(
          initialData.pointOfSale.primaryPhoneNumber || '',
          true,
        ),
        secondaryPhoneNumber: formatPhone(
          initialData.pointOfSale.secondaryPhoneNumber || '',
          true,
        ),
        address: {
          zipCode: formatCep(initialData.pointOfSale.address.zipCode || ''),
          state: initialData.pointOfSale.address.state,
          city: initialData.pointOfSale.address.city,
          neighborhood: initialData.pointOfSale.address.neighborhood,
          street: initialData.pointOfSale.address.street,
          number: initialData.pointOfSale.address.number,
          extraInfo: initialData.pointOfSale.address.extraInfo || '',
        },
        rent: initialData.pointOfSale.rent,
        isPercentage:
          initialData.pointOfSale.isPercentage?.toString() || 'false',
      });
    }
  }, []);

  const handlePointOfSale = useCallback(
    async (data: HandlePointOfSaleDto) => {
      setBusyBtn(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          label: Yup.string().required('Insira o nome do seu ponto de venda'),
          contactName: Yup.string().required('Insira o nome do contato'),
          primaryPhoneNumber: Yup.string().required(
            'Insira um telefone para contato',
          ),
          address: Yup.object().shape({
            zipCode: Yup.string().required('Insira o cep do ponto de venda'),
            number: Yup.string().required('Insira um número'),
          }),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        if (
          !initialData.group &&
          selectValue === undefined &&
          groups.length !== 1
        ) {
          addToast({
            title: 'Lembre-se de selecionar uma parceria',
            type: 'info',
          });
        }
        if (initialData.group) {
          await editPointOfSale(data, initialData.pointOfSale.id);
          setRedirect(true);
          setBusyBtn(false);
        } else {
          const createData: HandlePointOfSaleDto = {
            ...data,
            groupId:
              groups.length === 1
                ? groups[0].id
                : ((selectValue as OptionTypeBase).value as string),
          };
          await createPointOfSale(createData);
          setRedirect(true);
          setBusyBtn(false);
        }
      } catch (error) {
        setBusyBtn(false);
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [selectValue],
  );

  const handleCep = useCallback(
    async (data: string) => {
      setLoadingCepResponse(true);
      try {
        const response = await cep(data);
        if (response) {
          formRef.current?.setData({
            address: {
              state: response.state,
              city: response.city,
              neighborhood: response.neighborhood,
              street: response.street,
            },
          });
        }
        setLoadingCepResponse(false);
      } catch (error) {
        setLoadingCepResponse(false);
        addToast({
          title: 'Ops!',
          description: 'CEP não encotrado',
          type: 'error',
        });
      }
    },
    [addToast],
  );

  return (
    <Container active="points-of-sale" loading={busy}>
      <HandlePointOfSalePageContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">
              {Object.keys(initialData).length > 0
                ? 'Editar ponto de venda'
                : 'Criar ponto de venda'}
            </h1>
            <CurrentPath
              path={[
                { name: 'home', url: '/' },
                { name: 'Pontos de venda', url: '/pontos-de-venda' },
                {
                  name: `${
                    Object.keys(initialData).length > 0
                      ? 'Editar novo ponto de venda'
                      : 'Criar novo ponto de venda'
                  }`,
                },
              ]}
            />
          </div>
        </PageTitle>
        <HandlePointOfSalePageContent>
          <Form ref={formRef} onSubmit={handlePointOfSale}>
            <div className="form-grid">
              {Object.keys(initialData).length > 0 ? (
                <Input name="groupId" type="text" label="Parceria" isDisabled />
              ) : (
                <>
                  {groups.length === 1 ? null : (
                    <SelectInput
                      name="groupId"
                      label="Parceria"
                      value={selectValue as OptionTypeBase}
                      onChange={(e: any) => {
                        setSelectValue({
                          value: e.value as unknown,
                          label: e.label as unknown,
                        });
                      }}
                      options={groups.map(group => {
                        return {
                          value: group.id,
                          label: group.label,
                        };
                      })}
                    />
                  )}
                </>
              )}
              <Input name="label" type="text" label="Nome" />
              <Input name="contactName" type="text" label="Contato" />
              <Input
                name="primaryPhoneNumber"
                type="text"
                label="Telefone 1"
                onChange={event => {
                  const { value } = event.target;
                  event.target.value = formatPhone(value, false);
                }}
              />
              <Input
                name="secondaryPhoneNumber"
                type="text"
                label="Telefone 2"
                onChange={event => {
                  const { value } = event.target;
                  event.target.value = formatPhone(value, false);
                }}
              />
              <Scope path="address">
                {Object.keys(initialData).length > 0 ? (
                  <Input name="zipCode" isDisabled type="text" label="CEP" />
                ) : (
                  <Input
                    name="zipCode"
                    type="text"
                    label="CEP"
                    value={cepFormatted}
                    onChange={e => {
                      if (e.target.value.length < 10) {
                        formatCep(e.target.value);
                      }
                      if (e.target.value.replaceAll('-', '').length === 8) {
                        handleCep(unformatCnpj(e.target.value));
                      }
                    }}
                  />
                )}
                <Input name="state" isDisabled type="text" label="Estado" />
                <Input name="city" isDisabled type="text" label="Cidade" />
                <Input
                  name="street"
                  isDisabled
                  type="text"
                  label="Logradouro"
                />
                <Input
                  name="neighborhood"
                  isDisabled
                  type="text"
                  label="bairro"
                />
                <Input
                  name="number"
                  type="text"
                  label="Número"
                  inputMode="numeric"
                  isDisabled={Object.keys(initialData).length > 0}
                  autoComplete="cc-number"
                />
                <Input name="extraInfo" type="text" label="Complemento" />
              </Scope>
              <div className="rent-input">
                <Input
                  name="rent"
                  type="text"
                  label="Aluguel"
                  value={type + money}
                  onChange={e => {
                    if (!isPercentage) {
                      setMoney(
                        e.target.value.replaceAll('R', '').replaceAll('$', ''),
                      );
                    } else {
                      setMoney(e.target.value.replaceAll('%', ''));
                    }
                  }}
                />
                <div className="check">
                  <SingleCheckbox
                    name="isPercentage"
                    type="checkbox"
                    id="isPercentage"
                    label="Porcento"
                    onChange={e => {
                      setIsPercentage(e.target.checked);
                      if (!e.target.checked) {
                        setType('R$');
                      } else {
                        setType('%');
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-buttons">
              <Button
                color="tertiary"
                title="Cancelar"
                busy={false}
                callback={() => setRedirect(true)}
              />
              <Button
                color="primary"
                title={
                  initialData && Object.keys(initialData).length > 0
                    ? 'Editar'
                    : 'Cadastrar'
                }
                isSubmit
                busy={busyBtn}
              />
            </div>
          </Form>
        </HandlePointOfSalePageContent>
      </HandlePointOfSalePageContainer>
      {loadingCepResponse ? <AbsoluteLoading /> : null}
      {redirect ? (
        <Redirect
          to={{
            pathname: '/detalhes-do-ponto-de-venda',
            state: initialData.pointOfSale.id,
          }}
        />
      ) : null}
    </Container>
  );
};
export default HandlePointOfSalePage;
