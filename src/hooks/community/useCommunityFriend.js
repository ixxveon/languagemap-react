import { useEffect, useMemo, useState } from 'react';
import { friendService } from '../../api/user/friendService';
import { socialReportService } from '../../api/user/socialReportService';
import { useMapingoStore } from '../../store/user/useMapingoStore';

const getResponseData = (response) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    return [];
};

const normalizeRelation = (row) => ({
    friendship_id: row.friendship_id ?? row.friendshipId,
    requester_id: row.requester_id ?? row.requesterId,
    addressee_id: row.addressee_id ?? row.addresseeId,
    requester_name:
        row.requester_name ?? row.requesterName ?? `사용자 ${row.requesterId}`,
    requester_email: row.requester_email ?? row.requesterEmail ?? '-',
    addressee_name:
        row.addressee_name ?? row.addresseeName ?? `사용자 ${row.addresseeId}`,
    addressee_email: row.addressee_email ?? row.addresseeEmail ?? '-',
    status: row.status,
    requested_at: row.requested_at ?? row.requestedAt,
    responded_at: row.responded_at ?? row.respondedAt,
});

const normalizeRecommendUser = (row) => ({
    userId: row.userId ?? row.user_id,
    name: row.name,
    email: row.email,
    levelLabel: row.levelLabel ?? `Lv.${row.levelNumber ?? row.level ?? 1}`,
    levelNumber: row.levelNumber ?? row.level ?? 1,
    goalText: row.goalText ?? row.goal ?? '학습 목표 정보가 없어요.',
    badgeText: row.badgeText ?? row.badge ?? '기본 배지',
    matchLabel: row.matchLabel ?? '추천 친구',
    reason: row.reason ?? '학습 패턴이 비슷해요.',
});

const normalizeReport = (row, fallback = {}) => ({
    report_id: row.report_id ?? row.reportId ?? row.id ?? fallback.reportId,
    reporter_id: row.reporter_id ?? row.reporterId ?? fallback.reporterId,
    reported_user_id:
        row.reported_user_id ?? row.reportedUserId ?? row.targetId ?? fallback.reportedUserId,
    reason: row.reason ?? fallback.reason,
    status: row.status ?? 'PENDING',
    created_at: row.created_at ?? row.createdAt ?? fallback.createdAt,
    processed_at: row.processed_at ?? row.processedAt ?? null,
    admin_memo: row.admin_memo ?? row.adminMemo ?? '',
});

const getCachedUserDirectory = () => {
    try {
        return JSON.parse(sessionStorage.getItem('communityUserDirectory') ?? '{}');
    } catch {
        return {};
    }
};

const setCachedUserDirectory = (directory) => {
    sessionStorage.setItem('communityUserDirectory', JSON.stringify(directory));
};

