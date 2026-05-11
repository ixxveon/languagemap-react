import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminService } from '../../api/admin/adminService';
import { adminRegionService } from '../../api/place/AdminRegionService';
import { adminScenarioService } from '../../api/place/AdminScenarioService';
import { adminMissionService } from '../../api/place/AdminMissionService';
import { adminPlaceService } from '../../api/place/AdminPlaceService';


const EMPTY_PLACE_FORM = {
  googlePlaceId: '',
  placeName: '',
  placeAddress: '',
  latitude: '',
  longitude: '',
  placeDescription: '',
  scenarioId: '',
  regionId: '',
};

const EMPTY_SCENARIO_FORM = {
  prompt: '',
  scenarioDescription: '',
  category: '',
  completeExp: '120',
};

const EMPTY_MISSION_FORM = {
  missionTitle: '',
  missionDescription: '',
  scenarioId: '',
};

const EMPTY_REGION_FORM = {
  country: '',
  city: '',
  latitude: '',
  longitude: '',
};

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('no-window'));
      return;
    }

    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    const existing = document.getElementById('google-maps-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      existing.addEventListener('error', () => reject(new Error('google-maps-load-failed')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('google-maps-load-failed'));
    document.head.appendChild(script);
  });
}

function buildContentItems(places, scenarios, missions) {
  return [
    ...places.map((place) => ({
      id: `place-${place.placeId}`,
      type: '장소',
      title: place.placeName,
      status: '운영 중',
      difficulty: '-',
      description: place.placeDescription || 'Google Places 요약이 아직 없습니다.',
      tags: `${place.regionCity}, ${place.scenarioTitle}`,
      updatedAt: place.updatedAt,
    })),
    ...scenarios.map((scenario) => ({
      id: `scenario-${scenario.scenarioId}`,
      type: '시나리오',
      title: scenario.scenarioDescription,
      status: scenario.status ?? '초안',
      difficulty: '-',
      description: scenario.prompt,
      tags: `${scenario.category}, ${scenario.completeExp} EXP`,
      updatedAt: scenario.updatedAt,
    })),
    ...missions.map((mission) => ({
      id: `mission-${mission.missionId}`,
      type: '미션',
      title: mission.missionTitle,
      status: '운영 중',
      difficulty: '-',
      description: mission.missionDescription,
      tags: `시나리오 PK ${mission.scenarioId}`,
      updatedAt: mission.updatedAt,
    })),
  ];
}

function formatCardText(text) {
  return (text ?? '').replace(/,\s*/g, ', ').replace(/\s{2,}/g, ' ').trim();
}

function includesKeyword(values, keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return true;
  }

  return values
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedKeyword));
}

function resolveRegionCountry(querySuffix) {
  if (querySuffix === 'Seoul' || querySuffix === 'Busan') return '\uB300\uD55C\uBBFC\uAD6D';
  if (querySuffix === 'Tokyo') return '\uC77C\uBCF8';
  if (querySuffix === 'Sydney') return '\uD638\uC8FC';
  return querySuffix;
}

function getRegionCountry(region) {
  return region.country ?? resolveRegionCountry(region.querySuffix);
}

function getGoogleRegionCode(region) {
  const country = getRegionCountry(region);

  if (country === '대한민국' || country === '한국') return 'kr';
  if (country === '일본') return 'jp';
  if (country === '호주') return 'au';
  return undefined;
}

