import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Bus } from '@/types';
import { Maximize2, Target, Navigation, Phone, MessageSquare, Shield, Clock, MapPin, User, Gauge, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Rapido-style Bus/Vehicle Icon - Sleek and Modern
const createVehicleIcon = (status: string = 'on-route', heading = 0) => {
    const isDelayed = status === 'delayed';
    const isSOS = status === 'sos';
    const isDrunk = status === 'drunk';

    const primaryColor = isSOS ? '#EF4444' : isDrunk ? '#7E22CE' : isDelayed ? '#F59E0B' : '#10B981';
    const pulseColor = isSOS ? 'rgba(239, 68, 68, 0.4)' : isDrunk ? 'rgba(126, 34, 206, 0.4)' : isDelayed ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)';

    return L.divIcon({
        html: `
      <div class="rapido-vehicle-marker" style="transform: rotate(${heading}deg);">
        <div class="vehicle-pulse" style="background: ${pulseColor};"></div>
        <div class="vehicle-body" style="background: ${primaryColor};">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
          </svg>
        </div>
      </div>
    `,
        className: 'rapido-vehicle-icon',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
    });
};

// Origin Marker (Green dot like Rapido)
const OriginIcon = L.divIcon({
    html: `
    <div class="rapido-origin-marker">
      <div class="origin-pulse"></div>
      <div class="origin-dot"></div>
    </div>
  `,
    className: 'rapido-origin-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

// Destination Marker (Red pin like Rapido)
const DestinationIcon = L.divIcon({
    html: `
    <div class="rapido-destination-marker">
      <div class="destination-pin">
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="#EF4444"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      </div>
    </div>
  `,
    className: 'rapido-destination-icon',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
});

// Stop Marker - Minimal dot style
const createStopIcon = (status: 'passed' | 'next' | 'upcoming') => L.divIcon({
    html: `
    <div class="rapido-stop-marker ${status}">
      <div class="stop-dot"></div>
      ${status === 'next' ? '<div class="stop-pulse"></div>' : ''}
    </div>
  `,
    className: 'rapido-stop-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

interface Stop {
    name: string;
    lat: number;
    lng: number;
    status: 'passed' | 'next' | 'upcoming';
    eta?: string;
}

interface MapProps {
    buses: Bus[];
    stops?: Stop[];
    center?: { lat: number; lng: number };
    zoom?: number;
    onBusClick?: (busId: string) => void;
    autoCenter?: boolean;
    highlightLocation?: {
        name: string;
        lat: number;
        lng: number;
        zoom?: number;
        type: 'state' | 'district';
    } | null;
    noData?: boolean;
    showDriverCard?: boolean;
}

const defaultCenter: [number, number] = [18.4386, 79.1288];

// Rapido-style CSS
const rapidoStyles = `
  /* Vehicle Marker Animations */
  .rapido-vehicle-marker {
    position: relative;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .vehicle-pulse {
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    animation: vehiclePulse 2s ease-out infinite;
  }
  
  .vehicle-body {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.9);
    margin: 4px;
  }
  
  @keyframes vehiclePulse {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(2); opacity: 0; }
  }
  
  /* Origin Marker */
  .rapido-origin-marker {
    position: relative;
  }
  
  .origin-dot {
    width: 14px;
    height: 14px;
    background: linear-gradient(135deg, #10B981, #059669);
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.5);
    margin: 5px;
  }
  
  .origin-pulse {
    position: absolute;
    width: 24px;
    height: 24px;
    background: rgba(16, 185, 129, 0.3);
    border-radius: 50%;
    animation: originPulse 1.5s ease-out infinite;
  }
  
  @keyframes originPulse {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2); opacity: 0; }
  }
  
  /* Destination Marker */
  .rapido-destination-marker {
    filter: drop-shadow(0 4px 8px rgba(239, 68, 68, 0.4));
    animation: destinationBounce 2s ease-in-out infinite;
  }
  
  @keyframes destinationBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  
  /* Stop Markers */
  .rapido-stop-marker {
    position: relative;
  }
  
  .rapido-stop-marker .stop-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    margin: 3px;
  }
  
  .rapido-stop-marker.passed .stop-dot {
    background: #9CA3AF;
  }
  
  .rapido-stop-marker.next .stop-dot {
    background: #F59E0B;
  }
  
  .rapido-stop-marker.upcoming .stop-dot {
    background: #E5E7EB;
  }
  
  .rapido-stop-marker .stop-pulse {
    position: absolute;
    width: 16px;
    height: 16px;
    background: rgba(245, 158, 11, 0.4);
    border-radius: 50%;
    animation: stopPulse 1.5s ease-out infinite;
  }
  
  @keyframes stopPulse {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  
  /* Custom Popup Styling */
  .leaflet-popup-content-wrapper {
    border-radius: 16px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
    border: none !important;
  }
  
  .leaflet-popup-tip {
    display: none;
  }
  
  /* Map Container Styling */
  .rapido-map-container .leaflet-container {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  .rapido-map-container .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
    border-radius: 12px !important;
    overflow: hidden;
  }
  
  .rapido-map-container .leaflet-control-zoom a {
    background: rgba(255, 255, 255, 0.95) !important;
    color: #1F2937 !important;
    border: none !important;
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 18px !important;
  }
  
  .rapido-map-container .leaflet-control-zoom a:hover {
    background: #F3F4F6 !important;
  }

  /* Route Flow Animation */
  .animating-route-line {
    stroke-dasharray: 12 12;
    animation: routeFlow 1s linear infinite;
    filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.5));
  }
  
  @keyframes routeFlow {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }
`;

// Component to handle map center updates
const MapController = ({
    center,
    isLocked,
    highlightLocation
}: {
    center?: { lat: number; lng: number },
    isLocked: boolean,
    highlightLocation?: MapProps['highlightLocation']
}) => {
    const map = useMap();

    useEffect(() => {
        if (highlightLocation) {
            map.flyTo([highlightLocation.lat, highlightLocation.lng], highlightLocation.zoom || map.getZoom(), {
                animate: true,
                duration: 1.5
            });
        } else if (center && isLocked) {
            map.flyTo([center.lat, center.lng], map.getZoom(), {
                animate: true,
                duration: 1.5
            });
        }
    }, [center, isLocked, highlightLocation, map]);

    return null;
};

const LiveMap = ({
    buses,
    stops = [],
    center,
    zoom = 15,
    onBusClick,
    autoCenter = true,
    highlightLocation,
    noData = false,
    showDriverCard = true
}: MapProps) => {
    const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(autoCenter);
    const mapRef = useRef<L.Map | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const mapCenter = useMemo(() =>
        center ? [center.lat, center.lng] as [number, number] : defaultCenter
        , [center]);

    const polylinePositions = useMemo(() =>
        stops.map(stop => [stop.lat, stop.lng] as [number, number])
        , [stops]);

    const activeBus = useMemo(() =>
        buses.find(b => b.id === selectedBusId) || buses[0]
        , [buses, selectedBusId]);

    const toggleFullscreen = () => {
        const mapContainer = document.getElementById('rapido-map-wrapper');
        if (!document.fullscreenElement) {
            mapContainer?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    // Calculate ETA based on speed and distance (mock)
    const calculateETA = (bus: Bus) => {
        if (!bus.speed || bus.speed === 0) return '--';
        const estimatedMinutes = Math.floor(Math.random() * 15) + 5; // Mock ETA
        return `${estimatedMinutes} min`;
    };

    return (
        <div id="rapido-map-wrapper" className="rapido-map-container relative w-full h-full bg-slate-50 overflow-hidden rounded-2xl">
            <style>{rapidoStyles}</style>

            <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ width: '100%', height: '100%' }}
                className="z-0"
                zoomControl={false}
                ref={mapRef}
            >
                {/* Premium Light Map Tiles - Clean & Modern */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <MapController
                    center={center}
                    isLocked={isLocked}
                    highlightLocation={highlightLocation}
                />
                <ZoomControl position="bottomright" />

                {/* Route Polyline - Rapido Style Tracking */}
                {polylinePositions.length > 1 && (
                    <>
                        {/* 1. Subtle Shadow for depth */}
                        <Polyline
                            positions={polylinePositions}
                            pathOptions={{
                                color: '#000000',
                                weight: 10,
                                opacity: 0.15,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                        {/* 2. White Border for Contrast (Clean look on light map) */}
                        <Polyline
                            positions={polylinePositions}
                            pathOptions={{
                                color: '#FFFFFF',
                                weight: 8,
                                opacity: 1,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                        {/* 3. Main Solid Base */}
                        <Polyline
                            positions={polylinePositions}
                            pathOptions={{
                                color: '#2563EB', // Blue-600
                                weight: 6,
                                opacity: 1,
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                        {/* 4. Animated Flow Overlay */}
                        <Polyline
                            positions={polylinePositions}
                            pathOptions={{
                                color: '#93C5FD', // Blue-300
                                weight: 4,
                                opacity: 1,
                                className: 'animating-route-line',
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                    </>
                )}

                {/* Stop Markers */}
                {stops.map((stop, idx) => (
                    <Marker
                        key={`stop-${idx}`}
                        position={[stop.lat, stop.lng]}
                        icon={createStopIcon(stop.status)}
                    >
                        <Popup className="rapido-popup">
                            <div className="p-3 min-w-[180px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={cn(
                                        "w-3 h-3 rounded-full",
                                        stop.status === 'passed' ? 'bg-gray-400' :
                                            stop.status === 'next' ? 'bg-amber-500' : 'bg-gray-200'
                                    )} />
                                    <span className="font-semibold text-slate-800">{stop.name}</span>
                                </div>
                                {stop.eta && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Clock className="w-3 h-3" />
                                        <span>ETA: {stop.eta}</span>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* First stop as Origin */}
                {stops.length > 0 && (
                    <Marker
                        position={[stops[0].lat, stops[0].lng]}
                        icon={OriginIcon}
                    />
                )}

                {/* Last stop as Destination */}
                {stops.length > 1 && (
                    <Marker
                        position={[stops[stops.length - 1].lat, stops[stops.length - 1].lng]}
                        icon={DestinationIcon}
                    />
                )}

                {/* Bus Markers */}
                {buses.map((bus) => (
                    bus.location && (
                        <React.Fragment key={bus.id}>
                            <Marker
                                position={[bus.location.lat, bus.location.lng]}
                                icon={createVehicleIcon(
                                    bus.isSOS ? 'sos' : bus.isDrunkDriving ? 'drunk' : bus.status,
                                    (bus.speed || 0) * 4
                                )}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedBusId(bus.id);
                                        if (onBusClick) onBusClick(bus.id);
                                    }
                                }}
                            >
                                <Popup>
                                    <div className="p-4 min-w-[260px]">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-800">{bus.busNumber}</h3>
                                                <p className="text-sm text-slate-500">{bus.route}</p>
                                            </div>
                                            <div className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-bold uppercase",
                                                bus.status === 'on-route' ? 'bg-emerald-100 text-emerald-700' :
                                                    bus.status === 'delayed' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-700'
                                            )}>
                                                {bus.status}
                                            </div>
                                        </div>

                                        {/* Driver Info */}
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-800">{bus.driver}</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Shield className="w-3 h-3 text-emerald-500" />
                                                    <span>Verified Driver</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="text-center p-2 bg-blue-50 rounded-lg">
                                                <Gauge className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                                                <p className="text-xs text-slate-500">Speed</p>
                                                <p className="font-bold text-slate-800">{bus.speed} km/h</p>
                                            </div>
                                            <div className="text-center p-2 bg-purple-50 rounded-lg">
                                                <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                                                <p className="text-xs text-slate-500">Capacity</p>
                                                <p className="font-bold text-slate-800">{bus.passengers}/{bus.capacity}</p>
                                            </div>
                                            <div className="text-center p-2 bg-amber-50 rounded-lg">
                                                <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                                                <p className="text-xs text-slate-500">ETA</p>
                                                <p className="font-bold text-slate-800">{calculateETA(bus)}</p>
                                            </div>
                                        </div>

                                        {/* Alerts */}
                                        {/* Alerts */}
                                        {(bus.isHarshDriving || bus.isSOS || bus.isDrunkDriving) && (
                                            <div className={cn(
                                                "mt-3 p-2 rounded-lg flex items-center gap-2",
                                                bus.isSOS ? 'bg-red-100 border border-red-200' :
                                                    bus.isDrunkDriving ? 'bg-purple-100 border border-purple-200' :
                                                        'bg-amber-100 border border-amber-200'
                                            )}>
                                                <AlertTriangle className={cn("w-4 h-4",
                                                    bus.isSOS ? 'text-red-600' :
                                                        bus.isDrunkDriving ? 'text-purple-600' :
                                                            'text-amber-600'
                                                )} />
                                                <span className={cn("text-xs font-semibold",
                                                    bus.isSOS ? 'text-red-700' :
                                                        bus.isDrunkDriving ? 'text-purple-700' :
                                                            'text-amber-700'
                                                )}>
                                                    {bus.isSOS ? 'SOS Alert Active!' :
                                                        bus.isDrunkDriving ? 'Drunk Driving Detected!' :
                                                            'Harsh Driving Detected'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    )
                ))}
            </MapContainer>

            {/* Top Controls - Rapido Style */}
            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    className={cn(
                        "p-3 rounded-xl shadow-lg transition-all duration-300",
                        isLocked
                            ? "bg-blue-600 text-white shadow-blue-500/30"
                            : "bg-white/95 backdrop-blur text-slate-700 hover:bg-white"
                    )}
                    title={isLocked ? "Unlock Map" : "Lock to Vehicle"}
                >
                    <Target className={cn("w-5 h-5", isLocked && "animate-pulse")} />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="p-3 bg-white/95 backdrop-blur rounded-xl shadow-lg text-slate-700 hover:bg-white transition-all duration-300"
                    title="Fullscreen"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>
            </div>

            {/* Time Display - Top Right */}
            <div className="absolute top-4 right-4 z-[1000]">
                <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-slate-700">LIVE</span>
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-sm text-slate-600">{formatTime(currentTime)}</span>
                </div>
            </div>

            {/* Bottom Driver Card - Rapido Style */}
            {showDriverCard && activeBus && (
                <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4">
                    <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-md mx-auto">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Navigation className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{activeBus.busNumber}</h3>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                                activeBus.status === 'on-route' ? 'bg-emerald-500' :
                                                    activeBus.status === 'delayed' ? 'bg-amber-500' : 'bg-slate-500'
                                            )}>
                                                {activeBus.status}
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-sm">{activeBus.route}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-emerald-400">{calculateETA(activeBus)}</p>
                                    <p className="text-xs text-slate-400">ETA</p>
                                </div>
                            </div>
                        </div>

                        {/* Driver Details */}
                        <div className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center ring-2 ring-blue-100">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{activeBus.driver}</p>
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-3 h-3 text-emerald-500" />
                                            <span className="text-xs text-slate-500">Verified • 4.8 ★</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                                        <Phone className="w-5 h-5 text-emerald-600" />
                                    </button>
                                    <button className="p-2.5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                                        <MessageSquare className="w-5 h-5 text-blue-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Live Stats */}
                            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <Gauge className="w-4 h-4 text-blue-500" />
                                        <span className="text-lg font-bold text-slate-800">{activeBus.speed}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">km/h</p>
                                </div>
                                <div className="text-center border-x border-slate-100">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <Users className="w-4 h-4 text-purple-500" />
                                        <span className="text-lg font-bold text-slate-800">{activeBus.passengers}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">of {activeBus.capacity}</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <MapPin className="w-4 h-4 text-amber-500" />
                                        <span className="text-sm font-bold text-slate-800 truncate">{activeBus.mandal || 'N/A'}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">Area</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* No Data Overlay */}
            {noData && (
                <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Buses Available</h3>
                        <p className="text-slate-500">There are no active buses in this area right now. Please check back later.</p>
                    </div>
                </div>
            )}

            {/* SOS / Critical Alert Banner */}
            {(activeBus?.isSOS || activeBus?.isDrunkDriving) && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1002] animate-pulse">
                    <div className={cn(
                        "px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-white",
                        activeBus.isSOS ? 'bg-red-600' : 'bg-purple-600'
                    )}>
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-bold">
                            {activeBus.isSOS ? 'SOS ALERT ACTIVE' : 'DRUNK DRIVER DETECTED'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(LiveMap);
