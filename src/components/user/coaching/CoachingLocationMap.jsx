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

function CoachingLocationMap({ mapArea }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!apiKey || !mapRef.current) return undefined;

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (cancelled || !mapRef.current) return;

        const center = { lat: mapArea.lat, lng: mapArea.lng };

        mapInstanceRef.current = new maps.Map(mapRef.current, {
          center,
          zoom: mapArea.zoom,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          clickableIcons: false,
          gestureHandling: 'none',
          zoomControl: false,
          styles: [],
        });

        new maps.Marker({
          position: center,
          map: mapInstanceRef.current,
          title: mapArea.title,
          icon: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
            fillColor: '#14B8A6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 1.25,
            anchor: new maps.Point(12, 22),
          },
        });

        new maps.Circle({
          strokeColor: '#14B8A6',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#14B8A6',
          fillOpacity: 0.08,
          map: mapInstanceRef.current,
          center,
          radius: 200,
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [apiKey, mapArea.lat, mapArea.lng, mapArea.title, mapArea.zoom]);

  return (
    <div className={`coaching-location-map ${!apiKey ? 'is-placeholder' : ''}`} ref={mapRef}>
      {!apiKey && (
        <div className="coaching-location-map-placeholder">
          <strong>Google Map</strong>
          <span>VITE_GOOGLE_MAPS_API_KEY 연결 시 장소 기준 지도가 표시됩니다.</span>
        </div>
      )}
    </div>
  );
}

export default CoachingLocationMap;
