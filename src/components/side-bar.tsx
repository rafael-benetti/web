/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import {
  FiActivity,
  FiHardDrive,
  FiPocket,
  FiRadio,
  FiGift,
  FiHome,
  FiMap,
  FiFileText,
  FiThumbsUp,
  FiUsers,
  FiChevronRight,
  FiCircle,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons/lib';
import { v4 } from 'uuid';
import { math } from 'polished';
import { randomBytes } from 'crypto';
import {
  SideBarContainer,
  SideBarLogo,
  SideBarNav,
  NavBtn,
  NavSelectBtn,
  ToggleButton,
} from '../styles/components/side-bar';
import Logo from '../assets/logo.png';
import ContainerWithOpacity from './container-with-opacity';
import { useUser } from '../hooks/user';

interface ISubMenu {
  menu: string;
  path: string;
  class: string;
}

interface ISideBarMenu {
  menu: string;
  icon: IconType;
  path?: string;
  subMenu?: ISubMenu[];
  class: string;
}

interface IProps {
  active: string;
}

const SideBar: React.FC<IProps> = ({ active }) => {
  // hooks
  const { getUser, user } = useUser();

  // state
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setBusy(true);
    (async () => {
      getUser();
      setBusy(false);
    })();
  }, []);

  const SideBarMenu: ISideBarMenu[] = [
    {
      menu: 'Visão geral',
      icon: FiActivity,
      path: '/dashboard',
      class: 'dashboard',
    },
    {
      menu: 'Máquinas',
      icon: FiHardDrive,
      class: user?.role === 'OPERATOR' ? 'machines' : 'buttons',
      path: user?.role === 'OPERATOR' ? '/maquinas' : undefined,
      subMenu:
        user?.role === 'OPERATOR'
          ? undefined
          : [
              { menu: 'Minhas Máquinas', path: '/maquinas', class: 'machines' },
              {
                menu: 'Categorias',
                path: '/categorias',
                class: 'categories',
              },
              {
                menu: 'Tipos de contador',
                path: '/tipos-de-contadores',
                class: 'counter-types',
              },
            ],
    },
    {
      menu: 'Coletas',
      icon: FiPocket,
      path: '/coletas',
      class: 'collections',
    },
    {
      menu: 'Telemetria',
      icon: FiRadio,
      path: '/telemetrias',
      class: 'telemetries',
    },
    {
      menu: 'Estoque',
      icon: FiGift,
      class:
        user?.role === 'MANAGER'
          ? 'stock'
          : user?.role === 'OPERATOR'
          ? 'personal-stock'
          : 'group-stock',
      path:
        user?.role === 'MANAGER'
          ? undefined
          : user?.role === 'OPERATOR'
          ? '/estoque-pessoal'
          : '/estoque-da-parceria',
      subMenu:
        user?.role === 'MANAGER'
          ? [
              {
                menu: 'Estoque da parceria',
                path: '/estoque-da-parceria',
                class: 'group-stock',
              },
              {
                menu: 'Estoque pessoal',
                path: '/estoque-pessoal',
                class: 'personal-stock',
              },
            ]
          : undefined,
    },
    {
      menu: 'Pontos de venda',
      icon: FiHome,
      path: '/pontos-de-venda',
      class: 'points-of-sale',
    },
    {
      menu: 'Rotas',
      icon: FiMap,
      path: '/rotas',
      class: 'routes',
    },
    {
      menu: 'Parcerias',
      icon: FiThumbsUp,
      path: '/parcerias',
      class: 'groups',
    },
    {
      menu: 'Relatório',
      icon: FiFileText,
      path: '/relatorio',
      class: 'report',
    },
    {
      menu: 'Usuários',
      icon: FiUsers,
      class: 'users',
      subMenu: [
        {
          menu: 'Operadores',
          path: '/operadores',
          class: 'operators',
        },
        {
          menu: 'Colaboradores',
          path: '/colaboradores',
          class: 'managers',
        },
      ],
    },
  ];

  const check = useCallback((value: string, item: ISideBarMenu) => {
    const match = item.subMenu?.find(sub => sub.class === value);
    if (match) {
      return true;
    }
    return false;
  }, []);

  // state
  const [isToggle, setIsToggle] = useState<boolean>(false);

  return (
    <>
      <SideBarContainer isToggle={isToggle}>
        <SideBarLogo>
          <Link
            to={{ pathname: '/dashboard', state: `refresh-${Math.random()}` }}
          >
            <img src={Logo} alt="logo" />
          </Link>
        </SideBarLogo>
        <SideBarNav>
          {SideBarMenu.map(item => {
            if (item.class === 'groups' && user?.role === 'OPERATOR') {
              return null;
            }
            if (
              item.class === 'report' &&
              !user?.permissions?.generateReports &&
              user?.role !== 'OWNER'
            ) {
              return null;
            }
            if (item.class === 'users' && user?.role === 'OPERATOR') {
              return null;
            }
            if (
              item.class === 'users' &&
              !user?.permissions?.listOperators &&
              !user?.permissions?.listManagers &&
              user?.role === 'MANAGER'
            ) {
              return null;
            }
            if (item.subMenu) {
              return (
                <NavSelectBtn active={active} key={v4()}>
                  <input
                    type="checkbox"
                    name={item.menu}
                    id={item.menu}
                    onChange={e => {
                      if (check(active, item)) {
                        e.target.checked = true;
                      }
                    }}
                    defaultChecked={check(active, item)}
                  />
                  <label htmlFor={item.menu}>
                    <div className="nav-link">
                      <item.icon />
                      <span className="side-bar-primary-font">{item.menu}</span>
                      <div className="icon">
                        <FiChevronRight size={18} />
                      </div>
                    </div>

                    {item.subMenu.map(sub => {
                      if (
                        sub.class === 'operators' &&
                        !user?.permissions?.listOperators &&
                        user?.role !== 'OWNER'
                      ) {
                        return null;
                      }
                      if (
                        sub.class === 'managers' &&
                        !user?.permissions?.listManagers &&
                        user?.role !== 'OWNER'
                      ) {
                        return null;
                      }
                      return (
                        <div className="select-btns" key={v4()}>
                          <Link to={sub.path}>
                            <FiCircle
                              size={14}
                              color={
                                sub.class === active ? '#a26cf8' : undefined
                              }
                            />
                            <p
                              className="side-bar-secondary-font"
                              style={
                                sub.class === active
                                  ? {
                                      color: '#a26cf8',
                                    }
                                  : undefined
                              }
                            >
                              {sub.menu}
                            </p>
                          </Link>
                        </div>
                      );
                    })}
                  </label>
                </NavSelectBtn>
              );
            }
            return (
              <NavBtn active={active} key={v4()}>
                <Link to={item.path ? item.path : '/'}>
                  <div
                    className={`nav-link ${item.class}`}
                    style={
                      item.class === active
                        ? {
                            backgroundImage:
                              'linear-gradient(to right, #7366ff 0%, #a26cf8 100%)',
                            color: '#fff',
                            WebkitBoxShadow:
                              '0px 0px 12px 0px rgba(115, 102, 255, 0.35)',
                            boxShadow:
                              '0px 0px 12px 0px rgba(115, 102, 255, 0.35)',
                          }
                        : undefined
                    }
                  >
                    <item.icon />
                    <span className="side-bar-primary-font">{item.menu}</span>
                    <div className="icon" />
                  </div>
                </Link>
              </NavBtn>
            );
          })}
        </SideBarNav>
        <ToggleButton
          type="button"
          onClick={() => setIsToggle(!isToggle)}
          isToggle={isToggle}
        >
          <div className="icon" />
        </ToggleButton>
      </SideBarContainer>
      {isToggle ? (
        <ContainerWithOpacity showContainer={() => setIsToggle(false)} />
      ) : null}
    </>
  );
};

export default SideBar;
