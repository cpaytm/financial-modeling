# Financial Modeling with LLM, HTML, and Excel

Claude나 Codex 같은 LLM을 활용해 비상장 기업 재무모델을 만드는 강의 교안 repo입니다.

핵심 메시지는 단순히 “AI로 Excel을 빨리 만든다”가 아닙니다. 모델링 전에 사업모델을 언어로 정리하고, LLM과 대화하면서 드라이버 구조를 잡고, HTML 인터랙티브 트리로 머릿속 모델을 시각화한 뒤, 그 구조를 기반으로 Excel 모델을 만드는 작업법을 다룹니다.

---

## Repo Structure

```text
.
├── course/
│   ├── lecture_contents.md        # 강의 콘텐츠 원본. 추후 HTML 슬라이드 변환의 source
│   ├── course_guide.md            # 강의 운영용 가이드
│   ├── templates/
│   │   └── bm_brief.md            # BM 브리프 작성 템플릿
│   └── slides-html/
│       └── README.md              # 추후 생성할 HTML 슬라이드 위치
├── html-framework/
│   ├── template.html              # HTML 인터랙티브 트리 프레임워크
│   ├── README.md                  # HTML 프레임워크 사용법
│   └── html_modeling_framework.md # 모델링 방법론 + HTML 구현 규약
├── excel-framework/
│   ├── excel_modeling_framework.md # Excel 구현 시 모델링 가이드
│   ├── build_excel.py             # IR JSON → Excel 변환 스크립트
│   ├── requirements.txt
│   └── README.md
├── html-examples/
│   ├── kcar-2023/
│   │   └── bm_model_structure.md  # 케이카 2023 BM / 모델 구조
│   └── worldvision-office/
│       └── bm_model_structure.md  # 월드비전 사옥 BM / 모델 구조
├── excel-examples/
│   └── README.md                  # 추후 Excel 예시 산출물 위치
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

HTML은 최종 산출물이 아니라 사고를 정리하는 중간 표현입니다. Excel은 최종 실행 모델이고, HTML은 그 전에 모델의 논리, 드라이버, 가정변수, 연결 구조를 눈으로 검토하는 작업대입니다.

---

## 강의 콘텐츠

슬라이드 제작의 기준이 되는 강의 콘텐츠 원본:

- [course/lecture_contents.md](course/lecture_contents.md)

운영용 강의안:

- [course/course_guide.md](course/course_guide.md)

BM 브리프 템플릿:

- [course/templates/bm_brief.md](course/templates/bm_brief.md)

HTML 슬라이드는 아직 만들지 않았고, 추후 [course/slides-html](course/slides-html)에 추가합니다.

---

## Frameworks

HTML 프레임워크:

- [html-framework/template.html](html-framework/template.html)
- [html-framework/README.md](html-framework/README.md)

Excel 프레임워크:

- [excel-framework/excel_modeling_framework.md](excel-framework/excel_modeling_framework.md)
- [excel-framework/build_excel.py](excel-framework/build_excel.py)

디자인 가이드:

- [design-guide/design_system.md](design-guide/design_system.md)
- [design-guide/tokens.js](design-guide/tokens.js)

---

## Examples

HTML 예시:

- [html-examples/kcar-2023/bm_model_structure.md](html-examples/kcar-2023/bm_model_structure.md)
- [html-examples/worldvision-office/bm_model_structure.md](html-examples/worldvision-office/bm_model_structure.md)

Excel 예시는 추후 [excel-examples](excel-examples)에 추가합니다.

---

## 이 레포가 가르치는 것

- LLM을 계산기가 아니라 사고 정리 파트너로 쓰는 법
- BM 설명을 재무모델의 드라이버 구조로 바꾸는 법
- Q × P, 퍼널, 코호트, Fleet, 이용률 같은 드라이버를 트리로 분해하는 법
- HTML을 통해 모델의 논리를 먼저 합의한 뒤 Excel로 옮기는 법
- Excel 구현 시 구조, 수식, 검증 기준을 유지하는 법
- 투자심사, 내부 검토, 자문 모델링에서 설명 가능한 모델을 만드는 법

민감한 회사 자료나 독점 모델은 이 repo에 커밋하지 않습니다.
