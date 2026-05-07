export function formatDateTime(value) {
    if (!value) {
        return '-';
    }

    return value.replace('T', ' ').slice(0, 16);
}