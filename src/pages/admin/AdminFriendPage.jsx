import { useEffect, useMemo, useState } from 'react';
import { adminSocialService } from '../../api/admin/community/adminSocialService';
import { formatDateTime } from '../community/utils/formatDateTime';
import { includesSearch } from '../community/utils/search';
import { statusClassMap, statusLabelMap } from '../community/utils/statusLabels';
import '../../styles/admin/AdminFriendPage.css';

const reportStatusOptions = ['RESOLVED', 'REJECTED'];

function getDefaultReportStatus(status) {
    if (reportStatusOptions.includes(status)) {
        return status;
    }

    return 'RESOLVED';
}

function normalizeReport(report) {
    return {
        id: report.reportId,
        reporterId: report.reporterId,
        targetId: report.reportedUserId,
        reason: report.reason,
        status: report.status,
        createdAt: report.createdAt,
        processedAt: report.processedAt,
        adminMemo: report.adminMemo ?? '',
    };
}

function normalizeFriendship(history) {
    return {
        id: history.friendshipId,
        requesterId: history.requesterId,
        addresseeId: history.addresseeId,
        status: history.status,
        requestedAt: history.requestedAt,
        respondedAt: history.respondedAt,
    };
}

function AdminFriendPage() {
    const [reports, setReports] = useState([]);
    const [friendHistories, setFriendHistories] = useState([]);
    const [friendSearch, setFriendSearch] = useState('');
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [reportDrafts, setReportDrafts] = useState({});
    const [reportError, setReportError] = useState('');
    const [loading, setLoading] = useState(false);

    const filteredReports = useMemo(
        () =>
            reports.filter((report) =>
                includesSearch(
                    [
                        String(report.id),
                        String(report.reporterId),
                        String(report.targetId),
                        report.reason,
                        statusLabelMap[report.status] ?? report.status,
                        report.adminMemo,
                    ],
                    friendSearch,
                ),
            ),
        [friendSearch, reports],
    );

    const selectedReport =
        reports.find((report) => report.id === selectedReportId) ?? filteredReports[0] ?? null;

    const activeReportDraft = selectedReport
        ? reportDrafts[selectedReport.id] ?? {
            status: getDefaultReportStatus(selectedReport.status),
            adminMemo: selectedReport.adminMemo ?? '',
        }
        : {
            status: 'RESOLVED',
            adminMemo: '',
        };

    const fetchFriendData = async () => {
        try {
            setLoading(true);
            setReportError('');

            const [reportData, blockedData, rejectedData] = await Promise.all([
                adminSocialService.getReports(),
                adminSocialService.getBlockedFriendships(),
                adminSocialService.getRejectedFriendships(),
            ]);

            const normalizedReports = (reportData ?? []).map(normalizeReport);
            const normalizedBlockedHistories = (blockedData ?? []).map(normalizeFriendship);
            const normalizedRejectedHistories = (rejectedData ?? []).map(normalizeFriendship);

            setReports(normalizedReports);
            setFriendHistories([...normalizedBlockedHistories, ...normalizedRejectedHistories]);

            if (normalizedReports.length > 0) {
                setSelectedReportId((currentId) => currentId ?? normalizedReports[0].id);
            }
        } catch (error) {
            console.error(error);
            setReportError('친구 관리 데이터를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendData();
    }, []);

    const handleSaveReportStatus = async (reportId) => {
        const targetReport = reports.find((report) => report.id === reportId);

        if (!targetReport) {
            return;
        }

        const draft = reportDrafts[reportId] ?? {
            status: getDefaultReportStatus(targetReport.status),
            adminMemo: targetReport.adminMemo ?? '',
        };

        const trimmedMemo = draft.adminMemo.trim();

        if (!trimmedMemo) {
            setReportError('상태 변경 시 관리자 메모를 입력해야 합니다.');
            return;
        }

        try {
            await adminSocialService.updateReportStatus(reportId, {
                status: draft.status,
                adminMemo: trimmedMemo,
            });

            alert('신고 상태가 변경되었습니다.');
            await fetchFriendData();
            setReportError('');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || '신고 상태 변경 중 오류가 발생했습니다.');
        }
    };

    return (
        <section className="mapingo-page-section admin-friend-page">
            <div className="mapingo-admin-grid admin-content-layout">
                <div className="mapingo-list-card admin-friend-report-list">
                    <div className="mapingo-card-header-row admin-result-head">
                        <div>
                            <h3>소셜 신고 목록</h3>
                            <p className="mapingo-muted-copy">
                                소셜 신고 목록을 선택하면 오른쪽에서 상세 조회와 상태 변경을 진행합니다.
                            </p>
                        </div>

                        <span className="mapingo-inline-badge">{filteredReports.length}건</span>
                    </div>

                    <input
                        className="mapingo-input admin-notice-search"
                        type="search"
                        value={friendSearch}
                        onChange={(event) => setFriendSearch(event.target.value)}
                        placeholder="신고 ID, 사용자 ID, 신고 사유 검색"
                    />

                    {loading ? <p className="mapingo-muted-copy">데이터를 불러오는 중입니다.</p> : null}

                    <div className="mapingo-selectable-list">
                        {filteredReports.map((report) => (
                            <button
                                key={report.id}
                                type="button"
                                className={`mapingo-post-card admin-content-card admin-friend-report-card ${selectedReport?.id === report.id ? 'is-selected' : ''
                                    }`}
                                onClick={() => {
                                    setSelectedReportId(report.id);
                                    setReportError('');
                                }}
                            >
                                <div className="mapingo-admin-item-head">
                                    <div>
                                        <strong>신고 #{report.id}</strong>
                                        <p>
                                            사용자 #{report.reporterId} · {formatDateTime(report.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`admin-notice-status ${statusClassMap[report.status] ?? 'is-draft'
                                            }`}
                                    >
                                        {statusLabelMap[report.status] ?? report.status}
                                    </span>
                                </div>

                                <p className="admin-content-description">{report.reason}</p>
                            </button>
                        ))}

                        {!loading && filteredReports.length === 0 ? (
                            <div className="admin-content-empty-state">신고 내역이 없습니다.</div>
                        ) : null}
                    </div>
                </div>

                <div className="mapingo-form-card">
                    <div className="mapingo-card-header-row admin-builder-head">
                        <div>
                            <h3>신고 상세 조회</h3>
                            <p className="mapingo-muted-copy">
                                상태 변경과 관리자 메모 입력을 이 영역에서 처리합니다.
                            </p>
                        </div>
                    </div>

                    {selectedReport ? (
                        <section className="admin-entity-section admin-friend-detail-panel">
                            <div className="admin-entity-head">
                                <strong>신고 #{selectedReport.id}</strong>

                                <span
                                    className={`admin-notice-status ${statusClassMap[selectedReport.status] ?? 'is-draft'
                                        }`}
                                >
                                    {statusLabelMap[selectedReport.status] ?? selectedReport.status}
                                </span>
                            </div>

                            <div className="mapingo-admin-meta-grid admin-friend-detail-grid">
                                <p>
                                    <strong>신고자</strong>
                                    사용자 #{selectedReport.reporterId}
                                </p>

                                <p>
                                    <strong>대상자</strong>
                                    사용자 #{selectedReport.targetId}
                                </p>

                                <p>
                                    <strong>접수일</strong>
                                    {formatDateTime(selectedReport.createdAt)}
                                </p>

                                <p>
                                    <strong>처리일</strong>
                                    {formatDateTime(selectedReport.processedAt)}
                                </p>
                            </div>

                            <label className="mapingo-field">
                                <span className="mapingo-field-label">신고 사유</span>

                                <textarea
                                    className="mapingo-input mapingo-admin-textarea admin-friend-readonly-textarea"
                                    value={selectedReport.reason}
                                    readOnly
                                />
                            </label>

                            <div className="admin-content-form-grid admin-friend-form-grid">
                                <label className="mapingo-field">
                                    <span className="mapingo-field-label">신고 상태</span>

                                    <select
                                        className="mapingo-input"
                                        value={activeReportDraft.status}
                                        onChange={(event) => {
                                            setReportDrafts((currentDrafts) => ({
                                                ...currentDrafts,
                                                [selectedReport.id]: {
                                                    status: event.target.value,
                                                    adminMemo: activeReportDraft.adminMemo,
                                                },
                                            }));

                                            setReportError('');
                                        }}
                                    >
                                        {reportStatusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {statusLabelMap[status] ?? status}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <label className="mapingo-field">
                                <span className="mapingo-field-label">관리자 메모</span>

                                <textarea
                                    className="mapingo-input mapingo-admin-textarea admin-friend-memo-textarea"
                                    value={activeReportDraft.adminMemo}
                                    onChange={(event) => {
                                        setReportDrafts((currentDrafts) => ({
                                            ...currentDrafts,
                                            [selectedReport.id]: {
                                                status: activeReportDraft.status,
                                                adminMemo: event.target.value,
                                            },
                                        }));

                                        setReportError('');
                                    }}
                                    placeholder="상태 변경 사유 또는 처리 메모를 입력하세요"
                                />
                            </label>

                            {reportError ? (
                                <p className="mapingo-muted-copy">{reportError}</p>
                            ) : null}

                            <div className="mapingo-admin-action-row">
                                <button
                                    type="button"
                                    className="mapingo-submit-button"
                                    onClick={() => handleSaveReportStatus(selectedReport.id)}
                                >
                                    상태 변경 저장
                                </button>
                            </div>
                        </section>
                    ) : (
                        <div className="admin-content-empty-state">
                            선택된 신고가 없습니다.
                        </div>
                    )}
                </div>
            </div>

            <div className="mapingo-list-card admin-friend-history-list">
                <div className="mapingo-card-header-row admin-result-head">
                    <div>
                        <h3>차단 / 거절 이력 조회</h3>

                        <p className="mapingo-muted-copy">
                            요청자, 대상자, 상태, 요청일, 응답일을 조회 전용으로 확인합니다.
                        </p>
                    </div>

                    <span className="mapingo-inline-badge">
                        {friendHistories.length}건
                    </span>
                </div>

                <div className="admin-entity-stack admin-growth-stack admin-friend-history-stack">
                    {friendHistories.map((friend) => (
                        <article
                            key={friend.id}
                            className="mapingo-post-card admin-content-card admin-friend-history-card"
                        >
                            <div className="mapingo-admin-item-head">
                                <div>
                                    <strong>
                                        요청자 #{friend.requesterId} → 사용자 #{friend.addresseeId}
                                    </strong>

                                    <p>
                                        요청일 {formatDateTime(friend.requestedAt)} · 응답일{' '}
                                        {formatDateTime(friend.respondedAt)}
                                    </p>
                                </div>

                                <span
                                    className={`admin-notice-status ${statusClassMap[friend.status] ?? 'is-draft'
                                        }`}
                                >
                                    {statusLabelMap[friend.status] ?? friend.status}
                                </span>
                            </div>

                            <div className="admin-friend-history-meta">
                                <span>요청자 사용자 #{friend.requesterId}</span>
                                <span>대상자 사용자 #{friend.addresseeId}</span>
                                <span>요청일 {formatDateTime(friend.requestedAt)}</span>
                                <span>응답일 {formatDateTime(friend.respondedAt)}</span>
                            </div>
                        </article>
                    ))}

                    {!loading && friendHistories.length === 0 ? (
                        <div className="admin-content-empty-state">
                            차단 / 거절 이력이 없습니다.
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default AdminFriendPage;