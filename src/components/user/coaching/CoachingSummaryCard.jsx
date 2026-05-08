import CoachingLocationMap from './CoachingLocationMap';

function CoachingSummaryCard({ summary }) {
  return (
    <aside className="coaching-summary-card" aria-label="현재 학습 장소와 이전 평가 내용">
      <CoachingLocationMap mapArea={summary.mapArea} />

      <p className="coaching-summary-label">{summary.mapArea.subtitle}</p>
      <h2>{summary.mapArea.title}</h2>
      <p>{summary.mapArea.address}</p>

      <div className="coaching-summary-section">
        <span className="coaching-summary-chip">{summary.previousEvaluation.title}</span>
        <div className="coaching-summary-feedback">
          <p>{summary.previousEvaluation.content}</p>
        </div>
      </div>

      <div className="coaching-summary-small">
        <span className="coaching-summary-chip">지도 학습 대화 기록</span>
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
