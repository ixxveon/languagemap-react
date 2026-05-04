export const previousLearningSummary = {
  userName: '민지',
  place: '시드니 888 카페',
  topic: '카페에서 커피 주문하기',
  scenario: '카페에서 라테를 주문하고, 우유 옵션을 바꾼 뒤 테이크아웃 여부를 확인한 상황',
  mapArea: {
    title: 'Cafe Stage 888',
    subtitle: '현재 학습 장소',
    radius: '학습 평가 포인트',
    address: 'Sydney CBD · Near George St.',
    lat: -33.86882,
    lng: 151.20929,
    zoom: 17,
    conversationLog: [
      { speaker: 'Cafe Staff', text: 'Good morning. What would you like to order?' },
      { speaker: 'Minji', text: 'I would like a latte with almond milk, please.' },
      { speaker: 'Cafe Staff', text: 'Sure. Is that for here or to go?' },
      { speaker: 'Minji', text: 'To go, please. Could I pay by card?' },
    ],
  },
  evaluation: {
    pronunciation: '보통',
    expression: '좋음',
    responseSpeed: '개선 필요',
  },
  coachingGoal: '정중한 주문 표현과 빠른 응답 흐름을 자연스럽게 이어가기',
  weakPoints: ['almond milk 발음', '조건 붙여 말하기', '추가 요청에 바로 답하기'],
};

export const coachingModes = [
  {
    id: 'vocabulary',
    label: '더 어려운 단어',
    description: '쉬운 주문 표현을 더 자연스러운 고급 표현으로 바꿔요.',
  },
  {
    id: 'grammar',
    label: '더 어려운 문법',
    description: '이유, 조건, 정중 표현이 들어간 문장으로 확장해요.',
  },
  {
    id: 'conversation',
    label: '더 많은 대화',
    description: '주문 이후 추가 요청, 결제, 문의까지 이어서 연습해요.',
  },
];

export const scenarioByMode = {
  vocabulary: {
    title: '고급 주문 표현으로 바꾸기',
    goal: 'preference, recommendation 같은 자연스러운 단어를 사용합니다.',
    prompt:
      '좋아요. 이번 스테이지에서는 주문 표현을 조금 더 자연스럽게 바꿔볼게요. "Can I get a latte?" 대신 "I would like to go with a latte, preferably with almond milk."처럼 말해봅시다.',
    keySentences: [
      'I would like to go with a latte, preferably with almond milk.',
      'Could you recommend something that is not too sweet?',
      'I will take it to go, please.',
    ],
  },
  grammar: {
    title: '조건과 이유를 붙여 말하기',
    goal: '조건절과 이유 표현을 넣어 문장을 길게 연결합니다.',
    prompt:
      '좋아요. 이번에는 이유와 조건을 붙여 말하는 연습이에요. "If it is not too busy, could you make it less sweet?"처럼 정중하게 이어가볼게요.',
    keySentences: [
      'If it is not too busy, could you make it less sweet?',
      'I prefer almond milk because regular milk feels a bit heavy for me.',
      'Could you let me know when my order is ready?',
    ],
  },
  conversation: {
    title: '주문 다음 상황까지 이어가기',
    goal: '주문, 옵션 변경, 결제, 픽업 확인까지 하나의 대화로 이어갑니다.',
    prompt:
      '좋아요. 이번에는 주문에서 끝내지 않고 결제와 픽업 확인까지 이어가요. 점원이 추가 질문을 하면 짧고 정확하게 답해봅시다.',
    keySentences: [
      'Can I also add one blueberry muffin?',
      'Could I pay by card?',
      'Where should I wait for the pickup?',
    ],
  },
};

export const voiceConversation = [
  {
    id: 1,
    role: 'ai',
    speaker: 'AI Coach',
    text: 'Good morning. What would you like to order today?',
    duration: '0:05',
    status: '재생 완료',
  },
  {
    id: 2,
    role: 'user',
    speaker: '민지',
    text: 'I would like to go with a latte, preferably with almond milk.',
    duration: '0:07',
    status: '음성 로그',
  },
  {
    id: 3,
    role: 'ai',
    speaker: 'AI Coach',
    text: 'Sure. Would you like it hot or iced?',
    duration: '0:04',
    status: '재생 완료',
  },
  {
    id: 4,
    role: 'user',
    speaker: '민지',
    text: 'Hot, please. And could you make it less sweet?',
    duration: '0:06',
    status: '음성 로그',
  },
  {
    id: 5,
    role: 'ai',
    speaker: 'AI Coach',
    text: 'Of course. Is that for here or to go?',
    duration: '0:04',
    status: '재생 완료',
  },
  {
    id: 6,
    role: 'user',
    speaker: '민지',
    text: 'To go, please. Could I pay by card?',
    duration: '0:05',
    status: '음성 로그',
  },
];

export const evaluationResult = {
  score: 86,
  summary:
    '주문 의도는 명확했고 정중한 표현도 잘 사용했습니다. 다만 almond milk와 preferably에서 강세가 약해 일부 단어가 흐리게 들렸습니다.',
  strengths: ['정중한 요청 표현 사용', '옵션 변경을 자연스럽게 연결', '마지막 결제 질문까지 대화 유지'],
  improvements: ['almond의 첫 음절을 더 또렷하게 발음하기', 'preferably의 강세 위치 확인', '질문을 듣고 2초 안에 답하기'],
  nextFocus: '조건을 붙인 정중한 요청 문장을 한 호흡으로 말하기',
};

export const pronunciationSentences = [
  {
    id: 1,
    sentence: 'I would like to go with a latte, preferably with almond milk.',
    score: 82,
    accuracy: '84%',
    errorWords: ['preferably', 'almond'],
    feedback: 'preferably의 첫 강세와 almond의 l 소리를 줄이는 흐름을 확인해보세요.',
  },
  {
    id: 2,
    sentence: 'Could you make it less sweet?',
    score: 91,
    accuracy: '93%',
    errorWords: ['less'],
    feedback: '전체 억양은 좋고 less의 끝소리만 조금 더 짧게 끊으면 자연스러워요.',
  },
  {
    id: 3,
    sentence: 'Could I pay by card?',
    score: 88,
    accuracy: '90%',
    errorWords: ['card'],
    feedback: 'card의 r 소리를 살리면 결제 상황에서 더 또렷하게 들립니다.',
  },
];

export const youtubeRecommendations = [
  {
    id: 1,
    title: '카페 주문 영어: 정중하게 요청하는 법',
    channel: 'Travel English Lab',
    length: '8:42',
    description: '카페에서 옵션 변경과 추천 요청을 자연스럽게 말하는 짧은 영상',
    thumbnail: 'CAFE',
  },
  {
    id: 2,
    title: 'Would like, Could you 패턴 집중 연습',
    channel: 'Daily Speaking Coach',
    length: '6:15',
    description: '정중한 주문 문장에 자주 쓰이는 핵심 패턴 반복 연습',
    thumbnail: 'POLITE',
  },
  {
    id: 3,
    title: '여행 영어 결제 표현 10문장',
    channel: 'Mapingo Picks',
    length: '5:28',
    description: '카드 결제, 영수증, 픽업 확인까지 이어지는 실전 표현',
    thumbnail: 'PAY',
  },
];
