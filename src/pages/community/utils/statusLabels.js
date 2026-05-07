export const statusLabelMap = {
    PENDING: '처리 대기',
    RESOLVED: '처리 완료',
    REJECTED: '반려',
    ACCEPTED: '수락',
    BLOCKED: '차단',
};

export const statusClassMap = {
    PENDING: 'is-reserved',
    RESOLVED: 'is-published',
    ACCEPTED: 'is-published',
    BLOCKED: 'is-draft',
    REJECTED: 'is-draft',
};