import { useState } from 'react';
import { NewsItem, FilterState } from '@/types/news';
import { mockNewsData } from '@/data/mockNews';
import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { IntelMap } from '@/components/IntelMap';
import { NewsDetail } from '@/components/NewsDetail';
import { useNewsItems } from '@/hooks/useNewsItems';
import { useUserRole } from '@/hooks/useUserRole';
import { Skeleton } from '@/components/ui/skeleton';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';

export default function Dashboard() {
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: null, to: null },
    regions: [],
    countries: [],
    tags: [],
    sources: [],
    searchQuery: '',
    categories: [],
    threatLevels: [],
    confidenceLevels: [],
    actorTypes: [],
    timeRange: '24h',
  });
  const { newsItems, loading, createNewsItem, deleteNewsItem } = useNewsItems();
  const { isAnalyst, isClient, loading: roleLoading } = useUserRole();

  // Use database items if available, otherwise fall back to mock data for demo
  const displayItems = newsItems.length > 0 ? newsItems : mockNewsData;

  // Show loading state while role is being determined
  if (roleLoading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
              <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin"></div>
            </div>
            <span className="text-sm text-muted-foreground font-mono">LOADING DASHBOARD...</span>
          </div>
        </div>
      </div>
    );
  }

  // Executive/Client view - simplified summary dashboard
  if (isClient) {
    return (
      <div className="h-screen flex flex-col bg-background grid-pattern scanline">
        <Header
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          showSidebar={showSidebar}
          newsItems={displayItems}
        />
        <div className="flex-1 overflow-hidden">
          <ExecutiveDashboard newsItems={displayItems} loading={loading} />
        </div>
      </div>
    );
  }

  // Analyst view - full detailed dashboard with map and news feed
  return (
    <div className="h-screen flex flex-col bg-background grid-pattern scanline">
      <Header
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
        onCreateNews={isAnalyst ? createNewsItem : undefined}
        newsItems={displayItems}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - News Feed */}
        <aside className={`w-72 border-r border-border flex-shrink-0 transition-all duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full absolute lg:relative lg:translate-x-0'
        }`}>
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <NewsFeed
              newsItems={displayItems}
              onSelectItem={setSelectedItem}
              selectedItem={selectedItem}
              onDeleteItem={isAnalyst ? deleteNewsItem : undefined}
            />
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <IntelMap
              newsItems={displayItems}
              onSelectItem={setSelectedItem}
              selectedItem={selectedItem}
            />
          </div>
        </main>

        {/* Right Sidebar - News Detail */}
        {selectedItem && (
          <aside className="w-80 border-l border-border flex-shrink-0 bg-background">
            <NewsDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
          </aside>
        )}
      </div>
    </div>
  );
}
