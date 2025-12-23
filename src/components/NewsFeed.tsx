import { useMemo } from 'react';
import { NewsItem } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NewsFeedProps {
  newsItems: NewsItem[];
  onSelectItem: (item: NewsItem) => void;
  selectedItem: NewsItem | null;
  onDeleteItem?: (id: string) => Promise<boolean>;
}

const categoryColors: Record<string, string> = {
  security: 'bg-intel-cyan/20 text-intel-cyan border-intel-cyan/30',
  diplomacy: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  economy: 'bg-intel-emerald/20 text-intel-emerald border-intel-emerald/30',
  conflict: 'bg-intel-red/20 text-red-400 border-intel-red/30',
  humanitarian: 'bg-intel-amber/20 text-intel-amber border-intel-amber/30',
  technology: 'bg-intel-purple/20 text-purple-400 border-intel-purple/30',
};

export function NewsFeed({ newsItems, onSelectItem, selectedItem, onDeleteItem }: NewsFeedProps) {
  const { user } = useAuth();
  
  // Sort news items chronologically (newest first)
  const sortedNews = useMemo(() => {
    return [...newsItems].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [newsItems]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDeleteItem) {
      await onDeleteItem(id);
    }
  };

  return (
    <div className="intel-card h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedNews.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              <p>No intel reports yet.</p>
              <p className="text-xs mt-1">Click "Add Intel" to create one.</p>
            </div>
          ) : (
            sortedNews.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`p-3 rounded-lg cursor-pointer transition-all group relative ${
                  selectedItem?.id === item.id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-secondary/30 border border-transparent hover:bg-secondary/50 hover:border-border'
                }`}
              >
                {/* Delete button - only show for items user can delete */}
                {onDeleteItem && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => handleDelete(e, item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
                
                {/* Time and Category */}
                <div className="flex items-center justify-between gap-2 mb-2 pr-6">
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
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
