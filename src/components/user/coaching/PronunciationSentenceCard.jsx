import { useMemo, useState } from 'react';

function normalizeWord(word) {
  return String(word)
    .toLowerCase()
    .replace(/[.,?!:;"“”‘’()[\]{}]/g, '')
    .trim();
}

function speakWithBrowser(word) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.82;

  window.speechSynthesis.speak(utterance);
}

async function playDictionaryPronunciation(word) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
  );

  if (!response.ok) {
    throw new Error('Dictionary pronunciation not found');
  }

  const [entry] = await response.json();
  const audioUrl = entry?.phonetics?.find((phonetic) => phonetic.audio)?.audio;

  if (!audioUrl) {
    throw new Error('Pronunciation audio not found');
  }

  const audio = new Audio(audioUrl);
  await audio.play();
}

function highlightSentence(sentence, errorWords) {
  const normalizedErrorWords = errorWords.map(normalizeWord);

  return sentence.split(' ').map((word, index) => {
    const cleanWord = normalizeWord(word);
    const isError = normalizedErrorWords.includes(cleanWord);

    return (
      <span
        key={`${word}-${index}`}
        className={isError ? 'is-error-word' : undefined}
      >
        {word}{' '}
      </span>
    );
  });
}

function PronunciationSentenceCard({ sentence }) {
  const [playingWord, setPlayingWord] = useState('');

  const errorWords = useMemo(() => {
    return [...new Set((sentence.errorWords ?? []).filter(Boolean))];
  }, [sentence.errorWords]);

  const handlePlayWord = async (word) => {
    setPlayingWord(word);

    try {
      await playDictionaryPronunciation(word);
    } catch {
      speakWithBrowser(word);
    } finally {
      window.setTimeout(() => setPlayingWord(''), 500);
    }
  };

  return (
    <article className="pronunciation-sentence-card">
      <div className="pronunciation-score-line">
        <span>문장 자연도 {sentence.accuracy}</span>
        <strong>{sentence.score}점</strong>
      </div>

      <p className="pronunciation-sentence">
        {highlightSentence(sentence.sentence, errorWords)}
      </p>

      {errorWords.length > 0 ? (
        <div className="pronunciation-error-list">
          {errorWords.map((word) => (
            <span key={word} className="pronunciation-word-chip">
              {word}
              <button
                type="button"
                className={playingWord === word ? 'is-playing' : ''}
                onClick={() => handlePlayWord(word)}
                aria-label={`${word} 발음 듣기`}
                title={`${word} 발음 듣기`}
              >
                🔊
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="pronunciation-no-error">특별히 표시할 문제 단어가 없습니다.</p>
      )}

      <p className="pronunciation-feedback">{sentence.feedback}</p>
    </article>
  );
}

export default PronunciationSentenceCard;