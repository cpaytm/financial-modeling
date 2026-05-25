# Financial Modeling Design System

본 레포의 HTML 산출물·문서·향후 페이지의 시각 일관성을 보장하는 디자인 시스템.

토큰의 실제 값은 [`ds/tokens.js`](../ds/tokens.js) — 단일 진실 소스.

---

## 역할

| 구분 | 역할 |
|------|------|
| 디자이너·기획자 | UI 규칙을 본 가이드에 정의. 토큰 값(컬러·간격·타이포)은 `ds/tokens.js`에서 수정. |
| 개발자 | 본 가이드의 컴포넌트만 사용. 임의 스타일 수정 금지. 없는 게 필요하면 "요청"으로 추가. |
| 점진 적용 | 기존 산출물 한번에 바꿀 필요 없음. 새 산출물부터 DS 적용. |

---

## 점진 적용 가이드

이미 운영 중인 산출물(예: `examples/getcha-fy26/index.html`)은 한번에 전환하지 않음.

1. **신규부터 DS 적용** — 새로 만드는 모든 HTML 산출물은 본 가이드의 토큰·컴포넌트로만 구성. 레거시 코드는 건드리지 않음.
2. **수정 작업 시 같이 전환** — 버그 수정·기능 추가로 기존 산출물을 손대게 될 때 해당 섹션만 DS로 교체. 전체 리팩토링 아님.
3. **컬러·폰트 토큰부터 통일** — 가장 쉬운 첫 단계: 하드코딩된 hex를 `primary.500` 등 토큰 참조로 교체. 기능 영향 없음.
4. **데이터·이벤트 로직 유지** — DS는 시각 래퍼. 시뮬레이터·차트·시뮬레이션 엔진 등 기능 로직은 그대로.

---

## 페이지/산출물 레이아웃

향후 React/Vite 등 동적 페이지가 추가될 경우 3가지 템플릿 중 하나 사용.

| 템플릿 | 용도 | 구성 |
|--------|------|------|
| `StandardLayout` | Home, About, Engine, Demo, Blog, Contact | 상단 Hero + 섹션 스택 |
| `SidebarLayout` | Docs 상세 | 좌측 LNB + 본문 |
| `ArticleLayout` | Blog 상세 | 좌측 TOC (sticky) + 본문 |

현재 레포의 인터랙티브 트리(`framework/template.html`)는 별도 카테고리 — Canvas 기반 단일 페이지 앱.

---

## Hero Variants

3가지 variant만 허용. 개발자가 임의로 배경·높이·패딩을 수정하지 않음.

| Variant | 용도 | 톤 | 최소 높이 |
|---------|------|-----|----------|
| `main` | 홈 전용 | 짙은 뉴트럴 + 큐브 영역 | `min-h-[70vh]` |
| `sub` | 서브 페이지 | 은은한 뉴트럴 | `min-h-[40vh]` |
| `accent` | 아티클 상세 | sub와 동일 톤, 차별화는 eyebrow·태그 | `min-h-[40vh]` |

- ⚠️ Hero 배경·높이·패딩을 인라인 style로 수정 금지
- ⚠️ 새 variant가 필요하면 DS 담당자에게 요청 (하단 참조)

---

## Colors

### Primary Scale

투자·금융 톤에 맞춘 차분한 인디고 계열. 강조·CTA·링크에 사용.

| Token | Hex | 용도 |
|-------|-----|------|
| `primary.50`  | `#EDF3FF` | 매우 옅은 배경 |
| `primary.100` | `#DFE8FF` | 옅은 배경 |
| `primary.200` | `#C5D5FF` | hover 배경 |
| `primary.300` | `#A1B8FF` | 보조 강조 |
| `primary.400` | `#7C91FD` | 본문 강조 |
| **`primary.500`** | **`#5D68F7`** | **기본 강조색 (버튼, 가정변수 마크, 링크)** |
| `primary.600` | `#4B4DED` | 호버·active |
| `primary.700` | `#3332D0` | pressed |
| `primary.800` | `#282CA8` | 진한 배경 |
| `primary.900` | `#1E2185` | 가장 진한 강조 |
| `primary.950` | `#161863` | 매우 진한 강조 |

### Surfaces

| Token | Dark | Light |
|-------|------|-------|
| `bg` | `#0F0F12` | `#FFFFFF` |
| `card` / `surface` | `#1A1A1F` | `#F8F8FA` |
| `border` | `#2A2A2F` | `#E5E5E8` |
| `headerBg` | `rgba(15,15,18,0.85)` | `rgba(255,255,255,0.85)` |

### Diagram (시각화 전용)

| Token | Hex | 용도 |
|-------|-----|------|
| `client`          | `#888`    | 클라이언트 노드 |
| `queryProcessing` | `#5D68F7` | 쿼리 처리 (primary) |
| `execution`       | `#22C55E` | 실행 (green-500) |
| `postingList`     | `#22C55E` | 포스팅 리스트 |
| `storage`         | `#888`    | 스토리지 |
| `federation`      | `#EAB308` | 페더레이션 (yellow-500) |

---

## Typography

