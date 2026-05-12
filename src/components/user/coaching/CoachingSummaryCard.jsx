import CoachingLocationMap from './CoachingLocationMap';

function CoachingSummaryCard({ summary }) {
  if (!summary) {
    return null;
  }

  const mapArea = summary.mapArea ?? {};
  const previousEvaluation = summary.previousEvaluation ?? {};
  const conversationLog = mapArea.conversationLog ?? [];

  return (
    <aside className="coaching-summary-card" aria-label="현재 학습 장소와 이전 평가 내용">
      <CoachingLocationMap mapArea={mapArea} />

      <p className="coaching-summary-label">{mapArea.subtitle ?? '현재 학습 장소'}</p>
      <h2>{mapArea.title ?? '학습 장소'}</h2>
      <p>{mapArea.address ?? ''}</p>

      <div className="coaching-summary-section">
        <span className="coaching-summary-chip">
          {previousEvaluation.title ?? '이전 평가 내용'}
        </span>
        <div className="coaching-summary-feedback">
          <p>{previousEvaluation.content ?? '이전 평가 내용이 없습니다.'}</p>
        </div>
      </div>

      <div className="coaching-summary-small">
        <span className="coaching-summary-chip">지도 학습 대화 기록</span>
        <div className="coaching-map-dialogue">
          {conversationLog.length > 0 ? (
            conversationLog.map((message, index) => (
              <p key={`${message.speaker ?? 'speaker'}-${message.text ?? index}`}>
                <span>{message.speaker ?? '사용자'}</span>
                {message.text ?? ''}
              </p>
            ))
          ) : (
            <p>지도 학습 대화 기록이 없습니다.</p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default CoachingSummaryCard;