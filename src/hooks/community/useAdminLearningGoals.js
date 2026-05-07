import { useEffect, useMemo, useState } from 'react';
import { adminLearningService } from '../../api/admin/community/adminLearningService';

const emptyGoalForm = {
    title: '',
    description: '',
    goalType: 'STUDY_COUNT',
    targetValue: '1',
    periodType: 'WEEKLY',
    isActive: true,
};

function normalizeGoal(goal) {
    return {
        id: goal.goalMasterId,
        title: goal.goalTitle,
        description: goal.goalDescription,
        goalType: goal.goalType,
        targetValue: goal.targetValue,
        periodType: goal.periodType,
        isActive: goal.active,
    };
}

export function useAdminLearningGoals() {
    const [goals, setGoals] = useState([]);
    const [goalForm, setGoalForm] = useState(emptyGoalForm);
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [goalLoading, setGoalLoading] = useState(false);
    const [goalError, setGoalError] = useState('');

    const sortedGoals = useMemo(
        () => [...goals].sort((left, right) => left.id - right.id),
        [goals],
    );

    const editingGoal = goals.find((goal) => goal.id === editingGoalId) ?? null;

    const fetchGoals = async () => {
        try {
            setGoalLoading(true);
            setGoalError('');

            const data = await adminLearningService.getGoals();
            setGoals((data ?? []).map(normalizeGoal));
        } catch (error) {
            console.error(error);
            setGoalError('목표 목록을 불러오지 못했습니다.');
        } finally {
            setGoalLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const resetGoalForm = () => {
        setEditingGoalId(null);
        setGoalForm(emptyGoalForm);
    };

    const handleGoalSubmit = async (event) => {
        event.preventDefault();

        const title = goalForm.title.trim();
        const description = goalForm.description.trim();

        if (!title || !description) {
            alert('목표명과 설명을 입력해주세요.');
            return false;
        }

        const requestBody = {
            badgeId: null,
            goalType: goalForm.goalType,
            goalTitle: title,
            goalDescription: description,
            targetValue: Number(goalForm.targetValue),
            periodType: goalForm.periodType,
        };

        try {
            if (editingGoalId) {
                await adminLearningService.updateGoal(editingGoalId, requestBody);
                alert('목표가 수정되었습니다.');
            } else {
                await adminLearningService.createGoal(requestBody);
                alert('목표가 등록되었습니다.');
            }

            await fetchGoals();
            resetGoalForm();

            return true;
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || '목표 저장 중 오류가 발생했습니다.');

            return false;
        }
    };

    const handleEditGoal = (goal) => {
        setEditingGoalId(goal.id);

        setGoalForm({
            title: goal.title,
            description: goal.description,
            goalType: goal.goalType,
            targetValue: String(goal.targetValue),
            periodType: goal.periodType,
            isActive: goal.isActive,
        });
    };

    const handleToggleGoal = async (goal) => {
        try {
            await adminLearningService.updateGoalActive(goal.id, !goal.isActive);

            alert(goal.isActive ? '목표가 비활성화되었습니다.' : '목표가 활성화되었습니다.');

            await fetchGoals();

            if (editingGoalId === goal.id) {
                resetGoalForm();
            }

            return true;
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || '상태 변경 중 오류가 발생했습니다.');

            return false;
        }
    };

    const handleDeleteGoal = async (goalId) => {
        const confirmed = window.confirm('정말 삭제하시겠습니까?');

        if (!confirmed) return false;

        try {
            await adminLearningService.deleteGoal(goalId);
            alert('목표가 삭제되었습니다.');

            await fetchGoals();

            if (editingGoalId === goalId) {
                resetGoalForm();
            }

            return true;
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                '이미 사용 중인 목표는 삭제할 수 없습니다. 비활성화를 이용해주세요.',
            );

            return false;
        }
    };

    return {
        goalForm,
        setGoalForm,
        editingGoalId,
        editingGoal,
        sortedGoals,
        goalLoading,
        goalError,
        handleGoalSubmit,
        handleEditGoal,
        handleToggleGoal,
        handleDeleteGoal,
        resetGoalForm,
    };
}