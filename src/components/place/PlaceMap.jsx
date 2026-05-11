import { useEffect, useRef } from 'react';

function loadGoogleMaps(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.google?.maps) {
            resolve(window.google.maps);
            return;
        }

        const existingScript = document.getElementById('google-maps-script');

        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.google.maps));
            existingScript.addEventListener('error', reject);
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(window.google.maps);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function PlaceMap({
    places = [],
    activeRegion,
    selectedPlaceId,
    onSelectPlace,
}) {
    const mapElementRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    useEffect(() => {
        if (!apiKey) {
            return undefined;
        }

        const regionCenter = {
            lat: Number(activeRegion?.latitude ?? 37.5665),
            lng: Number(activeRegion?.longitude ?? 126.9780),
        };

        const regionZoom = 12;

        let cancelled = false;

        loadGoogleMaps(apiKey)
            .then((maps) => {
                if (cancelled || !mapElementRef.current) {
                    return;
                }

                if (!mapInstanceRef.current) {
                    mapInstanceRef.current = new maps.Map(mapElementRef.current, {
                        center: regionCenter,
                        zoom: regionZoom,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        streetViewControl: false,
                        clickableIcons: false,
                        gestureHandling: 'greedy',
                        zoomControl: true,
                        styles: [],
                    });

                    mapInstanceRef.current.addListener('click', () => onSelectPlace(null));
                }

                const map = mapInstanceRef.current;

                markersRef.current.forEach((marker) => marker.setMap(null));
                markersRef.current = [];

                places.forEach((place) => {
                    const isSelected = Number(place.id) === Number(selectedPlaceId);

                    const marker = new maps.Marker({
                        position: {
                            lat: Number(place.lat),
                            lng: Number(place.lng),
                        },
                        map,
                        zIndex: isSelected ? 999 : 10,
                        icon: {
                            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                            fillColor: isSelected ? '#155E63' : '#14B8A6',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2,
                            scale: isSelected ? 1.5 : 1.28,
                            anchor: new maps.Point(12, 22),
                        },
                    });

                    marker.addListener('click', () => onSelectPlace(place.id));
                    markersRef.current.push(marker);
                });

                if (selectedPlaceId) {
                    const currentPlace = places.find(
                        (place) => Number(place.id) === Number(selectedPlaceId)
                    );

                    if (currentPlace) {
                        map.panTo({
                            lat: Number(currentPlace.lat),
                            lng: Number(currentPlace.lng),
                        });
                        map.setZoom(Math.max(regionZoom, 15));
                        return;
                    }
                }

                if (places.length === 1) {
                    map.panTo({
                        lat: Number(places[0].lat),
                        lng: Number(places[0].lng),
                    });
                    map.setZoom(Math.max(regionZoom, 15));
                    return;
                }

                map.panTo(regionCenter);
                map.setZoom(regionZoom);
            })
            .catch((error) => {
                console.error('Google Maps 로드 실패:', error);
            });

        return () => {
            cancelled = true;
        };
    }, [activeRegion, apiKey, onSelectPlace, places, selectedPlaceId]);

    return (
        <div
            ref={mapElementRef}
            className={`map-domain-google-map ${!apiKey ? 'is-placeholder' : ''}`}
        >
            {!apiKey ? (
                <div className="map-domain-map-placeholder-card">
                    <strong>Google Maps API key가 연결되면 실제 지도 전체 화면으로 전환됩니다.</strong>
                    <p>
                        `VITE_GOOGLE_MAPS_API_KEY`를 넣으면 지금 레이아웃 그대로 지도, 마커,
                        도시 이동 버튼이 활성화됩니다.
                    </p>
                </div>
            ) : null}
        </div>
    );
}

export default PlaceMap;