import { useMemo } from 'react';
import { NewsItem, ThreatLevel } from '@/types/news';
import { AlertTriangle, TrendingUp, MapPin, Clock } from 'lucide-react';

interface RiskSummaryProps {
  newsItems: NewsItem[];
}

const threatColors: Record<ThreatLevel, string> = {
  low: 'text-green-400',
  elevated: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

export function RiskSummary({ newsItems }: RiskSummaryProps) {
  const stats = useMemo(() => {
    const criticalCount = newsItems.filter(i => i.threatLevel === 'critical').length;
    const highCount = newsItems.filter(i => i.threatLevel === 'high').length;
    const recentBreaking = newsItems.filter(i => i.confidenceLevel === 'breaking').length;
    
    // Top affected regions
    const regionCounts = newsItems.reduce((acc, item) => {
      acc[item.region] = (acc[item.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topRegions = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { criticalCount, highCount, recentBreaking, topRegions };
  }, [newsItems]);

  return (
    <div className="absolute top-4 right-4 z-[1000] w-72 bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-xl">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-intel-amber" />
          <h3 className="text-sm font-semibold">Global Risk Summary – 24h</h3>
        </div>
      </div>
      
      <div className="p-3 space-y-3">
        {/* Threat counts */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-red-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-red-400">{stats.criticalCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Critical</div>
          </div>
          <div className="bg-orange-500/10 rounded-lg p-2">
            <div className="text-lg font-bold text-orange-400">{stats.highCount}</div>
            <div className="text-[10px] text-muted-foreground uppercase">High</div>
          </div>
          <div className="bg-intel-amber/10 rounded-lg p-2">
            <div className="text-lg font-bold text-intel-amber">{stats.recentBreaking}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Breaking</div>
          </div>
        </div>

        {/* Top regions */}
        <div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" />
            <span>Top Affected Regions</span>
          </div>
          <div className="space-y-1">
            {stats.topRegions.map(([region, count]) => (
              <div key={region} className="flex justify-between items-center text-xs">
                <span className="text-foreground">{region}</span>
                <span className="text-muted-foreground font-mono">{count} events</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total events */}
        <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Total Events</span>
          </div>
          <span className="font-mono text-primary">{newsItems.length}</span>
        </div>
      </div>
    </div>
  );
}
