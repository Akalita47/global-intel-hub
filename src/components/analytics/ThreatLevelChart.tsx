import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { NewsItem } from '@/types/news';

interface ThreatLevelChartProps {
  newsItems: NewsItem[];
}

const THREAT_COLORS = {
  critical: 'hsl(0, 84%, 60%)',
  high: 'hsl(25, 95%, 53%)',
  elevated: 'hsl(45, 93%, 47%)',
  low: 'hsl(142, 71%, 45%)',
};

export function ThreatLevelChart({ newsItems }: ThreatLevelChartProps) {
  const data = useMemo(() => {
    const counts = {
      critical: 0,
      high: 0,
      elevated: 0,
      low: 0,
    };

    newsItems.forEach((item) => {
      counts[item.threatLevel]++;
    });

    return [
      { name: 'Critical', value: counts.critical, color: THREAT_COLORS.critical },
      { name: 'High', value: counts.high, color: THREAT_COLORS.high },
      { name: 'Elevated', value: counts.elevated, color: THREAT_COLORS.elevated },
      { name: 'Low', value: counts.low, color: THREAT_COLORS.low },
    ].filter(d => d.value > 0);
  }, [newsItems]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-intel-red animate-pulse" />
          Threat Level Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
