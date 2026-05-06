export function parseProblemWords(problemWords) {
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

export function levelToDots(level) {
    if (level === 'GOOD') return 4;
    if (level === 'CHECK') return 3;
    return 2;
}

export function levelToTone(level) {
    if (level === 'GOOD') return 'green';
    if (level === 'CHECK') return 'orange';
    return 'blue';
}

export function toRoundedScore(score, fallback = 0) {
    if (score === null || score === undefined || Number.isNaN(Number(score))) {
        return fallback;
    }

    return Math.round(Number(score));
}