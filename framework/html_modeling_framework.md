# 비상장 기업 추정 모델링 방법론 및 구현 프레임워크

**HTML 인터랙티브 트리로 모델 구조를 검토한 뒤, 코워커/LLM이 Excel 재무모델로 구현할 수 있게 만드는 분석 체계와 구현 청사진.**

뮤렉스파트너스 · 2026.03

본 문서는 분석 방법론(Part I), HTML 인터랙티브 트리의 구현 프레임워크(Part II), 최종 산출물인 Excel 모델의 구현 규약(Part III), 그리고 운영·거버넌스(Part IV)로 구성된다. 서비스 구현 사양이 아니라 분석가와 코워커/LLM이 같은 구조를 보고 Excel 모델을 만들기 위한 작업 체계·산출물 구조·구현 청사진을 정리한 것이다.

본 프레임워크는 회사별 BM / 모델 구조를 HTML 인터랙티브 트리로 옮기기 위한 공통 구현 청사진이다.

---

## 목차

**Part I — 방법론**
1. 배경
2. 방법론 개요
3. 입력 경로 (Case A: 엑셀 / Case B: 리서치)
4. 매출 추정
5. 비용 추정
6. 재무상태표 연동
7. 밸류에이션

**Part II — HTML 인터랙티브 트리 구현 프레임워크**
8. 모듈 구성
9. 데이터 계층
10. 트리 구조
11. 렌더링 엔진
12. UI 컴포넌트
13. 시뮬레이터
14. 시뮬레이션 엔진
15. 업종별 일반화 매핑

**Part III — 엑셀 모델 (최종 산출물)**
16. 표준 준수
17. Excel 구현 방식과 보조 IR
18. 메타데이터 임베드
19. 양방향 동기화의 한계

**Part IV — 시나리오·검증·거버넌스**
20. 시나리오·민감도 분석
21. 검증·정합성
22. LLM의 자리
23. 도메인 라이브러리 (7층)
24. 한국 회계 실무 특화
25. 한계와 주의점

**부록**
- A. 적용 사례 — 케이카 2023
- B. 구현 체크리스트
- C. HTML 파일 구조

---

# Part I — 방법론

## 1. 배경

비상장 기업의 투자 심사·자문에서 사업모델의 매출/비용 추정은 핵심 의사결정 근거이나, 다음 비효율이 존재함.

- **분석의 비효율**: 기존 엑셀 모델이 있어도 수십 시트·수백 셀 참조가 얽혀 전체 그림을 파악하기 어렵다. 모델이 없는 경우에는 사업보고서·증권사 리포트·과거 재무제표에서 추정 로직을 직접 설계해야 하나 체계화되어 있지 않다.
- **시나리오 분석의 번거로움**: 핵심 가정 하나를 바꿀 때 여러 시트를 오가며 수작업이 필요하고, 결과 변동을 즉시 확인하기 어렵다.
- **커뮤니케이션의 한계**: 투심위에서 엑셀 셀을 짚어가며 설명하는 방식은 직관적이지 않고, 즉석 질문에 실시간 응답이 어렵다.
- **재현성 부족**: 담당자가 바뀌면 로직 재파악에 상당한 시간이 소요됨.

---

## 2. 방법론 개요

### 2.1 핵심 흐름

```
[입력: 사업계획 엑셀  or  리서치 자료]
   ↓ 분석 (LLM + 사람)
[HTML 인터랙티브 트리 — 구조화·검토 레이어]
   ↓ 사람 검토·디렉션 (트리에서 직접 조정)
[확정된 추정 구조: 드라이버·수식·가정변수]
   ↓ 결정론적 변환
[엑셀 모델 — 최종 산출물]
```

### 2.2 두 산출물의 역할

- **HTML 인터랙티브 트리**: 추정 로직의 시각적 분해, 가정변수 노출, 시뮬레이터, 객관/주관 구분, 시나리오 케이스 — **Excel 구현 전에 구조를 검토하는 자리**
- **엑셀 모델**: 회계·감사·실무의 표준 산출물. 표준 템플릿(FAST 등)에 따라 시트 구조·수식·명명범위·검증 셀이 결정론적으로 생성됨 — **최종 산출물의 자리**

HTML은 단순 시각화가 아니라 **Excel 모델링 지시서 겸 검토 인터페이스** 역할을 한다. 트리에서 확정된 구조가 Excel의 시트, 행, 수식, 가정변수로 옮겨진다. JSON/IR은 자동화가 필요할 때 쓰는 보조 형식이며, 핵심 목표는 수식이 들어간 Excel 모델을 정확히 구현하는 것이다.

### 2.3 확률성 격리 원칙

LLM은 본질적으로 확률모델이므로 다음 원칙을 따른다.

- **허용**: 비정형 → 정형 변환 (사업보고서 → 사업모델 구조 추출, 자연어 → 드라이버 명세)
- **금지**: 숫자 계산, 합계, 잔액 검증, 회계 규칙 적용, 최종 가정 결정
- **격리**: LLM 출력은 항상 (a) JSON 스키마 강제, (b) 룰 엔진 검증, (c) 사람 검토 게이트를 통과한 후 결정론적 엔진(엑셀 생성)으로 넘어간다.

LLM 호출은 `temperature=0`, 모델 버전 핀, 프롬프트 Git 관리, 회귀 테스트 스위트 운영을 기본으로 한다.

---

## 3. 입력 경로

### 3.1 Case A — 기존 엑셀 모델 분해

회사가 만든 사업계획, 자문사 모델, 내부 추정 모델 등이 입력. 핵심은 **변환이지 복제가 아니라는 점**이다. 입력은 시트 난잡·추정 근거 불명, 출력은 드라이버 명시·가정 출처 기록·시뮬레이션 가능한 표준 모델.

**프로세스**

```
엑셀 업로드 → 시트·셀 참조 추적 → 분석 문서 → 검토·디렉션 → HTML 트리 → 엑셀 모델
```

**분석 문서에 포함되는 항목**

- 시트맵 및 모델 개요 — 시트를 매출/비용/B·S/가정/기타로 분류, 시트 간 참조 매핑
- 매출 체계 — BM별 Q×P 재귀 분해, 말단 가정변수까지 트리 전개
- 비용 체계 — 변동원가/반변동/고정비/감가/이자 분류, 매출-비용 교차 참조
- B/S — 운전자본 회전일수, CAPEX-감가상각 연결, 차입금 스케줄
- P&L 정합성 — 수직·수평 검증, B/S 균형
- 가정변수 일람 — 모든 하드코딩 입력값, 객관/주관 태깅
- 이슈·디렉션 요청 — 모호점, 수식 오류 의심, 대안 해석

