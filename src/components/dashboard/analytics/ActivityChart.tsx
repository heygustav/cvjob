
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityData {
  labels: string[];
  letterCounts: number[];
  jobCounts: number[];
}

interface ActivityChartProps {
  data: ActivityData;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const chartData = {
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
  };

  const options = {
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

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Aktivitet oversigt</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Bar options={options} data={chartData} />
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