export function useCommunityFriends() {
    const sessionUserId = useMapingoStore((state) => state.session?.user?.userId);
    const [friendshipRows, setFriendshipRows] = useState([]);
    const [recommendedFriends, setRecommendedFriends] = useState([]);
    const [userReportRows, setUserReportRows] = useState([]);

    const [inviteQuery, setInviteQuery] = useState('');
    const [reportTargetId, setReportTargetId] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const currentUserId = Number(sessionUserId ?? localStorage.getItem('userId')) || 1;

    const loadFriendData = async () => {
        try {
            setIsLoading(true);

            const [friends, received, sent, history, recommends, reports] = await Promise.all([
                friendService.getFriends(currentUserId),
                friendService.getReceivedFriendRequests(currentUserId),
                friendService.getSentFriendRequests(currentUserId),
                friendService.getFriendHistory(currentUserId),
                friendService.getRecommendFriends(currentUserId),
                socialReportService.getReportHistory(currentUserId),
            ]);

            const relationRows = [
                ...getResponseData(friends),
                ...getResponseData(received),
                ...getResponseData(sent),
                ...getResponseData(history),
            ].map(normalizeRelation);

            const uniqueRelationRows = relationRows.filter(
                (row, index, self) =>
                    row.friendship_id &&
                    index === self.findIndex(
                        (item) => item.friendship_id === row.friendship_id,
                    ),
            );

            const relatedUserIds = new Set(
                relationRows.flatMap((relation) => [
                    relation.requester_id,
                    relation.addressee_id,
                ]),
            );

            const recommendRows = getResponseData(recommends)
                .map(normalizeRecommendUser)
                .filter(
                    (user) =>
                        user.userId &&
                        user.userId !== currentUserId &&
                        !relatedUserIds.has(user.userId),
                );
            const cachedDirectory = getCachedUserDirectory();

            relationRows.forEach((relation) => {
                const requester = cachedDirectory[relation.requester_id];
                const addressee = cachedDirectory[relation.addressee_id];

                if (requester) {
                    relation.requester_name = requester.name ?? relation.requester_name;
                    relation.requester_email = requester.email ?? relation.requester_email;
                }

                if (addressee) {
                    relation.addressee_name = addressee.name ?? relation.addressee_name;
                    relation.addressee_email = addressee.email ?? relation.addressee_email;
                }
            });

            setFriendshipRows(uniqueRelationRows);
            setRecommendedFriends(recommendRows);
            setUserReportRows(getResponseData(reports).map(normalizeReport));

            if (recommendRows.length > 0 && !reportTargetId) {
                setReportTargetId(String(recommendRows[0].userId));
            }
        } catch (error) {
            console.error(error);
            setFeedbackMessage('친구 정보를 불러오지 못했어요.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFriendData();
    }, []);

    const acceptedFriends = useMemo(
        () => friendshipRows.filter((row) => row.status === 'ACCEPTED'),
        [friendshipRows],
    );

    const pendingRequests = useMemo(
        () => friendshipRows.filter((row) => row.status === 'PENDING'),
        [friendshipRows],
    );

    const archivedRelations = useMemo(
        () =>
            friendshipRows.filter((row) =>
                ['REJECTED', 'BLOCKED'].includes(row.status),
            ),
        [friendshipRows],
    );

    const availableUsers = useMemo(() => recommendedFriends, [recommendedFriends]);

    const userDirectory = useMemo(() => {
        const directory = {};

        recommendedFriends.forEach((user) => {
            if (!user.userId) return;
            directory[user.userId] = user;
        });

        friendshipRows.forEach((relation) => {
            if (relation.requester_id) {
                directory[relation.requester_id] = {
                    userId: relation.requester_id,
                    name: relation.requester_name,
                    email: relation.requester_email,
                };
            }

            if (relation.addressee_id) {
                directory[relation.addressee_id] = {
                    userId: relation.addressee_id,
                    name: relation.addressee_name,
                    email: relation.addressee_email,
                };
            }
        });

        const mergedDirectory = {
            ...getCachedUserDirectory(),
            ...directory,
        };

        setCachedUserDirectory(mergedDirectory);
        return mergedDirectory;
    }, [friendshipRows, recommendedFriends]);

    const sendFriendRequest = async (targetUserId) => {
        try {
            const targetUser = recommendedFriends.find(
                (user) => user.userId === targetUserId,
            );

            if (targetUser) {
                setCachedUserDirectory({
                    ...getCachedUserDirectory(),
                    [targetUser.userId]: targetUser,
                });
            }

            await friendService.sendFriendRequest({
                addresseeId: targetUserId,
            }, currentUserId);

            await loadFriendData();

            setFeedbackMessage(
                targetUser
                    ? `${targetUser.name}님에게 친구 요청을 보냈어요.`
                    : '친구 요청을 보냈어요.',
            );
        } catch (error) {
            console.error(error);
            setFeedbackMessage('친구 요청에 실패했어요.');
        }
    };

    const handleInvite = async () => {
        const normalizedQuery = inviteQuery.trim();

        if (!normalizedQuery) {
            setFeedbackMessage('닉네임이나 이메일을 입력해 주세요.');
            return;
        }

        try {
            if (normalizedQuery.includes('@')) {
                await friendService.sendFriendRequestByEmail({
                    email: normalizedQuery,
                }, currentUserId);

                await loadFriendData();
                setInviteQuery('');
                setFeedbackMessage('이메일로 친구 요청을 보냈어요.');
                return;
            }

            const targetUser = recommendedFriends.find((user) =>
                user.name?.toLowerCase().includes(normalizedQuery.toLowerCase()),
            );

            if (!targetUser) {
                setFeedbackMessage('일치하는 사용자를 찾지 못했어요.');
                return;
            }

            await sendFriendRequest(targetUser.userId);
            setInviteQuery('');
        } catch (error) {
            console.error(error);
            setFeedbackMessage('친구 요청에 실패했어요.');
        }
    };

    const handleAccept = async (friendshipId) => {
        try {
            await friendService.acceptFriendRequest(friendshipId, currentUserId);
            await loadFriendData();
            setFeedbackMessage('친구 요청을 수락했어요.');
        } catch (error) {
            console.error(error);
            setFeedbackMessage('친구 요청 수락에 실패했어요.');
        }
    };

    const handleReject = async (friendshipId) => {
        try {
            await friendService.rejectFriendRequest(friendshipId, currentUserId);
            await loadFriendData();
            setFeedbackMessage('친구 요청을 거절했어요.');
        } catch (error) {
            console.error(error);
            setFeedbackMessage('친구 요청 거절에 실패했어요.');
        }
    };

    const handleDelete = async (friendshipId) => {
        try {
            await friendService.deleteFriend(friendshipId, currentUserId);
            await loadFriendData();
            setFeedbackMessage('친구 관계 또는 요청을 취소했어요.');
        } catch (error) {
            console.error(error);
            setFeedbackMessage('친구 삭제 또는 요청 취소에 실패했어요.');
        }
    };

    const handleBlock = async (friendshipId) => {
        try {
            await friendService.blockFriend(friendshipId, currentUserId);
            await loadFriendData();
            setFeedbackMessage('친구를 차단했어요. 차단 이력에서 확인할 수 있어요.');
        } catch (error) {
            console.error(error);
            setFeedbackMessage('친구 차단에 실패했어요.');
        }
    };

    const handleSubmitReport = async () => {
        const reportedUserId = Number(reportTargetId);
        const reason = reportReason.trim();

        if (!reportedUserId) {
            setFeedbackMessage('신고할 사용자를 선택해 주세요.');
            return;
        }

        if (!reason) {
            setFeedbackMessage('신고 사유를 입력해 주세요.');
            return;
        }

        try {
            const payload = {
                reporterId: currentUserId,
                reportedUserId,
                reason,
            };
            const response = await socialReportService.createReport(payload);
            const createdReport = normalizeReport(response?.data ?? response, {
                reportId: Date.now(),
                reporterId: currentUserId,
                reportedUserId,
                reason,
                createdAt: new Date().toISOString(),
            });

            setUserReportRows((prevRows) => [createdReport, ...prevRows]);
            setReportReason('');
            setFeedbackMessage('신고가 접수됐어요.');
        } catch (error) {
            console.error(error);
            setFeedbackMessage('신고 접수에 실패했어요.');
        }
    };

    return {
        currentUserId,
        userDirectory,
        acceptedFriends,
        pendingRequests,
        archivedRelations,
        availableUsers,
        recommendedFriends,
        userReportRows,
        inviteQuery,
        reportTargetId,
        reportReason,
        feedbackMessage,
        isLoading,
        setInviteQuery,
        setReportTargetId,
        setReportReason,
        sendFriendRequest,
        handleInvite,
        handleAccept,
        handleReject,
        handleDelete,
        handleBlock,
        handleSubmitReport,
        clearFeedbackMessage: () => setFeedbackMessage(''),
    };
}
