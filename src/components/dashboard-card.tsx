/* eslint-disable prettier/prettier */
import React from 'react';
import { IconType } from 'react-icons/lib';
import { useMachine } from '../hooks/machine';
import { CardContainer } from '../styles/components/dashboard-card';

interface IProps {
  title: string;
  value: number;
  Icon: IconType;
  color: string;
  params?: { value: string; label: string };
}

const DashboardCard: React.FC<IProps> = ({
  title,
  value,
  Icon,
  color,
  params,
}) => {
  const { handleFilter } = useMachine();

  return (
    <CardContainer
      onClick={() =>
        handleFilter({
          telemetryStatus: params as {
            label: string;
            value: 'ONLINE' | 'OFFLINE' | 'VIRGIN' | 'NO_TELEMETRY' | 'none';
          },
        })}
    >
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
