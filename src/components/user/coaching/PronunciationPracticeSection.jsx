import PronunciationSentenceCard from './PronunciationSentenceCard';

function PronunciationPracticeSection({ sentences }) {
  const averageScore = Math.round(sentences.reduce((sum, sentence) => sum + sentence.score, 0) / sentences.length);

  const feedbackCards = [
    {
      title: '자연스러움',
      status: 'GOOD',
      tone: 'green',
      text: '문장이 자연스럽게 이어졌어요.',
      dots: 4,
    },
    {
      title: '응답 흐름',
      status: 'GOOD',
      tone: 'blue',
      text: '질문에 맞게 빠르게 이어갔어요.',
      dots: 4,
    },
    {
      title: '발음 포인트',
      status: 'CHECK',
      tone: 'orange',
      text: 'almond, preferably 강세를 더 확인해요.',
      dots: 3,
    },
  ];

  return (
    <section className="pronunciation-practice-section" aria-labelledby="pronunciation-title">
      <div className="coaching-feedback-board">
        <div className="coaching-feedback-intro">
          <p className="coaching-kicker">Detailed Feedback</p>
          <h2 id="pronunciation-title">상세 코칭 평가</h2>
          <p>채팅에서 말한 핵심 문장을 기준으로 자연스러움, 응답 흐름, 주의할 발음 포인트를 정리했습니다.</p>
        </div>

        <div className="coaching-score-hero">
          <div className="score-spark score-spark-one" />
          <div className="score-spark score-spark-two" />
          <span>종합 말하기 점수</span>
          <strong>
            {averageScore}
            <small>점</small>
          </strong>
          <div className="coaching-score-bar">
            <i style={{ width: `${averageScore}%` }} />
          </div>
          <p>속도 23% · 표현 88%</p>
          <div className="score-character" aria-hidden="true">
            <span className="score-character-face">
              <i />
              <i />
            </span>
            <span className="score-character-arm is-left" />
            <span className="score-character-arm is-right" />
          </div>
        </div>

        <div className="coaching-feedback-cards">
          {feedbackCards.map((card) => (
            <article key={card.title} className={`coaching-feedback-mini is-${card.tone}`}>
              <div>
                <h3>{card.title}</h3>
                <span>{card.status}</span>
              </div>
              <p>{card.text}</p>
              <div className="feedback-dots" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i key={index} className={index < card.dots ? 'is-filled' : ''} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="pronunciation-list-title">
        <p className="coaching-kicker">Sentence Detail</p>
        <h2>문장별 발음 점수 및 발음 포인트</h2>
      </div>

      <div className="pronunciation-card-grid">
        {sentences.map((sentence) => (
          <PronunciationSentenceCard key={sentence.id} sentence={sentence} />
        ))}
      </div>
    </section>
  );
}

export default PronunciationPracticeSection;
