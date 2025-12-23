import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalReports: number;
    last24h: number;
    criticalThreats: number;
    highThreats: number;
    verifiedIntel: number;
    avgConfidence: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Intel Reports',
      value: stats.totalReports,
      subtitle: `+${stats.last24h} last 24h`,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Critical Threats',
      value: stats.criticalThreats,
      subtitle: `${stats.highThreats} high priority`,
      icon: AlertTriangle,
      color: 'text-intel-red',
      bgColor: 'bg-intel-red/10',
    },
    {
      title: 'Verified Intel',
      value: stats.verifiedIntel,
      subtitle: `${Math.round((stats.verifiedIntel / stats.totalReports) * 100)}% of total`,
      icon: Shield,
      color: 'text-intel-emerald',
      bgColor: 'bg-intel-emerald/10',
    },
    {
      title: 'Avg Confidence',
      value: `${Math.round(stats.avgConfidence * 100)}%`,
      subtitle: 'Across all sources',
      icon: TrendingUp,
      color: 'text-intel-amber',
      bgColor: 'bg-intel-amber/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </div>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
