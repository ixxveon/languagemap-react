export function createAudioFileFromBlob(audioBlob) {
    return new File([audioBlob], `coaching-${Date.now()}.webm`, {
        type: audioBlob.type || 'audio/webm',
    });
}

export function resolveAudioUrl(audioUrl) {
    if (!audioUrl) return '';

    if (audioUrl.startsWith('http')) {
        return audioUrl;
    }

    return audioUrl;
}