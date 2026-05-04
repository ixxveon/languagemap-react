export const homeQuickStats = [
  { label: '이번 주 학습', value: '12회', hint: '최근 7일 기준' },
  { label: '평균 발음 점수', value: '89점', hint: '지난주 대비 +6' },
  { label: '연속 학습', value: '7일', hint: '오늘 목표까지 1회 남음' },
];

export const homeRecentLearning = [
  {
    title: '카페 주문 표현',
    meta: '서울 성수 · 오늘 오전 8:40',
    description: '주문 변경, 사이즈 확인, 포장 여부를 자연스럽게 말하는 루트를 마쳤어요.',
    cta: '이어 학습하기',
  },
  {
    title: '공항 입국 심사',
    meta: '인천공항 · 어제 오후 7:20',
    description: '질문 의도 파악과 짧고 정확한 답변 연습이 중심인 시나리오였어요.',
    cta: '복습하기',
  },
];

export const homeSections = [
  {
    eyebrow: 'AI Recommendation',
    title: '오늘의 추천 대화',
    description: '장소와 목표를 기반으로 지금 바로 시작할 수 있는 추천 시나리오를 보여줍니다.',
    cards: [
      {
        title: '출근 시간 카페 주문',
        body: '빠른 주문, 옵션 변경, 결제까지 한 흐름으로 연습할 수 있는 입문용 루트예요.',
      },
      {
        title: '길 묻기 스몰토크',
        body: '길을 묻고 답을 이해한 뒤 짧은 감사 표현까지 이어 가는 상황 연습이에요.',
      },
      {
        title: 'AI가 추천한 이유',
        body: '최근 카페와 이동 상황 학습이 많아서 비슷한 맥락의 표현을 연결하도록 구성했어요.',
      },
    ],
    action: { label: '추천 대화 시작', path: '/map' },
  },
  {
    eyebrow: 'Growth Snapshot',
    title: '성장 리포트 미리보기',
    description: '발음, 유창성, 학습 횟수를 한눈에 보고 성장 페이지로 이어집니다.',
    cards: [
      {
        title: '발음 점수 변화',
        body: '이번 주 평균 점수와 지난주 대비 변화를 빠르게 확인할 수 있도록 정리했어요.',
      },
      {
        title: '유창성 점수',
        body: '짧은 응답부터 문장 연결까지 얼마나 자연스러워졌는지 흐름으로 보여줍니다.',
      },
      {
        title: '다음 목표',
        body: '이번 주 안에 추가로 완료하면 좋은 학습 주제와 다음 추천 액션을 제안해요.',
      },
    ],
    action: { label: '성장 리포트 보기', path: '/growth' },
  },
  {
    eyebrow: 'Learning Progress',
    title: '목표와 배지 관리',
    description: '학습 레벨, 주간 목표, 최근 획득 배지를 홈에서도 바로 확인할 수 있게 구성했어요.',
    cards: [
      {
        title: '현재 레벨',
        body: '초급, 중급, 고급 단계 중 현재 학습 위치를 빠르게 확인할 수 있어요.',
      },
      {
        title: '주간 목표',
        body: '하루 문장 연습 또는 주간 학습 횟수를 추적해서 루틴을 유지하도록 도와줘요.',
      },
      {
        title: '최근 배지',
        body: '연속 학습이나 학습 횟수 달성에 따른 보상 상태를 한 번에 보여줍니다.',
      },
    ],
    action: { label: '학습 목표 보기', path: '/growth' },
  },
  {
    eyebrow: 'Premium Access',
    title: '유료 기능 안내',
    description: '구독 사용자에게만 열리는 STT, 발음 평가, 표현 추천 기능을 구분해서 안내합니다.',
    cards: [
      {
        title: 'AI 페이스 채팅',
        body: '실시간 대화 흐름으로 더 길고 자연스러운 말하기 연습을 진행할 수 있어요.',
      },
      {
        title: 'STT / 발음 평가',
        body: '음성을 텍스트로 바꾸고 발음 정확도를 점수와 피드백으로 확인할 수 있어요.',
      },
      {
        title: '표현 업그레이드',
        body: '내 문장을 더 자연스럽게 바꾸는 대체 표현과 개선 포인트를 바로 보여줘요.',
      },
    ],
    action: { label: '프리미엄 보기', path: '/premium' },
  },
  {
    eyebrow: 'Support',
    title: '공지와 고객지원',
    description: '자주 묻는 질문, 공지사항, 문의하기 진입을 홈에서도 빠르게 찾을 수 있어요.',
    cards: [
      {
        title: '공지사항',
        body: '서비스 업데이트와 주요 변경사항을 먼저 확인할 수 있도록 정리했어요.',
      },
      {
        title: 'FAQ',
        body: '로그인, 학습 기록, 결제, 루트 진행 방식과 관련된 대표 질문을 모아두었어요.',
      },
      {
        title: '문의하기',
        body: '게시판 형태로 문의를 남기고 답변 상태를 추적할 수 있는 흐름으로 연결됩니다.',
      },
    ],
    action: { label: '고객지원 가기', path: '/support' },
  },
];

