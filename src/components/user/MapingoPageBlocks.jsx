function MapingoPageSection({ eyebrow, title, description, children }) {
  return (
    <section className="mapingo-page-section">
      <div className="mapingo-page-section-head">
        {eyebrow ? <p className="mapingo-eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p className="mapingo-page-section-copy">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function MapingoMetricGrid({ items }) {
  return (
    <div className="mapingo-dashboard-stats">
      {items.map(({ label, value, hint }) => (
        <article key={label} className="mapingo-stat-card">
          <p className="mapingo-stat-label">{label}</p>
          <strong className="mapingo-stat-value">{value}</strong>
          {hint ? <p className="mapingo-stat-hint">{hint}</p> : null}
        </article>
      ))}
    </div>
  );
}

function MapingoInfoGrid({ items }) {
  return (
    <div className="mapingo-dashboard-grid">
      {items.map(({ title, description }) => (
        <article key={title} className="mapingo-detail-card">
          <h3>{title}</h3>
          <p>{description}</p>
        </article>
      ))}
    </div>
  );
}

function MapingoChecklist({ title, items }) {
  return (
    <article className="mapingo-feature-card">
      <h3>{title}</h3>
      <div className="mapingo-checklist">
        {items.map((item) => (
          <div key={item} className="mapingo-check-item">
            <span className="mapingo-check-bullet">✓</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function MapingoActivityList({ title, items }) {
  return (
    <article className="mapingo-feature-card">
      <h3>{title}</h3>
      <div className="mapingo-activity-list">
        {items.map(({ label, meta }) => (
          <div key={`${label}-${meta}`} className="mapingo-activity-item">
            <div>
              <p className="mapingo-activity-label">{label}</p>
              <p className="mapingo-activity-meta">{meta}</p>
            </div>
            <span className="mapingo-activity-dot" />
          </div>
        ))}
      </div>
    </article>
  );
}

export { MapingoActivityList, MapingoChecklist, MapingoInfoGrid, MapingoMetricGrid, MapingoPageSection };