**수치 정합성**

원본 엑셀 값과 변환 결과의 전 항목·전 연도 크로스체크가 가능. 수식 재현 불가 항목(월별 빈티지 등)은 원본 실제값을 기본값으로 저장하고 Proportional Scaling을 적용함(Part II §14).

### 3.2 Case B — 리서치 기반 신규 설계

엑셀 모델이 없을 때. 사업보고서(DART), 증권사 리포트, 과거 재무제표, 산업 리서치, IR 자료에서 추정 로직을 직접 설계.

**입력 자료별 추출 정보**

| 자료 유형 | 추출 정보 |
|-----------|----------|
| 사업보고서 (DART) | BM 분류, 매출·비용 체계, 주요 KPI |
| 증권사 리포트 | 매출 성장률 가정, 목표 밸류에이션, 핵심 드라이버 |
| 과거 재무제표 | 원가율·이익률 추이, 운전자본 회전일수, CAPEX 패턴 |
| 산업 리서치 | TAM/SAM/SOM, 경쟁 구도, 가격 트렌드 |
| 회사 IR 자료 | 점유율·신규사업 등 주관적 가정의 근거 |

**설계 문서**

Case A의 분석 문서와 동일한 체계이되, 엑셀 셀 참조 대신 **추정 근거와 데이터 소스**가 명시됨.

```
매출 합계
├── BM A (매출 = Q × P)
│   ├── Q = 시장규모 × 점유율
│   │   ├── 시장규모 = 기준모수 × 침투율
│   │   │   ├── 기준모수 [객관] 통계청
│   │   │   └── 침투율 [객관] 산업리서치
│   │   └── 점유율 [주관] 과거 실적 + 경영진 계획
│   └── P [주관] 상한/하한 설정, 시나리오 분리
```

### 3.3 두 경로의 차이

| 항목 | Case A (기존 모델) | Case B (리서치 기반) |
|------|---------|---------|
| 분석 방향 | 기존 로직 역추적·분해 | 자료에서 로직 신규 설계 |
| 가정변수 출처 | 엑셀 내 하드코딩 값 | 과거 실적 + 리서치 |
| 기본값 | 엑셀 실제 계산 결과 | 설계 수식의 계산 결과 |
| 정합성 검증 | 원본과 크로스체크 | 과거 실적과 백테스트 |

---

## 4. 매출 추정 방법론

### 4.1 핵심 원칙

매출을 가능한 범위까지 쪼개고, 쪼갠 요소를 **객관적 추정 가능**한 부분과 **주관적 판단 필요**한 부분으로 구분한다.

매출 전체는 등락이 작아 보여도 구성요소는 서로 다른 방향·크기의 트렌드를 가짐. 분해해야 추정의 논리적 근거가 생긴다.

### 4.2 Q × P 재귀 분해

```
매출 = Q × P
├── Q = 시장규모 × 점유율
│    ├── 시장규모 = 기준모수 × 침투율
│    │    ├── 기준모수 (20-65세 인구, 스마트폰 보유자, 제조 CAPA 등)
│    │    └── 침투율 (렌터카 등록비율, SaaS 도입률, 온라인 전환율 등)
│    └── 점유율
└── P = 단가
```

**분해를 멈추는 기준**: 트렌드를 식별할 수 있을 때까지. 무한정 쪼개는 게 아니라 객관적 트렌드가 보이거나 주관적 판단 포인트가 명확해지면 멈춤.

### 4.3 객관/주관 구분

| | 객관적 요소 | 주관적 요소 |
|---|---|---|
| 근거 | 공신력 있는 데이터 소스 (통계청·협회·정부) | 회사 경영 능력·전략·경쟁 환경 |
| 추정 | 트렌드 외삽, 직접 적용 | 상한/하한 설정 → 공격/기본/보수 시나리오 |

주관적 요소는 **상한/하한을 먼저 정한다**. "아무리 좋아도 이 이상은 어렵다"는 천장과 "아무리 나빠도 이 이하로는 안 떨어진다"는 바닥. 그 안에서 시나리오를 나눈다.

### 4.4 업종별 적용

| 업종 | Q 분해 | P 분해 |
|------|--------|--------|
| SaaS | 신규가입 - 이탈 = 순증 → 누적 구독자 | ARPU (플랜별 가중평균) |
| 커머스 | Traffic × 전환율 = 주문건수 | AOV |
| 중고차 유통 | 시장판매대수 × 점유율 = 판매대수 | 차급별 ASP |
| 제조업 | CAPA × 가동률 = 출하량 | 제품별 ASP |
| 마켓플레이스 | 공급자 × 건당거래 = 총거래건수 | 건당거래액 × 수수료율 |
| 바이오 | 적응증별 환자 풀 × 침투율 | 약가 × 보험급여율 |
| 콘텐츠 | 이용자 × 체류시간 = 인벤토리 | CPM / 구독료 |

### 4.5 브릿지 차트

분해 요소의 연도 간 변동을 워터폴로 시각화. 매출 전체는 평탄해 보여도 구성요소의 상승·하락 효과가 상쇄되어 나타나는 경우가 많다. 브릿지로 "어떤 요소가 매출을 끌어올리고 갉아먹는지"가 드러난다. (구현: Part II §12.2)

---

## 5. 비용 추정 방법론

### 5.1 비용 분류

| 구분 | 드라이버 | 예시 |
|------|---------|------|
| 변동원가 | 매출 × 원가율, Q × 단위원가 | 원재료, 외주, 물류, 결제수수료 |
| 반변동원가 | 구간별 고정 | 교대인력, 서버 Tier |
| 고정비 | 인원 × 인당단가, 면적 × 단가 | 인건비, 임차료, R&D, 마케팅 |
| 감가상각 | 취득가 × (1-잔존율) / 내용연수 | 설비, 차량, 소프트웨어 |
| 이자비용 | 차입금 × 이자율 | 운영자금, 설비자금, PF |

### 5.2 매출-비용 교차 참조

매출과 비용이 공유하는 드라이버를 반드시 식별한다. 시뮬레이터에서 공유 변수 한 번 변경 → 매출·비용 양쪽이 동시 변동해야 모델의 일관성이 유지됨.

