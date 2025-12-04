import { NewsItem } from '@/types/news';
import { formatDistanceToNow, format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface NewsListProps {
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

const getConfidenceColor = (score: number) => {
  if (score >= 0.9) return 'text-intel-emerald';
  if (score >= 0.7) return 'text-intel-amber';
  return 'text-intel-red';
};

export function NewsList({ newsItems, onSelectItem, selectedItem }: NewsListProps) {
  return (
    <div className="intel-card h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            Intel Feed
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {newsItems.length} items
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {newsItems.map((item, index) => (
            <article
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`p-3 rounded-lg cursor-pointer transition-all animate-fade-in ${
                selectedItem?.id === item.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-secondary/30 border border-transparent hover:bg-secondary/50 hover:border-border'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase tracking-wider ${categoryColors[item.category]}`}
                >
                  {item.category}
                </Badge>
                <span className={`text-[10px] font-mono ${getConfidenceColor(item.confidenceScore)}`}>
                  {Math.round(item.confidenceScore * 100)}%
                </span>
              </div>

              {/* Title */}
              <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2">
                {item.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {item.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                  </span>
                </div>
                <span className="font-mono">{item.source}</span>
              </div>
            </article>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
