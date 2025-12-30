import { useState } from 'react';
import { Header } from '@/components/Header';
import { IntelligenceTimeline } from '@/components/timeline/IntelligenceTimeline';
import { mockTimelineEvents } from '@/data/mockTimelineEvents';
import { useNewsItems } from '@/hooks/useNewsItems';
import { useUserRole } from '@/hooks/useUserRole';
import { IntelligenceEvent } from '@/types/timeline';

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState<IntelligenceEvent | null>(null);
  const { createNewsItem } = useNewsItems();
  const { isAnalyst } = useUserRole();

  return (
    <div className="h-screen flex flex-col bg-background grid-pattern">
      <Header
        onToggleSidebar={() => {}}
        showSidebar={false}
        onCreateNews={isAnalyst ? createNewsItem : undefined}
        newsItems={[]}
      />

      <div className="flex-1 overflow-hidden">
        <IntelligenceTimeline
          events={mockTimelineEvents}
          onEventSelect={setSelectedEvent}
          isPremium={true}
        />
      </div>
    </div>
  );
}