예: 중고차 판매대수를 바꾸면 차량 판매 매출, 재고자산원가, 판매보증비가 동시에 변동. 점유율을 바꾸면 매출과 판매대수 기반 비용이 함께 반영.

---

## 6. 재무상태표 연동

P&L만으로는 밸류에이션이 불완전.

- **운전자본**: 매출채권 = 매출 × 회전일수/365, 재고 = 원가 × 회전일수/365, 매입채무 = 원가 × 회전일수/365. 운전자본 증감이 FCF의 핵심.
- **CAPEX**: 유지보수(기존 자산 교체) + 성장(신규 투자). 감가상각과 역으로 연결.
- **차입금**: 신규 차입·상환 스케줄, 이자율. 순차입금이 EV → Equity Value 전환의 핵심.

---

## 7. 밸류에이션

### 7.1 DCF

```
EV = Σ FCF_t / (1+WACC)^t + TV / (1+WACC)^N
Equity Value = EV - 순차입금
```

수식 자체는 단순하나 모든 입력이 주관적 미래 추정. g를 2%→3%, WACC를 9%→8%로 바꾸면 TV가 거의 2배. **단일 숫자 출력은 거짓 확신**이므로 시나리오·민감도·몬테카를로로 분포로 본다.

### 7.2 멀티플

EV/EBITDA, PER, PSR. DCF와 병행 산출하여 교차 검증.

### 7.3 가정 거버넌스

- 각 가정에 출처 기록 (Bloomberg 시각, 가이던스 페이지, 컨센서스)
- 변경 이력 (누가·언제·왜)
- 동료 검토
- 허용 범위 사전 정의 (g ≤ 명목 GDP 성장률)

---

# Part II — HTML 인터랙티브 트리 구현 프레임워크

업종 무관 프레임워크. 이 구조를 따르면 어떤 사업모델이든 인터랙티브 트리·시뮬레이터·시나리오 비교가 가능한 단일 HTML로 구현할 수 있다.

## 8. 모듈 구성

단일 HTML 파일 내 5개 모듈.

```
┌─ 데이터 계층 (Data Layer)            YRS, HIST_N, D
├─ 파생 인덱스                         INPUT_KEYS, TREE, DEFAULTS_S, SIM_SECS
├─ 렌더링 엔진 (Canvas)                doLayout, drawNode, drawConns, hitTest, pan/zoom/drag
├─ UI 컴포넌트                         차트 팝업 · 브릿지 · 재무제표 · 가정변수 일람
└─ 시뮬레이션                          simCalc, SV/SR, SIM_SECS 슬라이더, _cases 관리
```

외부 의존성은 Chart.js CDN 하나뿐. 나머지는 인라인 JavaScript.

---

## 9. 데이터 계층

### 9.1 `MODEL` 객체 — 모든 시계열 데이터의 단일 저장소

```js
const MODEL = {
  variable_key: {
    v:    [v_y1, v_y2, ..., v_yN],  // 연도별 값 (필수)
    u:    '원' | '명' | '대' | '%',   // 단위 표기 (필수)
    parent: 'parent_key' | null,       // 트리 parent (필수)
    type: 'input' | 'computed',        // 입력/계산 구분 (필수)
    formula: 'q * p',                  // computed 수식 (computed 필수)
    c:    '#534AB7',                  // 차트·트리 색상 (선택)
    pct:  1,                           // 비율 변수 표시 (선택)
    role: 'revenue' | 'cost' | ...     // 의미 태그 (선택)
    desc: '추정 근거·출처·계산식'      // 노드 클릭 시 표시 (필수)
  },
  ...
}
```

**원칙**

- 매출·비용·B/S·밸류에이션의 모든 항목이 같은 스키마를 따른다.
- `parent`를 기준으로 `TREE`가 자동 생성된다.
- `type:'input'`은 슬라이더와 가정변수표로 자동 편입된다.
- `type:'computed'`는 `formula`를 기준으로 `simCalc()`가 계산한다.
- `desc`에는 그 숫자의 근거를 문장으로 적는다. 실적값이면 출처를, 추정값이면 논리와 범위를 적는다.
- 선두에 `[객관]` `[주관]` 같은 분류 태그를 붙여 두어도 되지만 **화면에는 노출되지 않는다.** 렌더 직전에 벗겨내며(`descBody()`), 원문은 그대로 보존된다.

### 9.2 `INPUT_KEYS` — 입력값 자동 식별

```js
INPUT_KEYS = new Set(Object.keys(MODEL).filter(k => MODEL[k].type === 'input'));
```

`type:'input'`인 노드는 트리에서 **주황색 점(●) + "가정변수: 하드코딩"** 라벨이 붙고, 시뮬레이터·가정변수표에 자동 편입된다. 별도 `INPUT_KEYS` 수기 작성은 하지 않는다.

### 9.3 `YRS` — 시간축

```js
const YRS = ['2025','2026','2027','2028','2029','2030','2031'];
const HIST_N = 1;
const _isFc = i => i >= HIST_N;
```

배열 길이가 모든 `MODEL[key].v`의 길이와 일치해야 함. `HIST_N`개 연도는 실적(Historical)으로 잠금 처리되고, 이후 연도는 추정(Forecast)으로 슬라이더 조정 가능하다.

템플릿은 이 값을 기준으로 다음을 자동 처리한다.

- 시뮬레이터 실적 연도 잠금
- 연도 선택기 실적/추정 2행 분리
- 차트·테이블의 Historical/Forecast 밴드
- 추정 막대 opacity 및 추정 컬럼 음영

### 9.4 `DEFAULTS_S` — 기본값 자동 보존

```js
const DEFAULTS_S = deriveDefaultsFromModel(); // MODEL의 input 노드 v에서 자동 추출
let SV = {}; for (let k in DEFAULTS_S) SV[k] = DEFAULTS_S[k].slice();
```

- `DEFAULTS_S`: 원본 실적/사업계획값. 절대 변경하지 않음. 슬라이더의 주황색 마크 위치.
- `SV`: 현재 시뮬레이터 상태. 슬라이더 조작 시에만 변경.
- "기본값" 버튼은 `SV ← DEFAULTS_S` 복사.
- `DEFAULTS_S`를 수기로 다시 쓰지 않는다. `MODEL`와 기본값의 이중 입력을 막기 위함이다.

