
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, UsersIcon, FileText, TrendingUp } from "lucide-react";

interface UsageStatsProps {
  totalLetters: number;
  totalJobs: number;
  totalCompanies: number;
  generationsUsed: number;
  generationsAllowed: number;
}

const UsageStats: React.FC<UsageStatsProps> = ({
  totalLetters,
  totalJobs,
  totalCompanies,
  generationsUsed,
  generationsAllowed
}) => {
  const stats = [
    {
      title: "Ansøgninger",
      value: totalLetters,
      icon: FileText,
      description: "Antal gemte ansøgninger"
    },
    {
      title: "Jobopslag",
      value: totalJobs,
      icon: BarChart,
      description: "Antal gemte jobopslag"
    },
    {
      title: "Virksomheder",
      value: totalCompanies,
      icon: UsersIcon,
      description: "Gemte virksomheder"
    },
    {
      title: "AI Genereringer",
      value: generationsUsed,
      icon: TrendingUp,
      description: `${generationsAllowed - generationsUsed} tilbage af ${generationsAllowed}`
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UsageStats;
