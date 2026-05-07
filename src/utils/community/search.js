export function includesSearch(fields, query) {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return true;
    }

    return fields.join(' ').toLowerCase().includes(normalizedQuery);
}