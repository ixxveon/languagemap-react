function fetchRecentLearning() {
  return [
    {
      id: 1,
      title: '카페 주문 표현',
      meta: '서울 성수 · 오늘 오전 8:40',
      description: '주문 변경, 사이즈 확인, 포장 여부를 자연스럽게 말하는 루트를 마쳤어요.',
      cta: '이어 학습하기',
    },
    {
      id: 2,
      title: '공항 입국 심사',
      meta: '인천공항 · 어제 오후 7:20',
      description: '질문 의도 파악과 짧고 정확한 답변 연습이 중심인 시나리오였어요.',
      cta: '복습하기',
    },
  ];
}

function fetchHomeRecommendations() {
  return [
    {
      id: 'cafe-morning',
      title: '출근 시간 카페 주문',
      description: '빠른 주문, 옵션 변경, 결제까지 한 흐름으로 연습할 수 있는 입문용 루트예요.',
    },
    {
      id: 'smalltalk-route',
      title: '길 묻기 스몰토크',
      description: '길을 묻고 답을 이해한 뒤 짧은 감사 표현까지 이어 가는 상황 연습이에요.',
    },
  ];
}

export const homeService = {
  fetchRecentLearning,
  fetchHomeRecommendations,
};