---

## 10. 트리 구조

### 10.1 MODEL.parent 기반 자동 트리

```js
D = {
  root: {label:'P&L', parent:null, type:'computed', formula:'op_profit', ...},
  rev: {label:'매출 합계', parent:'root', type:'computed', formula:'used_car_sales + auction_sales', ...},
  used_car_sales: {label:'중고차 판매', parent:'rev', type:'computed', formula:'ecommerce_sales + branch_sales', ...},
  ecommerce_sales: {label:'이커머스 중고차 판매', parent:'used_car_sales', type:'computed', formula:'ecommerce_units * ecommerce_asp', ...},
  ecommerce_units: {label:'이커머스 판매대수', parent:'ecommerce_sales', type:'computed', formula:'market_units * ecommerce_share', ...},
  market_units: {label:'시장판매대수', parent:'ecommerce_units', type:'input', ...},
  ecommerce_share: {label:'점유율', parent:'ecommerce_units', type:'input', pct:1, ...},
  ecommerce_asp: {label:'ASP', parent:'ecommerce_sales', type:'input', ...}
}
```

템플릿은 `MODEL[k].parent`를 따라 `TREE`를 자동 생성한다. 예전의 `N()` / `DR()` 생성자는 호환용 stub만 남겨두며 신규 모델에서는 쓰지 않는다.

**노드 속성**

| 속성 | 의미 |
|------|------|
| `id` | 유일 키 (펼침 상태·offset 추적용) |
| `label` | 트리 표시 텍스트 |
| `sub` | 부제 (수식 설명) |
| `bg/fg/sfg/bdr` | 배경·전경·부제·테두리 색상 |
| `parent` | 부모 노드 id. root만 `null` |
| `type` | `input`이면 드라이버 리프, `computed`면 그룹/계산 노드 |
| `formula` | Excel로 옮길 계산식 |
| `role` | `revenue`, `cost`, `profit`, `valuation` 등 의미 태그 |

### 10.2 트리 정의 패턴

상위 계산 노드의 수식에 들어가는 요소는 가능한 한 하위 노드로 둔다. 예를 들어 `이커머스 판매대수 = 시장판매대수 × 점유율`이면 `시장판매대수`와 `점유율`은 `이커머스 판매대수`의 자식이 되어야 한다.

### 10.3 트리 설계 규칙

| 규칙 | 이유 |
|------|------|
| root는 단일 — 매출/비용/이익이 자식 | Canvas 좌→우 단일 진행 방향 |
| 같은 데이터 키가 여러 노드 참조 가능 | 매출-비용 교차 참조 (판매대수, 전환건수) |
| 드라이버 노드는 더 이상 분해 불가 | 가정변수 또는 직접 계산 결과 |
| `sub`에 수식을 텍스트로 명시 | 사람이 트리만 봐도 로직 추적 가능 |
| 색상은 BM별로 묶음 | 시각적 그루핑 (legend와 일치) |

### 10.4 `openSet` — 펼침 상태

```js
let openSet = new Set(['root', 'rev']);  // 초기 펼침
```

노드 클릭 시 토글. 자식이 있는 노드만 토글 가능 (`canToggle`).

---

## 11. 렌더링 엔진 (Canvas 2D)

### 11.1 레이아웃 알고리즘

재귀적 좌→우 트리 배치.

```js
const NW=170, NH=48, DH=40, GX=22, GY=22, PAD=40;

function treeH_sub(n) {
  // 펼친 자식들의 총 높이 = 자식 높이 합 + 간격(GY)
  // 접힌 경우 노드 자체 높이만 반환
}
function doLayout(n, x, y, par) {
  // n을 (x, y+offset)에 배치, 자식은 x+NW+GX부터 재귀
  // parentMap[child] = parent (ancestor offset 추적용)
}
```

### 11.2 좌표 변환

```js
let cam = {x:0, y:0, s:1};  // 카메라 (pan + scale)

// 스크린 → 월드
function s2w(sx, sy) { return {x:(sx-cam.x)/cam.s, y:(sy-cam.y)/cam.s} }

// 그리기
ctx.translate(cam.x, cam.y);
ctx.scale(cam.s, cam.s);
```

### 11.3 노드 드래그 (개별 노드 위치 조정)

```js
let nodeOffsets = {};  // {nodeId: {dx, dy}}

function getPos(id) {
  // 자기 자신 + 모든 조상의 offset 누적
  let p = positions[id], dx=0, dy=0, cur=id;
  while (cur) {
    let o = nodeOffsets[cur];
    if (o) { dx+=o.dx; dy+=o.dy }
    cur = parentMap[cur];
  }
  return {x: p.x+dx, y: p.y+dy, ...};
}
```

부모를 옮기면 자식들이 자동으로 따라옴 (조상 체인 누적).

### 11.4 히트 테스트

```js
function hitTest(sx, sy) {
  let w = s2w(sx, sy);
  for (let i = allNodes.length-1; i >= 0; i--) {  // 위에서부터 검사
    let n = allNodes[i], p = getPos(n.id);
    if (w.x in [p.x, p.x+p.w] && w.y in [p.y, p.y+p.h]) {
      let inChart = (w.x >= p.x+p.w-ICON_W && w.y <= p.y+24);
      return {node: n, isChart: inChart};
    }
  }
}
```

오른쪽 아이콘 영역 클릭은 차트 팝업, 나머지는 펼침/접힘.

### 11.5 인터랙션

| 입력 | 동작 |
|------|------|
| 노드 클릭 (단순) | 펼침/접힘 토글 |
| 차트 아이콘 클릭 | 팝업 표시 |
| 노드 드래그 | nodeOffsets 갱신, 위치 자유 조정 |
| 빈 영역 드래그 | 카메라 pan |
| 휠 | 마우스 기준 zoom (cam.s 변경) |
| ESC | 모든 팝업 닫기 |

드래그 vs 클릭 구분: 8픽셀 이동 임계치 + 300ms 이내. 이 임계치 미만이면 클릭으로 처리.

---

## 12. UI 컴포넌트

### 12.1 차트 팝업

노드 클릭 시 표시. 구성: 제목 + 부제 + (다중 데이터셋 반복) → 라벨 + desc + 바 차트 + 테이블 + 단위.

