import PronunciationSentenceCard from './PronunciationSentenceCard';

function parseProblemWords(problemWords) {
  if (!problemWords) return [];

  if (Array.isArray(problemWords)) {
    return problemWords
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') return item.word ?? '';
        return '';
      })
      .filter(Boolean);
  }

  if (typeof problemWords === 'string') {
    try {
      return parseProblemWords(JSON.parse(problemWords));
    } catch {
      return [];
    }
  }

  return [];
}

function levelToDots(level) {
  if (level === 'GOOD') return 4;
  if (level === 'CHECK') return 3;
  return 2;
}

function levelToTone(level) {
  if (level === 'GOOD') return 'green';
  if (level === 'CHECK') return 'orange';
  return 'blue';
}

function PronunciationPracticeSection({ result }) {
  const feedback = result?.feedback;
  const pronunciationResults = result?.pronunciationResults?.pronunciationResults ?? [];

  const averageScore = feedback?.totalScore ??
    (pronunciationResults.length
      ? Math.round(
          pronunciationResults.reduce(
            (sum, sentence) => sum + (sentence.pronunciationScore ?? 0),
            0,
          ) / pronunciationResults.length,
        )
      : 0);

  const feedbackCards = [
    {
      title: '자연스러움',
      status: feedback?.naturalnessLevel ?? 'CHECK',
      tone: levelToTone(feedback?.naturalnessLevel),
      text: feedback?.naturalnessComment ?? '자연스러움 피드백이 아직 없습니다.',
      dots: levelToDots(feedback?.naturalnessLevel),
    },
    {
      title: '응답 흐름',
      status: feedback?.flowLevel ?? 'CHECK',
      tone: levelToTone(feedback?.flowLevel),
      text: feedback?.flowComment ?? '응답 흐름 피드백이 아직 없습니다.',
      dots: levelToDots(feedback?.flowLevel),
    },
    {
      title: '발음 포인트',
      status: feedback?.pronunciationLevel ?? 'CHECK',
      tone: levelToTone(feedback?.pronunciationLevel),
      text: feedback?.pronunciationComment ?? '발음 포인트 피드백이 아직 없습니다.',
      dots: levelToDots(feedback?.pronunciationLevel),
    },
  ];

  const sentenceCards = pronunciationResults.map((sentence) => ({
    id: sentence.pronunciationResultId,
    sentence: sentence.expectedText ?? sentence.recognizedText ?? '',
    score: Math.round(sentence.pronunciationScore ?? 0),
    accuracy: `${Math.round(sentence.accuracyScore ?? 0)}%`,
    errorWords: parseProblemWords(sentence.problemWords),
    feedback: sentence.feedback ?? '문장 피드백이 아직 없습니다.',
  }));

  return (
    <section className="pronunciation-practice-section" aria-labelledby="pronunciation-title">
      <div className="coaching-feedback-board">
        <div className="coaching-feedback-intro">
          <p className="coaching-kicker">Detailed Feedback</p>
          <h2 id="pronunciation-title">상세 코칭 평가</h2>
          <p>{feedback?.summaryFeedback ?? '대화 결과를 바탕으로 상세 피드백을 정리했습니다.'}</p>
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
            <i style={{ width: `${Math.min(100, averageScore)}%` }} />
          </div>
          <p>
            발음 {Math.round(sentenceCards[0]?.score ?? averageScore)}점 ·
            문장 수 {sentenceCards.length}개
          </p>
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
        {sentenceCards.map((sentence) => (
          <PronunciationSentenceCard key={sentence.id} sentence={sentence} />
        ))}
      </div>
    </section>
  );
}

export default PronunciationPracticeSection;
