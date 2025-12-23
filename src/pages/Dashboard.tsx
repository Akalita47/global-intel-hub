import { useState } from 'react';
import { NewsItem, ViewMode } from '@/types/news';
import { mockNewsData } from '@/data/mockNews';
import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { IntelMap } from '@/components/IntelMap';
import { NewsList } from '@/components/NewsList';
import { TimelineView } from '@/components/TimelineView';
import { NewsDetail } from '@/components/NewsDetail';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background grid-pattern scanline">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - News Feed */}
        <aside className={`w-72 border-r border-border flex-shrink-0 transition-all duration-300 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full absolute lg:relative lg:translate-x-0'
        }`}>
          <NewsFeed
            newsItems={mockNewsData}
            onSelectItem={setSelectedItem}
            selectedItem={selectedItem}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden relative">
          {/* Map/List/Timeline View */}
          <div className="flex-1 relative">
            {viewMode === 'map' && (
              <div className="absolute inset-0">
                <IntelMap
                  newsItems={mockNewsData}
                  onSelectItem={setSelectedItem}
                  selectedItem={selectedItem}
                />
              </div>
            )}
            {viewMode === 'list' && (
              <div className="h-full p-4">
                <NewsList newsItems={mockNewsData} onSelectItem={setSelectedItem} selectedItem={selectedItem} />
              </div>
            )}
            {viewMode === 'timeline' && (
              <div className="h-full p-4">
                <TimelineView newsItems={mockNewsData} onSelectItem={setSelectedItem} selectedItem={selectedItem} />
              </div>
            )}
          </div>

          {/* Right Panel - Detail View */}
          {selectedItem && (
            <aside className="w-80 border-l border-border flex-shrink-0">
              <NewsDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}
