export const learningSummary = {
  pronunciationScore: 89,
  fluencyScore: 84,
  weeklyLearnCount: 12,
  streakDays: 7,
  badgeCount: 5,
  weeklyGoalCompleted: 4,
  weeklyGoal: 5,
  currentLevel: '중급 진입',
};

export const learningLevelOptions = [
  { id: 'starter', label: '초급 시작', description: '짧은 질문과 기본 응답을 연습하는 단계' },
  { id: 'basic', label: '초급 확장', description: '주문, 이동, 쇼핑 표현을 더 길게 이어가는 단계' },
  { id: 'intermediate', label: '중급 진입', description: '상황 설명과 추가 질문을 자연스럽게 붙이는 단계' },
  { id: 'advanced', label: '고급 도전', description: '긴 대화와 즉흥 응답을 유연하게 이어가는 단계' },
];

export const badgeCatalog = [
  {
    id: 'starter-badge',
    name: '첫 걸음 배지',
    condition: '학습 3회 완료',
    status: 'earned',
  },
  {
    id: 'route-runner',
    name: '루트 러너',
    condition: '학습 10회 완료',
    status: 'earned',
  },
  {
    id: 'smalltalk-smile',
    name: '스몰토크 스마일',
    condition: '스몰토크 루트 3회 완료',
    status: 'earned',
  },
  {
    id: 'weekly-focus',
    name: '주간 집중 배지',
    condition: '주간 목표 달성',
    status: 'progress',
  },
  {
    id: 'city-explorer',
    name: '시티 익스플로러',
    condition: '장소 5개 이상 학습',
    status: 'locked',
  },
];

export const learningGoalSuggestions = [
  '하루 3문장 연습 목표 유지',
  '이번 주 지도 학습 2회 더 완료',
  '스몰토크 표현 1개 복습',
];

export const growthHighlights = [
  {
    title: '발음 점수 변화',
    description: '카페와 길 묻기 루트에서 자주 틀리던 소리가 안정적으로 개선되고 있어요.',
  },
  {
    title: '유창성 점수',
    description: '짧은 답변에서 한 문장 이상 자연스럽게 연결하는 비율이 높아졌어요.',
  },
  {
    title: '다음 목표',
    description: '이번 주에는 이동 상황 루트를 2회 더 완료하면 목표 달성에 가까워집니다.',
  },
];

export const learningChecklist = [
  '발음 점수 추이 확인하기',
  '이번 주 학습 목표 달성 여부 보기',
  '다음 추천 루트 1개 선택하기',
];

export const learningActivities = [
  { label: '카페 주문 루트 완료', meta: '오늘 오전' },
  { label: '스몰토크 피드백 확인', meta: '어제 오후' },
  { label: '주간 학습 목표 4회 달성', meta: '현재 진행 중' },
];
