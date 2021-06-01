import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { v4 } from 'uuid';
import { CurrentPathContainer } from '../styles/components/current-path';

interface IProps {
  path: {
    name: string;
    url?: string;
    state?: { pathname: string; state: string };
  }[];
}

const CurrentPath: React.FC<IProps> = ({ path }) => {
  return (
    <CurrentPathContainer>
      {path.map(p => {
        return (
          <div key={v4()}>
            {p.url ? (
              <Link key={v4()} to={p.url}>
                {p.name === 'home' ? <FiHome /> : p.name}
              </Link>
            ) : (
              <>
                {p.state ? (
                  <Link
                    key={v4()}
                    to={{ pathname: p.state.pathname, state: p.state.state }}
                  >
                    {p.name}
                  </Link>
                ) : (
                  <div key={v4()}>{`/ ${p.name}`}</div>
                )}
              </>
            )}
          </div>
        );
      })}
    </CurrentPathContainer>
  );
};
export default CurrentPath;
