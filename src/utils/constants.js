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
    lines: ['짧은 문장 · 6컷', '그림 중심 구성', '단순한 어휘'],
  },
  {
    value: '7-9',
    title: '7-9세',
    lines: ['보통 분량 · 8컷', '텍스트+그림 균형', '일상 어휘'],
  },
  {
    value: '10-12',
    title: '10-12세',
    lines: ['긴 이야기 · 10컷', '텍스트 중심 구성', '풍부한 어휘'],
  },
];

export const SETTINGS = [
  '학교', '깊은 산속', '한옥마을', '용궁',
  '도깨비 마을', '놀이터', '전통시장', '설·추석',
];

export const ART_STYLES = [
  { value: 'fairytale', label: '동화책 스타일' },
  { value: 'watercolor', label: '수채화' },
  { value: 'cartoon', label: '만화' },
  { value: 'animation', label: '애니메이션' },
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
  { id: 's1', created_at: '2026-05-23', title: '도깨비 마을의 민준', tint: '#ffe6a3', art_style: 'fairytale', illo: 'hanok', isSample: true },
  { id: 's2', created_at: '2026-05-20', title: '용감한 나비의 모험', tint: '#cdebff', art_style: 'watercolor', illo: 'butterfly', isSample: true },
  { id: 's3', created_at: '2026-05-14', title: '별을 모으는 하늘이', tint: '#e7d7ff', art_style: 'fairytale', illo: 'stars', isSample: true },
  { id: 's4', created_at: '2026-05-02', title: '숲속 비밀 친구 서연', tint: '#d6f5c8', art_style: 'cartoon', illo: 'forest', isSample: true },
  { id: 's5', created_at: '2026-04-28', title: '구름 위 우체국 우주', tint: '#ffd9c2', art_style: 'animation', illo: 'cloud', isSample: true },
];
