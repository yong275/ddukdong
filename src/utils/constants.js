export const NAV = [
  { key: 'home', label: '홈', path: '/' },
  { key: 'create', label: '동화 만들기', path: '/create' },
  { key: 'library', label: '내 책장', path: '/library' },
];

export const HERO = {
  title: ['내가 주인공이 될 수 있는', '세상에서 하나뿐인 그림동화'],
  lead: [
    '뚝딱동화는 누구나 주인공이 될 수 있어요.',
    '아이의 관심사와 일상생활을 반영한 아름다운 동화 만들기',
  ],
  cta: '동화 만들기',
};

export const SAMPLES = [
  { t: '용감한 토끼', tint: '#ffe6a3', illo: 'rabbit' },
  { t: '바다 속 친구들', tint: '#cdebff', illo: 'ocean' },
  { t: '별나라 여행', tint: '#e7d7ff', illo: 'stars' },
  { t: '숲속 음악회', tint: '#d6f5c8', illo: 'forest' },
  { t: '구름빵 가게', tint: '#ffd9c2', illo: 'cloud' },
];

export const FEATURES = [
  {
    icon: 'UserCirclePlus',
    title: '아이가 주인공이 되는 이야기',
    desc: '아이의 이름과 성별을 넣으면, 우리 아이가 동화의 진짜 주인공이 돼요. 최대 3명까지 등장인물을 더할 수 있어요.',
  },
  {
    icon: 'SlidersHorizontal',
    title: '나이에 꼭 맞는 동화',
    desc: '4-6세부터 10-12세까지, 나이대에 맞춰 문장 길이·컷 수·어휘 난이도가 자동으로 조절돼요.',
  },
  {
    icon: 'PaintBrushBroad',
    title: '여섯 가지 그림체',
    desc: '동화책·수채화·색연필·만화·애니메이션 중에서 아이 취향에 맞는 그림 스타일을 골라요.',
  },
];

export const AGE_OPTIONS = [
  {
    value: '4-6',
    title: '4-6세',
    lines: ['짧은 문장 · 6-8컷', '그림 중심 구성', '단순한 어휘'],
  },
  {
    value: '7-9',
    title: '7-9세',
    lines: ['보통 분량 · 8-10컷', '텍스트+그림 균형', '일상 어휘'],
  },
  {
    value: '10-12',
    title: '10-12세',
    lines: ['긴 이야기 · 12-16컷', '텍스트 중심 구성', '풍부한 어휘'],
  },
];

export const SETTINGS = [
  '학교', '깊은 산속', '한옥마을', '용궁',
  '도깨비 마을', '놀이터', '전통시장', '설·추석',
];

export const ART_STYLES = [
  { value: 'fairytale', label: '심플동화' },
  { value: 'watercolor', label: '수채화' },
  { value: 'cartoon', label: '종이공예' },
  { value: 'animation', label: '색연필' },
];

export const TIPS = [
  '그거 아세요? 어릴때부터 동화를 많이 읽은 아이들은 어휘력이 풍부해진다는 사실을!',
  '아이가 주인공이 되면 책에 대한 흥미가 두 배로 커져요.',
  '잠들기 전 10분, 동화 한 편이 하루를 포근하게 마무리해줘요.',
];

export const SETTING_ILLO = {
  '학교': 'house',
  '깊은 산속': 'forest',
  '한옥마을': 'hanok',
  '용궁': 'ocean',
  '도깨비 마을': 'hanok',
  '놀이터': 'cloud',
  '전통시장': 'hanok',
  '설·추석': 'house',
};

export const PAGE_TINTS = [
  '#ffe6a3', '#cdebff', '#e7d7ff',
  '#d6f5c8', '#ffd9c2', '#ffe0ef',
];

