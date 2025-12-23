import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NewsItem } from '@/types/news';
import { format, subDays, startOfDay } from 'date-fns';

interface CategoryTrendsChartProps {
  newsItems: NewsItem[];
}

const CATEGORY_COLORS = {
  security: 'hsl(0, 84%, 60%)',
  conflict: 'hsl(25, 95%, 53%)',
  diplomacy: 'hsl(220, 70%, 50%)',
  economy: 'hsl(142, 71%, 45%)',
  humanitarian: 'hsl(280, 65%, 60%)',
  technology: 'hsl(45, 93%, 47%)',
};

export function CategoryTrendsChart({ newsItems }: CategoryTrendsChartProps) {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      return {
        date: format(date, 'MMM dd'),
        dateObj: date,
        security: 0,
        conflict: 0,
        diplomacy: 0,
        economy: 0,
        humanitarian: 0,
        technology: 0,
      };
    });

    newsItems.forEach((item) => {
      const itemDate = startOfDay(new Date(item.publishedAt));
      const dayData = last7Days.find(d => d.dateObj.getTime() === itemDate.getTime());
      if (dayData && item.category in dayData) {
        (dayData as any)[item.category]++;
      }
    });

    return last7Days.map(({ dateObj, ...rest }) => rest);
  }, [newsItems]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Category Trends (7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
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
                  <span className="text-xs text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="security"
                stackId="1"
                stroke={CATEGORY_COLORS.security}
                fill={CATEGORY_COLORS.security}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="conflict"
                stackId="1"
                stroke={CATEGORY_COLORS.conflict}
                fill={CATEGORY_COLORS.conflict}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="diplomacy"
                stackId="1"
                stroke={CATEGORY_COLORS.diplomacy}
                fill={CATEGORY_COLORS.diplomacy}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="economy"
                stackId="1"
                stroke={CATEGORY_COLORS.economy}
                fill={CATEGORY_COLORS.economy}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