function AdminContentPage() {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [scenarios, setScenarios] = useState([]);
  const searchTypes = adminService.fetchAdminPlaceSearchTypes();

  const [regions, setRegions] = useState([]);
  const [places, setPlaces] = useState([]);
  const [missions, setMissions] = useState([]);
  const [placeForm, setPlaceForm] = useState(() => ({
    ...EMPTY_PLACE_FORM,
    scenarioId: '',
    regionId: '',
  }));
  const [scenarioForm, setScenarioForm] = useState(EMPTY_SCENARIO_FORM);
  const [missionForm, setMissionForm] = useState(() => ({
    ...EMPTY_MISSION_FORM,
    scenarioId: '',
  }));
  const [regionForm, setRegionForm] = useState(EMPTY_REGION_FORM);
  const [selectedSearchType, setSelectedSearchType] = useState(searchTypes[0]?.id ?? 'cafe');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGooglePlaceId, setSelectedGooglePlaceId] = useState('');
  const [mapStatus, setMapStatus] = useState(apiKey ? '지도 준비 중...' : 'Google Maps API 키가 없어서 검색 지도를 불러올 수 없습니다.');
  const [activePanel, setActivePanel] = useState('place');
  const [activeResultType, setActiveResultType] = useState('place');
  const [resultSearchQuery, setResultSearchQuery] = useState('');
  const [editingContent, setEditingContent] = useState(null);

  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);

  async function loadRegions(keyword = '') {
    try {
      const data = await adminRegionService.readRegions(keyword);

      console.log('지역 목록', data);

      setRegions(data);

      setPlaceForm((currentForm) => ({
        ...currentForm,
        regionId: currentForm.regionId || String(data[0]?.regionId ?? ''),
      }));
    } catch (error) {
      console.error('지역 목록 조회 실패', error);
    }
  }

  async function loadScenarios(keyword = '') {
    try {
      const data = await adminScenarioService.readScenarios(keyword);
      const scenarioList = data ?? [];

      console.log('시나리오 목록', scenarioList);

      setScenarios(scenarioList);

      setPlaceForm((currentForm) => ({
        ...currentForm,
        scenarioId:
          currentForm.scenarioId ||
          String(scenarioList[0]?.scenarioId ?? ''),
      }));

      setMissionForm((currentForm) => ({
        ...currentForm,
        scenarioId:
          currentForm.scenarioId ||
          String(scenarioList[0]?.scenarioId ?? ''),
      }));
    } catch (error) {
      console.error('시나리오 목록 조회 실패', error);
    }
  }

  async function loadMissions(keyword = '') {
    try {
      const data = await adminMissionService.readMissions(keyword);
      const missionList = data ?? [];

      console.log('미션 목록', missionList);

      setMissions(missionList);
    } catch (error) {
      console.error('미션 목록 조회 실패', error);
    }
  }

  async function loadPlaces(keyword = '') {
    try {
      const data = await adminPlaceService.readPlaces(keyword);
      const placeList = data ?? [];

      console.log('장소 목록', placeList);

      setPlaces(placeList);
    } catch (error) {
      console.error('장소 목록 조회 실패', error);
    }
  }

  useEffect(() => {
    loadRegions();
    loadScenarios();
    loadMissions();
    loadPlaces();
  }, []);

  const selectedRegion = useMemo(() => {
    const region =
      regions.find(
        (region) =>
          String(region.regionId) ===
          String(placeForm.regionId)
      ) ?? regions[0];

    if (!region) {
      return null;
    }

    return {
      ...region,
      id: region.regionId,
      name: region.city,
      center: {
        lat: Number(region.latitude),
        lng: Number(region.longitude),
      },
    };
  }, [placeForm.regionId, regions]);

  const contentItems = useMemo(() => buildContentItems(places, scenarios, missions), [missions, places, scenarios]);
  const filteredPlaces = useMemo(
    () =>
      places.filter((place) =>
        includesKeyword(
          [
            place.placeName,
            place.placeAddress,
            place.placeDescription,
            place.googlePlaceId,
            place.regionCity,
            place.scenarioTitle,
          ],
          resultSearchQuery,
        ),
      ),
    [places, resultSearchQuery],
  );
  const filteredScenarios = useMemo(
    () =>
      scenarios.filter((scenario) =>
        includesKeyword(
          [
            scenario.scenarioDescription,
            scenario.prompt,
            scenario.category,
            scenario.status,
            scenario.scenarioId,
          ],
          resultSearchQuery,
        ),
      ),
    [resultSearchQuery, scenarios],
  );
  const filteredMissions = useMemo(
    () =>
      missions.filter((mission) =>
        includesKeyword(
          [mission.missionTitle, mission.missionDescription, mission.scenarioId],
          resultSearchQuery,
        ),
      ),
    [missions, resultSearchQuery],
  );
  const filteredRegions = useMemo(
    () =>
      regions.filter((region) =>
        includesKeyword(
          [
            region.regionId,
            getRegionCountry(region),
            region.country,
            region.city,
            region.latitude,
            region.longitude,
          ],
          resultSearchQuery,
        ),
      ),
    [regions, resultSearchQuery],
  );

  useEffect(() => {
    if (!apiKey || !selectedRegion) {
      return undefined;
    }

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then(async (maps) => {
        if (cancelled || !mapElementRef.current) {
          return;
        }

        const { Map, InfoWindow } = await window.google.maps.importLibrary('maps');

        if (cancelled) {
          return;
        }

        if (!mapRef.current) {
          mapRef.current = new Map(mapElementRef.current, {
            center: selectedRegion.center,
            zoom: 14,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            clickableIcons: false,
          });
          infoWindowRef.current = new InfoWindow();
        } else {
          mapRef.current.panTo(selectedRegion.center);
          mapRef.current.setZoom(14);
        }

        setMapStatus('검색 조건을 선택한 뒤 장소 찾기를 눌러주세요.');
        return maps;
      })
      .catch(() => {
        if (!cancelled) {
          setMapStatus('지도를 불러오지 못했습니다. API 키와 Places API 설정을 확인해 주세요.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, selectedRegion]);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  const handleMarkerPick = async (place) => {
    try {
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'editorialSummary'],
      });

      const latitude = place.location?.lat?.();
      const longitude = place.location?.lng?.();

      setSelectedGooglePlaceId(place.id ?? '');
      setPlaceForm((currentForm) => ({
        ...currentForm,
        googlePlaceId: place.id ?? '',
        placeName: place.displayName ?? '',
        placeAddress: place.formattedAddress ?? '',
        latitude: latitude == null ? '' : String(latitude),
        longitude: longitude == null ? '' : String(longitude),
        placeDescription: place.editorialSummary ?? '',
      }));

      if (infoWindowRef.current && mapRef.current) {
        infoWindowRef.current.setContent(
          `
            <div style="min-width:200px">
              <strong>${place.displayName ?? '장소 선택'}</strong>
              <p style="margin:6px 0 0;color:#526274;font-size:12px;">${place.formattedAddress ?? ''}</p>
            </div>
          `,
        );
      }

      setMapStatus('마커에서 장소 정보를 가져왔습니다. 아래 폼에서 시나리오와 지역을 확인해 주세요.');
    } catch {
      setMapStatus('장소 상세 정보를 가져오지 못했습니다. 다른 마커를 선택해 주세요.');
    }
  };

  const handleSearchPlaces = async () => {
    if (!apiKey || !mapRef.current || !selectedRegion) {
      return;
    }

    const selectedType = searchTypes.find((type) => type.id === selectedSearchType) ?? searchTypes[0];
    const query = searchKeyword.trim() || `${selectedRegion.name} ${selectedType.label}`;

    setMapStatus('Google Places에서 장소를 찾는 중입니다...');

    try {
      await loadGoogleMaps(apiKey);
      const { Place } = await window.google.maps.importLibrary('places');

      const { places: foundPlaces = [] } = await Place.searchByText({
        textQuery: query,
        fields: ['id', 'displayName', 'formattedAddress', 'location'],
        includedType: selectedType.googleType,
        useStrictTypeFiltering: false,
        locationBias: selectedRegion.center,
        language: 'ko',
        region: getGoogleRegionCode(selectedRegion),
        maxResultCount: 8,
      });

      clearMarkers();
      setSearchResults(foundPlaces);

      if (!foundPlaces.length) {
        setMapStatus('검색 결과가 없습니다. 검색어를 바꾸거나 다른 지역을 선택해 주세요.');
        return;
      }

      foundPlaces.forEach((place) => {
        const marker = new window.google.maps.Marker({
          map: mapRef.current,
          position: place.location,
          title: place.displayName ?? '장소',
        });

        marker.addListener('click', async () => {
          await handleMarkerPick(place);

          if (infoWindowRef.current) {
            infoWindowRef.current.open({
              anchor: marker,
              map: mapRef.current,
            });
          }
        });

        markersRef.current.push(marker);
      });

      if (foundPlaces[0]?.location) {
        mapRef.current.panTo(foundPlaces[0].location);
      }

      setMapStatus('마커를 클릭하면 장소 생성 폼이 자동으로 채워집니다.');
    } catch {
      setSearchResults([]);
      clearMarkers();
      setMapStatus('Places 검색에 실패했습니다. Places API (New) 활성화 여부를 확인해 주세요.');
    }
  };

  const handlePlaceFormChange = (field) => (event) => {
    setPlaceForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleScenarioFormChange = (field) => (event) => {
    setScenarioForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleMissionFormChange = (field) => (event) => {
    setMissionForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleRegionFormChange = (field) => (event) => {
    setRegionForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handlePanelSelect = (panel) => {
    setActivePanel(panel);
    if (editingContent && editingContent.type !== panel) {
      setEditingContent(null);
    }
  };

  const resetPlaceForm = () => {
    setPlaceForm({
      ...EMPTY_PLACE_FORM,
      scenarioId: String(scenarios[0]?.scenarioId ?? ''),
      regionId: String(regions[0]?.regionId ?? ''),
    });
    setSelectedGooglePlaceId('');
    setEditingContent(null);
  };

  const resetScenarioForm = () => {
    setScenarioForm(EMPTY_SCENARIO_FORM);
    setEditingContent(null);
  };

  const resetMissionForm = () => {
    setMissionForm({
      ...EMPTY_MISSION_FORM,
      scenarioId: String(scenarios[0]?.scenarioId ?? ''),
    });
    setEditingContent(null);
  };

  const resetRegionForm = () => {
    setRegionForm(EMPTY_REGION_FORM);
    setEditingContent(null);
  };

  const handleSavePlace = async (event) => {
    event.preventDefault();

    const request = {
      googlePlaceId: placeForm.googlePlaceId,
      placeName: placeForm.placeName,
      placeAddress: placeForm.placeAddress,
      latitude: Number(placeForm.latitude),
      longitude: Number(placeForm.longitude),
      placeDescription: placeForm.placeDescription,
      scenarioId: Number(placeForm.scenarioId),
      regionId: Number(placeForm.regionId),
    };

    try {
      if (editingContent?.type === 'place') {
        await adminPlaceService.updatePlace(editingContent.id, request);
      } else {
        await adminPlaceService.createPlace(request);
      }

      resetPlaceForm();
      setEditingContent(null);
      setActivePanel('place');
      setActiveResultType('place');

      await loadPlaces();

      setMapStatus(
        editingContent?.type === 'place'
          ? '장소 정보를 수정했습니다.'
          : '장소가 생성되었습니다.'
      );
    } catch (error) {
      console.error('장소 저장 실패', error);
      window.alert('장소 저장에 실패했습니다.');
    }
  };

  const handleSaveScenario = async (event) => {
    event.preventDefault();

    const request = {
      prompt: scenarioForm.prompt,
      scenarioDescription: scenarioForm.scenarioDescription,
      category: scenarioForm.category,
      completeExp: Number(scenarioForm.completeExp),
    };

    try {
      if (editingContent?.type === 'scenario') {
        await adminScenarioService.updateScenario(editingContent.id, request);
      } else {
        await adminScenarioService.createScenario(request);
      }

      resetScenarioForm();
      setEditingContent(null);
      setActivePanel('scenario');
      setActiveResultType('scenario');
      await loadScenarios();
    } catch (error) {
      console.error('시나리오 저장 실패', error);
      window.alert('시나리오 저장에 실패했습니다.');
    }
  };

  const handleSaveMission = async (event) => {
    event.preventDefault();

    const request = {
      missionTitle: missionForm.missionTitle,
      missionDescription: missionForm.missionDescription,
      scenarioId: Number(missionForm.scenarioId),
    };

    try {
      if (editingContent?.type === 'mission') {
        await adminMissionService.updateMission(editingContent.id, request);
      } else {
        await adminMissionService.createMission(request);
      }

      resetMissionForm();
      setEditingContent(null);
      setActivePanel('mission');
      setActiveResultType('mission');
      await loadMissions();
    } catch (error) {
      console.error('미션 저장 실패', error);
      window.alert('미션 저장에 실패했습니다.');
    }
  };

  const handleSaveRegion = async (event) => {
    event.preventDefault();

    const request = {
      country: regionForm.country,
      city: regionForm.city,
      latitude: Number(regionForm.latitude),
      longitude: Number(regionForm.longitude),
    };

    try {
      if (editingContent?.type === 'region') {
        await adminRegionService.updateRegion(editingContent.id, request);
        setMapStatus(`${request.city} 지역 정보를 수정했습니다.`);
      } else {
        await adminRegionService.createRegion(request);
        setMapStatus(`${request.city} 지역이 생성되었습니다.`);
      }

      resetRegionForm();
      setEditingContent(null);
      setActivePanel('region');
      setActiveResultType('region');
      await loadRegions();
    } catch (error) {
      console.error('지역 저장 실패', error);
      window.alert('지역 저장에 실패했습니다.');
    }
  };

  const handleEditPlace = async (place) => {
    try {
      const detail = await adminPlaceService.readPlaceDetail(place.placeId);

      setEditingContent({ type: 'place', id: place.placeId });

      setPlaceForm({
        googlePlaceId: detail.googlePlaceId ?? '',
        placeName: detail.placeName ?? '',
        placeAddress: detail.placeAddress ?? '',
        latitude: String(detail.latitude ?? ''),
        longitude: String(detail.longitude ?? ''),
        placeDescription: detail.placeDescription ?? '',
        scenarioId: String(detail.scenarioId ?? ''),
        regionId: String(detail.regionId ?? ''),
      });

      setSelectedGooglePlaceId(detail.googlePlaceId ?? '');

      setActivePanel('place');
    } catch (error) {
      console.error('장소 상세 조회 실패', error);
      window.alert('장소 상세 조회에 실패했습니다.');
    }
  };

  const handleEditScenario = async (scenario) => {
    try {
      const detail = await adminScenarioService.readScenarioDetail(
        scenario.scenarioId
      );

      setEditingContent({ type: 'scenario', id: scenario.scenarioId });
      setScenarioForm({
        prompt: detail.prompt ?? '',
        scenarioDescription: detail.scenarioDescription ?? '',
        category: detail.category ?? '',
        completeExp: String(detail.completeExp ?? ''),
      });

      setActivePanel('scenario');
    } catch (error) {
      console.error('시나리오 상세 조회 실패', error);
      window.alert('시나리오 상세 조회에 실패했습니다.');
    }
  };

  const handleEditMission = async (mission) => {
    try {
      const detail = await adminMissionService.readMissionDetail(mission.missionId);

      setEditingContent({ type: 'mission', id: mission.missionId });
      setMissionForm({
        missionTitle: detail.missionTitle ?? '',
        missionDescription: detail.missionDescription ?? '',
        scenarioId: String(detail.scenarioId ?? ''),
      });

      setActivePanel('mission');
    } catch (error) {
      console.error('미션 상세 조회 실패', error);
      window.alert('미션 상세 조회에 실패했습니다.');
    }
  };

  const handleEditRegion = (region) => {
    setEditingContent({ type: 'region', id: region.regionId });
    setRegionForm({
      country: region.country,
      city: region.city,
      latitude: String(region.latitude ?? ''),
      longitude: String(region.longitude ?? ''),
    });
    setActivePanel('region');
    setActiveResultType('region');
  };

  const handleDeletePlace = async (placeId) => {
    if (!window.confirm('이 장소를 삭제할까요?')) return;

    try {
      await adminPlaceService.deletePlace(placeId);

      if (
        editingContent?.type === 'place' &&
        String(editingContent.id) === String(placeId)
      ) {
        resetPlaceForm();
      }

      await loadPlaces();
    } catch (error) {
      console.error('장소 삭제 실패', error);
      window.alert('장소 삭제에 실패했습니다.');
    }
  };

  const handleDeleteScenario = async (scenarioId) => {
    const linkedPlaceCount = places.filter(
      (place) => String(place.scenarioId) === String(scenarioId)
    ).length;

    const linkedMissionCount = missions.filter(
      (mission) => String(mission.scenarioId) === String(scenarioId)
    ).length;

    if (linkedPlaceCount || linkedMissionCount) {
      window.alert('연결된 장소나 미션이 있는 시나리오는 삭제할 수 없습니다.');
      return;
    }

    if (!window.confirm('이 시나리오를 삭제할까요?')) return;

    try {
      await adminScenarioService.deleteScenario(scenarioId);

      if (
        editingContent?.type === 'scenario' &&
        String(editingContent.id) === String(scenarioId)
      ) {
        resetScenarioForm();
      }

      await loadScenarios();
    } catch (error) {
      console.error('시나리오 삭제 실패', error);
      window.alert('시나리오 삭제에 실패했습니다.');
    }
  };
  const handleDeleteMission = async (missionId) => {
    if (!window.confirm('이 미션을 삭제할까요?')) return;

    try {
      await adminMissionService.deleteMission(missionId);

      if (
        editingContent?.type === 'mission' &&
        String(editingContent.id) === String(missionId)
      ) {
        resetMissionForm();
      }

      await loadMissions();
    } catch (error) {
      console.error('미션 삭제 실패', error);
      window.alert('미션 삭제에 실패했습니다.');
    }
  };

  const handleDeleteRegion = async (regionId) => {
    const linkedPlaceCount = places.filter(
      (place) => String(place.regionId) === String(regionId)
    ).length;

    if (linkedPlaceCount) {
      window.alert('연결된 장소가 있는 지역은 삭제할 수 없습니다.');
      return;
    }

    if (!window.confirm('이 지역을 삭제할까요?')) return;

    try {
      await adminRegionService.deleteRegion(regionId);

      if (String(placeForm.regionId) === String(regionId)) {
        setPlaceForm((currentForm) => ({
          ...currentForm,
          regionId: '',
        }));
      }

      if (
        editingContent?.type === 'region' &&
        String(editingContent.id) === String(regionId)
      ) {
        resetRegionForm();
      }

      await loadRegions();
    } catch (error) {
      console.error('지역 삭제 실패', error);
      window.alert('지역 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Admin"
        title="콘텐츠 생성 관리"
        description="장소, 시나리오, 미션 생성에 필요한 입력값을 한 화면에서 관리합니다. 장소는 Google Maps 마커를 클릭해 기본 정보를 자동으로 채우고, 시나리오와 지역은 내부 PK로 연결합니다."
      >
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/admin')}>
            관리자 메인으로
          </button>
        </div>
      </MapingoPageSection>

      <section className="mapingo-page-section">
        <div className="mapingo-dashboard-stats admin-overview-grid">
          <article className="mapingo-stat-card admin-overview-card">
            <p className="mapingo-stat-label">등록된 장소</p>
            <strong className="mapingo-stat-value">{places.length}</strong>
            <p className="mapingo-stat-hint">Google Places에서 가져온 장소</p>
          </article>
          <article className="mapingo-stat-card admin-overview-card">
            <p className="mapingo-stat-label">시나리오</p>
            <strong className="mapingo-stat-value">{scenarios.length}</strong>
            <p className="mapingo-stat-hint">프롬프트와 보상 정책 포함</p>
          </article>
          <article className="mapingo-stat-card admin-overview-card">
            <p className="mapingo-stat-label">미션</p>
            <strong className="mapingo-stat-value">{missions.length}</strong>
            <p className="mapingo-stat-hint">시나리오별 미션 연결 완료</p>
          </article>
          <article className="mapingo-stat-card admin-overview-card">
            <p className="mapingo-stat-label">전체 콘텐츠</p>
            <strong className="mapingo-stat-value">{contentItems.length}</strong>
            <p className="mapingo-stat-hint">관리 화면에서 확인 가능한 총 항목</p>
          </article>
        </div>
      </section>

      <section className="mapingo-page-section">
        <div className="mapingo-admin-grid admin-content-layout">
          <div className="mapingo-form-card">
            <div className="mapingo-card-header-row admin-builder-head">
              <div>
                <h3>{editingContent ? '콘텐츠 수정' : '콘텐츠 생성'}</h3>
                <p className="mapingo-muted-copy">장소, 시나리오, 미션을 생성하고 목록에서 선택한 항목을 바로 수정할 수 있습니다.</p>
              </div>
              <div className="admin-content-tab-row">
                <button
                  type="button"
                  className={`admin-content-tab ${activePanel === 'place' ? 'is-active' : ''}`}
                  onClick={() => handlePanelSelect('place')}
                >
                  장소
                </button>
                <button
                  type="button"
                  className={`admin-content-tab ${activePanel === 'scenario' ? 'is-active' : ''}`}
                  onClick={() => handlePanelSelect('scenario')}
                >
                  시나리오
                </button>
                <button
                  type="button"
                  className={`admin-content-tab ${activePanel === 'mission' ? 'is-active' : ''}`}
                  onClick={() => handlePanelSelect('mission')}
                >
                  미션
                </button>
                <button
                  type="button"
                  className={`admin-content-tab ${activePanel === 'region' ? 'is-active' : ''}`}
                  onClick={() => handlePanelSelect('region')}
                >
                  지역
                </button>
              </div>
            </div>

            <section className={`admin-builder-section ${activePanel === 'place' ? 'is-active' : ''}`}>
              <div className="mapingo-admin-editing-banner">
                <strong>{editingContent?.type === 'place' ? '장소 수정' : '장소 생성'}</strong>
                <p>구글 맵에서 검색된 마커를 클릭하면 장소 ID, 이름, 주소, 좌표가 자동 입력됩니다.</p>
              </div>

              <div className="admin-place-search-bar">
                <label className="mapingo-field">
                  <span className="mapingo-field-label">지역</span>
                  <select className="mapingo-input" value={placeForm.regionId} onChange={handlePlaceFormChange('regionId')}>
                    {regions.map((region) => (
                      <option key={region.regionId} value={region.regionId}>
                        {region.city}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mapingo-field admin-place-search-field">
                  <span className="mapingo-field-label">검색어</span>
                  <input
                    className="mapingo-input"
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="예: 성수 카페, 김포공항, 시드니 약국"
                  />
                </label>

                <button type="button" className="mapingo-submit-button admin-place-search-button" onClick={handleSearchPlaces}>
                  장소 찾기
                </button>
              </div>

              <div className="admin-place-type-row">
                {searchTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`mapingo-inline-badge admin-place-type ${selectedSearchType === type.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedSearchType(type.id)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="admin-place-map-panel">
                <div ref={mapElementRef} className={`admin-place-map ${!apiKey ? 'is-placeholder' : ''}`}>
                  {!apiKey ? (
                    <div className="admin-place-map-empty">
                      <strong>Google Maps API 키가 없어서 장소 검색을 실행할 수 없습니다.</strong>
                      <p>`VITE_GOOGLE_MAPS_API_KEY`와 Places API (New)가 설정되면 마커 클릭으로 자동 입력됩니다.</p>
                    </div>
                  ) : null}
                </div>

                <div className="admin-place-map-meta">
                  <strong>지도 상태</strong>
                  <p>{mapStatus}</p>
                </div>
              </div>

              <div className="admin-search-result-list">
                {searchResults.map((place) => (
                  <button
                    key={place.placeId}
                    type="button"
                    className={`admin-search-result-item ${selectedGooglePlaceId === place.id ? 'is-selected' : ''}`}
                    onClick={() => handleMarkerPick(place)}
                  >
                    <strong>{place.displayName ?? '이름 없음'}</strong>
                    <span>{place.formattedAddress ?? '주소 정보 없음'}</span>
                  </button>
                ))}
              </div>

              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleSavePlace}>
                <div className="admin-content-form-grid admin-place-field-grid">
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">Google 장소 ID</span>
                    <input className="mapingo-input" value={placeForm.googlePlaceId} readOnly placeholder="마커 클릭 시 자동 입력" />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">장소 이름</span>
                    <input className="mapingo-input" value={placeForm.placeName} readOnly placeholder="마커 클릭 시 자동 입력" />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">장소 주소</span>
                    <input className="mapingo-input" value={placeForm.placeAddress} readOnly placeholder="마커 클릭 시 자동 입력" />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">위도</span>
                    <input className="mapingo-input" value={placeForm.latitude} readOnly placeholder="마커 클릭 시 자동 입력" />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">경도</span>
                    <input className="mapingo-input" value={placeForm.longitude} readOnly placeholder="마커 클릭 시 자동 입력" />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">시나리오 PK</span>
                    <select className="mapingo-input" value={placeForm.scenarioId} onChange={handlePlaceFormChange('scenarioId')}>
                      {scenarios.map((scenario) => (
                        <option key={scenario.scenarioId} value={scenario.scenarioId}>
                          {scenario.scenarioId} - {scenario.scenarioDescription}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">지역 PK</span>
                    <select className="mapingo-input" value={placeForm.regionId} onChange={handlePlaceFormChange('regionId')}>
                      {regions.map((region) => (
                        <option key={region.regionId} value={region.regionId}>
                          {region.regionId} - {region.city}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mapingo-field">
                  <span className="mapingo-field-label">장소 설명</span>
                  <textarea
                    className="mapingo-input mapingo-admin-textarea"
                    value={placeForm.placeDescription}
                    onChange={handlePlaceFormChange('placeDescription')}
                    placeholder="Google Places editorial summary가 있으면 자동 입력됩니다."
                  />
                </label>

                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">
                    {editingContent?.type === 'place' ? '장소 수정 저장' : '장소 저장'}
                  </button>
                  {editingContent?.type === 'place' ? (
                    <button type="button" className="mapingo-ghost-button" onClick={resetPlaceForm}>
                      취소
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'scenario' ? 'is-active' : ''}`}>
              <div className="mapingo-admin-editing-banner">
                <strong>{editingContent?.type === 'scenario' ? '시나리오 수정' : '시나리오 생성'}</strong>
                <p>FastAPI의 긴 프롬프트 전 단계로, 관리자 페이지에서는 간단한 프롬프트와 운영 속성만 입력합니다.</p>
              </div>

              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleSaveScenario}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">프롬프트</span>
                  <textarea
                    className="mapingo-input mapingo-admin-textarea"
                    value={scenarioForm.prompt}
                    onChange={handleScenarioFormChange('prompt')}
                    placeholder="예: 공항 입국 심사에서 여행 목적과 숙소를 자연스럽게 말해보세요."
                    required
                  />
                </label>

                <label className="mapingo-field">
                  <span className="mapingo-field-label">시나리오 설명</span>
                  <input
                    className="mapingo-input"
                    value={scenarioForm.scenarioDescription}
                    onChange={handleScenarioFormChange('scenarioDescription')}
                    placeholder="예: 공항 입국 심사 응답"
                    required
                  />
                </label>

                <div className="admin-content-form-grid">
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">카테고리</span>
                    <input
                      className="mapingo-input"
                      value={scenarioForm.category}
                      onChange={handleScenarioFormChange('category')}
                      placeholder="예: CAFE"
                      required
                    />
                  </label>
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">완료 경험치</span>
                    <input
                      className="mapingo-input"
                      type="number"
                      min="0"
                      step="10"
                      value={scenarioForm.completeExp}
                      onChange={handleScenarioFormChange('completeExp')}
                      required
                    />
                  </label>
                </div>

                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">
                    {editingContent?.type === 'scenario' ? '시나리오 수정 저장' : '시나리오 저장'}
                  </button>
                  {editingContent?.type === 'scenario' ? (
                    <button type="button" className="mapingo-ghost-button" onClick={resetScenarioForm}>
                      취소
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'mission' ? 'is-active' : ''}`}>
              <div className="mapingo-admin-editing-banner">
                <strong>{editingContent?.type === 'mission' ? '미션 수정' : '미션 생성'}</strong>
                <p>미션은 시나리오 PK를 선택해서 연결합니다. 저장 후 오른쪽 목록에서 바로 확인할 수 있습니다.</p>
              </div>

              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleSaveMission}>
                <label className="mapingo-field">
                  <span className="mapingo-field-label">미션 주제</span>
                  <input
                    className="mapingo-input"
                    value={missionForm.missionTitle}
                    onChange={handleMissionFormChange('missionTitle')}
                    placeholder="예: 여행 목적과 숙소 말하기"
                    required
                  />
                </label>

                <label className="mapingo-field">
                  <span className="mapingo-field-label">미션 설명</span>
                  <textarea
                    className="mapingo-input mapingo-admin-textarea"
                    value={missionForm.missionDescription}
                    onChange={handleMissionFormChange('missionDescription')}
                    placeholder="예: 입국 심사 질문 3개에 정확하고 짧게 답하는 연습"
                    required
                  />
                </label>

                <label className="mapingo-field">
                  <span className="mapingo-field-label">시나리오 PK</span>
                  <select className="mapingo-input" value={missionForm.scenarioId} onChange={handleMissionFormChange('scenarioId')}>
                    {scenarios.map((scenario) => (
                      <option key={scenario.scenarioId} value={scenario.scenarioId}>
                        {scenario.scenarioId} - {scenario.scenarioDescription}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">
                    {editingContent?.type === 'mission' ? '미션 수정 저장' : '미션 저장'}
                  </button>
                  {editingContent?.type === 'mission' ? (
                    <button type="button" className="mapingo-ghost-button" onClick={resetMissionForm}>
                      취소
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className={`admin-builder-section ${activePanel === 'region' ? 'is-active' : ''}`}>
              <div className="mapingo-admin-editing-banner">
                <strong>{editingContent?.type === 'region' ? '지역 수정' : '지역 생성'}</strong>
                <p>{'지역은 나라, 도시, 위도, 경도를 입력해서 생성합니다. 저장 후 오른쪽 목록에서 바로 확인할 수 있습니다.'}</p>
              </div>

              <form className="mapingo-admin-form admin-builder-form" onSubmit={handleSaveRegion}>
                <div className="admin-content-form-grid">
                  <label className="mapingo-field">
                    <span className="mapingo-field-label">나라</span>
                    <input
                      className="mapingo-input"
                      value={regionForm.country}
                      onChange={handleRegionFormChange('country')}
                      placeholder="예: 대한민국"
                      required
                    />
                  </label>

                  <label className="mapingo-field">
                    <span className="mapingo-field-label">도시</span>
                    <input
                      className="mapingo-input"
                      value={regionForm.city}
                      onChange={handleRegionFormChange('city')}
                      placeholder="예: 서울"
                      required
                    />
                  </label>

                  <label className="mapingo-field">
                    <span className="mapingo-field-label">위도</span>
                    <input
                      className="mapingo-input"
                      type="number"
                      step="0.000001"
                      value={regionForm.latitude}
                      onChange={handleRegionFormChange('latitude')}
                      placeholder="예: 37.5665"
                      required
                    />
                  </label>

                  <label className="mapingo-field">
                    <span className="mapingo-field-label">경도</span>
                    <input
                      className="mapingo-input"
                      type="number"
                      step="0.000001"
                      value={regionForm.longitude}
                      onChange={handleRegionFormChange('longitude')}
                      placeholder="예: 126.9780"
                      required
                    />
                  </label>
                </div>

                <div className="mapingo-admin-action-row">
                  <button type="submit" className="mapingo-submit-button">
                    {editingContent?.type === 'region' ? '지역 수정 저장' : '지역 저장'}
                  </button>
                  {editingContent?.type === 'region' ? (
                    <button type="button" className="mapingo-ghost-button" onClick={resetRegionForm}>
                      취소
                    </button>
                  ) : null}
                </div>
              </form>
            </section>
          </div>

          <div className="mapingo-list-card">
            <div className="mapingo-card-header-row admin-result-head">
              <div>
                <h3>생성 결과</h3>
                <p className="mapingo-muted-copy">저장한 장소, 시나리오, 미션을 각각의 데이터 구조에 맞게 확인합니다.</p>
              </div>
              <span className="mapingo-inline-badge">{contentItems.length}개</span>
            </div>

            <div className="admin-content-result-controls">
              <div className="admin-content-tab-row">
                <button
                  type="button"
                  className={`admin-content-tab ${activeResultType === 'place' ? 'is-active' : ''}`}
                  onClick={() => setActiveResultType('place')}
                >
                  {'장소'}
                </button>
                <button
                  type="button"
                  className={`admin-content-tab ${activeResultType === 'scenario' ? 'is-active' : ''}`}
                  onClick={() => setActiveResultType('scenario')}
                >
                  {'시나리오'}
                </button>
                <button
                  type="button"
                  className={`admin-content-tab ${activeResultType === 'mission' ? 'is-active' : ''}`}
                  onClick={() => setActiveResultType('mission')}
                >
                  {'미션'}
                </button>
                <button
                  type="button"
                  className={`admin-content-tab ${activeResultType === 'region' ? 'is-active' : ''}`}
                  onClick={() => setActiveResultType('region')}
                >
                  {'지역'}
                </button>
              </div>

              <label className="mapingo-field admin-content-result-search">
                <span className="mapingo-field-label">{'결과 검색'}</span>
                <input
                  className="mapingo-input"
                  value={resultSearchQuery}
                  onChange={(event) => setResultSearchQuery(event.target.value)}
                  placeholder={'이름, 주소, 설명, 카테고리 검색'}
                />
              </label>
            </div>

            <div className="admin-entity-stack">
              <section className={`admin-entity-section ${activeResultType === 'place' ? '' : 'admin-result-section-hidden'}`}>
                <div className="admin-entity-head">
                  <strong>{'장소'}</strong>
                  <span>{`${filteredPlaces.length}개`}</span>
                </div>
                <div className="mapingo-selectable-list">
                  {filteredPlaces.map((place) => (
                    <article key={place.placeId} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{place.placeName}</strong>
                          <p>{`${place.regionCity} · 시나리오 PK ${place.scenarioId}`}</p>
                        </div>
                        <span className="mapingo-inline-badge">{'장소'}</span>
                      </div>
                      <p className="admin-content-description">{formatCardText(place.placeAddress)}</p>
                      <div className="mapingo-admin-meta-grid admin-place-meta-grid">
                        <p>
                          <strong>Google ID</strong>
                          {place.googlePlaceId}
                        </p>
                        <p>
                          <strong>{'위도'}</strong>
                          {place.latitude}
                        </p>
                        <p>
                          <strong>{'경도'}</strong>
                          {place.longitude}
                        </p>
                      </div>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => handleEditPlace(place)}>
                          {'수정'}
                        </button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeletePlace(place.placeId)}>
                          {'삭제'}
                        </button>
                      </div>
                    </article>
                  ))}
                  {!filteredPlaces.length ? <p className="admin-content-empty-state">{'검색 결과에 맞는 장소가 없습니다.'}</p> : null}
                </div>
              </section>

              <section className={`admin-entity-section ${activeResultType === 'scenario' ? '' : 'admin-result-section-hidden'}`}>
                <div className="admin-entity-head">
                  <strong>{'시나리오'}</strong>
                  <span>{`${filteredScenarios.length}개`}</span>
                </div>
                <div className="mapingo-selectable-list">
                  {filteredScenarios.map((scenario) => (
                    <article key={scenario.scenarioId} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{formatCardText(scenario.scenarioDescription)}</strong>
                          <p>{`시나리오 PK ${scenario.scenarioId}`}</p>
                        </div>
                        <div className="mapingo-inline-badges">
                          <span className="mapingo-inline-badge">{scenario.category}</span>
                        </div>
                      </div>
                      <div className="admin-content-tags">
                        <span>{scenario.completeExp} EXP</span>
                      </div>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => handleEditScenario(scenario)}>
                          {'수정'}
                        </button>
                        {/* <button type="button" className="mapingo-ghost-button" onClick={() => handleToggleScenarioStatus(scenario.scenarioId)}>
                          {'상태 전환'}
                        </button> */}
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteScenario(scenario.scenarioId)}>
                          {'삭제'}
                        </button>
                      </div>
                    </article>
                  ))}
                  {!filteredScenarios.length ? <p className="admin-content-empty-state">{'검색 결과에 맞는 시나리오가 없습니다.'}</p> : null}
                </div>
              </section>

              <section className={`admin-entity-section ${activeResultType === 'mission' ? '' : 'admin-result-section-hidden'}`}>
                <div className="admin-entity-head">
                  <strong>{'미션'}</strong>
                  <span>{`${filteredMissions.length}개`}</span>
                </div>
                <div className="mapingo-selectable-list">
                  {filteredMissions.map((mission) => (
                    <article key={mission.missionId} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{formatCardText(mission.missionTitle)}</strong>
                          <p>{`시나리오 PK ${mission.scenarioId}`}</p>
                        </div>
                        <span className="mapingo-inline-badge">{'미션'}</span>
                      </div>
                      <p className="admin-content-description">{formatCardText(mission.missionDescription)}</p>
                      <div className="admin-content-tags">
                        <span>{mission.scenarioId}</span>
                      </div>
                      <div className="mapingo-admin-action-row admin-content-card-actions">
                        <button type="button" className="mapingo-submit-button" onClick={() => handleEditMission(mission)}>
                          {'수정'}
                        </button>
                        <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteMission(mission.missionId)}>
                          {'삭제'}
                        </button>
                      </div>
                    </article>
                  ))}
                  {!filteredMissions.length ? <p className="admin-content-empty-state">{'검색 결과에 맞는 미션이 없습니다.'}</p> : null}
                </div>
              </section>

              <section className={`admin-entity-section ${activeResultType === 'region' ? '' : 'admin-result-section-hidden'}`}>
                <div className="admin-entity-head">
                  <strong>{'지역'}</strong>
                  <span>{`${filteredRegions.length}개`}</span>
                </div>
                <div className="mapingo-selectable-list">
                  {filteredRegions.map((region) => {

                    return (
                      <article key={region.regionId} className="mapingo-post-card admin-content-card">
                        <div className="mapingo-admin-item-head">
                          <div>
                            <strong>{`지역 PK ${region.regionId}`}</strong>
                            <p>{`국가명 ${region.country}`}</p>
                            <p>{`도시명 ${region.city}`}</p>
                            <p>{`위도 ${region.latitude}`}</p>
                            <p>{`경도 ${region.longitude}`}</p>
                          </div>
                        </div>
                        <div className="mapingo-admin-action-row admin-content-card-actions">
                          <button type="button" className="mapingo-submit-button" onClick={() => handleEditRegion(region)}>
                            {'수정'}
                          </button>
                          <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteRegion(region.regionId)}>
                            {'삭제'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  {!filteredRegions.length ? <p className="admin-content-empty-state">{'검색 결과에 맞는 지역이 없습니다.'}</p> : null}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminContentPage;