```js
function showChart(node) {
  let datasets = [];
  if (node.data) datasets.push({label: node.label, key: node.data});
  if (node.extra) node.extra.forEach(e => datasets.push({label: e.label, key: e.data}));
  // 각 dataset: 7개 바 (연도) + 7컬럼 테이블 + 단위 표기 + desc
}
```

**바 높이**: `Math.max(Math.abs(v)/maxV * 130, 2)`px. 음수도 절대값 기준.

### 12.2 브릿지 (워터폴) 차트

매출 합계 노드의 차트 팝업에서 바 클릭 시 인라인 전개.

```js
let bridgeSelection = [];  // [yearIdx1, yearIdx2] 또는 [yearIdx1]

function toggleBridgeInline(body, parentSec, yearIdx, barEl) {
  // 0개: 추가 / 1개: 두 번째 추가, 정렬 / 2개: 리셋
}
function renderBridge(fi, ti, parentSec) {
  // BMs별 delta = v[ti] - v[fi]
  // items = [from total, ...BM deltas, to total]
  // Chart.js stacked bar로 워터폴 효과 (transparent base + value top)
}
```

**핵심 로직**: 두 연도 사이의 차이를 BM별로 분해. 합산이 total delta와 일치하는지 검증 가능.

### 12.3 재무제표 테이블 (P&L 등)

전체 토글 가능 트리형 테이블.

```js
function row(label, key, indent, bold, color, parentGroup) {
  // indent: 들여쓰기 레벨 (0=상위, 1=중간, 2=리프)
  // bold + indent=0: 토글 가능한 상위 행
  // parentGroup: 이 행이 속한 상위 그룹 키 (tr.dataset.group)
}
// 토글 시: tbl.querySelectorAll('tr[data-group="X"]') 모두 display 전환
```

### 12.4 가정변수 일람

`MODEL`의 `type:'input'` 노드를 parent별로 자동 그룹화한다. 표에는 변수명, 설명 버튼, 연도별 값이 표시된다.

설명은 긴 텍스트를 표 안에 직접 넣지 않고 `ⓘ` 버튼 + 모달로 표시한다. `desc` 작성 규약은 다음과 같다.

```text
[객관] 과거 실적 CAGR을 기준으로 산정. 2025년 이후는 시장 성장률을 적용.
[주관] 경영진 목표치를 기준으로 상한/하한을 설정. Base case는 중간값 사용.
[계산] 매출 = 판매대수 × ASP. 판매대수는 시장판매대수 × 점유율.
```

선두 대괄호 태그는 모달의 색상 칩으로 표시되고, 본문은 마침표 기준 불릿으로 나뉜다.

### 12.5 숫자 표기 규칙

표시값은 공통 `fmtSmart()`를 경유한다. 내부 계산값은 반올림하지 않는다.

| 값 유형 | 표시 |
|---|---|
| `%` / `pct:1` | 소수 1자리 |
| `|v| >= 10` | 정수 반올림 + 천 단위 콤마 |
| `|v| < 10` | 소수 최대 2자리 |
| 원화 큰 숫자 | 차트 축약 표기에서 조/억/만 단위 사용 |

---

## 13. 시뮬레이터

### 13.1 `SIM_SECS` — 슬라이더 정의

```js
const SIM_SECS = [
  {t: '섹션 제목', c: '#534AB7', v: [
    {k: 'variable_key', l: '슬라이더 라벨', u: '단위', min: 0, max: 1500, step: 10, p: 1},
    ...
  ]},
  ...
];
```

| 속성 | 의미 |
|------|------|
| `k` | `SV[k]` 키 |
| `l` | 슬라이더 옆 라벨 |
| `u` | 표시 단위 (값 포맷 분기) |
| `min/max/step` | 슬라이더 범위 |
| `p: 1` | 비율 변수 (0~1 입력, %로 표시·반올림 방식 분기) |

### 13.2 연도 선택기 (다중 토글)

```js
let _simYrs = new Set();  // 빈 Set = 전체 추정 연도

// 클릭 시 토글, 모든 추정 연도 선택 시 다시 빈 Set으로
if (_simYrs.size === YRS.length - HIST_N) _simYrs.clear();

function _getAffectedYears() {
  if (_simYrs.size === 0) return YRS.map((_, i) => i).slice(HIST_N);
  return [..._simYrs].filter(i => _isFc(i)).sort();
}
```

연도 선택기는 실적/추정 2행으로 분리된다. 실적 행은 회색 점선·잠금 상태이고, 추정 행만 클릭 가능하다.

### 13.3 슬라이더 행 구조

```
┌────────────────────────────────────────┐
│ 변수명 (연도)   기본값↺   현재값      │
│ ▬▬▬●▬▬|▬▬▬▬▬▬▬   (단일 값 슬라이더)  │
│              ▲ 주황 마크 = 기본값      │
│ ±%  ▬▬▬▬|▬▬▬▬▬   +0%   ↺              │
│      (-50 ~ +100% 일괄 조정)           │
└────────────────────────────────────────┘
```

- **단일 값 슬라이더**: 선택된 연도들에 같은 값 일괄 적용
- **±% 슬라이더**: mousedown 시점의 `SV[k]`를 base로 잡고 `base × (1+pct/100)` 적용
- **기본값 마크**: `DEFAULTS_S[k][dispYr]`이 range 안에 있으면 주황 점 표시
- **기본값 링크**: 어느 연도든 기본값과 다르면 표시, 클릭 시 모든 연도 복귀

### 13.4 케이스 (시나리오) 관리

```js
let _cases = {};       // {'A': {sv: snapshot}, 'B': {...}}
let _activeCase = null; // null = base, 'A'/'B'/... = 활성 케이스

function _addCase() {
  let next = String.fromCharCode(65 + Object.keys(_cases).length); // A, B, C, ...
  _cases[next] = _saveCaseState();
  _activeCase = next;
}
function _switchCase(name) {
  if (_activeCase) _cases[_activeCase] = _saveCaseState();  // 현재 상태 저장
  _activeCase = name;
  if (name && _cases[name]) _loadCaseState(_cases[name]);
  else for (let k in DEFAULTS_S) SV[k] = DEFAULTS_S[k].slice();
}
```

**원칙**

- 활성 케이스가 있을 때 슬라이더 조작 시 자동으로 해당 케이스에 저장(`_updateActiveCase`)
- 기본값(null)은 항상 보존 — 원점 복귀 가능
- 케이스 전환 시 전체 P&L → B/S → 밸류에이션이 즉시 재계산
- 최대 10개 (`A` ~ `J`)

