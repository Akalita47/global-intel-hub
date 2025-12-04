import { useState, useMemo } from 'react';
import { NewsItem, FilterState, ViewMode } from '@/types/news';
import { mockNewsData } from '@/data/mockNews';
import { Header } from '@/components/Header';
import { FilterPanel } from '@/components/FilterPanel';
import { IntelMap } from '@/components/IntelMap';
import { NewsList } from '@/components/NewsList';
import { TimelineView } from '@/components/TimelineView';
import { NewsDetail } from '@/components/NewsDetail';

const initialFilters: FilterState = {
  dateRange: { from: null, to: null },
  regions: [],
  countries: [],
  tags: [],
  sources: [],
  searchQuery: '',
  categories: [],
};

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Filter news items based on current filters
  const filteredNews = useMemo(() => {
    return mockNewsData.filter((item) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }

      // Region filter
      if (filters.regions.length > 0 && !filters.regions.includes(item.region)) {
        return false;
      }

      // Source filter
      if (filters.sources.length > 0 && !filters.sources.includes(item.source)) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleSelectItem = (item: NewsItem) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background grid-pattern scanline">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Filters */}
        <aside
          className={`w-72 border-r border-border flex-shrink-0 transition-all duration-300 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full absolute lg:relative lg:translate-x-0'
          }`}
        >
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            totalResults={mockNewsData.length}
            filteredResults={filteredNews.length}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden">
          {/* Map/List/Timeline View */}
          <div className="flex-1 relative">
          {viewMode === 'map' && (
              <div className="absolute inset-0">
                <IntelMap
                  newsItems={filteredNews}
                  onSelectItem={handleSelectItem}
                  selectedItem={selectedItem}
                />
              </div>
            )}
            {viewMode === 'list' && (
              <div className="h-full p-4">
                <NewsList
                  newsItems={filteredNews}
                  onSelectItem={handleSelectItem}
                  selectedItem={selectedItem}
                />
              </div>
            )}
            {viewMode === 'timeline' && (
              <div className="h-full p-4">
                <TimelineView
                  newsItems={filteredNews}
                  onSelectItem={handleSelectItem}
                  selectedItem={selectedItem}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Detail View */}
          {selectedItem && (
            <aside className="w-80 border-l border-border flex-shrink-0">
              <NewsDetail item={selectedItem} onClose={handleCloseDetail} />
            </aside>
          )}
        </main>
      </div>

      {/* Status Bar */}
      <footer className="h-8 border-t border-border bg-card/50 flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-intel-emerald animate-pulse" />
            SYSTEM ONLINE
          </span>
          <span>|</span>
          <span>LAST UPDATE: {new Date().toISOString()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>SOURCES: 12 ACTIVE</span>
          <span>|</span>
          <span>LATENCY: 42ms</span>
        </div>
      </footer>
    </div>
  );
}
