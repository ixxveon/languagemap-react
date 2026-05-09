import { useCallback, useEffect, useMemo, useState } from 'react';
import { learningService } from '../../api/user/learningService';

const MAX_ACTIVE_GOALS = 3;
const INITIAL_AVAILABLE_GOAL_COUNT = 2;
const GOAL_PAGE_SIZE = 2;

function isGoalAchieved(goal) {
    return goal.currentValue >= goal.targetValue;
}

export function useLearningGoals() {
    const [availableGoals, setAvailableGoals] = useState([]);
    const [activeGoals, setActiveGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [visibleAvailableGoalCount, setVisibleAvailableGoalCount] = useState(
        INITIAL_AVAILABLE_GOAL_COUNT,
    );
    const [loading, setLoading] = useState(false);

    const visibleAvailableGoals = useMemo(
        () => availableGoals.slice(0, visibleAvailableGoalCount),
        [availableGoals, visibleAvailableGoalCount],
    );

    const hasMoreAvailableGoals =
        visibleAvailableGoalCount < availableGoals.length;

    const selectedGoalMasterIds = useMemo(
        () => activeGoals.map((goal) => goal.goalMasterId),
        [activeGoals],
    );

    const inProgressGoals = useMemo(
        () => activeGoals.filter((goal) => !isGoalAchieved(goal)),
        [activeGoals],
    );

    const achievedActiveGoals = useMemo(
        () => activeGoals.filter((goal) => isGoalAchieved(goal)),
        [activeGoals],
    );

    const displayCompletedGoals = useMemo(
        () => [...achievedActiveGoals, ...completedGoals],
        [achievedActiveGoals, completedGoals],
    );

    const fetchLearningGoals = useCallback(async () => {
        try {
            setLoading(true);

            const [availableData, activeData, completedData] = await Promise.all([
                learningService.getAvailableGoals(),
                learningService.getActiveGoals(),
                learningService.getCompletedGoals(),
            ]);

            setAvailableGoals(availableData || []);
            setActiveGoals(activeData || []);
            setCompletedGoals(completedData || []);
            setFeedbackMessage('');
        } catch (error) {
            console.error(error);
            setFeedbackMessage('학습 목표 정보를 불러오지 못했어요.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddGoal = async (goalMasterId) => {
        try {
            if (activeGoals.length >= MAX_ACTIVE_GOALS) {
                setFeedbackMessage('진행 중 목표는 최대 3개까지만 유지할 수 있어요.');
                return;
            }

            await learningService.selectGoal(goalMasterId);
            await fetchLearningGoals();
            setFeedbackMessage('');
        } catch (error) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                error.message ||
                '목표 추가에 실패했어요.';

            setFeedbackMessage(message);
        }
    };

    const handleCancelGoal = async (userGoalId) => {
        try {
            await learningService.deleteGoal(userGoalId);
            await fetchLearningGoals();
        } catch (error) {
            console.error(error);
            setFeedbackMessage('목표 해제에 실패했어요.');
        }
    };

    const handleShowMoreGoals = () => {
        setVisibleAvailableGoalCount((current) => current + GOAL_PAGE_SIZE);
    };

    useEffect(() => {
        fetchLearningGoals();
    }, [fetchLearningGoals]);

    return {
        MAX_ACTIVE_GOALS,
        availableGoals,
        activeGoals,
        completedGoals,
        feedbackMessage,
        loading,
        visibleAvailableGoals,
        hasMoreAvailableGoals,
        selectedGoalMasterIds,
        inProgressGoals,
        achievedActiveGoals,
        displayCompletedGoals,
        handleAddGoal,
        handleCancelGoal,
        handleShowMoreGoals,
    };
}