---

## 14. 시뮬레이션 엔진

### 14.1 핵심 패턴: MODEL.formula 기반 결정론적 재계산

```js
type:'computed',
formula:'market_volume * share * asp'
```

템플릿의 기본 엔진은 `MODEL[k].formula`를 파싱해 토폴로지 순서로 계산한다. 회사별 모델에서 별도 `simCalc()`를 수기로 작성하지 않는다. 수식이 닫히지 않는 특수 항목만 custom layer에서 확장한다.

지원 함수:

| 함수 | 의미 |
|---|---|
| `SUM(a,b,c)` | 같은 연도 합산 |
| `MIN(a,b)` / `MAX(a,b)` / `AVG(a,b)` | 같은 연도 기준 계산 |
| `IF(cond,a,b)` | 조건식 |
| `PREV(x)` | 전년도 값. `PREV(self)` 롤포워드 지원 |
| `SUMALL(x)` | 전체 기간 합계 |
| `LAST(x)` / `FIRST(x)` | 마지막/첫 연도 값 |

### 14.2 세 가지 계산 방식

| 방식 | 적용 대상 | 예시 |
|------|---------|------|
| **정확 재계산** | 수식이 닫힌 형태 | Q × P, 판매대수 × 단위원가, 차입금 × 이자율 |
| **롤포워드** | 전년 잔액 + 당해 증감 | `PREV(debt) + borrowing - repayment` |
| **Proportional Scaling** | 세부 분해를 단순화한 항목 | 상세 차급 매출, 감가상각, 보험료 |
| **외삽 (실적값 + 비율)** | 인건비 등 인원·단가 곱 | labor = headcount × avg_salary |

### 14.3 `PREV(self)` 롤포워드

재무모델에서 B/S 잔액, 누적 구독자, 차입금, 이익잉여금은 자기참조 롤포워드가 자주 필요하다.

```js
installed_base: {
  type:'computed',
  formula:'PREV(installed_base) + new_units'
}
```

엔진은 `PREV(self)`의 self dependency를 순환참조로 보지 않고, 연도 순차 평가로 계산한다. 첫 연도의 `PREV()`는 0으로 처리한다. 기준연도 시작 잔액이 필요하면 별도 input 노드(`opening_balance`)를 두고 `opening_balance + PREV(self) + delta` 형태로 작성한다.

### 14.4 Proportional Scaling 공식

수식이 완전히 닫히지 않는 경우에만 폴백으로 사용한다.

```
r[k][i] = Actuals[k][i] × Π(input_ratio_j)

where input_ratio_j = SV[input_j][i] / DEFAULTS_S[input_j][i]
```

### 14.5 갱신 체인

슬라이더 조작 한 번에 다음 순서로 실행.

```
사용자 슬라이더 input
  ↓
SV[k][i] = newValue            (1) 입력값 갱신
  ↓
simCalc()                       (2) 전체 P&L·B/S 재계산
  ↓ for k in r: MODEL[k].v = r[k]
renderAll()                     (3) Canvas 트리 재렌더링
  ↓
refreshOpenChart()              (4) 열려있는 팝업 차트 갱신
  ↓
_updateActiveCase()             (5) 활성 케이스에 자동 저장
```

**성능**: 연도 × ~50항목 = ~350 셀 재계산. 16ms 이내, 60fps 유지 가능.

---

## 15. 업종별 일반화 매핑

### 15.1 SaaS (구독 모델)

```js
D = {
  new_signups: {parent:'cum_subs', type:'input', v:[...], u:'명', desc:'[객관] 마케팅 채널별 신규 가입.'},
  churn:       {parent:'cum_subs', type:'input', v:[...], u:'%', pct:1, desc:'[주관] 월간 이탈률.'},
  cum_subs:    {parent:'rev', type:'computed', formula:'PREV(cum_subs) * (1 - churn) + new_signups', v:[...], u:'명', desc:'[계산] 전년 누적 구독자에서 이탈을 차감하고 신규 가입자를 더함.'},
  arpu:        {parent:'mrr', type:'input', v:[...], u:'원/명/월'},
  mrr:         {parent:'rev', type:'computed', formula:'cum_subs * arpu', v:[...], u:'원'},
  rev:         {parent:'root', type:'computed', formula:'mrr * 12', v:[...], u:'원', role:'revenue'},
};
```

### 15.2 제조업 (CAPA 기반)

```
Q = CAPA × 가동률
P = ASP (제품별 가중평균)
변동원가 = Q × 단위원가
고정비 = 인원 × 인당단가 + 임차 + ...
```

중고차 모델의 `판매대수`를 제조업의 `출하량`, `차급별 ASP`를 `제품별 ASP`로 대체하면 같은 구조.

### 15.3 커머스 (퍼널 기반)

```
Traffic → 전환율 → 주문건수(Q) × AOV(P) = GMV
GMV × 테이크레이트 = 매출
```

`Traffic / Rate / Conversion / Price` 형태의 4단 퍼널로 일반화 가능.

### 15.4 매핑 원칙

| 예시 구조 | 일반화 |
|------|--------|
| BM = 이커머스/지점내방/경매/렌터카/기타 | 사업부 또는 제품군 단위 |
| Q = 차급별 판매대수, P = 차급별 ASP | Q×P 분해의 업종 특화 |
| 상세 차급 믹스 → Proportional Scaling | 세부 분해를 단순화한 모든 항목 |
| 시장규모 → 점유율 → 판매대수 | n단 드라이버 구조 일반화 가능 |
| 판매대수 ↔ 재고자산원가·보증비 | 매출-비용 공유 드라이버 |

---

# Part III — 엑셀 모델 (최종 산출물)

회계·감사·실무의 표준 산출물. HTML 트리에서 확정된 구조를 결정론적으로 변환.

## 16. 표준 준수

- **FAST Standard** 또는 IB 관행: 색상 코드(파랑=하드코딩, 검정=수식, 초록=시트참조, 빨강=외부파일)
- **시트 구조**: Cover / Assumptions / Historical / Forecast / DCF / Outputs / Checks
- **수식 규칙**: 한 행 한 수식, 좌→우 복사 가능, 하드코딩은 가정 시트로 분리, 명명된 범위 사용
- **검증 셀**: 합계 check, B/S 좌우 일치, CF reconciliation

---

## 17. Excel 구현 방식과 보조 IR

