
import { ChartOptions } from 'chart.js';

export interface ActivityData {
  labels: string[];
  letterCounts: number[];
  jobCounts: number[];
}

export const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

export const getChartData = (data: ActivityData) => ({
  labels: data.labels,
  datasets: [
    {
      label: 'Ansøgninger',
      data: data.letterCounts,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
    {
      label: 'Jobopslag',
      data: data.jobCounts,
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
    },
  ],
});
