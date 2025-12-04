import { ViewMode } from '@/types/news';
import { Button } from '@/components/ui/button';
import { Map, List, Clock, Radio, Menu, Settings, Bell } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleSidebar: () => void;
  showSidebar: boolean;
}

export function Header({ viewMode, onViewModeChange, onToggleSidebar, showSidebar }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-intel-emerald rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Global Intel Desk</h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              OSINT Monitoring Platform
            </p>
          </div>
        </div>
      </div>

      {/* Center - View Mode Toggle */}
      <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
        <Button
          variant={viewMode === 'map' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3 text-xs"
          onClick={() => onViewModeChange('map')}
        >
          <Map className="w-3.5 h-3.5 mr-1.5" />
          Map
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3 text-xs"
          onClick={() => onViewModeChange('list')}
        >
          <List className="w-3.5 h-3.5 mr-1.5" />
          List
        </Button>
        <Button
          variant={viewMode === 'timeline' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-3 text-xs"
          onClick={() => onViewModeChange('timeline')}
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          Timeline
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-intel-red rounded-full" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
