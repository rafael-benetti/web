import React, { useCallback } from 'react';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import { Bar } from 'react-chartjs-2';
import { ChartData } from '../entiti/machine-info';
import { SingleMachineChartContainer } from '../styles/components/single-machine-chart';

interface Props {
  chartData?: ChartData[];
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | undefined;
}

const SingleMachineChart: React.FC<Props> = ({ chartData, period }) => {
  const handleLabels = useCallback(() => {
    if (period === 'DAILY') {
      return chartData?.map(chart => {
        return `${format(new Date(chart.date), 'H', {
          locale: ptLocale,
        })}h`;
      });
    }
    if (period === 'WEEKLY') {
      return chartData?.map(chart =>
        format(new Date(chart.date), 'dd-MM', {
          locale: ptLocale,
        }),
      );
    }
    return chartData?.map(chart =>
      format(new Date(chart.date), 'dd-MM', {
        locale: ptLocale,
      }),
    );
  }, []);

  const data = {
    labels: handleLabels(),

    datasets: [
      {
        label: 'Prêmios',
        fill: true,
        backgroundColor: '#dc3545',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 5,
        pointHitRadius: 40,
        data: chartData?.map(chart => chart.prizeCount),
        stack: 'stack',
      },
      {
        label: 'Faturamento',
        fill: true,
        backgroundColor: '#28a745',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 5,
        pointHitRadius: 40,
        data: chartData?.map(chart => chart.income),
        stack: 'stack',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };
  return (
    <SingleMachineChartContainer>
      <Bar type="bar" data={data} options={options} />
    </SingleMachineChartContainer>
  );
};
export default SingleMachineChart;
