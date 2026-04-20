import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import type { Zone } from '../types';

export const HeatLayer = ({ zones, intensityKey = 'growthVelocityScore' }: { zones: Zone[]; intensityKey?: keyof Zone }) => {
  const map = useMap();

  useEffect(() => {
    const points: [number, number, number][] = zones.map((z) => {
      const raw = Number((z as any)[intensityKey]) || 0;
      const intensity = intensityKey === 'growthVelocityScore' ? raw / 100 : raw;
      return [z.latitude, z.longitude, Math.max(0.05, Math.min(1, intensity))];
    });

    let layer: any = null;
    let cancelled = false;
    let observer: ResizeObserver | null = null;

    const attach = () => {
      if (cancelled || layer) return;
      const container = map.getContainer();
      if (container.clientWidth === 0 || container.clientHeight === 0) return;
      map.invalidateSize();
      const size = map.getSize();
      if (size.x === 0 || size.y === 0) return;
      try {
        layer = (L as any).heatLayer(points, {
          radius: 45,
          blur: 35,
          maxZoom: 14,
          gradient: { 0.2: '#1e3a8a', 0.4: '#0ea5e9', 0.6: '#f59e0b', 0.8: '#ef4444', 1.0: '#10b981' },
        }).addTo(map);
      } catch {
        // try again on next resize tick
      }
    };

    observer = new ResizeObserver(() => attach());
    observer.observe(map.getContainer());
    // also try once immediately in case it's already sized
    attach();

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (layer) map.removeLayer(layer);
    };
  }, [map, zones, intensityKey]);

  return null;
};
