import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { countries, type Country } from '../data/countries'

// 東南アジアに“切り抜く”境界。ここから離れられないようにする
const SEA_BOUNDS = L.latLngBounds([-11, 92], [29, 141])
const INITIAL_CENTER: [number, number] = [8, 114]
const INITIAL_ZOOM = 5
// このズーム以上で世界遺産ピンを表示
const HERITAGE_ZOOM = 6
// 世界遺産を選んだときに寄るズーム
const HERITAGE_FOCUS_ZOOM = 8

// 「動きを減らす」設定のとき、Leaflet の CSS ズームアニメーションは
// transitionend に依存して固まることがあるため、アニメーションを切り、
// 移動は瞬時に行う（アクセシビリティ対応）。
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function moveTo(map: L.Map, coords: [number, number], zoom: number) {
  if (prefersReducedMotion) {
    map.setView(coords, zoom, { animate: false })
  } else {
    map.flyTo(coords, zoom, { duration: 0.85 })
  }
}

function countryIcon(country: Country, active: boolean) {
  return L.divIcon({
    className: `marker-country${active ? ' is-active' : ''}`,
    html: `<div class="marker-country__pin"></div><div class="marker-country__label">${country.name}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })
}

function heritageIcon(kind: string, active: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="marker-heritage${active ? ' is-active' : ''}" data-kind="${kind}"></div>`,
    iconSize: active ? [22, 22] : [14, 14],
    iconAnchor: active ? [11, 11] : [7, 7],
  })
}

/** ズーム変化を親に伝える */
function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  useMapEvent('zoomend', (e) => onZoom(e.target.getZoom()))
  return null
}

/** 選択された国・世界遺産へ寄る */
function FlyTo({
  selected,
  activeHeritage,
}: {
  selected: Country | null
  activeHeritage: string | null
}) {
  const map = useMap()

  // 世界遺産が選ばれたら、その場所へ
  useEffect(() => {
    if (!selected || !activeHeritage) return
    const site = selected.heritageSites.find((h) => h.name === activeHeritage)
    if (site) moveTo(map, site.coords, HERITAGE_FOCUS_ZOOM)
  }, [selected, activeHeritage, map])

  // 国が選ばれたら（遺産未選択のとき）その国へ
  useEffect(() => {
    if (!selected || activeHeritage) return
    moveTo(map, selected.coords, Math.max(map.getZoom(), HERITAGE_ZOOM))
    // activeHeritage は依存に入れない（遺産選択時は上の効果に任せる）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, map])

  return null
}

type Props = {
  selected: Country | null
  activeHeritage: string | null
  onSelectCountry: (id: string) => void
  onSelectHeritage: (countryId: string, name: string) => void
}

export function SeaMap({
  selected,
  activeHeritage,
  onSelectCountry,
  onSelectHeritage,
}: Props) {
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

  const showHeritage = zoom >= HERITAGE_ZOOM
  const heritageMarkers = useMemo(
    () =>
      countries.flatMap((c) =>
        c.heritageSites.map((h) => ({ country: c, site: h })),
      ),
    [],
  )

  return (
    <MapContainer
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      minZoom={4}
      maxZoom={9}
      maxBounds={SEA_BOUNDS}
      maxBoundsViscosity={1}
      zoomControl
      zoomAnimation={!prefersReducedMotion}
      markerZoomAnimation={!prefersReducedMotion}
      fadeAnimation={!prefersReducedMotion}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <ZoomWatcher onZoom={setZoom} />
      <FlyTo selected={selected} activeHeritage={activeHeritage} />

      {countries.map((c) => (
        <Marker
          key={c.id}
          position={c.coords}
          icon={countryIcon(c, selected?.id === c.id)}
          eventHandlers={{ click: () => onSelectCountry(c.id) }}
          zIndexOffset={1000}
        />
      ))}

      {showHeritage &&
        heritageMarkers.map(({ country, site }) => {
          const isActive =
            selected?.id === country.id && activeHeritage === site.name
          return (
            <Marker
              key={`${country.id}-${site.name}`}
              position={site.coords}
              icon={heritageIcon(site.kind, isActive)}
              eventHandlers={{
                click: () => onSelectHeritage(country.id, site.name),
              }}
              zIndexOffset={isActive ? 2000 : 0}
            />
          )
        })}
    </MapContainer>
  )
}
