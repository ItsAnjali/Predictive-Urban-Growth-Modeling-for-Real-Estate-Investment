import { useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet';
import type { Zone } from '../types';
import { colorForScore } from '../lib/format';
import { HeatLayer } from './HeatLayer';

interface Props {
  zones: Zone[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export const ZoneMap = ({ zones, selectedId, onSelect }: Props) => {
  const center: [number, number] = [12.9716, 77.5946];
  const [showHeat, setShowHeat] = useState(true);

  return (
    <div className="relative h-full w-full">
      <div className="absolute right-3 top-3 z-[500] flex gap-1 rounded-lg border border-slate-700 bg-slate-900/85 p-1 text-xs">
        <button
          onClick={() => setShowHeat(true)}
          className={`rounded px-2 py-1 ${showHeat ? 'bg-brand-600 text-white' : 'text-slate-300'}`}
        >Heatmap</button>
        <button
          onClick={() => setShowHeat(false)}
          className={`rounded px-2 py-1 ${!showHeat ? 'bg-brand-600 text-white' : 'text-slate-300'}`}
        >Markers</button>
      </div>
    <MapContainer center={center} zoom={11} className="h-full w-full rounded-xl" scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {showHeat && <HeatLayer zones={zones} />}
      {zones.map((z) => {
        const color = colorForScore(z.growthVelocityScore);
        const radius = 8 + (z.growthVelocityScore / 100) * 16;
        const isSelected = z.id === selectedId;
        return (
          <CircleMarker
            key={z.id}
            center={[z.latitude, z.longitude]}
            radius={radius}
            pathOptions={{
              color: isSelected ? '#fff' : color,
              weight: isSelected ? 3 : 1.5,
              fillColor: color,
              fillOpacity: 0.55,
            }}
            eventHandlers={{ click: () => onSelect(z.id) }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
              <span className="text-slate-900 font-medium">{z.name}</span>
              <span className="text-slate-500"> · {z.growthVelocityScore.toFixed(1)}</span>
            </Tooltip>
            <Popup>
              <div className="text-slate-900">
                <div className="font-semibold">{z.name}</div>
                <div className="text-xs text-slate-600">Score: {z.growthVelocityScore.toFixed(1)} · {z.opportunityLevel}</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
    </div>
  );
};
