import { useMemo } from 'react';
import { NewsItem } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Newspaper, MapPin, Clock } from 'lucide-react';

interface NewsFeedProps {
  newsItems: NewsItem[];
  onSelectItem: (item: NewsItem) => void;
  selectedItem: NewsItem | null;
}

const categoryColors: Record<string, string> = {
  security: 'bg-intel-cyan/20 text-intel-cyan border-intel-cyan/30',
  diplomacy: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  economy: 'bg-intel-emerald/20 text-intel-emerald border-intel-emerald/30',
  conflict: 'bg-intel-red/20 text-red-400 border-intel-red/30',
  humanitarian: 'bg-intel-amber/20 text-intel-amber border-intel-amber/30',
  technology: 'bg-intel-purple/20 text-purple-400 border-intel-purple/30',
};

export function NewsFeed({ newsItems, onSelectItem, selectedItem }: NewsFeedProps) {
  // Sort news items chronologically (newest first)
  const sortedNews = useMemo(() => {
    return [...newsItems].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [newsItems]);

  return (
    <div className="intel-card h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedNews.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedItem?.id === item.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-secondary/30 border border-transparent hover:bg-secondary/50 hover:border-border'
              }`}
            >
              {/* Time and Category */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase tracking-wider ${categoryColors[item.category]}`}
                >
                  {item.category}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="font-medium text-xs leading-tight line-clamp-2 mb-1">
                {item.title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {item.country}
              </div>
            </article>
          ))}
        </div>
      </ScrollArea>

      {/* Live indicator */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-intel-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-intel-cyan"></span>
          </span>
          <span className="text-muted-foreground font-mono text-[10px]">LIVE FEED</span>
        </div>
      </div>
    </div>
  );
}
