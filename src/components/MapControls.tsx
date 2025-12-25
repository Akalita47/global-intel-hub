import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, Map, Download, FileImage, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThreatLevel } from '@/types/news';

interface MapControlsProps {
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  onExportImage: () => void;
  onExportPDF: () => void;
}

const threatColors: Record<ThreatLevel, { color: string; label: string }> = {
  low: { color: '#22c55e', label: 'Low' },
  elevated: { color: '#eab308', label: 'Elevated' },
  high: { color: '#f97316', label: 'High' },
  critical: { color: '#ef4444', label: 'Critical' },
};

const categoryColors: Record<string, { color: string; label: string }> = {
  security: { color: '#14b8a6', label: 'Security' },
  diplomacy: { color: '#3b82f6', label: 'Diplomacy' },
  economy: { color: '#22c55e', label: 'Economy' },
  conflict: { color: '#ef4444', label: 'Conflict' },
  humanitarian: { color: '#f59e0b', label: 'Humanitarian' },
  technology: { color: '#8b5cf6', label: 'Technology' },
};

export function MapControls({ showHeatmap, onToggleHeatmap, onExportImage, onExportPDF }: MapControlsProps) {
  return (
    <>
      {/* Top Left Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <Button
          variant={showHeatmap ? 'default' : 'secondary'}
          size="sm"
          className="gap-2 shadow-lg"
          onClick={onToggleHeatmap}
        >
          <Layers className="w-4 h-4" />
          {showHeatmap ? 'Markers' : 'Heatmap'}
        </Button>
      </div>

      {/* Top Right Export */}
      <div className="absolute top-4 right-4 z-[1000]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-2 shadow-lg">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportImage}>
              <FileImage className="w-4 h-4 mr-2" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPDF}>
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-8 left-4 z-[1000] intel-card p-3 shadow-lg max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <Map className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold">Legend</span>
        </div>
        
        {!showHeatmap ? (
          <>
            <div className="mb-2">
              <p className="text-[10px] text-muted-foreground mb-1">Categories</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(categoryColors).map(([key, { color, label }]) => (
                  <Badge
                    key={key}
                    variant="outline"
                    className="text-[10px] gap-1"
                    style={{ borderColor: color }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">Threat Intensity</p>
            <div className="flex items-center gap-1">
              <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">Low</span>
              <span className="text-[10px] text-muted-foreground">Critical</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Right Stats */}
      <div className="absolute bottom-8 right-4 z-[1000] intel-card p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-intel-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-intel-emerald"></span>
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">LIVE</span>
        </div>
      </div>
    </>
  );
}
