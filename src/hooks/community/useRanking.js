import { useEffect, useMemo, useState } from "react";
import { rankingService } from "../../api/user/rankingService";

function maskUserName(name) {
    if (!name) {
        return "익명";
    }

    if (name.length <= 1) {
        return "*";
    }

    if (name.length === 2) {
        return `${name[0]}*`;
    }

    if (name.length === 3) {
        return `${name[0]}*${name[2]}`;
    }

    return `${name.slice(0, 2)}${"*".repeat(name.length - 3)}${name.slice(-1)}`;
}

function normalizeRankingItem(item, index) {
    return {
        id: item.userId ?? index + 1,
        rank: item.rank ?? index + 1,
        userId: item.userId,
        name: maskUserName(item.userName ?? item.name),
        originalName: item.userName ?? item.name,
        score: item.totalScore ?? item.score ?? 0,
    };
}

function extractData(response) {
    if (Array.isArray(response)) {
        return response;
    }

    return response?.data ?? [];
}

function extractNumber(response) {
    if (typeof response === "number") {
        return response;
    }

    return response?.data ?? response?.totalUserCount ?? 0;
}

export function useRanking() {
    const [rankingList, setRankingList] = useState([]);
    const [friendComparisonList, setFriendComparisonList] = useState([]);
    const [myRanking, setMyRanking] = useState(null);

    const [friendBestScore, setFriendBestScore] = useState(0);
    const [friendAverageScore, setFriendAverageScore] = useState(0);
    const [totalUserCount, setTotalUserCount] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchRankingData = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const userId = 1;
                const [
                    weeklyRankingResponse,
                    myRankingResponse,
                    friendRankingResponse,
                    friendBestScoreResponse,
                    friendAverageScoreResponse,
                    totalUserCountResponse,
                ] = await Promise.all([
                    rankingService.getWeeklyRankings(),
                    rankingService.getMyRanking(userId),
                    rankingService.getFriendRankings(userId),
                    rankingService.getFriendBestScore(userId),
                    rankingService.getFriendAverageScore(userId),
                    rankingService.getTotalUserCount(),
                ]);

                const weeklyRanking = extractData(weeklyRankingResponse).map(normalizeRankingItem);
                const friendRanking = extractData(friendRankingResponse).map((item, index) => ({
                    ...normalizeRankingItem(item, index),
                    focus: "학습",
                    streak: "-",
                }));

                const normalizedMyRanking = myRankingResponse?.data
                    ? normalizeRankingItem(myRankingResponse.data, 0)
                    : null;

                setRankingList(weeklyRanking);
                setFriendComparisonList(friendRanking);
                setMyRanking(normalizedMyRanking);
                setFriendBestScore(extractNumber(friendBestScoreResponse));
                setFriendAverageScore(Math.round(extractNumber(friendAverageScoreResponse)));
                setTotalUserCount(extractNumber(totalUserCountResponse));
            } catch (error) {
                console.error("사용자 랭킹 조회 실패", error);
                setErrorMessage("랭킹 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRankingData();
    }, []);

    const topFriend = useMemo(() => {
        if (friendComparisonList.length === 0) {
            return null;
        }

        return friendComparisonList.reduce((best, current) =>
            current.score > best.score ? current : best,
        );
    }, [friendComparisonList]);

    const rankingStats = useMemo(
        () => [
            {
                label: "내 현재 순위",
                value: myRanking ? `${myRanking.rank}위` : "-",
                hint: myRanking
                    ? `전체 사용자 중 ${myRanking.score}점`
                    : "순위 정보 없음",
            },
            {
                label: "가장 높은 친구 점수",
                value: topFriend ? `${topFriend.name} ${topFriend.score}점` : "-",
                hint: topFriend
                    ? `${topFriend.streak}일 연속 학습 중`
                    : "친구 랭킹 정보 없음",
            },
            {
                label: "친구 평균 점수",
                value: `${friendAverageScore}점`,
                hint: "친구 비교 카드에서 자세히 볼 수 있어요",
            },
        ],
        [myRanking, topFriend, friendAverageScore],
    );

    return {
        rankingList,
        friendComparisonList,
        myRanking,
        friendBestScore,
        friendAverageScore,
        totalUserCount,
        rankingStats,
        isLoading,
        errorMessage,
    };
}