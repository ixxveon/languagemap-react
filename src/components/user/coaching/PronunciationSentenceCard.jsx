import { useState } from 'react';

function speakWithBrowser(word) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

async function playDictionaryPronunciation(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

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
  return sentence.split(' ').map((word) => {
    const cleanWord = word.replace(/[.,?]/g, '');
    const isError = errorWords.includes(cleanWord);

    return (
      <span key={`${word}-${cleanWord}`} className={isError ? 'is-error-word' : undefined}>
        {word}{' '}
      </span>
    );
  });
}

function PronunciationSentenceCard({ sentence }) {
  const [playingWord, setPlayingWord] = useState('');

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
      <p className="pronunciation-sentence">{highlightSentence(sentence.sentence, sentence.errorWords)}</p>
      <div className="pronunciation-error-list">
        {sentence.errorWords.map((word) => (
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
      <p className="pronunciation-feedback">{sentence.feedback}</p>
    </article>
  );
}

export default PronunciationSentenceCard;
