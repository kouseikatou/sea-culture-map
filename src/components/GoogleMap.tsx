import { useEffect, useMemo, useState } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  type MapCameraChangedEvent,
} from '@vis.gl/react-google-maps'
import { countries, type Country } from '../data/countries'
import { googleMapsKey, googleMapsMapId } from '../config'

const BOUNDS = { north: 56, south: -12, east: 147, west: 24 }
const INITIAL_CENTER = { lat: 29, lng: 84 }
const INITIAL_ZOOM = 3
const HERITAGE_ZOOM = 6
const HERITAGE_FOCUS_ZOOM = 8
const COUNTRY_FOCUS_ZOOM = 6

/** 選択された国・世界遺産へ寄る */
function FlyController({
  selected,
  activeHeritage,
}: {
  selected: Country | null
  activeHeritage: string | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!map || !selected || !activeHeritage) return
    const site = selected.heritageSites.find((h) => h.name === activeHeritage)
    if (site) {
      map.panTo({ lat: site.coords[0], lng: site.coords[1] })
      map.setZoom(HERITAGE_FOCUS_ZOOM)
    }
  }, [map, selected, activeHeritage])

  useEffect(() => {
    if (!map || !selected || activeHeritage) return
    map.panTo({ lat: selected.coords[0], lng: selected.coords[1] })
    if ((map.getZoom() ?? 0) < COUNTRY_FOCUS_ZOOM) map.setZoom(COUNTRY_FOCUS_ZOOM)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selected])

  return null
}

type Props = {
  selected: Country | null
  activeHeritage: string | null
  maxBudget: number | null
  onSelectCountry: (id: string) => void
  onSelectHeritage: (countryId: string, name: string) => void
}

export function GoogleMap({
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
    <APIProvider apiKey={googleMapsKey ?? ''}>
      <Map
        defaultCenter={INITIAL_CENTER}
        defaultZoom={INITIAL_ZOOM}
        mapId={googleMapsMapId}
        minZoom={3}
        maxZoom={9}
        gestureHandling="greedy"
        zoomControl
        mapTypeControl={false}
        streetViewControl
        fullscreenControl={false}
        restriction={{ latLngBounds: BOUNDS, strictBounds: false }}
        onCameraChanged={(e: MapCameraChangedEvent) =>
          setZoom(Math.round(e.detail.zoom))
        }
        style={{ width: '100%', height: '100%' }}
      >
        <FlyController selected={selected} activeHeritage={activeHeritage} />

        {countries.map((c) => {
          const dimmed = maxBudget != null && c.budgetLevel > maxBudget
          const active = selected?.id === c.id
          return (
            <AdvancedMarker
              key={c.id}
              position={{ lat: c.coords[0], lng: c.coords[1] }}
              onClick={() => onSelectCountry(c.id)}
              zIndex={dimmed ? 1 : 10}
              title={c.name}
            >
              <div
                className={`marker-country${active ? ' is-active' : ''}${dimmed ? ' is-dimmed' : ''}`}
                style={{ opacity: dimmed ? 0.45 : 1 }}
              >
                <div className="marker-country__pin" data-level={c.budgetLevel} />
                <div className="marker-country__label">{c.name}</div>
              </div>
            </AdvancedMarker>
          )
        })}

        {showHeritage &&
          heritageMarkers.map(({ country, site }) => {
            const isActive =
              selected?.id === country.id && activeHeritage === site.name
            return (
              <AdvancedMarker
                key={`${country.id}-${site.name}`}
                position={{ lat: site.coords[0], lng: site.coords[1] }}
                onClick={() => onSelectHeritage(country.id, site.name)}
                zIndex={isActive ? 20 : 5}
              >
                <div
                  className={`marker-heritage${isActive ? ' is-active' : ''}`}
                  data-kind={site.kind}
                />
              </AdvancedMarker>
            )
          })}
      </Map>
    </APIProvider>
  )
}