| Role | Font | Source |
|------|------|--------|
| Heading | **Outfit** | [Google Fonts](https://fonts.google.com/specimen/Outfit) |
| Body | **Pretendard** | [orioncactus/pretendard](https://github.com/orioncactus/pretendard) |
| Code | monospace (system) | — |

### 위계

| 레벨 | 사용 |
|------|------|
| Hero Title | h1, Outfit 700, 64px+ |
| Section Title | h2, Outfit 600, 36~48px |
| Card Title Large | h3, Outfit 600, 24~32px |
| Card Title Medium | h4, Outfit 600, 18~22px |
| Card Title Small | h5, Outfit 500, 16~18px |
| Body | p, Pretendard 400, 14~16px |
| Sub | p, Pretendard 400, 12~14px |
| Secondary | p, Pretendard 400, 11~12px |

### CDN 로드 (HTML)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" rel="stylesheet">
```

---

## Components

### Card

```
variants: base | alt | hover | accent
```

| Variant | 스타일 |
|---------|--------|
| `base`   | `bg-card + border` (기본) |
| `alt`    | `surface / card-dark` (배경 교체) |
| `hover`  | `hover: lift + border` |
| `accent` | gradient 배경 (primary 톤) |

### Badge

```
variants: category | tag | tech | status | adopted
```

| Variant | 용도 | 예시 |
|---------|------|------|
| `category` | 분류 | Tech |
| `tag`      | 해시태그 | #Graph |
| `tech`     | 기술 | Full-text Search |
| `status`   | 상태 | IN PROGRESS |
| `adopted`  | 채택 | Apache Lucene |

### Button

```
variants: primary | outline | text
```

| Variant | 용도 |
|---------|------|
| `primary` | 주요 CTA |
| `outline` | 보조 액션 |
| `text`    | 인라인 링크 |

---

## Icons — Feather Icons 전용

[Feather Icons](https://feathericons.com/)만 사용. 다른 라이브러리(Heroicons, Lucide 등) 혼용 금지.

### 사용 규칙

- ✅ `stroke="currentColor"` 유지 (부모 text 컬러 상속)
- ✅ 크기는 4단계만: **16(inline) / 20(button) / 24(card) / 28(large)**
- ✅ SVG 인라인 또는 `<i data-feather="...">` 후 `feather.replace()`
- ❌ 다른 아이콘 라이브러리 혼용

### 자주 쓰는 아이콘

| Icon | 용도 |
|------|------|
| `database`     | 데이터·엔진 |
| `search`       | 검색·풀텍스트 |
| `target`       | 벡터 검색 |
| `share-2`      | 그래프 |
| `server`       | 서버 모드 |
| `package`      | 내장 모드 |
| `book`         | 문서 |
| `file-text`    | 보고서·결정문 |
| `lock`         | 권한 |
| `link-2`       | 외부 링크 |
| `external-link`| 외부 이동 |
| `check`        | 체크리스트 |
| `sun` / `moon` | 테마 토글 |
| `menu`         | 모바일 GNB |
| `github` / `linkedin` | 소셜 |

---

## Layout 토큰

| Token | 값 | Tailwind |
|-------|-----|---------|
| `layout.marketing` | xl | `max-w-7xl` |
| `layout.content`   | xl | `max-w-7xl` |
| `layout.article`   | xl | `max-w-7xl` |
| `layout.narrow`    | md | `max-w-4xl` |

## Spacing 토큰

| Token | 값 |
|-------|-----|
| `spacing.section`       | `py-20` |
| `spacing.sectionLg`     | `py-24` |
| `spacing.heroMin`       | `min-h-[70vh]` |
| `spacing.heroMinSub`    | `min-h-[40vh]` |
| `spacing.cardPadding`   | `p-6` |
| `spacing.cardPaddingLg` | `p-8` |
| `spacing.gap`           | `gap-6` |

---

## Section Variants

| Variant | 배경 |
|---------|------|
| (default) | dark `#0F0F12` / light `#FFFFFF` |
| `alt`     | dark `black` / light `#F8F8FA` |
| `accent`  | Primary gradient (항상 어두운 톤) |

---

## Animation — Reveal

스크롤 시 등장 애니메이션. `stagger` 옵션으로 순차/계단식 효과.

- `<Reveal>` — 단일 요소
- `<RevealGroup stagger={0.15}>` — 순차 등장
- `stagger={0.30}` — 계단식

---

## DS에 없는 컴포넌트가 필요할 때

개발자가 임의 스타일 만들지 않음. DS 담당자에게 추가 요청.

**요청 시 포함할 정보**

1. 어떤 페이지·산출물의 어떤 영역인지 (스크린샷)
2. 기존 DS 컴포넌트로 해결 안 되는 이유
3. 참고 이미지나 경쟁 사이트 예시
4. 반복 사용 가능성 (일회성 vs 여러 곳)

**추가 후 프로세스**

1. DS 담당자가 컴포넌트 설계 → `ds/tokens.js`에 토큰 추가, 가이드에 반영
2. 본 문서에 실물 + 코드 예시 업데이트
3. 개발자는 가이드 보고 사용
4. 같은 요구사항이 또 나와도 동일 컴포넌트 재사용

---

## 본 레포에서의 적용

| 산출물 | 적용 여부 | 비고 |
|--------|----------|------|
| [`framework/template.html`](../framework/template.html) | ✅ 적용 | Outfit·Pretendard 폰트, primary.500 강조색, light surfaces |
| [`examples/getcha-fy26/index.html`](../examples/getcha-fy26/index.html) | ❌ 미적용 | 레거시 참조 구현. 차후 수정 시 점진 적용 |
| (향후) 마케팅 페이지·문서 사이트 | — | 본 DS 100% 준수 |
