import { Button } from '@/components/ui/button';
import { Radio, ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AnalyticsHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-intel-emerald rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              Intelligence Metrics & Trends
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <RefreshCw className="w-3 h-3" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <Download className="w-3 h-3" />
          Export
        </Button>
      </div>
    </header>
  );
}
