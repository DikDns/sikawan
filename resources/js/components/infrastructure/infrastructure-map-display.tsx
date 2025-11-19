import { Badge } from '@/components/ui/badge'
import {
  Map,
  MapDrawControl,
  MapDrawDelete,
  MapDrawEdit,
  MapDrawMarker,
  MapDrawPolygon,
  MapDrawPolyline,
  MapTileLayer,
  useLeaflet,
} from '@/components/ui/map'
import type { LatLngExpression } from 'leaflet'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import type { InfrastructureItem } from './infrastructure-feature-list'
import { Building2, Hospital, GraduationCap, Zap, Droplet, Trash2 } from 'lucide-react'
import { renderToString } from 'react-dom/server'

export interface InfrastructureFeatureGeometry {
  id: number
  name: string
  geometry_type: 'Point' | 'LineString' | 'Polygon'
  geometry_json: string
  color?: string
}

export interface InfrastructureMapDisplayProps {
  type: 'Marker' | 'Polyline' | 'Polygon'
  features: InfrastructureFeatureGeometry[]
  defaultColor?: string
  className?: string
  center?: LatLngExpression
  zoom?: number
  onLayerCreated?: (geometry: unknown, layerNumber: number, geometryType: 'Point' | 'LineString' | 'Polygon') => void
  onLayerDeleted?: (id: number) => void
  onLayerEdited?: (id: number, geometry: unknown, geometryType: 'Point' | 'LineString' | 'Polygon') => void
  resolvedLayerIds?: Record<number, number>
}

