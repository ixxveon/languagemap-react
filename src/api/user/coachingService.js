async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    const error = new Error(payload?.message ?? 'AI Coaching 요청에 실패했습니다.');
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload?.data ?? payload;
}

export function getCoachingEntry(sessionId) {
  return request(`/api/coaching/entry/${sessionId}`);
}

export function startCoachingFlow({ sessionId, optionType }) {
  return request('/api/coaching/flow/start', {
    method: 'POST',
    body: JSON.stringify({ sessionId, optionType }),
  });
}

export function prepareCoachingScript({
  sessionId,
  optionType,
  placeName,
  country,
  city,
  placeAddress,
  evaluation,
  previousMessages,
}) {
  return request('/api/coaching/conversation/script', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      optionType,
      placeName,
      country,
      city,
      placeAddress,
      evaluation,
      previousMessages,
    }),
  });
}

export function startConversation(coachingSessionId) {
  return request(`/api/coaching/conversation/${coachingSessionId}/start`, {
    method: 'POST',
  });
}

export async function processUserSpeech(coachingSessionId, audioFile) {
  const formData = new FormData();
  formData.append('audioFile', audioFile, audioFile.name ?? 'speech.webm');

  return request(`/api/coaching/conversation/${coachingSessionId}/speech`, {
    method: 'POST',
    body: formData,
  });
}

export function finishConversation(coachingSessionId) {
  return request(`/api/coaching/conversation/${coachingSessionId}/finish`, {
    method: 'POST',
  });
}

export function getCoachingMessages(coachingSessionId) {
  return request(`/api/coaching/messages/${coachingSessionId}`);
}

export const coachingService = {
  getCoachingEntry,
  startCoachingFlow,
  prepareCoachingScript,
  startConversation,
  processUserSpeech,
  finishConversation,
  getCoachingMessages,
};