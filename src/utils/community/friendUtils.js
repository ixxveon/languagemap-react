export function formatDate(dateString) {
    if (!dateString) return '-';
    const [date] = dateString.split(' ');
    return date.replaceAll('-', '.');
}

export function getStatusLabel(status) {
    if (status === 'ACCEPTED') return '친구';
    if (status === 'PENDING') return '대기 중';
    if (status === 'REJECTED') return '거절됨';
    if (status === 'BLOCKED') return '차단됨';
    if (status === 'RESOLVED') return '처리 완료';
    return '접수됨';
}

export function getStatusTone(status) {
    if (status === 'ACCEPTED' || status === 'RESOLVED') return 'success';
    if (status === 'PENDING') return 'info';
    if (status === 'BLOCKED' || status === 'REJECTED') return 'danger';
    return 'muted';
}

export function getLevelTone(levelNumber) {
    if (levelNumber >= 40) return 'violet';
    if (levelNumber >= 30) return 'sky';
    if (levelNumber >= 20) return 'mint';
    return 'lime';
}