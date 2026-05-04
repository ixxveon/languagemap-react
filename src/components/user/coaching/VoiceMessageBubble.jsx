function VoiceMessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <article className={`coaching-message-row ${isUser ? 'is-user' : 'is-ai'}`}>
      {!isUser && <div className="coaching-avatar">AI</div>}
      <div className={`voice-message-bubble ${isUser ? 'is-user' : 'is-ai'}`}>
        <div className="voice-message-meta">
          <span>{message.speaker}</span>
          <small>{message.duration}</small>
        </div>
        <div className="voice-message-body">
          <button type="button" className="voice-play-button" aria-label={`${message.speaker} 음성 재생`}>
            ▶
          </button>
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
      </div>
    </article>
  );
}

export default VoiceMessageBubble;
