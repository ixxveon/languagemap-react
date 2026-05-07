function ChatPanel({
    chatLog,
    chatInput,
    chatCompleted,
    onChatInputChange,
    onSendMessage,
    onBackToDetail,
    onClosePanel,
    onOpenCoaching,
    chatLogRef,
}) {
    return (

        <div className="map-domain-panel-inner map-domain-panel-chat map-domain-chat-reference">
            <div className="map-domain-panel-top map-domain-chat-head">
                <div>
                    <p className="map-domain-panel-kicker map-domain-chat-title">AI Chat Room</p>
                </div>
                <div className="map-domain-chat-head-actions">
                    <button
                        type="button"
                        className="map-domain-close-button map-domain-chat-back"
                        onClick={onBackToDetail}
                        aria-label="Back to detail panel"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        className="map-domain-close-button map-domain-chat-close"
                        onClick={onClosePanel}
                        aria-label="Close place panel"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div className="map-domain-chat-surface">
                <div className="map-domain-live-chat-log map-domain-reference-log" ref={chatLogRef}>
                    {chatLog.map((message, index) => (
                        <article key={`${message.role}-${index}`} className={`map-domain-message-row is-${message.role}`}>
                            {message.role === 'ai' ? (
                                <div className="map-domain-message-avatar" aria-hidden="true">
                                    {index === 0 ? 'AI' : '✦'}
                                </div>
                            ) : null}

                            <div className={`map-domain-message-card is-${message.role}`}>
                                {message.role === 'ai' ? (
                                    <strong className="map-domain-message-speaker">{message.speaker}</strong>
                                ) : null}
                                <p>{message.text}</p>
                                {message.kind === 'evaluation' ? (
                                    <div className="map-domain-follow-up-actions">
                                        <button
                                            type="button"
                                            className="map-domain-follow-up-button"
                                            onClick={onOpenCoaching}
                                        >
                                            더 알아보기
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </article>
                    ))}

                    {!chatCompleted ? (
                        <div className="map-domain-chat-typing" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="map-domain-chat-inputbar">
                <input
                    className="map-domain-chat-input"
                    value={chatInput}
                    disabled={chatCompleted}
                    onChange={(event) => onChatInputChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            onSendMessage();
                        }
                    }}
                    placeholder={chatCompleted ? '아래 더 알아보기 버튼으로 이어서 연습할 수 있어요.' : 'Type your message...'}
                />
                <button
                    type="button"
                    className="map-domain-chat-send"
                    onClick={onSendMessage}
                    aria-label="Send"
                    disabled={chatCompleted}
                >
                    ➤
                </button>
            </div>
        </div>
    )
}

export default ChatPanel;