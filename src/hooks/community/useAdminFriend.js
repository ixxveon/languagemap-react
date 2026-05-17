import { useCallback, useEffect, useMemo, useState } from "react";
import { adminSocialService } from "../../api/admin/community/adminSocialService";
import { includesSearch } from "../../utils/community/search";
import { statusLabelMap } from "../../utils/community/statusLabels";

export const reportStatusOptions = ['RESOLVED', 'REJECTED'];

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
        reporterName: report.reporterName,
        targetId: report.reportedUserId,
        targetName: report.reportedUserName,
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
        requesterName: history.requesterName,
        addresseeId: history.addresseeId,
        addresseeName: history.addresseeName,
        status: history.status,
        requestedAt: history.requestedAt,
        respondedAt: history.respondedAt,
    };
}

export function useAdminFriend() {
    const [reports, setReports] = useState([]);
    const [friendHistories, setFriendHistories] = useState([]);
    const [friendSearch, setFriendSearch] = useState('');
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [reportDrafts, setReportDrafts] = useState({});
    const [editableReportIds, setEditableReportIds] = useState(new Set());
    const [reportError, setReportError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const filteredReports = useMemo(
        () =>
            reports.filter((report) =>
                includesSearch(
                    [
                        String(report.id),
                        String(report.reporterId),
                        report.reporterName,
                        String(report.targetId),
                        report.targetName,
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

    const isSelectedReportLocked = selectedReport
        ? reportStatusOptions.includes(selectedReport.status) && !editableReportIds.has(selectedReport.id)
        : false;

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

            await fetchFriendData();
            setReportError('');
            setEditableReportIds((currentIds) => {
                const nextIds = new Set(currentIds);
                nextIds.delete(reportId);
                return nextIds;
            });
            setFeedbackMessage('상태 변경이 완료되었습니다.');
        } catch (error) {
            console.error(error);
            setFeedbackMessage(error.response?.data?.message || '상태 변경 중 오류가 발생했습니다.');
        }
    };

    const clearFeedbackMessage = () => {
        setFeedbackMessage('');
    };

    const handleEditReportStatus = (reportId) => {
        setEditableReportIds((currentIds) => new Set(currentIds).add(reportId));
        setReportError('');
    };

    return {
        filteredReports,
        friendHistories,
        friendSearch,
        setFriendSearch,
        selectedReport,
        setSelectedReportId,
        activeReportDraft,
        reportDrafts,
        setReportDrafts,
        reportError,
        setReportError,
        feedbackMessage,
        clearFeedbackMessage,
        isSelectedReportLocked,
        loading,
        handleSaveReportStatus,
        handleEditReportStatus,
    };
}
