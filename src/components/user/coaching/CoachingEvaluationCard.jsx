function CoachingEvaluationCard({ evaluation }) {
  return (
    <article className="coaching-text-bubble coaching-evaluation-message">
      <span>AI Coach</span>
      <p>오늘 코칭은 여기까지입니다. 종합 점수는 {evaluation.score}점이에요.</p>
      <p>{evaluation.summary}</p>
    </article>
  );
}

export default CoachingEvaluationCard;
