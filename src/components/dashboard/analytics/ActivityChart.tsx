
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
import { ActivityData, chartOptions, getChartData } from './chart-config/activityChartConfig';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityChartProps {
  data: ActivityData;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const chartData = getChartData(data);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Aktivitet oversigt</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Bar options={chartOptions} data={chartData} />
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