export const SAMPLE_BOOKS = [
  {
    id: 's1', created_at: '2026-05-23', title: '도깨비 마을의 민준',
    tint: '#ffe6a3', art_style: 'fairytale', illo: 'hanok', isSample: true,
    pages: [
      { id: 's1p1', page_number: 1, text_ko: '옛날 옛적, 한옥이 가득한 도깨비 마을에 민준이가 살고 있었어요.', illo: 'hanok', tint: '#ffe6a3' },
      { id: 's1p2', page_number: 2, text_ko: '어느 날 아침, 민준이는 마을 어귀에서 작고 동그란 도깨비불을 발견했어요.', illo: 'stars', tint: '#fff3c4' },
      { id: 's1p3', page_number: 3, text_ko: '"안녕? 나는 뚝딱이야!" 도깨비불이 방긋 웃으며 말했어요.\n민준이는 깜짝 놀랐지만 용기를 냈어요.', illo: 'cloud', tint: '#ffe6a3' },
      { id: 's1p4', page_number: 4, text_ko: '뚝딱이는 민준이에게 마법 지팡이를 내밀었어요.\n"이걸로 소원을 하나 말해봐!"', illo: 'castle', tint: '#fff3c4' },
      { id: 's1p5', page_number: 5, text_ko: '민준이는 잠깐 생각했어요.\n그리고 조용히 말했어요. "우리 마을이 항상 웃음 가득하면 좋겠어."', illo: 'hanok', tint: '#ffe6a3' },
      { id: 's1p6', page_number: 6, text_ko: '뚝딱이가 기뻐하며 지팡이를 흔들자, 마을에 따스한 빛이 쏟아졌어요.\n민준이는 오늘도 조금 더 용감한 아이가 되었어요.', illo: 'stars', tint: '#fff3c4' },
    ],
  },
  {
    id: 's2', created_at: '2026-05-20', title: '용감한 나비의 모험',
    tint: '#cdebff', art_style: 'watercolor', illo: 'butterfly', isSample: true,
    pages: [
      { id: 's2p1', page_number: 1, text_ko: '파란 하늘 아래, 나비는 처음으로 혼자 날아보기로 했어요.', illo: 'butterfly', tint: '#cdebff' },
      { id: 's2p2', page_number: 2, text_ko: '"할 수 있을까?" 나비의 날개가 살짝 떨렸어요.\n그래도 한 걸음 내디뎠어요.', illo: 'cloud', tint: '#dff0ff' },
      { id: 's2p3', page_number: 3, text_ko: '바람이 세게 불어왔어요. 나비는 흔들렸지만 포기하지 않았어요.', illo: 'stars', tint: '#cdebff' },
      { id: 's2p4', page_number: 4, text_ko: '친구 벌이 날아와 옆에서 함께 날아주었어요.\n둘이 함께라면 어디든 갈 수 있을 것 같았어요.', illo: 'butterfly', tint: '#dff0ff' },
      { id: 's2p5', page_number: 5, text_ko: '마침내 나비는 꽃밭 꼭대기에 도착했어요.\n세상이 이렇게 넓고 아름다웠다니!', illo: 'forest', tint: '#cdebff' },
      { id: 's2p6', page_number: 6, text_ko: '나비는 활짝 날개를 펼쳤어요.\n용기를 낸 오늘이 나비에게 최고의 날이었답니다.', illo: 'butterfly', tint: '#dff0ff' },
    ],
  },
  {
    id: 's3', created_at: '2026-05-14', title: '별을 모으는 하늘이',
    tint: '#e7d7ff', art_style: 'fairytale', illo: 'stars', isSample: true,
    pages: [
      { id: 's3p1', page_number: 1, text_ko: '밤마다 하늘이는 창문 너머 별을 세었어요.\n"저 별들이 다 어디서 왔을까?"', illo: 'stars', tint: '#e7d7ff' },
      { id: 's3p2', page_number: 2, text_ko: '어느 날 밤, 별 하나가 툭 떨어졌어요.\n하늘이는 두 손을 모아 조심스레 받았어요.', illo: 'cloud', tint: '#f0e8ff' },
      { id: 's3p3', page_number: 3, text_ko: '"나를 하늘로 돌려보내 줄 수 있니?" 별이 속삭였어요.\n하늘이는 고개를 끄덕였어요.', illo: 'stars', tint: '#e7d7ff' },
      { id: 's3p4', page_number: 4, text_ko: '하늘이는 언덕 꼭대기로 달려갔어요.\n온 힘을 다해 별을 하늘 높이 던졌어요.', illo: 'castle', tint: '#f0e8ff' },
      { id: 's3p5', page_number: 5, text_ko: '별이 하늘로 돌아가며 반짝반짝 빛났어요.\n마치 고맙다고 인사하는 것 같았어요.', illo: 'stars', tint: '#e7d7ff' },
      { id: 's3p6', page_number: 6, text_ko: '그날 밤 하늘이의 이름을 딴 별이 하나 생겨났어요.\n하늘이는 그 별을 볼 때마다 살포시 웃었어요.', illo: 'stars', tint: '#f0e8ff' },
    ],
  },
  {
    id: 's4', created_at: '2026-05-02', title: '숲속 비밀 친구 서연',
    tint: '#d6f5c8', art_style: 'cartoon', illo: 'forest', isSample: true,
    pages: [
      { id: 's4p1', page_number: 1, text_ko: '서연이는 전학 온 첫날, 아무도 말을 걸어주지 않아 혼자 숲 옆 벤치에 앉았어요.', illo: 'forest', tint: '#d6f5c8' },
      { id: 's4p2', page_number: 2, text_ko: '그때 나뭇잎 사이에서 다람쥐 한 마리가 고개를 내밀었어요.\n"너도 혼자야?"', illo: 'forest', tint: '#e5ffda' },
      { id: 's4p3', page_number: 3, text_ko: '서연이와 다람쥐는 도토리 숨기기 놀이를 했어요.\n깔깔깔 웃음소리가 숲에 울려 퍼졌어요.', illo: 'forest', tint: '#d6f5c8' },
      { id: 's4p4', page_number: 4, text_ko: '다음 날, 같은 반 친구 지호가 말을 걸어왔어요.\n"어제 숲에서 웃던 애 너야?"', illo: 'house', tint: '#e5ffda' },
      { id: 's4p5', page_number: 5, text_ko: '서연이는 처음으로 친구에게 손을 내밀었어요.\n"응, 나야. 나는 서연이야."', illo: 'forest', tint: '#d6f5c8' },
      { id: 's4p6', page_number: 6, text_ko: '그날부터 서연이에게는 학교 친구와 숲속 친구, 두 명의 친구가 생겼어요.', illo: 'forest', tint: '#e5ffda' },
    ],
  },
  {
    id: 's5', created_at: '2026-04-28', title: '구름 위 우체국 우주',
    tint: '#ffd9c2', art_style: 'animation', illo: 'cloud', isSample: true,
    pages: [
      { id: 's5p1', page_number: 1, text_ko: '구름 위에는 아무도 모르는 우체국이 있었어요.\n우주는 그곳에서 편지를 배달하는 일을 했어요.', illo: 'cloud', tint: '#ffd9c2' },
      { id: 's5p2', page_number: 2, text_ko: '오늘 배달할 편지가 한 통 왔어요.\n받는 사람: 외로운 토끼. 보내는 사람: 달.', illo: 'stars', tint: '#ffe8d6' },
      { id: 's5p3', page_number: 3, text_ko: '우주는 구름을 타고 토끼가 사는 언덕으로 날아갔어요.\n바람이 씽씽, 구름이 폭신폭신했어요.', illo: 'cloud', tint: '#ffd9c2' },
      { id: 's5p4', page_number: 4, text_ko: '편지를 받은 토끼의 눈이 반짝였어요.\n"달이 나를 생각해줬구나!"', illo: 'rabbit', tint: '#ffe8d6' },
      { id: 's5p5', page_number: 5, text_ko: '우주는 생각했어요. 편지 한 장이 이렇게 큰 기쁨을 줄 수 있다니.\n나도 소중한 사람에게 편지를 써야겠다고.', illo: 'cloud', tint: '#ffd9c2' },
      { id: 's5p6', page_number: 6, text_ko: '그날 저녁, 우주는 처음으로 엄마에게 편지를 썼어요.\n"엄마, 사랑해요. 매일 고마워요."', illo: 'stars', tint: '#ffe8d6' },
    ],
  },
];
