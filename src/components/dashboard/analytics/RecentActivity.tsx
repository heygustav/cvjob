
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from '@/components/ui/icon';
import { formatDistanceToNow } from 'date-fns';
import { da } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'letter' | 'job' | 'company';
  title: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'letter':
        return 'file-text';
      case 'job':
        return 'briefcase';
      case 'company':
        return 'building';
      default:
        return 'activity';
    }
  };

  return (
    <Card className="col-span-4 md:col-span-2">
      <CardHeader>
        <CardTitle>Seneste aktivitet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Icon 
                  name={getActivityIcon(activity.type)}
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { 
                    addSuffix: true,
                    locale: da 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
