export function createTextMessage(role, speaker, text, extra = {}) {
    return {
        id: `${role}-${Date.now()}-${Math.random()}`,
        type: 'text',
        role,
        speaker,
        text,
        ...extra,
    };
}

export function createVoiceMessage({
    role = 'ai',
    speaker,
    text,
    audioUrl,
    coachingScriptTurnId,
    turnOrder,
}) {
    return {
        id: `voice-${coachingScriptTurnId ?? Date.now()}-${Math.random()}`,
        type: 'voice',
        role,
        speaker,
        text,
        audioUrl,
        coachingScriptTurnId,
        turnOrder,
    };
}

export function normalizePreviousMessages(messages = []) {
    return messages
        .map((message) => ({
            role: String(message.role ?? 'USER').toUpperCase(),
            message: message.message ?? message.text ?? '',
        }))
        .filter((message) => message.message);
}

export function mapEntryToSummary(entry, learnerName = '학습자') {
    return {
        sessionId: entry.sessionId,
        placeId: entry.placeId,
        placeName: entry.placeName,
        country: entry.country,
        city: entry.city,
        placeAddress: entry.placeAddress,
        evaluation: entry.evaluation,
        sessionMessages: entry.sessionMessages ?? [],
        learnerName,
    };
}