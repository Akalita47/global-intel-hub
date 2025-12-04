import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NewsItem } from '@/types/news';
import { formatDistanceToNow } from 'date-fns';
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

const createCustomIcon = (category: string) => {
  const color = categoryColors[category] || '#14b8a6';
  return L.divIcon({
    className: 'custom-marker-container',
    html: `<div style="width:20px;height:20px;background:${color};border-radius:50%;border:2px solid rgba(255,255,255,0.9);box-shadow:0 0 10px ${color}80,0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
};

export function IntelMap({ newsItems, onSelectItem, selectedItem }: IntelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when newsItems change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    newsItems.forEach((item) => {
      const marker = L.marker([item.lat, item.lon], {
        icon: createCustomIcon(item.category),
      });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; max-width: 280px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              background: ${categoryColors[item.category]}30;
              color: ${categoryColors[item.category]};
            ">${item.category}</span>
            <span style="font-size: 11px; color: #666;">
              ${formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
            </span>
          </div>
          <h3 style="font-size: 13px; font-weight: 600; margin: 0 0 8px 0; line-height: 1.3; color: #111;">
            ${item.title}
          </h3>
          <p style="font-size: 11px; color: #555; margin: 0 0 10px 0; line-height: 1.4;">
            ${item.summary.slice(0, 120)}...
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; font-family: monospace; color: #777;">
              ${item.source} • ${Math.round(item.confidenceScore * 100)}% conf
            </span>
            <a href="${item.url}" target="_blank" rel="noopener" style="
              font-size: 11px;
              color: #0066cc;
              text-decoration: none;
            ">View Source →</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });
      marker.on('click', () => onSelectItem(item));
      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [newsItems, onSelectItem]);

  // Fly to selected item
  useEffect(() => {
    if (!mapRef.current || !selectedItem) return;
    mapRef.current.flyTo([selectedItem.lat, selectedItem.lon], 6, { duration: 1.5 });
  }, [selectedItem]);

  return (
    <div ref={mapContainerRef} className="h-full w-full" style={{ background: '#0a0f1a' }} />
  );
}
