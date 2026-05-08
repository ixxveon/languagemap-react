import { useRef, useState } from 'react';

function VoiceMessageBubble({ message }) {
  const [playStatus, setPlayStatus] = useState('idle');
  const audioRef = useRef(null);

  const isUser = message.role === 'user';

  // 음성 재생/중지 처리
  const handlePlay = async () => {
    if (!message.audioUrl) return;

    try {
      // 이미 재생 중이면 중지하고 처음 상태로 되돌림
      if (audioRef.current && playStatus === 'playing') {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setPlayStatus('idle');
        return;
      }

      const audio = new Audio(message.audioUrl);
      audioRef.current = audio;

      setPlayStatus('loading');

      // 오디오 재생 상태에 따라 UI 상태 변경
      audio.onplay = () => setPlayStatus('playing');
      audio.onended = () => setPlayStatus('ended');
      audio.onerror = () => setPlayStatus('error');

      await audio.play();
    } catch {
      setPlayStatus('error');
    }
  };

  // 현재 재생 상태에 따라 버튼 표시 문구 변경
  const playLabel = {
    idle: '▶',
    loading: '…',
    playing: '■',
    ended: '↻',
    error: '!',
  }[playStatus];

  return (
    <article className={`coaching-message-row ${isUser ? 'is-user' : 'is-ai'}`}>
      {!isUser && <div className="coaching-avatar">AI</div>}

      <div className={`voice-message-bubble ${isUser ? 'is-user' : 'is-ai'} ${playStatus === 'playing' ? 'is-playing' : ''}`}>
        <div className="voice-message-meta">
          <span>{message.speaker}</span>
          <small>{message.turnOrder ? `TURN ${message.turnOrder}` : message.duration ?? 'VOICE'}</small>
        </div>

        <div className="voice-message-body">
          <button
            type="button"
            className={`voice-play-button ${playStatus === 'playing' ? 'is-playing' : ''}`}
            aria-label={`${message.speaker} 음성 재생`}
            onClick={handlePlay}
            disabled={playStatus === 'loading'}
          >
            {playLabel}
          </button>

          {/* 음성 메시지의 파형 UI */}
          <div className="voice-wave" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <p>{message.text}</p>

        {/* 음성 파일 재생 실패 안내 */}
        {playStatus === 'error' ? (
          <small className="voice-error-text">음성 파일을 재생할 수 없습니다.</small>
        ) : null}
      </div>
    </article>
  );
}

export default VoiceMessageBubble;