export const domainPageContent = {
  map: {
    sectionTitle: '지금 바로 써먹기 좋은 장소 기반 루트를 골라 학습해보세요',
    sectionDescription:
      'Place 도메인은 지도 위 장소를 선택하고 난이도를 정한 뒤, 해당 장소에 맞는 AI 대화와 종료 평가까지 이어지는 흐름을 담고 있어요.',
    guideTitle: '장소 학습 흐름',
    guideDescription:
      '장소 선택, 난이도 설정, AI 대화, 종료 피드백까지 이어지는 학습 단계를 한 번에 볼 수 있도록 정리했습니다.',
    guideCards: [
      { title: '장소 선택', description: '이름, 카테고리, 간단한 설명을 보고 지금 시작할 학습 장소를 고를 수 있어요.' },
      { title: '난이도 설정', description: '초급, 중급, 고급을 선택해 표현 범위와 대화 난도를 조절합니다.' },
      { title: 'AI 대화 시작', description: '주문, 길 묻기, 공항 심사처럼 장소에 맞는 상황형 대화를 바로 시작해요.' },
    ],
    checklistTitle: '오늘의 장소 학습 체크',
    checklistItems: ['학습할 장소와 카테고리 고르기', '난이도 선택하기', '종료 후 피드백 확인하기'],
    activityTitle: '지도 학습 단계',
    activityItems: [
      { label: '장소 선택 후 학습 시작', meta: '첫 진입 단계' },
      { label: '실시간 AI 대화 진행', meta: '텍스트 대화 우선' },
      { label: '종료 평가와 표현 피드백', meta: '학습 마무리 단계' },
    ],
  },
  growth: {
    sectionTitle: '성장 그래프와 통계로 학습 변화를 확인해보세요',
    sectionDescription:
      'Analysis 도메인은 발음 점수, 유창성 점수, 학습 횟수처럼 시간에 따라 달라지는 성장 지표를 시각적으로 보여줍니다.',
    infoTitle: '성장 포인트',
    infoDescription: '지금 강해진 부분과 다음으로 집중하면 좋은 영역을 빠르게 파악할 수 있도록 정리했어요.',
    infoCards: [
      { title: '발음 점수 변화', description: '주간 평균과 최근 추이를 비교해 발음 안정감을 확인할 수 있어요.' },
      { title: '유창성 점수', description: '짧은 문장부터 연결된 응답까지 얼마나 부드러워졌는지 보여줘요.' },
      { title: '학습 횟수', description: '주간, 월간 학습 빈도를 바탕으로 루틴 유지 정도를 확인합니다.' },
    ],
    checklistTitle: '이번 주 점검',
    checklistItems: ['성장 그래프 확인하기', '주간 학습 횟수 채우기', '다음 목표 1개 정하기'],
    activityTitle: '최근 성장 기록',
    activityItems: [
      { label: '카페 주문 미션 완료', meta: '오늘 오전' },
      { label: '길 묻기 루트 복습', meta: '어제 오후' },
      { label: '문장 자연스러움 평가 확인', meta: '2일 전' },
    ],
  },
  community: {
    sectionTitle: '사용자들과 경험을 공유하고 비교할 수 있는 커뮤니티 공간이에요',
    sectionDescription:
      'Social 도메인은 친구 비교, 점수 공유, 랭킹 조회와 같은 경쟁 요소를 가볍게 녹여 학습 동기를 이어가도록 돕습니다.',
    boardTitle: '커뮤니티에서 바로 보기',
    boardDescription: '후기 공유뿐 아니라 친구 비교와 랭킹 흐름까지 이어질 수 있는 구조를 담고 있어요.',
    boardCards: [
      { title: '친구 점수 비교', description: '내 점수와 친구 점수를 나란히 보며 어떤 영역을 더 연습할지 확인할 수 있어요.' },
      { title: '주간 / 전체 랭킹', description: '주간 랭킹과 전체 랭킹을 모두 확인하며 동기부여를 유지합니다.' },
      { title: '후기와 문장 공유', description: '잘 통했던 표현이나 어려웠던 포인트를 다른 사용자와 나눌 수 있어요.' },
    ],
    checklistTitle: '오늘의 커뮤니티 참여',
    checklistItems: ['후기 1개 남기기', '친구 점수 비교하기', '랭킹 흐름 확인하기'],
    activityTitle: '인기 활동',
    activityItems: [
      { label: '카페 주문 후기 반응 상승 중', meta: '좋아요 9개' },
      { label: '스몰토크 챌린지 공유', meta: '참여자 17명' },
      { label: '주간 랭킹 조회 증가', meta: '오늘 가장 많이 본 항목' },
    ],
  },
  support: {
    sectionTitle: '공지, FAQ, 문의하기를 빠르게 찾아 해결해보세요',
    sectionDescription:
      'Support 도메인은 공지사항, 자주 묻는 질문, 게시판형 문의하기를 통해 필요한 도움을 빠르게 찾도록 구성되어 있어요.',
    infoTitle: '지원 메뉴',
    infoDescription: '가장 많이 찾는 고객지원 주제를 먼저 분류해 필요한 영역으로 바로 이동할 수 있어요.',
    infoCards: [
      { title: '공지사항 확인', description: '서비스 변경사항과 업데이트 내용을 가장 먼저 확인할 수 있어요.' },
      { title: 'FAQ 확인', description: '자주 나오는 질문을 먼저 보고 빠르게 스스로 해결할 수 있어요.' },
      { title: '문의하기', description: '게시판 형태로 문의를 남기고 답변 상태를 추적할 수 있습니다.' },
    ],
    checklistTitle: '문의 전 확인',
    checklistItems: ['FAQ 먼저 검색하기', '공지사항 확인하기', '문의 유형 선택하기'],
    activityTitle: '최근 지원 업데이트',
    activityItems: [
      { label: '로그인 안내 업데이트', meta: '오늘 오전' },
      { label: '학습 기록 문의 처리', meta: '어제 오후' },
      { label: '결제 FAQ 추가', meta: '2일 전' },
    ],
  },
  premium: {
    sectionTitle: '구독 상품과 유료 기능 범위를 한눈에 비교해보세요',
    sectionDescription:
      'Subscription 도메인은 1개월 / 1년 상품, 결제 상태, 유료 기능 접근 제어를 중심으로 구성됩니다.',
    infoTitle: '프리미엄에서 열리는 기능',
    infoDescription: '유료 사용자에게만 제공되는 기능을 명확히 구분해서 보여줍니다.',
    infoCards: [
      { title: 'AI 페이스 채팅', description: '더 길고 자연스러운 실시간 대화 흐름을 연습할 수 있어요.' },
      { title: 'STT / 발음 평가', description: '음성을 텍스트로 바꾸고 발음 정확도를 분석해 줍니다.' },
      { title: '표현 추천', description: '문장을 더 자연스럽게 바꾸는 제안과 피드백을 받을 수 있어요.' },
    ],
    checklistTitle: '구독 전 확인',
    checklistItems: ['상품 비교하기', '유료 기능 범위 확인하기', '결제 후 학습 흐름 확인하기'],
    activityTitle: '프리미엄 하이라이트',
    activityItems: [
      { label: '1개월 / 1년 구독 제공', meta: '상품 관리 기준' },
      { label: '결제 이력 추적 가능', meta: '상태 저장 포함' },
      { label: '만료 / 해지 처리 지원', meta: '구독 상태 관리' },
    ],
  },
  settings: {
    sectionTitle: '알림, 언어, 공통 환경설정을 조정해보세요',
    sectionDescription:
      'Common 도메인은 다크모드, 학습 알림, 글씨 크기, 언어 표시처럼 서비스 전반에 영향을 주는 설정을 담습니다.',
    infoTitle: '조정 가능한 항목',
    infoDescription: '자주 바꾸는 설정을 중심으로 학습 흐름에 맞게 환경을 바꿀 수 있어요.',
    infoCards: [
      { title: '학습 알림', description: '원하는 시간에 맞춰 학습 시작 알림을 받을 수 있어요.' },
      { title: '언어 / 표시 방식', description: '한국어 우선, 영어 우선 등 표시 순서를 바꿀 수 있어요.' },
      { title: '공통 접근성', description: '글씨 크기, 테마, 인터페이스 환경을 함께 조정할 수 있습니다.' },
    ],
    checklistTitle: '추천 설정 순서',
    checklistItems: ['학습 알림 시간 정하기', '주간 목표 맞추기', '언어 표시 방식 확인하기'],
    activityTitle: '최근 설정 변경',
    activityItems: [
      { label: '학습 알림 활성화', meta: '방금 저장됨' },
      { label: '주간 목표 조정', meta: '현재 적용 중' },
      { label: '표시 언어 변경', meta: '환경설정 반영' },
    ],
  },
};
