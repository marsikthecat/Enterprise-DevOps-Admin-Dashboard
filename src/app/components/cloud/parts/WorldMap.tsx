import { 
  ZoomIn,
  ZoomOut,
  Globe,
  RotateCcw, } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { StorageRegion } from "../Cloud";

const GEO_URL = import.meta.env.VITE_GEO_URL;

function getCityForRegion(region: StorageRegion) {
    let lookUp: Record<string, string> = {
        "US-EAST": "Ashburn, VA",
        "US-WEST": "San Jose, CA",
        "EU-CENTRAL": "Frankfurt, DE",
        "ASIA-PACIFIC": "Singapore",
    }
    return lookUp[region.region]; 
}

export function WorldMap(storageRegions: StorageRegion[]) {
  const [zoom, setZoom] = useState(2.2);
  const [center, setCenter] = useState<[number, number]>([10, 20]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const hoveredData = storageRegions.find((r) => r.region === hovered);


  const handleMarkerEnter = useCallback(
    (region: string, e: React.MouseEvent) => {
      setHovered(region);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCardPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    },
    []
  );

  const handleMarkerMove = useCallback(
    (e: React.MouseEvent) => {
      if (!hovered) return;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCardPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    },
    [hovered]
  );

  const containerW = containerRef.current?.clientWidth ?? 900;
  const CARD_W = 224;
  const CARD_H = 136;
  const CONTAINER_H = 420;
  let cardLeft = cardPos.x + 18;
  let cardTop = cardPos.y - 18;
  if (cardLeft + CARD_W > containerW - 8) cardLeft = cardPos.x - CARD_W - 12;
  if (cardTop + CARD_H > CONTAINER_H - 8) cardTop = cardPos.y - CARD_H - 12;
  if (cardTop < 8) cardTop = 8;

  return (
    <div
      ref={containerRef}
      className="relative rounded-lg overflow-hidden bg-[#060A10]"
      style={{ height: CONTAINER_H }}
      onMouseMove={handleMarkerMove}
    >
      {/* Map */}
      <ComposableMap
        projectionConfig={{ scale: 145, center }}
        style={{ width: "100%", height: "100%", background: "#060A10" }}
      >
        {/* Ocean fill */}
        <rect width="100%" height="100%" fill="#060A10" />

        <ZoomableGroup
          zoom={zoom}
          center={center}
          minZoom={2}
          maxZoom={10}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "#162032",
                      stroke: "#38BDF8",
                      strokeWidth: 0.3,
                      strokeOpacity: 0.35,
                      outline: "none",
                    },
                    hover: {
                      fill: "#1e2e42",
                      stroke: "#38BDF8",
                      strokeWidth: 0.4,
                      strokeOpacity: 0.5,
                      outline: "none",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {storageRegions.map((region) => {
            const isHov = hovered === region.region;
            const pct = region.usedMemory / region.totalMemory;
            const r = 5 / zoom;
            const pulseR = 11 / zoom;
            const arcR = 8 / zoom;
            const sw = 1.5 / zoom;
            const circumference = 2 * Math.PI * arcR;

            return (
              <Marker key={region.region} coordinates={[region.lng, region.lat]}>
                <g
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => handleMarkerEnter(region.region, e)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Outer glow ring */}
                  <circle
                    r={pulseR}
                    fill="#38BDF8"
                    opacity={isHov ? 0.15 : 0.07}
                    style={{ transition: "opacity 0.2s" }}
                  />
                  {/* Usage arc */}
                  <circle
                    r={arcR}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={sw}
                    strokeDasharray={`${pct * circumference} ${(1 - pct) * circumference}`}
                    strokeDashoffset={circumference * 0.25}
                    opacity={isHov ? 1 : 0.75}
                    style={{ transition: "opacity 0.2s" }}
                  />
                  {/* Border ring */}
                  <circle
                    r={arcR}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth={sw * 0.6}
                    opacity={isHov ? 0.5 : 0.3}
                    style={{ transition: "opacity 0.2s" }}
                  />
                  {/* Center dot */}
                  <circle
                    r={r}
                    fill="#38BDF8"
                    opacity={isHov ? 1 : 0.9}
                    style={{ transition: "r 0.15s, opacity 0.2s" }}
                  />
                  {/* Inner dot dark */}
                  <circle r={r * 0.45} fill="#060A10" opacity={0.8} />
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Hover card overlay */}
      {hoveredData && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{ left: cardLeft, top: cardTop }}
        >
          <RegionHoverCard region={hoveredData} />
        </div>
      )}
    </div>
  );
}

function RegionHoverCard({ region }: { region: StorageRegion }) {
  const pct = region.usedMemory / region.totalMemory;
  return (
    <div className="glass-panel rounded-lg p-4 border border-[#38BDF8]/40 backdrop-blur-md w-56"
      style={{
        boxShadow: "0 0 0 1px rgba(56,189,248,0.15), 0 8px 32px rgba(0,0,0,0.8), 0 0 24px rgba(56,189,248,0.12)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-[#38BDF8] shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-white leading-none">{region.region}</h4>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{getCityForRegion(region)}</p>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="mono text-2xl font-semibold text-white">{region.usedMemory}</span>
          <span className="text-sm text-[#9CA3AF]">/ {region.totalMemory} TB</span>
        </div>
        <div className="bg-[#1f2937] rounded-full h-2 overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] rounded-full"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
      </div>
      <div className="text-xs text-[#9CA3AF]">{region.files.toLocaleString()} files stored</div>
    </div>
  );
}