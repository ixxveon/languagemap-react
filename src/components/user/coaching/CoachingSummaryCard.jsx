import CoachingLocationMap from './CoachingLocationMap';

function CoachingSummaryCard({ summary }) {
  const evaluationItems = [
    ['발음', summary.evaluation.pronunciation],
    ['표현', summary.evaluation.expression],
    ['속도', summary.evaluation.responseSpeed],
  ];

  return (
    <aside className="coaching-summary-card" aria-label="현재 학습 장소">
      <CoachingLocationMap mapArea={summary.mapArea} />

      <p className="coaching-summary-label">{summary.mapArea.subtitle}</p>
      <h2>{summary.mapArea.title}</h2>
      <p>{summary.mapArea.address}</p>

      <div className="coaching-map-radius">{summary.mapArea.radius}</div>

      <div className="coaching-summary-tags">
        {evaluationItems.map(([label, value]) => (
          <span key={label}>
            {label} {value}
          </span>
        ))}
      </div>

      <div className="coaching-summary-small">
        <strong>지도 학습 대화 기록</strong>
        <div className="coaching-map-dialogue">
          {summary.mapArea.conversationLog.map((message) => (
            <p key={`${message.speaker}-${message.text}`}>
              <span>{message.speaker}</span>
              {message.text}
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default CoachingSummaryCard;
