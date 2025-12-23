import { useState } from 'react';
import { NewsItem } from '@/types/news';
import { mockNewsData } from '@/data/mockNews';
import { Header } from '@/components/Header';
import { TimelineView } from '@/components/TimelineView';
import { NewsDetail } from '@/components/NewsDetail';
import { useNewsItems } from '@/hooks/useNewsItems';
import { useUserRole } from '@/hooks/useUserRole';

export default function Timeline() {
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const { newsItems, createNewsItem } = useNewsItems();
  const { isAnalyst } = useUserRole();

  const displayItems = newsItems.length > 0 ? newsItems : mockNewsData;

  return (
    <div className="h-screen flex flex-col bg-background grid-pattern">
      <Header
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
        onCreateNews={isAnalyst ? createNewsItem : undefined}
        newsItems={displayItems}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Timeline View */}
        <main className={`flex-1 overflow-hidden transition-all duration-300 ${selectedItem ? 'lg:mr-96' : ''}`}>
          <TimelineView
            newsItems={displayItems}
            onSelectItem={setSelectedItem}
            selectedItem={selectedItem}
          />
        </main>

        {/* Right Sidebar - Detail Panel */}
        {selectedItem && (
          <aside className="w-96 border-l border-border flex-shrink-0 absolute right-0 top-14 bottom-0 lg:relative lg:top-0 bg-background z-10">
            <NewsDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
          </aside>
        )}
      </div>
    </div>
  );
}