Excel 모델은 두 방식으로 구현할 수 있다.

1. 코워커/LLM이 BM md와 HTML 구조를 읽고 `openpyxl` 등으로 직접 Excel 모델을 코딩함.
2. 자동화가 필요할 때 HTML에서 내보낸 IR/JSON을 `build_excel.py`의 입력으로 사용함.

어느 방식이든 기준은 같다. HTML에서 합의한 BM 구조, 드라이버, 가정변수, 수식, 검증 포인트가 Excel에 그대로 반영되어야 한다.

IR/JSON은 Excel 생성을 돕는 보조 계약이다. 엑셀 생성기는 필요하면 다음 형식의 JSON을 입력으로 받을 수 있다.

```json
{
  "years": ["2025", ..., "2031"],
  "nodes": [
    {
      "id": "ecom_suv_market",
      "label": "이커머스 SUV 시장판매대수",
      "unit": "대",
      "is_input": true,
      "values": [10000, 10500, 11000, 11600, 12200, 12800, 13400],
      "formula": null,
      "source": "시장 리서치 / 과거 실적",
      "dependencies": [],
      "parent": "ecom_suv"
    },
    {
      "id": "ecom_suv_sales",
      "label": "이커머스 SUV 매출",
      "unit": "대",
      "is_input": false,
      "values": [...],
      "formula": "ecom_suv_market * ecom_suv_share * ecom_suv_asp",
      "dependencies": ["ecom_suv_market", "ecom_suv_share", "ecom_suv_asp"],
      "parent": "ecom_suv"
    }
  ]
}
```

`MODEL` 객체 + 화면 구조 + 입력 변수 목록 + 각 노드의 수식 명세를 합치면 위 JSON이 됨. 다만 이 파일 자체가 목표는 아니다. 목표는 코워커/LLM 또는 `build_excel.py`가 같은 구조를 보고 수식이 박힌 Excel 모델을 재현하는 것이다.

---

## 18. 메타데이터 임베드

워크북에 다음을 임베드(custom_doc_props + 숨김 시트 + 사이드카 JSON).

- library_version, generated_from, timestamp
- 셀별 모듈 추적
- 입력 해시
- 가정 출처 (각 셀에 주석)

이로써 엑셀 → IR 역방향 분석, 버전 diff, 라이브러리 업데이트 영향 분석이 가능.

---

## 19. 양방향 동기화의 한계

기본은 단방향(HTML/IR → 엑셀). 엑셀 자유도가 너무 높아 수정을 자동으로 IR로 되돌리는 건 어렵다.

가능한 것:
- 변경 감지 (해시 비교)
- 입력 셀(가정값)만 export
- diff 리포트

**원칙**: 가정값은 양방향 가능, 로직(수식 구조)은 단방향.

---

# Part IV — 시나리오·검증·거버넌스

## 20. 시나리오·민감도 분석

### 20.1 케이스 (시나리오)

같은 구조에서 가정변수만 달리한 변형. 공격적/기본/보수적의 3종이 기본이나 더 만들어도 됨. HTML 트리에서 named case로 저장 (Part II §13.4).

### 20.2 1-way / 2-way 민감도

- 1-way: 변수 하나를 ±20% 변동 시 밸류에이션 변화 — tornado chart
- 2-way: 두 변수 매트릭스 (WACC × g, 점유율 × ASP 등)

### 20.3 몬테카를로 (선택)

각 가정을 확률분포로 (성장률 ~ Normal, WACC ~ Triangular, g ~ Uniform). 상관관계 고려, 시드 고정 필수. 단일 숫자 대신 분포로 의사결정.

### 20.4 버전과 케이스의 구분

- **버전**은 입력 자료·시점이 바뀔 때 생성 (외부 환경의 변화 반영)
- **케이스**는 같은 버전 안에서 가정만 달리한 시나리오

```
타겟
├── v1 (2026.03 IR 기반)
│   ├── Case A: 공격적
│   ├── Case B: 기본
│   └── Case C: 보수적
└── v2 (2026.06 반기 실적 반영)
    ├── Case A: 전환율 상향
    └── Case B: 기본
```

---

## 21. 검증·정합성

### 21.1 구조 검증

- 순환참조, 단방향 의존성
- 시간축·단위 일관성
- 명명된 범위 사용

### 21.2 회계 항등식

- P&L 합계
- B/S 좌우 일치 (Assets = Liabilities + Equity)
- CF reconciliation, retained earnings rollforward, cash-to-cash

### 21.3 합리성 검증

- 성장률 bounds, 마진 일관성
- CAPEX vs 감가상각
- g ≤ 명목 GDP 성장률

### 21.4 교차 검증

- DCF vs 멀티플 (EV/EBITDA, PER, PSR)
- Implied 분석 (현재가에서 역산하면 어떤 가정?)
- 동종업계 벤치마크

### 21.5 Case A 수치 정합성

원본 엑셀 vs 변환 결과 전 항목·전 연도 크로스체크. 수식 재현 불가 항목은 Proportional Scaling으로 근사. 차이는 ±0.5% 이내가 목표.

### 21.6 Case B 백테스트

설계한 추정 로직을 과거 실적에 적용해 차이 측정. 차이가 크면 로직 재설계.

---

## 22. LLM의 자리

확률성 격리 원칙(§2.3)을 구체화.

| 단계 | 사용 | 역할 |
|------|------|------|
| 사업모델 구조 추출 | O | 사업보고서 → JSON 구조화 |
| 드라이버 트리 제안 | O (사람 검토 필수) | 후보 2~3개 제안 |
| 가정 정당화 narrative | O | 초안 작성, 사람 확정 |
| 이상치·논리 검증 | O (보조) | "ROIC 30%가 정당한가?" 같은 질문 |
| 가정 수치 결정 | X | 사람 결정 |
| WACC·g 결정 | X | 사람 결정 |
| 산수·합계·할인 계산 | X | 결정론적 코드 |
| 회계 규칙 적용 | X | 룰 엔진 |

### LLM 호출 설정

- `temperature=0`, top_p=1
- 모델 버전 명시적 핀 (별칭 X)
- 프롬프트 Git 버전 관리
- Few-shot 예시 고정
- 회귀 테스트 스위트

### 출력 형식

- JSON 스키마 강제 (structured output)
- 자유 텍스트 금지

---

## 23. 도메인 라이브러리

