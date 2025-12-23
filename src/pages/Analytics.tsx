import { useMemo } from 'react';
import { useNewsItems } from '@/hooks/useNewsItems';
import { mockNewsData } from '@/data/mockNews';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { ThreatLevelChart } from '@/components/analytics/ThreatLevelChart';
import { RegionalChart } from '@/components/analytics/RegionalChart';
import { CategoryTrendsChart } from '@/components/analytics/CategoryTrendsChart';
import { StatsCards } from '@/components/analytics/StatsCards';
import { SourceCredibilityChart } from '@/components/analytics/SourceCredibilityChart';
import { RecentActivityFeed } from '@/components/analytics/RecentActivityFeed';
import { Skeleton } from '@/components/ui/skeleton';

export default function Analytics() {
  const { newsItems, loading } = useNewsItems();
  
  // Use database items if available, otherwise fall back to mock data
  const displayItems = newsItems.length > 0 ? newsItems : mockNewsData;

  const stats = useMemo(() => {
    const now = new Date();
    const last24h = displayItems.filter(item => {
      const itemDate = new Date(item.publishedAt);
      return (now.getTime() - itemDate.getTime()) < 24 * 60 * 60 * 1000;
    });

    const criticalCount = displayItems.filter(i => i.threatLevel === 'critical').length;
    const highCount = displayItems.filter(i => i.threatLevel === 'high').length;
    const verifiedCount = displayItems.filter(i => i.confidenceLevel === 'verified').length;

    return {
      totalReports: displayItems.length,
      last24h: last24h.length,
      criticalThreats: criticalCount,
      highThreats: highCount,
      verifiedIntel: verifiedCount,
      avgConfidence: displayItems.reduce((acc, i) => acc + i.confidenceScore, 0) / displayItems.length || 0,
    };
  }, [displayItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AnalyticsHeader />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnalyticsHeader />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatLevelChart newsItems={displayItems} />
          <RegionalChart newsItems={displayItems} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CategoryTrendsChart newsItems={displayItems} />
          </div>
          <SourceCredibilityChart newsItems={displayItems} />
        </div>

        {/* Recent Activity */}
        <RecentActivityFeed newsItems={displayItems} />
      </div>
    </div>
  );
}
