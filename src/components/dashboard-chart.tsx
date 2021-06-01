import React from 'react';

import { Bar } from 'react-chartjs-2';
import { DashboardChartContainer } from '../styles/components/dashboard-chart';

interface Props {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
}

const DashboardChart: React.FC<Props> = () => {
  const data = {
    labels: [
      '15h',
      '16h',
      '17h',
      '18h',
      '19h',
      '20h',
      '21h',
      '23h',
      '0h',
      '1h',
      '2h',
      '3h',
      '4h',
      '5h',
      '6h',
      '7h',
      '8h',
      '9h',
      '10h',
      '11h',
      '12h',
      '13h',
      '14h',
    ],

    datasets: [
      {
        label: 'Prêmios',
        fill: true,
        backgroundColor: '#dc3545',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 5,
        pointHitRadius: 40,
        data: [
          20,
          35,
          15,
          20,
          45,
          87,
          65,
          32,
          45,
          15,
          21,
          54,
          89,
          65,
          45,
          100,
          23,
          65,
          99,
          55,
          12,
          130,
        ],
        stack: 'stack',
      },
      {
        label: 'Faturamento',
        fill: true,
        backgroundColor: '#28a745',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 5,
        pointHitRadius: 40,
        data: [
          200,
          350,
          150,
          200,
          450,
          870,
          650,
          320,
          450,
          150,
          210,
          540,
          890,
          650,
          450,
          1000,
          230,
          650,
          990,
          550,
          120,
          1300,
        ],
        stack: 'stack',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 50,
      },
    },
  };
  return (
    <DashboardChartContainer>
      <Bar type="bar" data={data} options={options} />
    </DashboardChartContainer>
  );
};
export default DashboardChart;
