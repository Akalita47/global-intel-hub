import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from 'recharts';
import { NewsItem } from '@/types/news';

interface SourceCredibilityChartProps {
  newsItems: NewsItem[];
}

export function SourceCredibilityChart({ newsItems }: SourceCredibilityChartProps) {
  const data = useMemo(() => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
    };

    newsItems.forEach((item) => {
      counts[item.sourceCredibility]++;
    });

    const total = newsItems.length || 1;

    return [
      {
        name: 'High',
        value: Math.round((counts.high / total) * 100),
        fill: 'hsl(142, 71%, 45%)',
      },
      {
        name: 'Medium',
        value: Math.round((counts.medium / total) * 100),
        fill: 'hsl(45, 93%, 47%)',
      },
      {
        name: 'Low',
        value: Math.round((counts.low / total) * 100),
        fill: 'hsl(0, 84%, 60%)',
      },
    ];
  }, [newsItems]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-intel-emerald" />
          Source Credibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="100%"
              barSize={12}
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background={{ fill: 'hsl(var(--muted)/0.2)' }}
                dataKey="value"
                cornerRadius={6}
              />
              <Legend
                iconSize={8}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value, entry: any) => (
                  <span className="text-xs text-muted-foreground">
                    {value}: {entry.payload.value}%
                  </span>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
