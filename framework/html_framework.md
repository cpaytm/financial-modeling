# Framework — HTML 인터랙티브 트리 템플릿

`template.html`은 [html_modeling_framework.md](html_modeling_framework.md) Part II의 구현 청사진을 단일 HTML로 구현한 빈 스켈레톤이다. 엔진 코드는 그대로 두고 회사별 `YRS`, `HIST_N`, `D`만 채워 사용한다.

---

## 사용법

```bash
cp framework/template.html projects/<회사명>/index.html
# 편집기로 열어 YRS / HIST_N / D를 채운다
open projects/<회사명>/index.html  # 브라우저에서 확인
```

---

## 채워야 할 3개 블록

`template.html` 상단의 주석에 표시된 순서대로.

| # | 블록 | 위치 | 자세히 |
|---|------|------|--------|
| 1 | `YRS` | template 상단 | [html_modeling_framework.md](html_modeling_framework.md) §9.3 — 시간축 |
| 2 | `HIST_N` | `YRS` 바로 아래 | [html_modeling_framework.md](html_modeling_framework.md) §9.3 — 실적 연도 수 |
| 3 | `D` | 데이터 계층 | [html_modeling_framework.md](html_modeling_framework.md) §9.1 — 데이터 객체·트리 parent·수식 |

`INPUT_KEYS`, `TREE`, `DEFAULTS_S`, `SIM_SECS`, 가정변수표, 기본 `simCalc()`는 `D`에서 자동 파생된다. 엔진(렌더링·UI·인터랙션·시뮬레이터 UI·케이스 관리)은 손대지 않는다.

---

## 작업 순서 (권장)

1. **YRS / HIST_N** 먼저 — 전체 연도와 실적 연도 수를 확정한다.
2. **D 객체 작성** — 모든 노드에 `label`, `parent`, `type`, `formula`, `v`, `u`, `desc`를 채운다.
3. **수식 닫기** — computed 노드는 가능한 한 `formula`로 닫는다. `PREV(self)` 롤포워드도 지원된다.
4. **desc 작성** — `[객관]`, `[주관]`, `[외생]`, `[계산]` 같은 태그로 시작하고 문장 단위로 근거를 적는다.
5. **검증** — 원본 엑셀과 전 항목·전 연도 크로스체크 (Case A) 또는 과거 실적 백테스트 (Case B)

---

## 출력 형식

브라우저에서 바로 열리는 단일 HTML. Chart.js CDN 외 외부 의존 없음.

배포:
- 이메일 첨부
- 클라우드 드라이브 공유
- 로컬에서 더블클릭으로 실행

서버 불필요. 데이터는 페이지 내 하드코딩. 브라우저 export로 Excel과 보조 JSON을 받을 수 있다.

---

## 예시 구조

[../examples/kcar-2023/kcar_bm_model_structure.md](../examples/kcar-2023/kcar_bm_model_structure.md) — 완성된 Excel 모델을 분석해 HTML과 Excel 구현 전에 BM / 모델 구조를 언어화한 예시.
