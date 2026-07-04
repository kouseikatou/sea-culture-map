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

function countryIcon(country: Country, active: boolean) {
  return L.divIcon({
    className: `marker-country${active ? ' is-active' : ''}`,
    html: `<div class="marker-country__pin"></div><div class="marker-country__label">${country.name}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })
}

function heritageIcon(kind: string) {
  return L.divIcon({
    className: '',
    html: `<div class="marker-heritage" data-kind="${kind}"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

/** ズーム変化を親に伝える */
function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  useMapEvent('zoomend', (e) => onZoom(e.target.getZoom()))
  return null
}

/** 選択された国へ寄る */
function FlyToSelected({ selected }: { selected: Country | null }) {
  const map = useMap()
  useEffect(() => {
    if (!selected) return
    map.flyTo(selected.coords, Math.max(map.getZoom(), HERITAGE_ZOOM), {
      duration: 0.8,
    })
  }, [selected, map])
  return null
}

type Props = {
  selected: Country | null
  onSelectCountry: (id: string) => void
}

export function SeaMap({ selected, onSelectCountry }: Props) {
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
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <ZoomWatcher onZoom={setZoom} />
      <FlyToSelected selected={selected} />

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
        heritageMarkers.map(({ country, site }) => (
          <Marker
            key={`${country.id}-${site.name}`}
            position={site.coords}
            icon={heritageIcon(site.kind)}
            eventHandlers={{ click: () => onSelectCountry(country.id) }}
          />
        ))}
    </MapContainer>
  )
}
