function CapitalFilter({
    capitals,
    activeCapitalId,
    onSelectCapital,
}) {
    return (
        <div
            className="map-domain-capital-row"
            role="tablist"
            aria-label="capital filters"
        >
            {capitals
                .filter((capital) => capital.id !== 'all')
                .map((capital) => (
                    <button
                        key={capital.id}
                        type="button"
                        className={`map-domain-capital-pill ${activeCapitalId === capital.id ? 'is-active' : ''
                            }`}
                        onClick={() => onSelectCapital(capital.id)}
                    >
                        {capital.label}
                    </button>
                ))}
        </div>
    );
}

export default CapitalFilter;