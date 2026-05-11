function CapitalFilter({
    regions = [],
    activeRegionId,
    onSelectRegion,
}) {
    return (
        <div className="map-domain-capital-filter">
            <span className="map-domain-capital-filter-label">Places</span>
            {regions.map((region) => (
                <button
                    key={region.regionId}
                    type="button"
                    className={`map-domain-capital-filter-button ${
                        Number(activeRegionId) === Number(region.regionId)
                            ? 'is-active'
                            : ''
                    }`}
                    onClick={() => onSelectRegion(region)}
                >
                    {region.city}
                </button>
            ))}
        </div>
    );
}

export default CapitalFilter;
