import { useState } from 'react';
import { NewsItem } from '@/types/news';
import { mockNewsData } from '@/data/mockNews';
import { Header } from '@/components/Header';
import { NewsFeed } from '@/components/NewsFeed';
import { IntelMap } from '@/components/IntelMap';
import { NewsDetail } from '@/components/NewsDetail';

export default function Dashboard() {
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background grid-pattern scanline">
      <Header
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
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0">
            <IntelMap
              newsItems={mockNewsData}
              onSelectItem={setSelectedItem}
              selectedItem={selectedItem}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
