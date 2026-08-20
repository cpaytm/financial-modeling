# Financial Modeling with LLM, HTML, and Excel

Claude나 Codex 같은 LLM을 활용해 재무모델을 만드는 강의 교안 repo입니다.

핵심 메시지는 단순히 “AI로 Excel을 빨리 만든다”가 아닙니다. 모델링 전에 사업모델을 언어로 정리하고, LLM과 대화하면서 드라이버 구조를 잡고, HTML 인터랙티브 트리로 머릿속 모델을 시각화한 뒤, 그 구조를 기반으로 Excel 모델을 만드는 작업법을 다룹니다.

---

## Repo Structure

```text
.
├── course/
│   ├── course_guide.md            # 강의 운영용 가이드
│   ├── templates/
│   │   └── bm_brief.md            # BM 브리프 작성 템플릿
│   └── slides-html/
│       └── lecture_slides.html    # 강의 슬라이드
├── framework/
│   ├── html_framework.md          # HTML 프레임워크 사용법
│   ├── template.html              # HTML 인터랙티브 트리 프레임워크
│   ├── html_modeling_framework.md # 모델링 방법론 + HTML 구현 규약
│   ├── excel_framework.md         # Excel 프레임워크 사용법
│   ├── excel_modeling_framework.md # Excel 구현 시 모델링 가이드
│   ├── build_excel.py             # BM/HTML 구조 → Excel 생성 스크립트
│   └── requirements.txt
├── examples/
│   └── Tesla/
│       ├── tesla_bm_revenue_methodology.md # 테슬라 매출 설계도 (BM / 모델 구조)
│       ├── conversation_transcript.md      # 실제 LLM 대화 전사본
│       ├── tesla_revenue_model.html        # 테슬라 인터랙티브 HTML 모델
│       ├── tesla_revenue_ir.json           # HTML 모델 IR export
│       └── tesla_revenue_model.xlsx        # 수식 기반 Excel 모델
├── design-guide/
│   ├── design_system.md           # 디자인 시스템 가이드
│   └── tokens.js                  # 디자인 토큰
├── CLAUDE.md
└── README.md
```

---

## Workflow

```text
BM Brief
  ↓
LLM과 대화하며 드라이버 구조화
  ↓
HTML Framework로 인터랙티브 트리 구현
  ↓
HTML Example로 검토와 시뮬레이션
  ↓
Excel Framework 규칙에 따라 Excel 모델 구현
  ↓
Excel Example 축적
```

HTML은 최종 산출물이 아니라 Excel 모델을 만들기 전에 구조를 검토하는 작업대입니다. Excel은 최종 실행 모델이고, HTML은 그 전에 모델의 논리, 드라이버, 가정변수, 연결 구조를 코워커/LLM과 맞추는 설계서입니다. 보조 JSON은 필요할 때만 쓰는 자동화 파일입니다.

---

## 강의 자료

- [course/slides-html/lecture_slides.html](course/slides-html/lecture_slides.html) — 강의 슬라이드
- [course/course_guide.md](course/course_guide.md) — 운영용 강의안

BM 브리프 템플릿:

- [course/templates/bm_brief.md](course/templates/bm_brief.md)

---

## Frameworks

HTML 프레임워크:

- [framework/template.html](framework/template.html)
- [framework/html_framework.md](framework/html_framework.md)

Excel 프레임워크:

- [framework/excel_framework.md](framework/excel_framework.md)
- [framework/excel_modeling_framework.md](framework/excel_modeling_framework.md)
- [framework/build_excel.py](framework/build_excel.py)

디자인 가이드:

- [design-guide/design_system.md](design-guide/design_system.md)
- [design-guide/tokens.js](design-guide/tokens.js)

---

## Examples

프로젝트별 예시:

- [examples/Tesla/tesla_bm_revenue_methodology.md](examples/Tesla/tesla_bm_revenue_methodology.md)
- [examples/Tesla/tesla_revenue_model.html](examples/Tesla/tesla_revenue_model.html)
- [examples/Tesla/tesla_revenue_model.xlsx](examples/Tesla/tesla_revenue_model.xlsx)

---

## 이 레포가 가르치는 것

- LLM을 계산기가 아니라 사고 정리 파트너로 쓰는 법
- BM 설명을 재무모델의 드라이버 구조로 바꾸는 법
- Q × P, 퍼널, 코호트, Fleet, 이용률 같은 드라이버를 트리로 분해하는 법
- HTML을 통해 모델의 논리를 먼저 합의한 뒤 Excel로 옮기는 법
- Excel 구현 시 구조, 수식, 검증 기준을 유지하는 법
- 투자심사, 내부 검토, 자문 모델링에서 설명 가능한 모델을 만드는 법

민감한 회사 자료나 독점 모델은 이 repo에 커밋하지 않습니다.
