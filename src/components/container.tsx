import React from 'react';
import { ClipLoader } from 'react-spinners';
import { ContainerStyle } from '../styles/pages/container';
import Header from './header';
import SideBar from './side-bar';

interface Props {
  active: string;
  loading: boolean;
}

const Container: React.FC<Props> = ({ children, loading, active }) => {
  return (
    <ContainerStyle>
      <Header />
      <SideBar active={active} />
      <div className="main">
        {loading ? (
          <div className="is-loading">
            <ClipLoader size={30} color="#7366ff" />
          </div>
        ) : (
          children
        )}
      </div>
    </ContainerStyle>
  );
};
export default Container;
