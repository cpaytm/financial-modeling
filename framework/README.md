# Framework — HTML 인터랙티브 트리 템플릿

`template.html`은 [docs/modeling_framework.md](../docs/modeling_framework.md) Part II의 구현 청사진을 단일 HTML로 구현한 빈 스켈레톤이다. 엔진 코드는 그대로 두고 회사별 데이터·트리·계산식만 채워 사용한다.

---

## 사용법

```bash
cp framework/template.html projects/<회사명>/index.html
# 편집기로 열어 9개 블록을 채운다
open projects/<회사명>/index.html  # 브라우저에서 확인
```

---

## 채워야 할 9개 블록

`template.html` 상단의 주석에 표시된 순서대로.

| # | 블록 | 위치 | 자세히 |
|---|------|------|--------|
| 1 | `YRS` | line ~138 | docs §9.3 — 시간축 (실적+추정 연도) |
| 2 | `D` | line ~143 | docs §9.1 — 데이터 객체 (모든 시계열) |
| 3 | `INPUT_KEYS` | line ~175 | docs §9.2 — 입력 변수 식별 |
| 4 | `TREE` | line ~190 | docs §10 — 트리 구조 |
| 5 | P&L 테이블 | `showRevTable()` 내부 | docs §12.3 — `row()` 호출 |
| 6 | 가정변수표 | `showAssumptions()` 내부 | docs §12.4 — `sections[]` |
| 7 | `DEFAULTS_S` | `function simCalc()` 직전 | docs §9.4 — 기본값 보존 |
| 8 | `simCalc()` | `DEFAULTS_S` 다음 | docs §14 — 시뮬레이션 엔진 |
| 9 | `SIM_SECS` | `simCalc()` 직후 | docs §13.1 — 슬라이더 정의 |

엔진(렌더링·UI·인터랙션·시뮬레이터 UI·케이스 관리)은 손대지 않는다.

---

## 작업 순서 (권장)

1. **YRS** 먼저 — 연도 배열 길이가 이후 모든 시계열 길이를 정한다
2. **TREE 초안** — Q×P 분해를 종이에 그린 뒤 `N()`/`DR()` 호출로 옮긴다
3. **D 객체** — TREE의 각 `data` 참조에 대응하는 시계열 채움. `desc`는 추정 근거를 텍스트로 박제하는 자리
4. **INPUT_KEYS** — D의 변수 중 슬라이더로 조정할 것만 등록
5. **DEFAULTS_S** — INPUT_KEYS의 모든 변수에 기본값 복사
6. **simCalc** — 닫힌 수식부터(정확 재계산), 그 외는 Proportional Scaling. 매출-비용 교차 참조 명시
7. **SIM_SECS** — 슬라이더 그룹화. min/max는 합리적 범위
8. **P&L 테이블·가정변수표** — TREE에서 자동 생성되지 않으므로 별도 정의
9. **검증** — 원본 엑셀과 전 항목·전 연도 크로스체크 (Case A) 또는 과거 실적 백테스트 (Case B)

---

## 출력 형식

브라우저에서 바로 열리는 단일 HTML. Chart.js CDN 외 외부 의존 없음.

배포:
- 이메일 첨부
- 클라우드 드라이브 공유
- 로컬에서 더블클릭으로 실행

서버 불필요. 데이터는 페이지 내 하드코딩.

---

## 참조 구현

`/examples/getcha-fy26/index.html` — 5개 BM, 55개 가정변수, 매출·비용·이익 전체를 포함한 완성 사례. 본 템플릿이 어떻게 채워지는지의 골든 케이스.
