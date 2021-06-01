import React from 'react';
import { IconType } from 'react-icons/lib';
import { CardContainer } from '../styles/components/dashboard-card';

interface IProps {
  title: string;
  value: number;
  Icon: IconType;
  color: string;
}

const DashboardCard: React.FC<IProps> = ({ title, value, Icon, color }) => {
  return (
    <CardContainer>
      <Icon size={30} color={color} />
      <div className="label">
        <p>{title}</p>
        <span>{value}</span>
      </div>
      <div className="background-icon">
        <Icon style={{ color }} />
      </div>
    </CardContainer>
  );
};

export default DashboardCard;