export function InfrastructureMapDisplay({
  type,
  features,
  defaultColor = '#4C6EF5',
  className,
  center,
  zoom = 13,
  onLayerCreated,
  onLayerDeleted,
  onLayerEdited,
  resolvedLayerIds,
}: InfrastructureMapDisplayProps) {
  const { L } = useLeaflet()
  const page = usePage()
  const itemsFromProps = (page.props as any)?.items as InfrastructureItem[] | undefined
  const groupFromProps = (page.props as any)?.group as { legend_icon?: string | null; legend_color_hex?: string | null } | undefined
  const [numberOfShapes, setNumberOfShapes] = useState(0)
  const drawLayersRef = useRef<L.FeatureGroup | null>(null)
  const layerCounterRef = useRef(0)
  const featureLayersRef = useRef<Record<number, L.Layer>>({})
  const createdLayersRef = useRef<Record<number, L.Layer>>({})

  const parsedFeatures = useMemo(() => {
    return features
      .filter((f) => f.geometry_json)
      .map((f) => {
        try {
          const geometry = typeof f.geometry_json === 'string' ? JSON.parse(f.geometry_json) : f.geometry_json
          return { ...f, geometry }
        } catch {
          return null
        }
      })
      .filter((f) => f !== null) as Array<InfrastructureFeatureGeometry & { geometry: any }>
  }, [features])

  const allowedGeometryType: 'Point' | 'LineString' | 'Polygon' = type === 'Marker' ? 'Point' : type === 'Polyline' ? 'LineString' : 'Polygon'

  const markerIcon = useMemo(() => {
    if (!L) return undefined
    const color = groupFromProps?.legend_color_hex || defaultColor
    const name = (groupFromProps?.legend_icon || '').toLowerCase()
    let iconEl = <Building2 className="size-6" style={{ color }} />
    if (name === 'hospital') iconEl = <Hospital className="size-6" style={{ color }} />
    else if (name === 'graduation-cap') iconEl = <GraduationCap className="size-6" style={{ color }} />
    else if (name === 'zap') iconEl = <Zap className="size-6" style={{ color }} />
    else if (name === 'droplet') iconEl = <Droplet className="size-6" style={{ color }} />
    else if (name === 'building-2') iconEl = <Building2 className="size-6" style={{ color }} />
    else if (name === 'trash-2') iconEl = <Trash2 className="size-6" style={{ color }} />
    const wrapper = (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          backgroundColor: '#ffffff',
          borderRadius: 9999,
          border: '2px solid #0f172a',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      >
        {iconEl}
      </div>
    )
    const html = renderToString(wrapper)
    return L.divIcon({ className: '', iconAnchor: [14, 14], iconSize: [28, 28] as any, html })
  }, [L, groupFromProps, defaultColor])

  const initialShapes = useMemo(() => {
    const shapes: any[] = []
    parsedFeatures.forEach((f) => {
      const g: any = (f as any).geometry
      if (!g || !g.type || !Array.isArray(g.coordinates)) return
      if (allowedGeometryType === 'Point' && g.type === 'Point') {
        const [lng, lat] = g.coordinates
        shapes.push({ type: 'marker', position: [lat, lng] as [number, number], id: f.id, color: f.color || defaultColor })
      } else if (allowedGeometryType === 'LineString' && g.type === 'LineString') {
        const latlngs = g.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number])
        shapes.push({ type: 'polyline', positions: latlngs, id: f.id, color: f.color || defaultColor })
      } else if (allowedGeometryType === 'Polygon' && g.type === 'Polygon') {
        const positions = g.coordinates.map((ring: [number, number][]) => ring.map(([lng, lat]) => [lat, lng] as [number, number]))
        shapes.push({ type: 'polygon', positions, id: f.id, color: f.color || defaultColor })
      }
    })
    return shapes
  }, [parsedFeatures, allowedGeometryType, defaultColor])

  const mapCenter = useMemo(() => {
    if (center) return center
    try {
      const coords: [number, number][] = []
      parsedFeatures.forEach((f) => {
        const g: any = (f as any).geometry
        if (!g) return
        if (allowedGeometryType === 'Point' && g.type === 'Point' && Array.isArray(g.coordinates)) {
          const [lng, lat] = g.coordinates
          coords.push([lat, lng])
        } else if (allowedGeometryType === 'LineString' && g.type === 'LineString' && Array.isArray(g.coordinates)) {
          g.coordinates.forEach((c: [number, number]) => coords.push([c[1], c[0]]))
        } else if (allowedGeometryType === 'Polygon' && g.type === 'Polygon' && Array.isArray(g.coordinates)) {
          g.coordinates.forEach((ring: [number, number][]) => {
            ring.forEach(([lng, lat]) => coords.push([lat, lng]))
          })
        }
      })
      if (coords.length > 0) {
        const avgLat = coords.reduce((s, [lat]) => s + lat, 0) / coords.length
        const avgLng = coords.reduce((s, [, lng]) => s + lng, 0) / coords.length
        return [avgLat, avgLng] as LatLngExpression
      }
    } catch (e) { void 0 }
    return [-6.2, 106.816666] as LatLngExpression
  }, [center, parsedFeatures, allowedGeometryType])

  const POPUP_CLASSNAME = 'bg-popover text-popover-foreground animate-in fade-out-0 fade-in-0 zoom-out-95 zoom-in-95 slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 font-sans shadow-md outline-hidden'
  const TOOLTIP_CLASSNAME = 'animate-in fade-in-0 zoom-in-95 fade-out-0 zoom-out-95 relative z-50 w-fit text-xs text-balance transition-opacity'

  const attachInfoUI = useCallback((layer: any, label?: string) => {
    if (!L || !layer) return

    let tipe = 'Fitur'
    if (layer instanceof L.Marker) tipe = 'Titik'
    else if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) tipe = 'Garis'
    else if (layer instanceof L.Polygon) tipe = 'Poligon'

    const serverId = (layer as any).__initialId as number | undefined
    const itemDetail: InfrastructureItem | undefined = Array.isArray(itemsFromProps)
      ? itemsFromProps.find((i) => i.id === serverId)
      : undefined

    const esc = (v: any) => String(v ?? '-')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

    const displayName = esc(itemDetail?.name ?? label ?? 'PSU')

    try {
      layer.bindTooltip(displayName, {
        className: TOOLTIP_CLASSNAME,
        sticky: true,
        opacity: 1,
        direction: 'top',
        offset: L.point(0, 15),
      })
    } catch {}

    const popupContent = `
      <div class="space-y-4" aria-label="Informasi PSU">
        <div>
          <div class="text-xs text-muted-foreground">Nama</div>
          <div class="font-medium">${displayName}</div>
        </div>
        <div>
          <div class="text-xs text-muted-foreground">Deskripsi</div>
          <div class="text-sm whitespace-pre-line">${esc(itemDetail?.description)}</div>
        </div>
        <div class="text-xs text-muted-foreground">Tipe: ${esc(tipe)}</div>
      </div>
    `

    try {
      layer.bindPopup(popupContent, {
        className: POPUP_CLASSNAME,
        maxWidth: 360,
        closeButton: true,
        autoPan: true,
        autoPanPadding: L.point(10, 10),
      })
    } catch {}
  }, [L, itemsFromProps])

  const handleLayersChange = useCallback((layers: L.FeatureGroup, changeType: 'initialized' | 'created' | 'edited' | 'deleted', changedLayers?: L.LayerGroup) => {
    if (!L) return
    drawLayersRef.current = layers
    setNumberOfShapes(layers.getLayers().length)

    if (changeType === 'initialized') {
      const groupLayers = layers.getLayers()
      const CHUNK = 200
      let i = 0
      const processChunk = () => {
        const end = Math.min(i + CHUNK, groupLayers.length)
        for (; i < end; i++) {
          const layer = groupLayers[i] as L.Layer
          const id = (layer as any).__initialId as number | undefined
          if (typeof id === 'number' && id > 0) {
            featureLayersRef.current[id] = layer
            const feat = features.find((f) => f.id === id)
            const label = feat?.name ?? `PSU #${id}`
            attachInfoUI(layer, label)
            if (allowedGeometryType === 'Point' && markerIcon && layer instanceof L.Marker) {
              ;(layer as L.Marker).setIcon(markerIcon)
            }
          }
        }
        if (i < groupLayers.length) {
          if (typeof window !== 'undefined' && window.requestAnimationFrame) {
            window.requestAnimationFrame(processChunk)
          } else {
            setTimeout(processChunk, 0)
          }
        }
      }
      processChunk()
      return
    }

    if (changeType === 'created') {
      const sourceGroup: L.LayerGroup = (changedLayers || layers) as L.LayerGroup
      sourceGroup.eachLayer((layer: L.Layer) => {
        const isKnown = Object.values(featureLayersRef.current).some((existingLayer) => existingLayer === layer)
        if (isKnown) return

        let geometry: unknown = null
        const gtype: 'Point' | 'LineString' | 'Polygon' = allowedGeometryType

        if (layer instanceof L.Marker && allowedGeometryType === 'Point') {
          const ll = layer.getLatLng()
          geometry = { type: 'Point', coordinates: [ll.lng, ll.lat] }
        } else if (layer instanceof L.Polyline && !(layer instanceof L.Polygon) && allowedGeometryType === 'LineString') {
          const latlngs = (layer as L.Polyline).getLatLngs() as L.LatLng[]
          geometry = { type: 'LineString', coordinates: latlngs.map((ll) => [ll.lng, ll.lat]) }
        } else if (layer instanceof L.Polygon && allowedGeometryType === 'Polygon') {
          const latlngs = (layer as L.Polygon).getLatLngs() as L.LatLng[][]
          geometry = { type: 'Polygon', coordinates: latlngs.map((ring) => ring.map((ll) => [ll.lng, ll.lat])) }
        }

        if (geometry && onLayerCreated) {
          let tempId = (layer as any).__clientTempId as number | undefined
          if (!tempId) {
            layerCounterRef.current += 1
            tempId = layerCounterRef.current
            ;(layer as any).__clientTempId = tempId
            createdLayersRef.current[tempId] = layer
          }
          onLayerCreated(geometry, tempId!, gtype)
          attachInfoUI(layer, `PSU baru #${tempId}`)
          if (allowedGeometryType === 'Point' && markerIcon && layer instanceof L.Marker) {
            ;(layer as L.Marker).setIcon(markerIcon)
          }
        }
      })
      return
    }

    if (changeType === 'edited') {
      if (!changedLayers) return
      changedLayers.eachLayer((layer: L.Layer) => {
        const id = (layer as any).__initialId as number | null
        if (typeof id !== 'number' || id <= 0) return

        let geometry: unknown = null
        const gtype: 'Point' | 'LineString' | 'Polygon' = allowedGeometryType

        if (layer instanceof L.Marker && allowedGeometryType === 'Point') {
          const ll = (layer as any).getLatLng()
          geometry = { type: 'Point', coordinates: [ll.lng, ll.lat] }
        } else if (layer instanceof L.Polyline && !(layer instanceof L.Polygon) && allowedGeometryType === 'LineString') {
          const latlngs = (layer as any).getLatLngs() as L.LatLng[]
          geometry = { type: 'LineString', coordinates: latlngs.map((ll) => [ll.lng, ll.lat]) }
        } else if (layer instanceof L.Polygon && allowedGeometryType === 'Polygon') {
          const latlngs = (layer as any).getLatLngs() as L.LatLng[][]
          geometry = { type: 'Polygon', coordinates: latlngs.map((ring) => ring.map((ll) => [ll.lng, ll.lat])) }
        }

        if (geometry && onLayerEdited) {
          onLayerEdited(id!, geometry, gtype)
        }
      })
      return
    }

    if (changeType === 'deleted') {
      const removedIds: number[] = []
      if (changedLayers) {
        changedLayers.eachLayer((layer: L.Layer) => {
          const id = (layer as any).__initialId as number | null
          if (typeof id === 'number' && id > 0) removedIds.push(id)
        })
      }
      removedIds.forEach((id) => {
        delete featureLayersRef.current[id]
        onLayerDeleted?.(id)
      })
      return
    }
  }, [L, parsedFeatures, allowedGeometryType, onLayerCreated, onLayerDeleted, onLayerEdited, defaultColor])

  useEffect(() => {
    if (!L || !resolvedLayerIds) return
    Object.entries(resolvedLayerIds).forEach(([tempIdStr, serverId]) => {
      const tempId = Number(tempIdStr)
      const layer = createdLayersRef.current[tempId]
      if (!layer) return
      if (typeof serverId !== 'number' || serverId <= 0) return
      ;(layer as any).__initialId = serverId
      featureLayersRef.current[serverId] = layer
      delete createdLayersRef.current[tempId]
      const feat = features.find((f) => f.id === serverId)
      const label = feat?.name ?? `PSU #${serverId}`
      attachInfoUI(layer, label)
    })
  }, [resolvedLayerIds, L, features, attachInfoUI])

  if (!L) return null

  return (
    <div className={className}>
      <Map center={mapCenter} zoom={zoom} className="h-full w-full">
        <MapTileLayer />
        <MapDrawControl onLayersChange={handleLayersChange} initialShapes={initialShapes}>
          {type === 'Marker' && <MapDrawMarker icon={markerIcon} />}
          {type === 'Polyline' && <MapDrawPolyline />}
          {type === 'Polygon' && <MapDrawPolygon />}
          <MapDrawEdit />
          <MapDrawDelete />
        </MapDrawControl>
        <Badge className="absolute right-1 bottom-1 z-[1000]">Fitur: {numberOfShapes}</Badge>
      </Map>
    </div>
  )
}