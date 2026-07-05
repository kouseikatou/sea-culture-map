import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { countries, type Country } from '../data/countries'

// アジアに“切り抜く”境界。ここから離れられないようにする
const ASIA_BOUNDS = L.latLngBounds([-12, 44], [56, 147])
const INITIAL_CENTER: [number, number] = [26, 92]
const INITIAL_ZOOM = 3
// このズーム以上で世界遺産ピンを表示
const HERITAGE_ZOOM = 6
// 世界遺産を選んだときに寄るズーム
const HERITAGE_FOCUS_ZOOM = 8
// 国を選んだときに寄るズーム
const COUNTRY_FOCUS_ZOOM = 6

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

function countryIcon(country: Country, active: boolean, dimmed: boolean) {
  const cls = `marker-country${active ? ' is-active' : ''}${dimmed ? ' is-dimmed' : ''}`
  return L.divIcon({
    className: cls,
    html: `<div class="marker-country__pin" data-level="${country.budgetLevel}"></div><div class="marker-country__label">${country.name}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
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
    moveTo(map, selected.coords, Math.max(map.getZoom(), COUNTRY_FOCUS_ZOOM))
    // activeHeritage は依存に入れない（遺産選択時は上の効果に任せる）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, map])

  return null
}

type Props = {
  selected: Country | null
  activeHeritage: string | null
  maxBudget: number | null // これ以下の予算レベルだけ強調（null=全部）
  onSelectCountry: (id: string) => void
  onSelectHeritage: (countryId: string, name: string) => void
}

export function SeaMap({
  selected,
  activeHeritage,
  maxBudget,
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
      minZoom={3}
      maxZoom={9}
      maxBounds={ASIA_BOUNDS}
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

      {countries.map((c) => {
        const dimmed = maxBudget != null && c.budgetLevel > maxBudget
        return (
          <Marker
            key={c.id}
            position={c.coords}
            icon={countryIcon(c, selected?.id === c.id, dimmed)}
            eventHandlers={{ click: () => onSelectCountry(c.id) }}
            zIndexOffset={dimmed ? 100 : 1000}
            opacity={dimmed ? 0.45 : 1}
          />
        )
      })}

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
