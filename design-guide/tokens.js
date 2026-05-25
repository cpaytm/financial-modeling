// ============================================================
// Financial Modeling Design System — Tokens
//
// 본 레포의 HTML 산출물·문서에서 공통으로 사용하는 시각 토큰.
// 자세한 사용 규칙: design-guide/design_system.md
//
// 사용:
//   - HTML 산출물(html-framework/template.html 등): CSS 인라인에 hex 값 직접 사용,
//     주석으로 토큰 이름 표기 (정적 산출물이라 import 불가)
//   - 향후 React/Vite 프로젝트가 추가되면: `import { colors } from './design-guide/tokens'`
// ============================================================

// ─── Colors: Primary Scale ──────────────────────────────────
export const primary = {
  50:  '#EDF3FF',
  100: '#DFE8FF',
  200: '#C5D5FF',
  300: '#A1B8FF',
  400: '#7C91FD',
  500: '#5D68F7',  // 기본 강조색 (버튼, 가정변수 마크, 링크)
  600: '#4B4DED',
  700: '#3332D0',
  800: '#282CA8',
  900: '#1E2185',
  950: '#161863',
};

// ─── Colors: Surfaces (Dark / Light) ────────────────────────
export const dark = {
  bg:       '#0F0F12',
  card:     '#1A1A1F',
  border:   '#2A2A2F',
  headerBg: 'rgba(15,15,18,0.85)',  // backdrop-blur 용
};

export const light = {
  bg:       '#FFFFFF',
  surface:  '#F8F8FA',
  border:   '#E5E5E8',
  headerBg: 'rgba(255,255,255,0.85)',
};

// ─── Colors: Diagram (시각화 전용) ──────────────────────────
export const diagram = {
  client:          '#888',
  queryProcessing: '#5D68F7',
  execution:       '#22C55E',
  postingList:     '#22C55E',
  storage:         '#888',
  federation:      '#EAB308',
};

// ─── Typography ─────────────────────────────────────────────
export const typography = {
  heading: {
    family: 'Outfit, system-ui, sans-serif',
    googleFontHref: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
  },
  body: {
    family: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    cdnHref: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css',
  },
};

// ─── Layout (Tailwind container max-width 클래스) ──────────
export const layout = {
  marketing: 'max-w-7xl',  // xl — 마케팅 페이지 (Home 등)
  content:   'max-w-7xl',  // xl — 일반 컨텐츠
  article:   'max-w-7xl',  // xl — 아티클
  narrow:    'max-w-4xl',  // md — 좁은 본문 (Docs, Terms 등)
};

// ─── Spacing ────────────────────────────────────────────────
export const spacing = {
  section:        'py-20',           // 표준 섹션 상하 패딩
  sectionLg:      'py-24',           // 강조 섹션
  heroMin:        'min-h-[70vh]',    // Hero 최소 높이
  heroMinSub:     'min-h-[40vh]',    // Sub Hero 높이
  cardPadding:    'p-6',
  cardPaddingLg:  'p-8',
  gap:            'gap-6',
};

// ─── Hero Gradients ─────────────────────────────────────────
// 3종만 허용: main (홈) · sub (서브 페이지) · accent (아티클)
export const hero = {
  main:   'linear-gradient(135deg, #0F0F12 0%, #1A1A1F 100%)',
  sub:    'linear-gradient(180deg, #F8F8FA 0%, #FFFFFF 100%)',
  accent: 'linear-gradient(180deg, #F8F8FA 0%, #FFFFFF 100%)',  // sub과 동일, 차별화는 eyebrow/태그
};

// ─── Icon Sizes (Feather Icons 전용) ────────────────────────
// stroke="currentColor" 유지하여 부모 text 컬러 상속
export const iconSize = {
  inline: 16,   // 인라인 텍스트
  button: 20,   // 버튼 내
  card:   24,   // 카드
  large:  28,   // 큰 카드·헤로
};

// ─── Theme: text 색상 (다크 기준) ───────────────────────────
// useTheme() 반환값에 대응
export const text = {
  dark: {
    primary:   '#FFFFFF',
    body:      '#9CA3AF',  // text-gray-400 + font-medium 권장
    secondary: '#6B7280',  // text-gray-500
    heading:   '#FFFFFF',
  },
  light: {
    primary:   '#0F0F12',
    body:      '#4B5563',
    secondary: '#6B7280',
    heading:   '#0F0F12',
  },
};

// ─── Neutrals (grey scale, Tailwind 호환) ───────────────────
export const neutral = {
  50:  '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

// ─── Semantic (재무 모델링 도메인) ──────────────────────────
// 매출-비용-이익 위계. 비용은 빨강 대신 차분한 neutral 사용.
// 이익만 diagram.execution(green-500)으로 양의 신호 강조.
export const semantic = {
  revenue:  '#1E2185',  // primary.900 — 매출 계열
  cost:     '#374151',  // neutral.700 — 비용 계열
  profit:   '#22C55E',  // green-500   — 이익 (양의 신호)
  positive: '#22C55E',  // green-500   — 증감 양수
  negative: '#DC2626',  // red-600     — 증감 음수 (관행상 빨강 유지)
  input:    '#5D68F7',  // primary.500 — 입력 변수 (가정변수 마크)
  // 위계 보조 (sub-카테고리)
  revenueSub: '#3332D0', // primary.700
  costSub:    '#6B7280', // neutral.500
};
