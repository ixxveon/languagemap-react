function CapitalFilter({
    regions = [],
    activeRegionId,
    onSelectRegion,
}) {
    const selectedRegionId = String(activeRegionId ?? regions[0]?.regionId ?? '');

    return (
        <div className="map-domain-capital-filter">
            <span className="map-domain-capital-filter-label">Places</span>
            <div className="map-domain-capital-filter-dropdown">
                <select
                    className="map-domain-capital-filter-select"
                    value={selectedRegionId}
                    onChange={(event) => {
                        const selectedRegion = regions.find(
                            (region) => String(region.regionId) === event.target.value
                        );

                        if (selectedRegion) {
                            onSelectRegion(selectedRegion);
                        }
                    }}
                    aria-label="Select place region"
                >
                    {regions.map((region) => (
                        <option key={region.regionId} value={String(region.regionId)}>
                            {region.city}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default CapitalFilter;
