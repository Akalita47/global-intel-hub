import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsItem, ThreatLevel } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Shield, Zap } from 'lucide-react';

interface RecentActivityFeedProps {
  newsItems: NewsItem[];
}

const threatColors: Record<ThreatLevel, string> = {
  critical: 'bg-intel-red/10 text-intel-red border-intel-red/30',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  elevated: 'bg-intel-amber/10 text-intel-amber border-intel-amber/30',
  low: 'bg-intel-emerald/10 text-intel-emerald border-intel-emerald/30',
};

const threatIcons: Record<ThreatLevel, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: AlertTriangle,
  elevated: Zap,
  low: Shield,
};

export function RecentActivityFeed({ newsItems }: RecentActivityFeedProps) {
  const recentItems = useMemo(() => {
    return [...newsItems]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 8);
  }, [newsItems]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-intel-emerald animate-pulse" />
          Recent Intelligence Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentItems.map((item) => {
            const Icon = threatIcons[item.threatLevel];
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className={`p-1.5 rounded ${threatColors[item.threatLevel]}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] h-5">
                      {item.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {item.region}
                    </span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Badge className={`text-[10px] h-5 ${threatColors[item.threatLevel]}`}>
                  {item.threatLevel}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
