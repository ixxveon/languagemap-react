import { useEffect, useMemo, useState } from "react";
import { rankingService } from "../../api/user/rankingService";
import { useMapingoStore } from "../../store/user/useMapingoStore";

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
    id: item.userId ?? item.user_id ?? item.id ?? index + 1,
    rank: item.rank ?? index + 1,
    userId: item.userId ?? item.user_id ?? item.id ?? null,
    name: maskUserName(item.userName ?? item.name ?? item.nickname),
    originalName: item.userName ?? item.name ?? item.nickname ?? "",
    score: item.totalScore ?? item.weeklyScore ?? item.score ?? 0,
  };
}

function extractData(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.result)) {
    return response.result;
  }

  return [];
}

function extractNumber(response) {
  if (typeof response === "number") {
    return response;
  }

  if (typeof response?.data === "number") {
    return response.data;
  }

  if (typeof response?.result === "number") {
    return response.result;
  }

  return response?.totalUserCount ?? 0;
}

function extractObject(response) {
  if (!response || Array.isArray(response)) {
    return null;
  }

  if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
    return response.data;
  }

  if (response.result && typeof response.result === "object" && !Array.isArray(response.result)) {
    return response.result;
  }

  return typeof response === "object" ? response : null;
}

export function useRanking() {
  const sessionUserId = useMapingoStore((state) => state.session?.user?.userId);

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
      const userId = Number(sessionUserId ?? localStorage.getItem("userId"));

      if (!userId) {
        setRankingList([]);
        setFriendComparisonList([]);
        setMyRanking(null);
        setFriendBestScore(0);
        setFriendAverageScore(0);
        setTotalUserCount(0);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
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
        }));
        const myRankingData = extractObject(myRankingResponse);
        const normalizedMyRanking = myRankingData
          ? normalizeRankingItem(myRankingData, 0)
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
  }, [sessionUserId]);

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
        hint: myRanking ? "주간 랭킹 기준 내 위치" : "이번 주 순위 정보 없음",
      },
      {
        label: "가장 높은 친구 점수",
        value: topFriend ? `${topFriend.name} ${topFriend.score}점` : "-",
        hint: topFriend ? "친구 그룹 최고 기록" : "비교할 친구 데이터 없음",
      },
      {
        label: "친구 평균 점수",
        value: `${friendAverageScore}점`,
        hint: "함께 학습하는 친구들의 평균 기록",
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
