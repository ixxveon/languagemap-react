export const placeTabOptions = [
  {
    id: 'all',
    label: 'All',
    country: 'Global',
    capital: 'All Capitals',
    center: { lat: 40.711, lng: 20.214 },
    zoom: 2,
  },
  {
    id: 'seoul',
    label: '서울',
    country: 'South Korea',
    capital: 'Seoul',
    center: { lat: 37.5665, lng: 126.978 },
    zoom: 13,
  },
  {
    id: 'tokyo',
    label: '도쿄',
    country: 'Japan',
    capital: 'Tokyo',
    center: { lat: 35.6762, lng: 139.6503 },
    zoom: 13,
  },
  {
    id: 'london',
    label: '런던',
    country: 'United Kingdom',
    capital: 'London',
    center: { lat: 51.5072, lng: -0.1276 },
    zoom: 13,
  },
  {
    id: 'paris',
    label: '파리',
    country: 'France',
    capital: 'Paris',
    center: { lat: 48.8566, lng: 2.3522 },
    zoom: 13,
  },
  {
    id: 'washington-dc',
    label: '워싱턴 D.C.',
    country: 'United States',
    capital: 'Washington, D.C.',
    center: { lat: 38.9072, lng: -77.0369 },
    zoom: 13,
  },
];

export const routeCatalog = [
  {
    id: 'seoul-cityhall-cafe',
    capitalId: 'seoul',
    title: 'City Hall Cafe Order',
    address: 'Sejong-daero, Jung-gu, Seoul',
    category: '서울',
    placeType: 'Cafe',
    difficulty: 'Starter',
    duration: '12 min',
    lat: 37.5658,
    lng: 126.9784,
    description:
      '서울 시청 근처 카페에서 음료를 주문하고 옵션을 바꾸는 상황을 연습하는 장소입니다.',
    scenario:
      '바쁜 점심 시간에 원하는 음료를 주문하고, 사이즈와 우유 옵션을 자연스럽게 바꿔 말하는 시나리오예요.',
    coachTip: 'Please, size, option change 표현을 짧고 또렷하게 말하면 훨씬 자연스럽습니다.',
    missions: [
      {
        id: 'mission-order-drink',
        title: '음료 주문하기',
        summary: '기본 주문 문장으로 원하는 음료를 또렷하게 말해보세요.',
      },
      {
        id: 'mission-change-option',
        title: '옵션 바꾸기',
        summary: '사이즈나 우유 옵션을 자연스럽게 수정 요청해보세요.',
      },
    ],
    feedback: {
      strengths: ['주문 시작 문장이 자연스럽습니다.', '옵션 변경 요청이 또렷하게 들립니다.'],
      improvements: ['마무리 감사 표현을 한 번 더 붙여보세요.', '사이즈 확인 질문도 이어서 연습해보세요.'],
    },
    chatSteps: [
      {
        speaker: 'Barista',
        prompt: 'Hello. What can I get for you today?',
        choices: ['Can I get a latte, please?', 'I would like a hot latte.', 'Could I order a latte?'],
      },
      {
        speaker: 'Barista',
        prompt: 'Sure. What size would you like?',
        choices: ['Medium, please.', 'Can I get a large?', 'I will take a regular size.'],
      },
      {
        speaker: 'Barista',
        prompt: 'Would you like to change the milk option?',
        choices: ['Yes, oat milk please.', 'Can I switch to soy milk?', 'Regular milk is fine, thanks.'],
      },
    ],
  },
  {
    id: 'seoul-gwanghwamun-station',
    capitalId: 'seoul',
    title: 'Gwanghwamun Station Transfer',
    address: 'Jong-ro, Jongno-gu, Seoul',
    category: '서울',
    placeType: 'Subway',
    difficulty: 'Starter',
    duration: '10 min',
    lat: 37.5716,
    lng: 126.9768,
    description:
      '광화문역 주변에서 노선, 환승, 출구 번호를 묻는 기본 이동 표현을 익히기 좋은 지점입니다.',
    scenario:
      '처음 방문한 관광객처럼 시청역 방향과 가장 가까운 출구를 영어로 묻는 상황을 연습합니다.',
    coachTip: 'Which line, transfer, exit number를 한 세트로 묶어 말하면 이동 상황에서 정말 유용합니다.',
    missions: [
      {
        id: 'mission-find-line',
        title: '노선 찾기',
        summary: '목적지까지 가는 노선을 영어로 질문해보세요.',
      },
      {
        id: 'mission-find-exit',
        title: '출구 묻기',
        summary: '가장 가까운 출구 번호를 정확하게 물어보세요.',
      },
    ],
    feedback: {
      strengths: ['목적지를 먼저 말해서 의도가 분명합니다.', '출구 번호 질문이 자연스럽습니다.'],
      improvements: ['환승 여부를 묻는 문장을 조금 더 길게 말해보세요.', '감사 표현을 붙이면 더 부드럽습니다.'],
    },
    chatSteps: [
      {
        speaker: 'Station Staff',
        prompt: 'Hi there. Where are you trying to go?',
        choices: ['How can I get to City Hall?', 'Which line goes to City Hall?', 'Can you help me get to City Hall?'],
      },
      {
        speaker: 'Station Staff',
        prompt: 'You can take line one. Do you need to transfer?',
        choices: ['Do I need to transfer?', 'Is there a transfer on the way?', 'Can I go there directly?'],
      },
      {
        speaker: 'Station Staff',
        prompt: 'It takes about ten minutes. Which exit do you need?',
        choices: ['Which exit should I take?', 'What is the closest exit?', 'Can you tell me the exit number?'],
      },
    ],
  },
  {
    id: 'tokyo-shibuya-hotel',
    capitalId: 'tokyo',
    title: 'Shibuya Hotel Check-in',
    address: 'Shibuya Crossing, Tokyo',
    category: '도쿄',
    placeType: 'Hotel',
    difficulty: 'Intermediate',
    duration: '14 min',
    lat: 35.6595,
    lng: 139.7005,
    description:
      '도쿄 시부야에서 체크인, 조식 여부, 체크아웃 시간 같은 호텔 표현을 집중적으로 연습할 수 있습니다.',
    scenario:
      '늦은 시간에 호텔 프런트에 도착해 예약 확인, 조식 시간, 와이파이 정보를 영어로 묻는 상황입니다.',
    coachTip: 'reservation, check-in, breakfast time 같은 핵심 단어를 정확히 발음하면 자신감이 올라갑니다.',
    missions: [
      {
        id: 'mission-checkin',
        title: '예약 확인',
        summary: '예약자 이름과 체크인 의도를 분명하게 전달해보세요.',
      },
      {
        id: 'mission-breakfast',
        title: '조식 정보 묻기',
        summary: '조식 시간과 포함 여부를 자연스럽게 질문해보세요.',
      },
    ],
    feedback: {
      strengths: ['예약 확인 문장이 정중합니다.', '추가 정보 요청 흐름이 매끄럽습니다.'],
      improvements: ['체크아웃 시간 질문을 더 자연스럽게 이어보세요.', '와이파이 비밀번호 요청도 붙여보세요.'],
    },
    chatSteps: [
      {
        speaker: 'Front Desk',
        prompt: 'Good evening. Do you have a reservation with us?',
        choices: ['Yes, I booked a room under Kim.', 'I have a reservation under Kim.', 'Yes, it is under my name, Kim.'],
      },
      {
        speaker: 'Front Desk',
        prompt: 'Great. Would you like information about breakfast?',
        choices: ['Yes, what time does breakfast start?', 'Could you tell me the breakfast hours?', 'Is breakfast included in my stay?'],
      },
      {
        speaker: 'Front Desk',
        prompt: 'Breakfast starts at seven. Is there anything else you need?',
        choices: ['Can I get the Wi-Fi password too?', 'What time is check-out?', 'That is all for now, thank you.'],
      },
    ],
  },
  {
    id: 'tokyo-ueno-museum',
    capitalId: 'tokyo',
    title: 'Ueno Museum Ticket Desk',
    address: 'Ueno Park, Tokyo',
    category: '도쿄',
    placeType: 'Museum',
    difficulty: 'Intermediate',
    duration: '11 min',
    lat: 35.7168,
    lng: 139.7753,
    description:
      '박물관 입장권 구매, 전시 위치 확인, 오디오 가이드 요청 같은 문화 공간 표현을 연습합니다.',
    scenario:
      '특별 전시를 보러 온 방문객이 티켓 종류와 전시실 위치를 영어로 묻는 장면입니다.',
    coachTip: 'ticket, exhibit, audio guide 표현을 또렷하게 끊어 말하면 이해가 쉬워집니다.',
    missions: [
      {
        id: 'mission-buy-ticket',
        title: '티켓 구매',
        summary: '특별 전시 티켓을 원하는 방식으로 요청해보세요.',
      },
      {
        id: 'mission-audio-guide',
        title: '오디오 가이드 요청',
        summary: '영어 오디오 가이드 가능 여부를 확인해보세요.',
      },
    ],
    feedback: {
      strengths: ['표 구매 의도가 분명합니다.', '전시 위치 질문이 자연스럽습니다.'],
      improvements: ['오디오 가이드 요청 문장을 더 길게 말해보세요.', '학생 할인 여부도 함께 물어보세요.'],
    },
    chatSteps: [
      {
        speaker: 'Ticket Staff',
        prompt: 'Hello. Which exhibition would you like to see today?',
        choices: ['I want to see the special exhibition.', 'I would like one ticket for the special exhibit.', 'Can I buy a ticket for the main exhibition?'],
      },
      {
        speaker: 'Ticket Staff',
        prompt: 'Sure. Do you need an audio guide as well?',
        choices: ['Yes, please. Is it available in English?', 'Can I get an English audio guide?', 'No, just one regular ticket, please.'],
      },
      {
        speaker: 'Ticket Staff',
        prompt: 'Of course. The exhibition hall is on the second floor.',
        choices: ['Thank you. Where is the elevator?', 'Is photography allowed inside?', 'That helps a lot, thanks.'],
      },
    ],
  },
  {
    id: 'london-soho-pharmacy',
    capitalId: 'london',
    title: 'Soho Pharmacy Help',
    address: 'Soho, London',
    category: '런던',
    placeType: 'Pharmacy',
    difficulty: 'Intermediate',
    duration: '9 min',
    lat: 51.5136,
    lng: -0.1365,
    description:
      '런던 소호에서 감기약 추천, 복용 횟수, 증상 설명을 영어로 말하는 연습에 적합한 장소입니다.',
    scenario:
      '가벼운 감기 증상이 있어 약사에게 증상을 설명하고 추천 약을 묻는 상황을 상정합니다.',
    coachTip: 'symptom, sore throat, how often 표현을 정확히 말하면 실생활 활용도가 높습니다.',
    missions: [
      {
        id: 'mission-describe-symptom',
        title: '증상 설명',
        summary: '목 상태와 기침 증상을 짧고 정확하게 말해보세요.',
      },
      {
        id: 'mission-ask-dose',
        title: '복용법 확인',
        summary: '약을 얼마나 자주 먹어야 하는지 질문해보세요.',
      },
    ],
    feedback: {
      strengths: ['증상 설명이 간결하고 분명합니다.', '복용 방법 질문이 자연스럽습니다.'],
      improvements: ['알레르기 여부를 함께 말해보세요.', '증상 지속 시간을 추가하면 더 좋습니다.'],
    },
    chatSteps: [
      {
        speaker: 'Pharmacist',
        prompt: 'Hello. How can I help you today?',
        choices: ['I have a sore throat and a mild cough.', 'Can you recommend some cold medicine?', 'I am looking for something for a cold.'],
      },
      {
        speaker: 'Pharmacist',
        prompt: 'Of course. How long have you had these symptoms?',
        choices: ['For about two days.', 'It started yesterday morning.', 'I have had them since the weekend.'],
      },
      {
        speaker: 'Pharmacist',
        prompt: 'This medicine should help. Do you have any allergies?',
        choices: ['No, I do not have any allergies.', 'How often should I take it?', 'Can I take this after meals?'],
      },
    ],
  },
  {
    id: 'london-kingscross-platform',
    capitalId: 'london',
    title: 'King’s Cross Platform Check',
    address: 'King’s Cross Station, London',
    category: '런던',
    placeType: 'Station',
    difficulty: 'Intermediate',
    duration: '13 min',
    lat: 51.5308,
    lng: -0.1238,
    description:
      '플랫폼 번호, 기차 출발 시간, 지연 여부를 묻는 영국식 이동 표현을 익히기 좋습니다.',
    scenario:
      '옥스퍼드행 열차를 타기 전에 플랫폼과 탑승 시간을 영어로 확인하는 상황입니다.',
    coachTip: 'platform, departure, delayed 표현을 익히면 역에서 훨씬 덜 당황하게 됩니다.',
    missions: [
      {
        id: 'mission-platform',
        title: '플랫폼 확인',
        summary: '열차 플랫폼 번호를 영어로 물어보세요.',
      },
      {
        id: 'mission-delay',
        title: '지연 여부 확인',
        summary: '열차가 제시간에 출발하는지 자연스럽게 질문해보세요.',
      },
    ],
    feedback: {
      strengths: ['열차 목적지를 먼저 제시했습니다.', '출발 시간 질문 흐름이 좋습니다.'],
      improvements: ['지연 여부를 묻는 문장을 더 자연스럽게 이어보세요.', '탑승구 방향도 추가로 물어보세요.'],
    },
    chatSteps: [
      {
        speaker: 'Station Assistant',
        prompt: 'Hi. Which train are you looking for?',
        choices: ['I am taking the train to Oxford.', 'Which platform is for Oxford?', 'Can you help me find the Oxford train?'],
      },
      {
        speaker: 'Station Assistant',
        prompt: 'It should leave from platform five.',
        choices: ['What time does it depart?', 'Is it running on time today?', 'How far is platform five from here?'],
      },
      {
        speaker: 'Station Assistant',
        prompt: 'It departs in fifteen minutes.',
        choices: ['Thank you. Is there enough time to board?', 'Has the platform changed at all?', 'That is perfect, thanks.'],
      },
    ],
  },
  {
    id: 'paris-louvre-ticket',
    capitalId: 'paris',
    title: 'Louvre Ticket and Directions',
    address: 'Rue de Rivoli, Paris',
    category: '파리',
    placeType: 'Museum',
    difficulty: 'Intermediate',
    duration: '12 min',
    lat: 48.8606,
    lng: 2.3376,
    description:
      '파리 루브르 근처에서 티켓 예매 여부, 입장 라인, 주요 작품 위치를 묻는 표현을 연습합니다.',
    scenario:
      '미리 예매한 티켓으로 입장하면서 어느 줄로 가야 하는지, 모나리자 전시실이 어디인지 묻는 장면입니다.',
    coachTip: 'entrance, reservation, gallery 표현을 익히면 관광지에서도 훨씬 편해집니다.',
    missions: [
      {
        id: 'mission-entrance-line',
        title: '입장 줄 찾기',
        summary: '예약 티켓으로 어느 줄로 들어가야 하는지 물어보세요.',
      },
      {
        id: 'mission-find-gallery',
        title: '전시실 위치 묻기',
        summary: '보고 싶은 작품 전시실 위치를 영어로 질문해보세요.',
      },
    ],
    feedback: {
      strengths: ['입장 의도가 분명합니다.', '작품 위치 질문이 자연스럽습니다.'],
      improvements: ['대기 시간 질문도 추가해보세요.', '예약 확인 문장을 조금 더 천천히 말해보세요.'],
    },
    chatSteps: [
      {
        speaker: 'Museum Staff',
        prompt: 'Bonjour. Do you already have a reservation?',
        choices: ['Yes, I booked my ticket online.', 'I have an online ticket reservation.', 'Yes, I reserved a ticket for today.'],
      },
      {
        speaker: 'Museum Staff',
        prompt: 'Great. Please use the entrance on your left.',
        choices: ['Which gallery is the Mona Lisa in?', 'How long is the wait from there?', 'Can I enter with this QR code?'],
      },
      {
        speaker: 'Museum Staff',
        prompt: 'It is in the Denon Wing on the first floor.',
        choices: ['Thank you. Is there a map in English?', 'Could you show me on the map?', 'That is exactly what I needed.'],
      },
    ],
  },
  {
    id: 'paris-metro-connection',
    capitalId: 'paris',
    title: 'Paris Metro Connection',
    address: 'Châtelet, Paris',
    category: '파리',
    placeType: 'Metro',
    difficulty: 'Starter',
    duration: '8 min',
    lat: 48.8582,
    lng: 2.347,
    description:
      '파리 메트로에서 환승 노선, 티켓 사용 범위, 가장 가까운 출구를 묻는 짧은 대화를 연습합니다.',
    scenario:
      '에펠탑 방향으로 가기 위해 어떤 노선을 타야 하는지 영어로 빠르게 묻는 장면입니다.',
    coachTip: 'Which metro line, transfer, nearest exit 세 표현만 익혀도 이동이 훨씬 쉬워집니다.',
    missions: [
      {
        id: 'mission-metro-line',
        title: '메트로 노선 확인',
        summary: '목적지로 가는 노선을 빠르게 질문해보세요.',
      },
      {
        id: 'mission-transfer-ticket',
        title: '환승과 티켓 확인',
        summary: '환승 위치와 티켓 사용 가능 여부를 물어보세요.',
      },
    ],
    feedback: {
      strengths: ['이동 목적이 분명하게 전달됩니다.', '핵심 질문이 짧고 좋습니다.'],
      improvements: ['표 사용 가능 범위를 추가로 물어보세요.', '출구 방향 질문을 더 정중하게 말해보세요.'],
    },
    chatSteps: [
      {
        speaker: 'Metro Staff',
        prompt: 'Hello. Where would you like to go?',
        choices: ['How can I get to the Eiffel Tower?', 'Which metro line goes to the Eiffel Tower?', 'Can you help me get to the Eiffel Tower?'],
      },
      {
        speaker: 'Metro Staff',
        prompt: 'Take line six after one transfer.',
        choices: ['Where do I transfer?', 'Can I use this ticket for the transfer?', 'How long does it take from here?'],
      },
      {
        speaker: 'Metro Staff',
        prompt: 'The transfer is at Nation station.',
        choices: ['Which exit should I use at the end?', 'Thank you. Is it a long walk?', 'That is very helpful, thanks.'],
      },
    ],
  },
  {
    id: 'dc-smithsonian-mall',
    capitalId: 'washington-dc',
    title: 'National Mall Visitor Help',
    address: 'National Mall, Washington, D.C.',
    category: '워싱턴 D.C.',
    placeType: 'Tourist Info',
    difficulty: 'Advanced',
    duration: '15 min',
    lat: 38.8896,
    lng: -77.0091,
    description:
      '국회의사당과 스미스소니언 사이에서 길 안내, 입장 시간, 추천 동선을 묻는 관광 영어를 연습합니다.',
    scenario:
      '하루 일정으로 박물관 두 곳을 돌려고 하며 이동 시간과 우선 방문 순서를 묻는 장면입니다.',
    coachTip: 'opening hours, walking distance, recommended route 표현을 묶어서 말하면 더 자연스럽습니다.',
    missions: [
      {
        id: 'mission-recommend-route',
        title: '추천 동선 받기',
        summary: '짧은 일정 안에서 좋은 코스를 추천받아보세요.',
      },
      {
        id: 'mission-ask-opening-hours',
        title: '운영 시간 확인',
        summary: '방문하려는 장소의 운영 시간을 영어로 물어보세요.',
      },
    ],
    feedback: {
      strengths: ['여행 목적이 분명합니다.', '추천 동선 요청이 자연스럽습니다.'],
      improvements: ['이동 시간 질문을 조금 더 구체적으로 해보세요.', '입장료 여부도 추가해보세요.'],
    },
    chatSteps: [
      {
        speaker: 'Visitor Center Staff',
        prompt: 'Welcome. What would you like to visit today?',
        choices: ['I want to visit two museums this afternoon.', 'Can you recommend the best route around the Mall?', 'I only have a few hours. Where should I start?'],
      },
      {
        speaker: 'Visitor Center Staff',
        prompt: 'The Air and Space Museum is a great first stop.',
        choices: ['How long does it take to walk there?', 'What time does it open today?', 'Is there an entrance fee for that museum?'],
      },
      {
        speaker: 'Visitor Center Staff',
        prompt: 'It is about a ten-minute walk from here.',
        choices: ['That sounds good. What should I visit next?', 'Can I get a map in English?', 'Thanks. Is the route easy to follow?'],
      },
    ],
  },
  {
    id: 'dc-georgetown-restaurant',
    capitalId: 'washington-dc',
    title: 'Georgetown Dinner Reservation',
    address: 'Georgetown, Washington, D.C.',
    category: '워싱턴 D.C.',
    placeType: 'Restaurant',
    difficulty: 'Advanced',
    duration: '16 min',
    lat: 38.9078,
    lng: -77.0658,
    description:
      '예약 확인, 대기 시간, 좌석 요청, 메뉴 추천까지 식당 영어를 넓게 연습할 수 있는 장소입니다.',
    scenario:
      '저녁 예약이 제대로 들어갔는지 확인하고, 창가 자리 가능 여부와 대표 메뉴를 묻는 상황입니다.',
    coachTip: 'reservation, available table, recommendation을 침착하게 말하면 식당 상황에서 훨씬 안정적입니다.',
    missions: [
      {
        id: 'mission-check-reservation',
        title: '예약 확인',
        summary: '예약자 이름과 시간을 영어로 다시 확인해보세요.',
      },
      {
        id: 'mission-ask-recommendation',
        title: '메뉴 추천 받기',
        summary: '대표 메뉴와 인기 메뉴를 자연스럽게 질문해보세요.',
      },
    ],
    feedback: {
      strengths: ['예약 확인 문장이 정중합니다.', '자리 요청과 추천 요청이 자연스럽게 이어집니다.'],
      improvements: ['대기 시간 질문도 덧붙여보세요.', '알레르기 정보가 있으면 함께 말해보세요.'],
    },
    chatSteps: [
      {
        speaker: 'Host',
        prompt: 'Good evening. Do you have a reservation?',
        choices: ['Yes, it should be under Lee for seven thirty.', 'I booked a table for two under Lee.', 'Could you check a reservation under Lee?'],
      },
      {
        speaker: 'Host',
        prompt: 'Yes, I found it. Do you have any seating preference?',
        choices: ['Do you have a table by the window?', 'Could we sit somewhere quiet?', 'Any comfortable table is fine, thank you.'],
      },
      {
        speaker: 'Host',
        prompt: 'We can seat you by the window in a few minutes.',
        choices: ['That is perfect. What do you recommend here?', 'How long is the wait?', 'Thank you. We can wait.'],
      },
    ],
  },
];