방법론의 누적 자산. 큐레이션된 도메인 지식이 LLM 성능 의존도를 낮추고 품질 일관성을 만든다. 7층 구조로 정리.

### 23.1 7층 구조

| Layer | 내용 | 예시 |
|-------|------|------|
| 1. 산업 템플릿 | 산업별 드라이버 트리·KPI·이슈 | retail, saas, manufacturing, banking, ... |
| 2. 사업모델 패턴 | 산업과 직교하는 비즈모델 | subscription, marketplace, lease, ... |
| 3. 재무 항목 모듈 | 결정론적 계산 블록 | revenue·cogs·opex·WC·capex·debt·tax·TV |
| 4. 모델 유형 | 시트 구조와 검증 정의 | 3_statement, dcf, lbo, m_and_a, ... |
| 5. 검증 룰셋 | 구조·회계·합리성·포맷·거버넌스 | balance check, g vs GDP, ... |
| 6. 외생변수 데이터셋 | 자동 fetch·캐시 | risk_free_rates, betas, multiples, ... |
| 7. 한국 특화 | K-IFRS·DART·세무 | k_ifrs_accounts, dart_xbrl_parser, ... |

### 23.2 거버넌스

- Git, semantic versioning
- 시니어 PR 리뷰, 테스트 케이스 동반
- 산업 골든 케이스 회귀 테스트
- 카탈로그·검색 UI

### 23.3 라이브러리의 한계

라이브러리가 잘 만들어질수록 사고가 라이브러리에 갇힐 위험. "라이브러리 외" 케이스 식별 게이트와 정기적 비판 검토가 필요. **출발점이지 종착점이 아니다.**

---

## 24. 한국 회계 실무 특화

| 영역 | 내용 |
|------|------|
| K-IFRS | 계정과목 표준화, K-GAAP 매핑 |
| DART | XBRL 파싱, 과거 재무제표 자동 fetch |
| 세무 | 세무조정, 법인세율, 이연법인세 |
| 감사조서 | 한공회 표준, PBC 리스트, leadsheet |
| 규제 | 금감원·공정위, 산업 인허가 |

한국 시장 특화 모델링 표준은 빈 공간. 차별화 가능 영역.

---

## 25. 한계와 주의점

### 25.1 GIGO

DCF는 모델 자체는 결정론적이나 입력 한두 개로 가치가 30~50% 흔들림. 단일 숫자 출력에 의존하지 말 것.

### 25.2 LLM의 plausible-but-wrong 위험

추정 로직 생성은 모델 결과의 가장 큰 영향 요소. 잘못된 드라이버 선택은 전체를 잘못된 프레임에 가둠. 단독 결정 금지, 후보 제안 → 사람 검토 → 확정.

### 25.3 표준의 종교전쟁

FAST vs IB vs 회사 내규. 어느 표준이든 **일관성**이 핵심.

### 25.4 룰 엔진의 한계

형식 위반은 잡지만 **가정의 타당성**은 못 잡음. 사람 검토 게이트가 필수.

### 25.5 Proportional Scaling의 한계

비선형 효과는 표현 못함. 수식이 닫힌 항목은 정확 재계산을 우선하고 Scaling은 폴백으로만 사용.

### 25.6 적합·부적합 케이스

- **잘 됨**: 표준 사업모델, 공개정보 충분, 단순 자본구조, 표준 회계
- **어려움**: 신산업·비표준, 비상장·정보 부족, 복잡 자본구조(전환증권), 비표준 회계(수주·부동산 개발), M&A·기업분할

---

# 부록

## A. 적용 사례 — 케이카 2023

완성된 Excel 모델을 먼저 분석한 뒤 BM / 모델 구조를 언어화하는 Case A 경로.

- **원본**: `(Financial model) 케이카_2023.xlsx`
- **BM 구조 문서**: [`../examples/kcar-2023/kcar_bm_model_structure.md`](../examples/kcar-2023/kcar_bm_model_structure.md)
- **매출 BM**: 이커머스 중고차 / 지점내방 중고차 / 경매 / 렌터카 / 용역·기타
- **핵심 드라이버**: 차급별 시장판매대수, 케이카 점유율, 평균판매가격, 1대당 원가, 보증비, 인건비 생산성, CapEx, NWC, WACC
- **모델 흐름**: Sales → Cost / Labor / CapEx / NWC → FCFF → DCF → Equity Value

방법론의 가치는 원본 Excel에 숨어 있는 BM, 드라이버, 교차 참조를 **언어화 → HTML 구조화 → Excel 재구현** 순서로 드러내는 것이다. Excel만 봐서는 보이지 않던 구조가 트리 분해와 시뮬레이션에서 가시화됨.

---

## B. 구현 체크리스트

새 회사에 본 프레임워크를 적용할 때의 6단계.

1. **사업모델 파악** — BM 식별, Q×P 분해 트리 초안 (사람 + LLM 보조)
2. **시간축 작성** — `YRS`, `HIST_N` 설정. 실적/추정 구간을 명확히 분리.
3. **데이터 객체 작성** — `D = {key: {label, parent, type, formula, v, u, desc}}` 채우기.
4. **수식 검토** — 모든 computed 노드가 Excel로 옮길 수 있는 수식으로 닫혔는지 확인.
5. **desc 검토** — `[객관]`, `[주관]`, `[외생]`, `[계산]` 태그와 근거 문장 작성.
6. **검증** — 원본 엑셀 vs HTML 계산 결과 전 항목·전 연도 크로스체크. 차이는 ±0.5% 이내.

---

## C. HTML 파일 구조

`template.html`을 회사별 HTML 예시로 복사해 채울 때의 권장 구조.

| 라인 | 내용 |
|------|------|
| 7~65 | CSS 스타일 |
| 상단 | `YRS`, `HIST_N` |
| 데이터 계층 | 데이터 객체 `MODEL` |
| 파생 인덱스 | `INPUT_KEYS`, `TREE`, `SIM_SECS`, `DEFAULTS_S` 자동 생성 |
| 렌더링 | 레이아웃·캔버스·차트 팝업·브릿지 |
| UI | P&L 테이블·가정변수 일람·설명 모달 |
| 엔진 | 수식 파서·토폴로지 정렬·연도 순차 평가 |
| Export | Excel 다운로드·보조 JSON 다운로드 |
| 시뮬레이터 | 연도 선택기·슬라이더·케이스 관리 |
