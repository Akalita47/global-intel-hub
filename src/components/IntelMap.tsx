import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { NewsItem } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Shield, TrendingUp, Globe, AlertTriangle, Heart, Cpu } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface IntelMapProps {
  newsItems: NewsItem[];
  onSelectItem: (item: NewsItem) => void;
  selectedItem: NewsItem | null;
}

const categoryColors: Record<string, string> = {
  security: '#14b8a6',
  diplomacy: '#3b82f6',
  economy: '#22c55e',
  conflict: '#ef4444',
  humanitarian: '#f59e0b',
  technology: '#8b5cf6',
};

const categoryIcons: Record<string, typeof Shield> = {
  security: Shield,
  diplomacy: Globe,
  economy: TrendingUp,
  conflict: AlertTriangle,
  humanitarian: Heart,
  technology: Cpu,
};

// Create custom marker icon
const createCustomIcon = (category: string) => {
  const color = categoryColors[category] || '#14b8a6';
  return L.divIcon({
    className: 'custom-marker-container',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid rgba(255,255,255,0.9);
        box-shadow: 0 0 12px ${color}80, 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: ${color}40;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16],
  });
};

function MapController({ selectedItem }: { selectedItem: NewsItem | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedItem) {
      map.flyTo([selectedItem.lat, selectedItem.lon], 6, {
        duration: 1.5,
      });
    }
  }, [selectedItem, map]);
  
  return null;
}

export function IntelMap({ newsItems, onSelectItem, selectedItem }: IntelMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      className="h-full w-full"
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapController selectedItem={selectedItem} />
      
      {newsItems.map((item) => {
        const IconComponent = categoryIcons[item.category] || Shield;
        
        return (
          <Marker
            key={item.id}
            position={[item.lat, item.lon]}
            icon={createCustomIcon(item.category)}
            eventHandlers={{
              click: () => onSelectItem(item),
            }}
          >
            <Popup className="intel-popup" maxWidth={350}>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide"
                    style={{
                      backgroundColor: `${categoryColors[item.category]}20`,
                      color: categoryColors[item.category],
                    }}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                  </span>
                </div>
                
                <h3 className="font-semibold text-sm mb-2 leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {item.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {item.source}
                    </span>
                    <span className="text-xs font-mono" style={{ color: categoryColors[item.category] }}>
                      {Math.round(item.confidenceScore * 100)}% conf
                    </span>
                  </div>
                  
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
