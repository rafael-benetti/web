import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { IToastMessage, useToast } from '../../../hooks/toast';

import { Container } from './styles';

interface IProps {
  message: IToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<IProps> = ({ message, style }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, message.duration || 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id, message.duration]);

  return (
    <Container
      style={style}
      type={message.type}
      hasdescription={!!message.description}
    >
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        <p>{message.description}</p>
      </div>

      <button type="button" onClick={() => removeToast(message.id)}>
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
